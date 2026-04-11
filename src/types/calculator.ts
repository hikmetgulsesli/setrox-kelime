export type Operation = 'add' | 'subtract' | 'multiply' | 'divide'

export interface CalculatorState {
  display: string
  previousValue: number | null
  operation: Operation | null
  waitingForOperand: boolean
  memory: number
}

export interface CalculationResult {
  value: number
  error?: string
}
