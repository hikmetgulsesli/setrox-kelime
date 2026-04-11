import { useState, useCallback } from 'react'
import type { Operation, CalculatorState } from '../types/calculator'
import { calculate, formatDisplay, parseInput } from '../utils/calculator'

const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  memory: 0,
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState)

  const inputDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: digit,
          waitingForOperand: false,
        }
      }

      // Prevent multiple leading zeros
      if (prev.display === '0' && digit === '0') {
        return prev
      }

      // Replace initial zero with digit (unless adding decimal)
      const newDisplay = prev.display === '0' && digit !== '.'
        ? digit
        : prev.display + digit

      // Limit input length
      if (newDisplay.replace('.', '').length > 12) {
        return prev
      }

      return {
        ...prev,
        display: newDisplay,
      }
    })
  }, [])

  const inputDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: '0.',
          waitingForOperand: false,
        }
      }

      // Only add decimal if not already present
      if (prev.display.includes('.')) {
        return prev
      }

      return {
        ...prev,
        display: prev.display + '.',
      }
    })
  }, [])

  const clear = useCallback(() => {
    setState(prev => ({
      ...initialState,
      memory: prev.memory,
    }))
  }, [])

  const clearEntry = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: '0',
      waitingForOperand: false,
    }))
  }, [])

  const deleteLastDigit = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) return prev

      const newDisplay = prev.display.length > 1
        ? prev.display.slice(0, -1)
        : '0'

      return {
        ...prev,
        display: newDisplay,
      }
    })
  }, [])

  const performOperation = useCallback((nextOperation: Operation) => {
    setState(prev => {
      const currentValue = parseInput(prev.display)

      if (prev.previousValue === null || prev.waitingForOperand) {
        return {
          ...prev,
          previousValue: currentValue,
          operation: nextOperation,
          waitingForOperand: true,
        }
      }

      const result = calculate(prev.previousValue, currentValue, prev.operation || 'add')

      if (result.error) {
        return {
          ...initialState,
          display: result.error,
        }
      }

      return {
        ...prev,
        display: formatDisplay(result.value),
        previousValue: result.value,
        operation: nextOperation,
        waitingForOperand: true,
      }
    })
  }, [])

  const performCalculation = useCallback(() => {
    setState(prev => {
      if (prev.previousValue === null || prev.operation === null) {
        return prev
      }

      const currentValue = parseInput(prev.display)
      const result = calculate(prev.previousValue, currentValue, prev.operation)

      if (result.error) {
        return {
          ...initialState,
          display: result.error,
        }
      }

      return {
        ...initialState,
        display: formatDisplay(result.value),
        previousValue: null,
        operation: null,
        waitingForOperand: true,
      }
    })
  }, [])

  const toggleSign = useCallback(() => {
    setState(prev => {
      const currentValue = parseInput(prev.display)
      return {
        ...prev,
        display: formatDisplay(-currentValue),
      }
    })
  }, [])

  const inputPercent = useCallback(() => {
    setState(prev => {
      const currentValue = parseInput(prev.display)
      return {
        ...prev,
        display: formatDisplay(currentValue / 100),
      }
    })
  }, [])

  const memoryClear = useCallback(() => {
    setState(prev => ({ ...prev, memory: 0 }))
  }, [])

  const memoryRecall = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: formatDisplay(prev.memory),
      waitingForOperand: true,
    }))
  }, [])

  const memoryAdd = useCallback(() => {
    setState(prev => ({
      ...prev,
      memory: prev.memory + parseInput(prev.display),
      waitingForOperand: true,
    }))
  }, [])

  const memorySubtract = useCallback(() => {
    setState(prev => ({
      ...prev,
      memory: prev.memory - parseInput(prev.display),
      waitingForOperand: true,
    }))
  }, [])

  return {
    display: state.display,
    previousValue: state.previousValue,
    operation: state.operation,
    waitingForOperand: state.waitingForOperand,
    memory: state.memory,
    inputDigit,
    inputDecimal,
    clear,
    clearEntry,
    deleteLastDigit,
    performOperation,
    performCalculation,
    toggleSign,
    inputPercent,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
  }
}
