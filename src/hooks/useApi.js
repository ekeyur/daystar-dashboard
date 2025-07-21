import useSWR from "swr";
import { dashboardAPI } from "@/utils/axiosutils";
import { useAuth } from "@/contexts/authcontext";
import { useEffect } from "react";

const fetcher = async (url) => {
  const response = await dashboardAPI[url]();
  return response.data;
};

export const useDashboardData = () => {
  const { isAuthenticated, loading: authLoading, login } = useAuth();

  useEffect(() => {
    const autoLogin = async () => {
      if (!isAuthenticated && !authLoading) {
        try {
          await login();
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      }
    };
    autoLogin();
  }, [isAuthenticated, authLoading, login]);

  const { data, error, isLoading, mutate } = useSWR(
    isAuthenticated ? "getDashboardData" : null,
    fetcher,
    {
      refreshInterval: 5 * 1000, // Refresh every 5 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: true,
      onError: (err) => {
        if (err.response?.status === 401) {
          login();
        }
      },
    }
  );

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
};
