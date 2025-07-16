import useSWR from "swr";
import { dashboardAPI } from "@/utils/axiosutils";
import { useAuth } from "@/contexts/authcontext";
import { useEffect } from "react";

const fetcher = async (url) => {
  const response = await dashboardAPI[url]();
  return response.data;
};

export const useDashboardData = () => {
  const { isAuthenticated, login } = useAuth();

  // Call login if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      login();
    }
  }, [isAuthenticated, login]);

  const { data, error, isLoading, mutate } = useSWR(
    isAuthenticated ? "getDashboardData" : null,
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
};
