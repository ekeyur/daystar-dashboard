import axios from "axios";
import { NextResponse } from "next/server";

// Simple server-side token cache (optional)
let sfToken = null;
let sfInstanceUrl = null;
let sfExpiresAt = 0;

// Data cache
let cachedData = null;
let cacheExpiresAt = null;
let currentCacheDuration = 5000; // Default 5 seconds

async function getSfAuth() {
  if (sfToken && Date.now() < sfExpiresAt - 5000) {
    return { accessToken: sfToken, instanceUrl: sfInstanceUrl };
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/auth-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.details || "Auth failed");

  sfToken = json.access_token;
  sfInstanceUrl = json.instance_url;
  sfExpiresAt = json.expires_at ?? (Date.now() + 60_000); // fallback
  return { accessToken: sfToken, instanceUrl: sfInstanceUrl };
}

export async function GET(request) {
  try {
    // Check if we have valid cached data
    if (cachedData && cacheExpiresAt && Date.now() < cacheExpiresAt) {
      return NextResponse.json({
        success: true,
        result: cachedData,
        fromCache: true,
        cacheDuration: currentCacheDuration,
      });
    }

    const requestBody = { inputs: [{ timeStamp: "" }] };
    const path = `/services/data/v64.0/actions/custom/flow/Ticker_Generate_UI_Values`;

    const callFlow = (instanceUrl, token) =>
      axios.post(instanceUrl + path, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

    // 1st attempt
    let { accessToken, instanceUrl } = await getSfAuth();
    let resp;
    try {
      resp = await callFlow(instanceUrl, accessToken);
    } catch (e) {
      const status = e?.response?.status;
      const body = e?.response?.data;
      const invalid =
        status === 401 &&
        (body?.errorCode === "INVALID_SESSION_ID" ||
         body?.[0]?.errorCode === "INVALID_SESSION_ID" ||
         `${body?.message ?? ""}`.includes("INVALID_SESSION_ID"));

      if (!invalid) throw e;

      // Re-auth once and retry
      const fresh = await getSfAuth(); // fetches new token if expired
      accessToken = fresh.accessToken;
      instanceUrl = fresh.instanceUrl;
      resp = await callFlow(instanceUrl, accessToken);
    }

    // Cache window from Flow output
    const dashboardData = resp.data?.[0]?.outputValues;
    const s = Number(dashboardData?.refreshInterval);
    currentCacheDuration = s > 0 ? s * 1000 : 5000;

    // Cache the response data
    cachedData = resp.data;
    cacheExpiresAt = Date.now() + currentCacheDuration;

    return NextResponse.json({
      success: true,
      result: resp.data,
      fromCache: false,
      cacheDuration: currentCacheDuration,
    });
  } catch (error) {
    console.error("Ticker fetch failed:", error?.response?.data || error?.message);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong with data fetching",
        details: 
          error?.response?.data?.[0]?.message ||
          error?.response?.data?.error_description ||
          error?.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
