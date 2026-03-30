import type { LetterStatus } from '../types/keyboard'

export function getKeyColorClass(status: LetterStatus): string {
  switch (status) {
    case 'correct':
      return 'bg-green-500 text-white border-green-500'
    case 'present':
      return 'bg-yellow-500 text-white border-yellow-500'
    case 'absent':
      return 'bg-gray-500 text-white border-gray-500'
    case 'tbd':
      return 'bg-gray-200 text-black border-gray-300'
    default:
      return 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'
  }
}

export function getKeyWidthClass(key: string): string {
  if (key === 'ENTER' || key === 'BACKSPACE') {
    return 'flex-[1.5]'
  }
  return 'flex-1'
}
