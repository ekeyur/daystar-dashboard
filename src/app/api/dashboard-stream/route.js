import axios from "axios";

// Token cache
let cachedToken = null;
let tokenExpiresAt = null;

async function getAuthToken() {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const authResponse = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth-token`);
    cachedToken = authResponse.data.access_token;

    // Salesforce tokens typically expire in 2 hours, cache for 1.5 hours to be safe
    tokenExpiresAt = Date.now() + (90 * 60 * 1000); // 90 minutes

    return cachedToken;
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw error;
  }
}

async function getDashboardData() {
  try {
    const accessToken = await getAuthToken();

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
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    // If we get a 401, clear the cached token and retry once
    if (error.response?.status === 401 && cachedToken) {
      console.log("Token expired, clearing cache and retrying...");
      cachedToken = null;
      tokenExpiresAt = null;

      try {
        const accessToken = await getAuthToken();
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
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return response.data;
      } catch (retryError) {
        console.error("Error fetching dashboard data after token refresh:", retryError);
        throw retryError;
      }
    }

    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export async function GET(request) {
  // Set up SSE headers
  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  };

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      const sendData = async () => {
        try {
          const data = await getDashboardData();
          const dashboardData = data?.[0]?.outputValues || {};
          
          // Send the data as SSE
          const sseData = `data: ${JSON.stringify(dashboardData)}\n\n`;
          controller.enqueue(encoder.encode(sseData));
        } catch (error) {
          console.error("Error in SSE stream:", error);
          const errorData = `data: ${JSON.stringify({ error: "Failed to fetch data" })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
        }
      };

      // Send initial data immediately
      sendData();

      // Set up interval to send data every 5 seconds
      const interval = setInterval(sendData, 5000);

      // Clean up interval when the connection is closed
      request.signal?.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, { headers: responseHeaders });
}