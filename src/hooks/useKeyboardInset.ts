import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Keyboard, KeyboardResize } from '@capacitor/keyboard'

export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    void Keyboard.setResizeMode({ mode: KeyboardResize.Body })

    const listeners = [
      Keyboard.addListener('keyboardWillShow', (info) => {
        setInset(info.keyboardHeight)
      }),
      Keyboard.addListener('keyboardDidShow', (info) => {
        setInset(info.keyboardHeight)
      }),
      Keyboard.addListener('keyboardWillHide', () => {
        setInset(0)
      }),
      Keyboard.addListener('keyboardDidHide', () => {
        setInset(0)
      }),
    ]

    return () => {
      void Promise.all(listeners).then((handles) => {
        handles.forEach((handle) => handle.remove())
      })
    }
  }, [])

  return inset
}
