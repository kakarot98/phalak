import { useState } from "react";
import { message } from "antd";

interface UseUpdateEntityOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Generic hook for updating entities via PATCH requests
 * Consolidates repeated update logic across pages
 *
 * @param endpoint - API endpoint to PATCH to (should include entity ID)
 * @param options - Optional configuration object
 *
 * @example
 * const { loading, update } = useUpdateEntity(`/api/projects/${id}`, {
 *   successMessage: 'Project updated successfully',
 *   onSuccess: () => refetchProject()
 * })
 *
 * await update({ name: 'Updated Name' })
 */
export function useUpdateEntity(
  endpoint: string,
  options: UseUpdateEntityOptions = {},
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    successMessage = "Updated successfully",
    errorMessage = "Failed to update",
    onSuccess,
    onError,
  } = options;

  const update = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        // Try to get error message from response
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      message.success(successMessage);

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unknown error");
      setError(errorObj.message);
      message.error(errorObj.message || errorMessage);
      console.error(`Error updating entity at ${endpoint}:`, errorObj);

      if (onError) {
        onError(errorObj);
      }

      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    update,
  };
}
