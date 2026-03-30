import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Key } from './Key'

describe('Key', () => {
  it('renders letter key correctly', () => {
    const handleClick = vi.fn()
    render(<Key letter="A" status="empty" onClick={handleClick} />)
    
    expect(screen.getByTestId('key-A')).toBeInTheDocument()
    expect(screen.getByTestId('key-A')).toHaveTextContent('A')
  })

  it('renders BACKSPACE as ⌫', () => {
    const handleClick = vi.fn()
    render(<Key letter="BACKSPACE" status="empty" onClick={handleClick} />)
    
    expect(screen.getByTestId('key-BACKSPACE')).toHaveTextContent('⌫')
  })

  it('renders ENTER key correctly', () => {
    const handleClick = vi.fn()
    render(<Key letter="ENTER" status="empty" onClick={handleClick} />)
    
    expect(screen.getByTestId('key-ENTER')).toHaveTextContent('ENTER')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Key letter="A" status="empty" onClick={handleClick} />)
    
    fireEvent.click(screen.getByTestId('key-A'))
    expect(handleClick).toHaveBeenCalledWith('A')
  })

  it('applies correct color for correct status', () => {
    const handleClick = vi.fn()
    render(<Key letter="A" status="correct" onClick={handleClick} />)
    
    const key = screen.getByTestId('key-A')
    expect(key).toHaveClass('bg-green-500')
  })

  it('applies correct color for present status', () => {
    const handleClick = vi.fn()
    render(<Key letter="A" status="present" onClick={handleClick} />)
    
    const key = screen.getByTestId('key-A')
    expect(key).toHaveClass('bg-yellow-500')
  })

  it('applies correct color for absent status', () => {
    const handleClick = vi.fn()
    render(<Key letter="A" status="absent" onClick={handleClick} />)
    
    const key = screen.getByTestId('key-A')
    expect(key).toHaveClass('bg-gray-500')
  })

  it('applies correct color for empty status', () => {
    const handleClick = vi.fn()
    render(<Key letter="A" status="empty" onClick={handleClick} />)
    
    const key = screen.getByTestId('key-A')
    expect(key).toHaveClass('bg-gray-200')
  })

  it('renders Turkish characters correctly', () => {
    const handleClick = vi.fn()
    const { rerender } = render(<Key letter="Ç" status="empty" onClick={handleClick} />)
    expect(screen.getByTestId('key-Ç')).toHaveTextContent('Ç')
    
    rerender(<Key letter="Ğ" status="empty" onClick={handleClick} />)
    expect(screen.getByTestId('key-Ğ')).toHaveTextContent('Ğ')
    
    rerender(<Key letter="İ" status="empty" onClick={handleClick} />)
    expect(screen.getByTestId('key-İ')).toHaveTextContent('İ')
    
    rerender(<Key letter="Ş" status="empty" onClick={handleClick} />)
    expect(screen.getByTestId('key-Ş')).toHaveTextContent('Ş')
    
    rerender(<Key letter="Ö" status="empty" onClick={handleClick} />)
    expect(screen.getByTestId('key-Ö')).toHaveTextContent('Ö')
    
    rerender(<Key letter="Ü" status="empty" onClick={handleClick} />)
    expect(screen.getByTestId('key-Ü')).toHaveTextContent('Ü')
  })
})
