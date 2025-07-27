import { useState, useCallback } from "react";
import { useApi } from "./useApi";

interface CrudActions<T> {
  create: (
    data: Omit<T, "_id" | "createdAt" | "author">
  ) => Promise<{ success: boolean; error?: string }>;
  update: (
    id: string,
    data: Partial<T>
  ) => Promise<{ success: boolean; error?: string }>;
  delete: (id: string) => Promise<{ success: boolean; error?: string }>;
  togglePublish?: (
    id: string,
    currentPublished: boolean
  ) => Promise<{ success: boolean; error?: string }>;
}

export function useCrud<T extends { _id: string }>(
  baseUrl: string,
  options?: {
    authorField?: string;
    authorValue?: string;
    publishField?: string;
  }
): ReturnType<typeof useApi<T[]>> & CrudActions<T> {
  const { authorField, authorValue, publishField } = options || {};

  const api = useApi<T[]>(baseUrl);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Set<string>>(
    new Set()
  );

  const create = useCallback(
    async (data: Omit<T, "_id" | "createdAt" | "author">) => {
      try {
        const body =
          authorField && authorValue
            ? { ...data, [authorField]: authorValue }
            : data;

        const response = await fetch(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const newItem: T = await response.json();
          const currentData = api.data;
          api.setData([newItem, ...currentData]);
          return { success: true };
        }
        return { success: false, error: "Failed to create item" };
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    },
    [baseUrl, authorField, authorValue, api]
  );

  const update = useCallback(
    async (id: string, data: Partial<T>) => {
      try {
        const response = await fetch(`${baseUrl}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          const updatedItem = result.item || result;
          const currentData = api.data;
          api.setData(
            currentData.map((item: T) => (item._id === id ? updatedItem : item))
          );
          return { success: true };
        }
        return { success: false, error: "Failed to update item" };
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    },
    [baseUrl, api]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${baseUrl}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const currentData = api.data;
          api.setData(currentData.filter((item: T) => item._id !== id));
          return { success: true };
        }
        return { success: false, error: "Failed to delete item" };
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    },
    [baseUrl, api]
  );

  const togglePublish = useCallback(
    async (id: string, currentPublished: boolean) => {
      if (!publishField) {
        return { success: false, error: "Publish field not configured" };
      }

      try {
        const response = await fetch(`${baseUrl}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [publishField]: !currentPublished }),
        });

        if (response.ok) {
          const currentData = api.data;
          api.setData(
            currentData.map((item: T) =>
              item._id === id
                ? { ...item, [publishField]: !currentPublished }
                : item
            )
          );
          return { success: true };
        }
        return { success: false, error: "Failed to update publish status" };
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    },
    [baseUrl, publishField, api]
  );

  return {
    ...api,
    create,
    update,
    delete: deleteItem,
    ...(publishField && { togglePublish }),
  };
}
