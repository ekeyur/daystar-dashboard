import useSWR from "swr";
import { useAuth } from "@/contexts/authcontext";
import { useState, useEffect } from "react";

const fetcher = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch dashboard data");
  }

  const dashboardData = data.result?.[0]?.outputValues || {};

  return {
    data: dashboardData,
    refreshInterval: dashboardData.refreshInterval,
    cacheDuration: data.cacheDuration,
  };
};

export function useDashboardData() {
  const { accessToken, isHydrated } = useAuth();
  const [refreshInterval, setRefreshInterval] = useState(5000); // Default 5 seconds

  const {
    data: responseData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    isHydrated && accessToken ? ["/api/live-ticker-data", accessToken] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval, // Use dynamic refresh interval
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: Math.max(refreshInterval - 1000, 1000), // Prevent duplicate requests within interval minus 1 second
      keepPreviousData: true, // Keep previous data while fetching new data
      errorRetryInterval: refreshInterval,
      errorRetryCount: 3,
    }
  );

  // Update refresh interval when we get new data
  useEffect(() => {
    if (
      responseData?.refreshInterval &&
      typeof responseData.refreshInterval === "number" &&
      responseData.refreshInterval > 0
    ) {
      const newInterval = responseData.refreshInterval * 1000; // Convert seconds to milliseconds
      if (newInterval !== refreshInterval) {
        setRefreshInterval(newInterval);
        // Force a revalidation to apply the new interval immediately
        mutate();
      }
    }
  }, [responseData?.refreshInterval, refreshInterval, mutate]);

  return {
    data: responseData?.data || {},
    isLoading,
    error,
    refreshInterval: refreshInterval / 1000, // Return in seconds for debugging
    isHydrated,
    colors: {
      colorOne: responseData?.colorOne,
      colorTwo: responseData?.colorTwo,
      bgColorOne: responseData?.bgColorOne,
      bgColorTwo: responseData?.bgColorTwo,
    },
  };
}
