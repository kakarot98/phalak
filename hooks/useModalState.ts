import { useState, useCallback } from 'react'

/**
 * Hook for managing modal state
 * Consolidates repeated modal state logic
 *
 * @param initialState - Initial open/closed state (default: false)
 *
 * @example
 * const { isOpen, open, close, toggle } = useModalState()
 *
 * <Button onClick={open}>Open Modal</Button>
 * <Modal open={isOpen} onCancel={close}>...</Modal>
 */
export function useModalState(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}

/**
 * Hook for managing modal with type selection (e.g., folder/phalak)
 * Extends basic modal state with type discrimination
 *
 * @param types - Array of possible types
 * @param defaultType - Default type when opening modal
 *
 * @example
 * const modal = useModalWithType(['folder', 'phalak'], 'folder')
 *
 * <Button onClick={() => modal.open('folder')}>Create Folder</Button>
 * <Button onClick={() => modal.open('phalak')}>Create Phalak</Button>
 * <Modal
 *   open={modal.isOpen}
 *   title={modal.type === 'folder' ? 'Create Folder' : 'Create Phalak'}
 * />
 */
export function useModalWithType<T extends string>(
  types: readonly T[],
  defaultType: T
) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<T>(defaultType)

  const open = useCallback((selectedType?: T) => {
    if (selectedType) {
      setType(selectedType)
    }
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback((selectedType?: T) => {
    if (selectedType) {
      setType(selectedType)
    }
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    type,
    setType,
    open,
    close,
    toggle,
    setIsOpen,
  }
}
