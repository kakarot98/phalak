import { useState } from 'react'
import { message } from 'antd'

interface UseCreateEntityOptions {
  successMessage?: string
  errorMessage?: string
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

/**
 * Generic hook for creating entities via POST requests
 * Consolidates repeated create logic across pages
 *
 * @param endpoint - API endpoint to POST to
 * @param options - Optional configuration object
 *
 * @example
 * const { loading, create } = useCreateEntity('/api/projects', {
 *   successMessage: 'Project created successfully',
 *   onSuccess: () => refetchProjects()
 * })
 *
 * await create({ name: 'New Project', description: '...' })
 */
export function useCreateEntity(
  endpoint: string,
  options: UseCreateEntityOptions = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    successMessage = 'Created successfully',
    errorMessage = 'Failed to create',
    onSuccess,
    onError,
  } = options

  const create = async (values: any, additionalPayload?: object) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          ...additionalPayload,
        }),
      })

      if (!res.ok) {
        // Try to get error message from response
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      message.success(successMessage)

      if (onSuccess) {
        onSuccess(data)
      }

      return data
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error')
      setError(errorObj.message)
      message.error(errorObj.message || errorMessage)
      console.error(`Error creating entity at ${endpoint}:`, errorObj)

      if (onError) {
        onError(errorObj)
      }

      throw errorObj
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    create,
  }
}
