export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd'

export interface KeyState {
  letter: string
  status: LetterStatus
}

export interface KeyboardRow {
  keys: string[]
}

export const TURKISH_QWERTY_ROWS: KeyboardRow[] = [
  { keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'] },
  { keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'] },
  { keys: ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', 'BACKSPACE'] },
]

export const ENGLISH_QWERTY_ROWS: KeyboardRow[] = [
  { keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'] },
  { keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'] },
  { keys: ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'] },
]
