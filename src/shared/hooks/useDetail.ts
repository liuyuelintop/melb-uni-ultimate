import { useState, useEffect } from "react";

export function useDetail<T>(id: string | undefined, baseUrl: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${baseUrl}/${id}`);
        if (!response.ok) {
          throw new Error("Item not found");
        }

        const result = await response.json();
        // Handle different response formats
        const item = result.item || result;
        setData(item);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, baseUrl]);

  return { data, loading, error };
}
