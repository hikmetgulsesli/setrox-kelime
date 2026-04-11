import type { Operation, CalculationResult } from '../types/calculator'

export function calculate(
  left: number,
  right: number,
  operation: Operation
): CalculationResult {
  switch (operation) {
    case 'add':
      return { value: left + right }
    case 'subtract':
      return { value: left - right }
    case 'multiply':
      return { value: left * right }
    case 'divide':
      if (right === 0) {
        return { value: 0, error: 'Division by zero' }
      }
      return { value: left / right }
    default:
      return { value: right }
  }
}

export function formatDisplay(value: number): string {
  if (Number.isNaN(value)) return 'Error'
  if (!Number.isFinite(value)) return 'Error'
  
  const stringValue = value.toString()
  
  // Handle very large or very small numbers with scientific notation
  if (Math.abs(value) > 999999999999 || (Math.abs(value) < 0.000001 && value !== 0)) {
    return value.toExponential(6)
  }
  
  // Limit to 12 digits to fit display
  if (stringValue.length > 12) {
    const precision = 12 - Math.floor(Math.log10(Math.abs(value))) - 1
    return value.toFixed(Math.max(0, precision))
  }
  
  return stringValue
}

export function parseInput(input: string): number {
  const parsed = parseFloat(input)
  return Number.isNaN(parsed) ? 0 : parsed
}
