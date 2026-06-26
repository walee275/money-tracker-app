import { Capacitor } from '@capacitor/core'
import type { FocusEvent } from 'react'

const KEYBOARD_ANIMATION_MS = 320

export function scrollFocusedInputIntoView(event: FocusEvent<HTMLElement>) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  if (!target.matches('input, textarea, select')) return

  const scroll = () => {
    target.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  requestAnimationFrame(() => {
    scroll()
    window.setTimeout(scroll, KEYBOARD_ANIMATION_MS)
  })
}

export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform()
}
