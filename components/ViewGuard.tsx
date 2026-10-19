'use client'

import { useEffect } from 'react'

/**
 * Casual-inspection deterrent, carried over from the previous site at the
 * owner's request: blocks the context menu and the usual devtools shortcuts.
 *
 * Deliberately NOT carried over from the old implementation:
 *   - `document.write("Please disable developer tools.")`, which after load
 *     implicitly calls document.open() and destroys the whole document. It was
 *     gated on wall-clock time elapsed across a `debugger` statement, so a GC
 *     pause or a CPU-throttled crawler could trip it with no devtools present
 *     and leave a one-sentence page in the search index.
 *   - the `debugger` statement itself and its setInterval, which scheduled a
 *     main-thread task every second for the lifetime of the session.
 *
 * This is a speed bump, not a security control: the bundle is public either
 * way. It is kept because it was asked for, at zero risk to the page.
 */
export default function ViewGuard() {
  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      const isDevToolsCombo =
        key === 'F12' ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ['I', 'J', 'C'].includes(key.toUpperCase())) ||
        ((event.ctrlKey || event.metaKey) && key.toUpperCase() === 'U')

      if (isDevToolsCombo) event.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}
