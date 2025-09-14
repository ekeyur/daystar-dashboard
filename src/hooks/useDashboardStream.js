import { useEffect, useState, useCallback } from 'react';

export function useDashboardStream() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const connectToStream = useCallback(() => {
    const eventSource = new EventSource('/api/dashboard-stream');
    
    eventSource.onmessage = (event) => {
      try {
        const dashboardData = JSON.parse(event.data);
        
        if (dashboardData.error) {
          setError(new Error(dashboardData.error));
          setIsLoading(false);
        } else {
          setData(dashboardData);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
        // Don't set error state, just log and continue with previous data
        setIsLoading(false);
      }
    };

    eventSource.onerror = (event) => {
      console.error('SSE connection error:', event);
      // Don't set error state to avoid showing error message to user
      // Just keep the previous data and try to reconnect silently

      // Try to reconnect after 5 seconds
      setTimeout(() => {
        eventSource.close();
        connectToStream();
      }, 5000);
    };

    return eventSource;
  }, []);

  useEffect(() => {
    const eventSource = connectToStream();

    return () => {
      eventSource.close();
    };
  }, [connectToStream]);

  return {
    data,
    isLoading,
    error,
  };
}