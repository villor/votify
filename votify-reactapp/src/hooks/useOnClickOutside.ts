import { useEffect, RefObject } from 'react'

export default function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (e: MouseEvent | TouchEvent) => any
) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return
      }
      return handler(e)
    }
    
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  })
}
