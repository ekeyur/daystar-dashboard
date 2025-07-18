import useSWR from "swr";
import { dashboardAPI } from "@/utils/axiosutils";
import { useAuth } from "@/contexts/authcontext";

const fetcher = async (url) => {
  const response = await dashboardAPI[url]();
  return response.data;
};

export const useDashboardData = () => {
  const { isAuthenticated } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    isAuthenticated ? "getDashboardData" : null,
    fetcher,
    {
      refreshInterval: 5 * 1000, // Refresh every 5 seconds
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
