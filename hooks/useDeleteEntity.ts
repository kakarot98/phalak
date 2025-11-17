import { useState } from "react";
import { message } from "antd";

interface UseDeleteEntityOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Generic hook for deleting entities via DELETE requests
 * Consolidates repeated delete logic across pages
 *
 * @param endpoint - API endpoint to DELETE (should include entity ID)
 * @param options - Optional configuration object
 *
 * @example
 * const { loading, deleteEntity } = useDeleteEntity(`/api/projects/${id}`, {
 *   successMessage: 'Project deleted successfully',
 *   onSuccess: () => router.push('/')
 * })
 *
 * await deleteEntity()
 */
export function useDeleteEntity(
  endpoint: string,
  options: UseDeleteEntityOptions = {},
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    successMessage = "Deleted successfully",
    errorMessage = "Failed to delete",
    onSuccess,
    onError,
  } = options;

  const deleteEntity = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!res.ok) {
        // Try to get error message from response
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      // DELETE endpoints return 204 No Content, no JSON to parse
      message.success(successMessage);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unknown error");
      setError(errorObj.message);
      message.error(errorObj.message || errorMessage);
      console.error(`Error deleting entity at ${endpoint}:`, errorObj);

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
    deleteEntity,
  };
}
