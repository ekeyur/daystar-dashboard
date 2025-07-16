import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  const DAYSTAR_SALESFORCE_CLIENT_ID =
    "3MVG9TZvGM_0NqB1Peb4fnCo2Dm7cAZuPmH3GNfWlppkT7DqrB.pK.7uRbeoFFaY3eyTrrh0i26IQBbmIBLhK";
  const DAYSTAR_SALESFORCE_CLIENT_SECRET =
    "E5C38C1784BF032E89D563FAB5293947CDD0B4D804EF607A84A6849E6DC1906C";
  const BASE_URL =
    "https://daystartelevision--ssdevorg.sandbox.my.salesforce.com";

  try {
    const response = await axios.post(
      BASE_URL + "/services/oauth2/token",
      null,
      {
        params: {
          grant_type: "client_credentials",
          client_id: DAYSTAR_SALESFORCE_CLIENT_ID,
          client_secret: DAYSTAR_SALESFORCE_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
    console.log("Salesforce authentication successful:", response.data);

    const { access_token, issued_at, token_type } = response.data;

    return NextResponse.json({
      success: true,
      access_token,
      issued_at,
      token_type,
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
