import { useState, useCallback, useEffect } from 'react'
import { Keyboard } from './components/Keyboard'
import { Settings } from './components/Settings'
import type { LetterStatus } from './types/keyboard'

type Page = 'game' | 'settings'

const MAX_GUESSES = 6
const WORD_LENGTH = 5

function evaluateGuess(guess: string, target: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(WORD_LENGTH).fill('absent')
  const targetLetters = target.split('')
  const guessLetters = guess.split('')
  
  // First pass: mark correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct'
      targetLetters[i] = ''
      guessLetters[i] = ''
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] !== '') {
      const index = targetLetters.indexOf(guessLetters[i])
      if (index !== -1) {
        result[i] = 'present'
        targetLetters[index] = ''
      }
    }
  }
  
  return result
}

function updateKeyStates(
  currentStates: Map<string, LetterStatus>,
  guess: string,
  results: LetterStatus[]
): Map<string, LetterStatus> {
  const newStates = new Map(currentStates)
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const status = results[i]
    const currentStatus = newStates.get(letter)
    
    // Priority: correct > present > absent
    if (status === 'correct') {
      newStates.set(letter, 'correct')
    } else if (status === 'present' && currentStatus !== 'correct') {
      newStates.set(letter, 'present')
    } else if (!currentStatus) {
      newStates.set(letter, 'absent')
    }
  }
  
  return newStates
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('game')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [keyStates, setKeyStates] = useState<Map<string, LetterStatus>>(new Map())
  const [targetWord] = useState('KELİM')
  const [gameOver, setGameOver] = useState(false)

  const handleKeyPress = useCallback((key: string) => {
    if (gameOver) return
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key)
    }
  }, [currentGuess.length, gameOver])

  const handleBackspace = useCallback(() => {
    if (gameOver) return
    setCurrentGuess(prev => prev.slice(0, -1))
  }, [gameOver])

  const handleEnter = useCallback(() => {
    if (gameOver) return
    if (currentGuess.length !== WORD_LENGTH) {
      alert('Kelime tamamlanmadı!')
      return
    }

    const results = evaluateGuess(currentGuess, targetWord)
    setKeyStates(prev => updateKeyStates(prev, currentGuess, results))
    setGuesses(prev => [...prev, currentGuess])
    setCurrentGuess('')

    if (currentGuess === targetWord) {
      setGameOver(true)
      alert('Tebrikler! Doğru kelime!')
    } else if (guesses.length + 1 >= MAX_GUESSES) {
      setGameOver(true)
      alert(`Oyun bitti! Kelime: ${targetWord}`)
    }
  }, [currentGuess, targetWord, guesses.length, gameOver])

  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      
      if (key === 'ENTER') {
        handleEnter()
      } else if (key === 'BACKSPACE') {
        handleBackspace()
      } else if (/^[A-ZÇĞİÖŞÜ]$/.test(key)) {
        handleKeyPress(key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleEnter, handleBackspace, handleKeyPress])

  const handleOpenSettings = () => {
    setCurrentPage('settings')
  }

  const handleBackToGame = () => {
    setCurrentPage('game')
  }

  if (currentPage === 'settings') {
    return <Settings onBack={handleBackToGame} />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-8">
      {/* Header with settings button */}
      <div className="w-full max-w-2xl flex items-center justify-between px-4 mb-8">
        <div className="w-10" /> {/* Spacer for centering */}
        <h1 className="text-3xl font-bold">SETROX KELİME</h1>
        <button
          onClick={handleOpenSettings}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          aria-label="Ayarlar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      {/* Game Board */}
      <div className="flex flex-col gap-2 mb-8">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] ?? (rowIndex === guesses.length ? currentGuess : '')
          const isCurrentRow = rowIndex === guesses.length
          
          return (
            <div key={rowIndex} className="flex gap-2">
              {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                const letter = guess[colIndex] ?? ''
                let status: LetterStatus = 'empty'
                
                if (rowIndex < guesses.length) {
                  const results = evaluateGuess(guesses[rowIndex], targetWord)
                  status = results[colIndex]
                } else if (letter) {
                  status = 'tbd'
                }
                
                const getBgColor = () => {
                  switch (status) {
                    case 'correct': return 'bg-green-500 border-green-500'
                    case 'present': return 'bg-yellow-500 border-yellow-500'
                    case 'absent': return 'bg-gray-700 border-gray-700'
                    case 'tbd': return 'bg-gray-800 border-gray-600'
                    default: return 'bg-transparent border-gray-600'
                  }
                }
                
                return (
                  <div
                    key={colIndex}
                    className={`
                      w-14 h-14 border-2 rounded flex items-center justify-center
                      text-2xl font-bold uppercase
                      ${getBgColor()}
                      ${isCurrentRow && letter ? 'border-gray-400' : ''}
                    `}
                  >
                    {letter}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Virtual Keyboard */}
      <Keyboard
        keyStates={keyStates}
        onKeyPress={handleKeyPress}
        onEnter={handleEnter}
        onBackspace={handleBackspace}
      />
    </div>
  )
}

export default App
