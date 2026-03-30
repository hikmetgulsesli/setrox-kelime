import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Keyboard } from './Keyboard'
import type { LetterStatus } from '../types/keyboard'

describe('Keyboard', () => {
  const defaultProps = {
    keyStates: new Map<string, LetterStatus>(),
    onKeyPress: vi.fn(),
    onEnter: vi.fn(),
    onBackspace: vi.fn(),
  }

  it('renders all Turkish QWERTY keys', () => {
    render(<Keyboard {...defaultProps} />)
    
    // Top row
    expect(screen.getByTestId('key-Q')).toBeInTheDocument()
    expect(screen.getByTestId('key-W')).toBeInTheDocument()
    expect(screen.getByTestId('key-E')).toBeInTheDocument()
    expect(screen.getByTestId('key-R')).toBeInTheDocument()
    expect(screen.getByTestId('key-T')).toBeInTheDocument()
    expect(screen.getByTestId('key-Y')).toBeInTheDocument()
    expect(screen.getByTestId('key-U')).toBeInTheDocument()
    expect(screen.getByTestId('key-I')).toBeInTheDocument()
    expect(screen.getByTestId('key-O')).toBeInTheDocument()
    expect(screen.getByTestId('key-P')).toBeInTheDocument()
    expect(screen.getByTestId('key-Ğ')).toBeInTheDocument()
    expect(screen.getByTestId('key-Ü')).toBeInTheDocument()
    
    // Middle row
    expect(screen.getByTestId('key-A')).toBeInTheDocument()
    expect(screen.getByTestId('key-S')).toBeInTheDocument()
    expect(screen.getByTestId('key-D')).toBeInTheDocument()
    expect(screen.getByTestId('key-F')).toBeInTheDocument()
    expect(screen.getByTestId('key-G')).toBeInTheDocument()
    expect(screen.getByTestId('key-H')).toBeInTheDocument()
    expect(screen.getByTestId('key-J')).toBeInTheDocument()
    expect(screen.getByTestId('key-K')).toBeInTheDocument()
    expect(screen.getByTestId('key-L')).toBeInTheDocument()
    expect(screen.getByTestId('key-Ş')).toBeInTheDocument()
    expect(screen.getByTestId('key-İ')).toBeInTheDocument()
    
    // Bottom row
    expect(screen.getByTestId('key-ENTER')).toBeInTheDocument()
    expect(screen.getByTestId('key-Z')).toBeInTheDocument()
    expect(screen.getByTestId('key-X')).toBeInTheDocument()
    expect(screen.getByTestId('key-C')).toBeInTheDocument()
    expect(screen.getByTestId('key-V')).toBeInTheDocument()
    expect(screen.getByTestId('key-B')).toBeInTheDocument()
    expect(screen.getByTestId('key-N')).toBeInTheDocument()
    expect(screen.getByTestId('key-M')).toBeInTheDocument()
    expect(screen.getByTestId('key-Ö')).toBeInTheDocument()
    expect(screen.getByTestId('key-Ç')).toBeInTheDocument()
    expect(screen.getByTestId('key-BACKSPACE')).toBeInTheDocument()
  })

  it('calls onKeyPress when letter key is clicked', () => {
    const onKeyPress = vi.fn()
    render(<Keyboard {...defaultProps} onKeyPress={onKeyPress} />)
    
    fireEvent.click(screen.getByTestId('key-A'))
    expect(onKeyPress).toHaveBeenCalledWith('A')
  })

  it('calls onEnter when ENTER key is clicked', () => {
    const onEnter = vi.fn()
    render(<Keyboard {...defaultProps} onEnter={onEnter} />)
    
    fireEvent.click(screen.getByTestId('key-ENTER'))
    expect(onEnter).toHaveBeenCalled()
  })

  it('calls onBackspace when BACKSPACE key is clicked', () => {
    const onBackspace = vi.fn()
    render(<Keyboard {...defaultProps} onBackspace={onBackspace} />)
    
    fireEvent.click(screen.getByTestId('key-BACKSPACE'))
    expect(onBackspace).toHaveBeenCalled()
  })

  it('applies correct colors from keyStates', () => {
    const keyStates = new Map<string, LetterStatus>([
      ['A', 'correct'],
      ['B', 'present'],
      ['C', 'absent'],
    ])
    
    render(<Keyboard {...defaultProps} keyStates={keyStates} />)
    
    expect(screen.getByTestId('key-A')).toHaveClass('bg-green-500')
    expect(screen.getByTestId('key-B')).toHaveClass('bg-yellow-500')
    expect(screen.getByTestId('key-C')).toHaveClass('bg-gray-500')
  })

  it('calls onKeyPress with Turkish characters', () => {
    const onKeyPress = vi.fn()
    render(<Keyboard {...defaultProps} onKeyPress={onKeyPress} />)
    
    fireEvent.click(screen.getByTestId('key-Ç'))
    expect(onKeyPress).toHaveBeenCalledWith('Ç')
    
    fireEvent.click(screen.getByTestId('key-Ş'))
    expect(onKeyPress).toHaveBeenCalledWith('Ş')
    
    fireEvent.click(screen.getByTestId('key-Ğ'))
    expect(onKeyPress).toHaveBeenCalledWith('Ğ')
    
    fireEvent.click(screen.getByTestId('key-Ü'))
    expect(onKeyPress).toHaveBeenCalledWith('Ü')
    
    fireEvent.click(screen.getByTestId('key-Ö'))
    expect(onKeyPress).toHaveBeenCalledWith('Ö')
    
    fireEvent.click(screen.getByTestId('key-İ'))
    expect(onKeyPress).toHaveBeenCalledWith('İ')
  })
})
