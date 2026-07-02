import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Settings } from './Settings'

describe('Settings', () => {
  const mockOnBack = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    mockOnBack.mockClear()
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    })
  })

  it('renders settings page with title', () => {
    render(<Settings onBack={mockOnBack} />)
    expect(screen.getByText('Ayarlar')).toBeInTheDocument()
  })

  it('renders back button', () => {
    render(<Settings onBack={mockOnBack} />)
    expect(screen.getByLabelText('Geri dön')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    render(<Settings onBack={mockOnBack} />)
    fireEvent.click(screen.getByLabelText('Geri dön'))
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('renders notification toggle', () => {
    render(<Settings onBack={mockOnBack} />)
    expect(screen.getByText('Hatırlatıcı bildirimleri')).toBeInTheDocument()
  })

  it('renders theme section with coming soon note', () => {
    render(<Settings onBack={mockOnBack} />)
    expect(screen.getByText('Koyu tema')).toBeInTheDocument()
    expect(screen.getByText('Yakında')).toBeInTheDocument()
  })

  it('shows correct permission status text', () => {
    render(<Settings onBack={mockOnBack} />)
    expect(screen.getByText('Durum: Bekliyor')).toBeInTheDocument()
  })

  it('shows denied permission status when denied', () => {
    vi.stubGlobal('Notification', {
      permission: 'denied',
      requestPermission: vi.fn(),
    })
    render(<Settings onBack={mockOnBack} />)
    expect(screen.getByText('Durum: İzin reddedildi')).toBeInTheDocument()
  })

  it('shows granted permission status when granted', () => {
    vi.stubGlobal('Notification', {
      permission: 'granted',
      requestPermission: vi.fn(),
    })
    render(<Settings onBack={mockOnBack} />)
    expect(screen.getByText('Durum: İzin verildi')).toBeInTheDocument()
  })

  it('shows instructions when permission is denied', () => {
    vi.stubGlobal('Notification', {
      permission: 'denied',
      requestPermission: vi.fn(),
    })
    render(<Settings onBack={mockOnBack} />)
    expect(screen.getByText(/Bildirimler engellendi/)).toBeInTheDocument()
    expect(screen.getByText(/Chrome:/)).toBeInTheDocument()
  })

  it('saves notification preference to localStorage when toggled', () => {
    render(<Settings onBack={mockOnBack} />)
    const toggle = screen.getByLabelText('Hatırlatıcı bildirimlerini aç/kapat')
    
    fireEvent.click(toggle)
    expect(localStorage.getItem('setrox_notifications_enabled')).toBe('true')
    
    fireEvent.click(toggle)
    expect(localStorage.getItem('setrox_notifications_enabled')).toBe('false')
  })

  it('loads saved notification preference from localStorage', () => {
    localStorage.setItem('setrox_notifications_enabled', 'true')
    render(<Settings onBack={mockOnBack} />)
    const toggle = screen.getByLabelText('Hatırlatıcı bildirimlerini aç/kapat')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('requests notification permission when enabling and permission is default', async () => {
    const requestPermission = vi.fn().mockResolvedValue('granted')
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission,
    })
    render(<Settings onBack={mockOnBack} />)
    const toggle = screen.getByLabelText('Hatırlatıcı bildirimlerini aç/kapat')
    
    fireEvent.click(toggle)
    expect(requestPermission).toHaveBeenCalledTimes(1)
  })

  it('does not request permission when disabling notifications', () => {
    localStorage.setItem('setrox_notifications_enabled', 'true')
    const requestPermission = vi.fn()
    vi.stubGlobal('Notification', {
      permission: 'granted',
      requestPermission,
    })
    render(<Settings onBack={mockOnBack} />)
    const toggle = screen.getByLabelText('Hatırlatıcı bildirimlerini aç/kapat')
    
    fireEvent.click(toggle)
    expect(requestPermission).not.toHaveBeenCalled()
  })
})
