import axios from "axios";
import { NextResponse } from "next/server";

// Data cache
let cachedData = null;
let cacheExpiresAt = null;
let currentCacheDuration = 5000; // Default 5 seconds

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Check if we have valid cached data
    if (cachedData && cacheExpiresAt && Date.now() < cacheExpiresAt) {
      return NextResponse.json({
        success: true,
        result: cachedData,
        fromCache: true,
        cacheDuration: currentCacheDuration,
      });
    }

    const requestBody = {
      inputs: [
        {
          timeStamp: "",
        },
      ],
    };

    const url = `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v64.0/actions/custom/flow/Ticker_Generate_UI_Values`;

    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    // Extract refresh interval from the response data and update cache duration
    const dashboardData = response.data?.[0]?.outputValues;
    const refreshIntervalSeconds = dashboardData?.refreshInterval;

    if (refreshIntervalSeconds && typeof refreshIntervalSeconds === 'number' && refreshIntervalSeconds > 0) {
      currentCacheDuration = refreshIntervalSeconds * 1000; // Convert seconds to milliseconds
    } else {
      currentCacheDuration = 5000; // Default to 5 seconds
    }

    // Cache the response data
    cachedData = response.data;
    cacheExpiresAt = Date.now() + currentCacheDuration;

    return NextResponse.json({
      success: true,
      result: response.data,
      fromCache: false,
      cacheDuration: currentCacheDuration,
    });
  } catch (error) {
    console.error(
      "Something went wrong with data fetching: ",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong with data fetching",
        details: error.response?.data?.error_description || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
