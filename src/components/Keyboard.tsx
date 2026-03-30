import { useState, useCallback } from 'react'
import { Key } from './Key'
import { TURKISH_QWERTY_ROWS } from '../types/keyboard'
import type { LetterStatus } from '../types/keyboard'

interface KeyboardProps {
  keyStates: Map<string, LetterStatus>
  onKeyPress: (key: string) => void
  onEnter: () => void
  onBackspace: () => void
}

export function Keyboard({ keyStates, onKeyPress, onEnter, onBackspace }: KeyboardProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const handleKeyClick = useCallback((letter: string) => {
    setActiveKey(letter)
    setTimeout(() => setActiveKey(null), 100)

    if (letter === 'ENTER') {
      onEnter()
    } else if (letter === 'BACKSPACE') {
      onBackspace()
    } else {
      onKeyPress(letter)
    }
  }, [onEnter, onBackspace, onKeyPress])

  return (
    <div data-testid="virtual-keyboard" className="flex flex-col gap-2 w-full max-w-2xl mx-auto p-2">
      {TURKISH_QWERTY_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.keys.map((key) => (
            <Key
              key={key}
              letter={key}
              status={keyStates.get(key) ?? 'empty'}
              onClick={handleKeyClick}
              isActive={activeKey === key}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
