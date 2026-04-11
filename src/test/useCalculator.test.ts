import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from '../hooks/useCalculator'

describe('useCalculator', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCalculator())
    
    expect(result.current.display).toBe('0')
    expect(result.current.previousValue).toBeNull()
    expect(result.current.operation).toBeNull()
    expect(result.current.waitingForOperand).toBe(false)
    expect(result.current.memory).toBe(0)
  })

  it('should input digits', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('1')
    })
    
    expect(result.current.display).toBe('1')
    
    act(() => {
      result.current.inputDigit('2')
    })
    
    expect(result.current.display).toBe('12')
  })

  it('should handle decimal input', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.inputDecimal()
      result.current.inputDigit('5')
    })
    
    expect(result.current.display).toBe('5.5')
  })

  it('should prevent multiple decimals', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDecimal()
      result.current.inputDecimal()
    })
    
    expect(result.current.display).toBe('0.')
  })

  it('should clear display', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.clear()
    })
    
    expect(result.current.display).toBe('0')
    expect(result.current.previousValue).toBeNull()
  })

  it('should clear entry only', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.performOperation('add')
      result.current.inputDigit('3')
      result.current.clearEntry()
    })
    
    expect(result.current.display).toBe('0')
    expect(result.current.previousValue).toBe(5)
  })

  it('should delete last digit', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('1')
      result.current.inputDigit('2')
      result.current.inputDigit('3')
      result.current.deleteLastDigit()
    })
    
    expect(result.current.display).toBe('12')
  })

  it('should perform addition', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.performOperation('add')
      result.current.inputDigit('3')
      result.current.performCalculation()
    })
    
    expect(result.current.display).toBe('8')
  })

  it('should perform subtraction', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('1')
      result.current.inputDigit('0')
      result.current.performOperation('subtract')
      result.current.inputDigit('3')
      result.current.performCalculation()
    })
    
    expect(result.current.display).toBe('7')
  })

  it('should perform multiplication', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('6')
      result.current.performOperation('multiply')
      result.current.inputDigit('7')
      result.current.performCalculation()
    })
    
    expect(result.current.display).toBe('42')
  })

  it('should perform division', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('2')
      result.current.inputDigit('0')
      result.current.performOperation('divide')
      result.current.inputDigit('4')
      result.current.performCalculation()
    })
    
    expect(result.current.display).toBe('5')
  })

  it('should handle division by zero', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.performOperation('divide')
      result.current.inputDigit('0')
      result.current.performCalculation()
    })
    
    expect(result.current.display).toBe('Division by zero')
  })

  it('should toggle sign', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.toggleSign()
    })
    
    expect(result.current.display).toBe('-5')
    
    act(() => {
      result.current.toggleSign()
    })
    
    expect(result.current.display).toBe('5')
  })

  it('should calculate percentage', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.inputDigit('0')
      result.current.inputPercent()
    })
    
    expect(result.current.display).toBe('0.5')
  })

  it('should handle chained operations', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.performOperation('add')
      result.current.inputDigit('3')
      result.current.performOperation('multiply')
    })
    
    expect(result.current.display).toBe('8')
    
    act(() => {
      result.current.inputDigit('2')
      result.current.performCalculation()
    })
    
    expect(result.current.display).toBe('16')
  })

  describe('memory operations', () => {
    it('should store and recall memory', () => {
      const { result } = renderHook(() => useCalculator())
      
      act(() => {
        result.current.inputDigit('5')
        result.current.memoryAdd()
        result.current.clear()
        result.current.memoryRecall()
      })
      
      expect(result.current.display).toBe('5')
    })

    it('should clear memory', () => {
      const { result } = renderHook(() => useCalculator())
      
      act(() => {
        result.current.inputDigit('5')
        result.current.memoryAdd()
        result.current.memoryClear()
      })
      
      expect(result.current.memory).toBe(0)
    })

    it('should subtract from memory', () => {
      const { result } = renderHook(() => useCalculator())
      
      act(() => {
        result.current.inputDigit('1')
        result.current.inputDigit('0')
        result.current.memoryAdd()
        result.current.inputDigit('3')
        result.current.memorySubtract()
      })
      
      expect(result.current.memory).toBe(7)
    })
  })

  it('should limit input length to 12 digits', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.inputDigit('1')
      }
    })
    
    expect(result.current.display.replace('.', '').length).toBeLessThanOrEqual(12)
  })
})
