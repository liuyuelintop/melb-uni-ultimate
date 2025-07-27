import { useState, useEffect, useCallback, useMemo, useRef } from "react";

interface ApiState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface ApiActions<T> {
  refetch: () => Promise<void>;
  setData: (data: T) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useApi<T>(
  url: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
    immediate?: boolean;
    initialData?: T;
  }
): ApiState<T> & ApiActions<T> {
  const {
    method = "GET",
    body,
    headers = {},
    immediate = true,
    initialData = [] as T,
  } = options || {};

  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to store the latest options to avoid dependency issues
  const optionsRef = useRef({ method, body, headers, url });
  optionsRef.current = { method, body, headers, url };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { method, body, headers, url } = optionsRef.current;
      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };

      if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
    setError,
    setLoading,
  };
}
