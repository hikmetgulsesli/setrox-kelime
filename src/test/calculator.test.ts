import { describe, it, expect } from 'vitest'
import { calculate, formatDisplay, parseInput } from '../utils/calculator'


describe('calculate', () => {
  it('should add two numbers', () => {
    const result = calculate(5, 3, 'add')
    expect(result.value).toBe(8)
    expect(result.error).toBeUndefined()
  })

  it('should subtract two numbers', () => {
    const result = calculate(10, 4, 'subtract')
    expect(result.value).toBe(6)
  })

  it('should multiply two numbers', () => {
    const result = calculate(6, 7, 'multiply')
    expect(result.value).toBe(42)
  })

  it('should divide two numbers', () => {
    const result = calculate(20, 4, 'divide')
    expect(result.value).toBe(5)
  })

  it('should return error on division by zero', () => {
    const result = calculate(10, 0, 'divide')
    expect(result.error).toBe('Division by zero')
  })

  it('should handle negative numbers', () => {
    expect(calculate(-5, 3, 'add').value).toBe(-2)
    expect(calculate(5, -3, 'multiply').value).toBe(-15)
  })

  it('should handle decimal numbers', () => {
    expect(calculate(0.1, 0.2, 'add').value).toBeCloseTo(0.3)
  })
})

describe('formatDisplay', () => {
  it('should format simple numbers', () => {
    expect(formatDisplay(42)).toBe('42')
    expect(formatDisplay(3.14)).toBe('3.14')
  })

  it('should return Error for NaN', () => {
    expect(formatDisplay(NaN)).toBe('Error')
  })

  it('should return Error for Infinity', () => {
    expect(formatDisplay(Infinity)).toBe('Error')
    expect(formatDisplay(-Infinity)).toBe('Error')
  })

  it('should use scientific notation for very large numbers', () => {
    expect(formatDisplay(10000000000000)).toContain('e')
  })

  it('should use scientific notation for very small numbers', () => {
    expect(formatDisplay(0.0000001)).toContain('e')
  })
})

describe('parseInput', () => {
  it('should parse valid numbers', () => {
    expect(parseInput('42')).toBe(42)
    expect(parseInput('3.14')).toBe(3.14)
    expect(parseInput('-5')).toBe(-5)
  })

  it('should return 0 for invalid input', () => {
    expect(parseInput('')).toBe(0)
    expect(parseInput('abc')).toBe(0)
  })
})
