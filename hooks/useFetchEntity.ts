import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'

interface UseFetchEntityOptions {
  errorMessage?: string
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

/**
 * Generic hook for fetching data from an API endpoint
 * Consolidates repeated fetch logic across pages
 *
 * @param url - API endpoint to fetch from
 * @param dependencies - Optional dependencies array for refetching
 * @param options - Optional configuration object
 *
 * @example
 * const { data, loading, error, refetch } = useFetchEntity<Project>(
 *   '/api/projects/123',
 *   [projectId]
 * )
 */
export function useFetchEntity<T = any>(
  url: string,
  dependencies: any[] = [],
  options: UseFetchEntityOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    errorMessage = 'Failed to fetch data',
    onSuccess,
    onError,
  } = options

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const responseData = await res.json()
      setData(responseData)

      if (onSuccess) {
        onSuccess(responseData)
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error')
      setError(errorObj.message)
      message.error(errorMessage)
      console.error(`Error fetching from ${url}:`, errorObj)

      if (onError) {
        onError(errorObj)
      }
    } finally {
      setLoading(false)
    }
  }, [url, errorMessage, onSuccess, onError])

  useEffect(() => {
    if (url) {
      fetchData()
    }
  }, [url, ...dependencies]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
