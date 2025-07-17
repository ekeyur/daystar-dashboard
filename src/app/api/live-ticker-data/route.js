import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authorization header missing" },
        { status: 401 }
      );
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

    return NextResponse.json({
      success: true,
      result: response.data,
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
