import type { LetterStatus } from '../types/keyboard'

interface KeyProps {
  letter: string
  status: LetterStatus
  onClick: (letter: string) => void
  isActive?: boolean
}

export function Key({ letter, status, onClick, isActive = false }: KeyProps) {
  const getColorClass = (): string => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 text-white border-green-500'
      case 'present':
        return 'bg-yellow-500 text-white border-yellow-500'
      case 'absent':
        return 'bg-gray-500 text-white border-gray-500'
      default:
        return 'bg-gray-200 text-black border-gray-300 hover:bg-gray-300'
    }
  }

  const getWidthClass = (): string => {
    if (letter === 'ENTER' || letter === 'BACKSPACE') {
      return 'flex-[1.5] min-w-[60px]'
    }
    return 'flex-1 min-w-[32px]'
  }

  const getDisplayLabel = (): string => {
    if (letter === 'BACKSPACE') return '⌫'
    return letter
  }

  return (
    <button
      data-testid={`key-${letter}`}
      className={`
        ${getWidthClass()}
        h-14
        rounded
        border
        font-semibold
        text-sm
        uppercase
        transition-all
        duration-100
        select-none
        ${getColorClass()}
        ${isActive ? 'scale-95' : 'scale-100'}
        active:scale-95
      `}
      onClick={() => onClick(letter)}
      type="button"
    >
      {getDisplayLabel()}
    </button>
  )
}
