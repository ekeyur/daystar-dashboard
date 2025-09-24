import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const loginBase =
      process.env.SALESFORCE_INSTANCE_URL ??
      "https://test.salesforce.com";

    const url = `${loginBase}/services/oauth2/token`;
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
    });

    const response = await axios.post(url, body.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const {
      access_token,
      issued_at,
      token_type,
      expires_in,
      instance_url,
      id,
      signature,
    } = response.data;

    return NextResponse.json({
      success: true,
      access_token,
      issued_at,
      token_type,
      instance_url,
      id,
      signature,
      expires_at: Date.now() + expires_in * 1000,
    });
  } catch (error) {
    console.error(
      "Salesforce authentication failed:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
        details: error.response?.data?.error_description || error.message,
      },
      { status: 500 }
    );
  }
}
