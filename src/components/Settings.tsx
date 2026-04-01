import { useState, useEffect } from 'react'

interface SettingsProps {
  onBack: () => void
}

const NOTIFICATIONS_KEY = 'setrox_notifications_enabled'

export function Settings({ onBack }: SettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem(NOTIFICATIONS_KEY)
    if (saved !== null) {
      setNotificationsEnabled(saved === 'true')
    }
    
    // Get current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled
    setNotificationsEnabled(newValue)
    localStorage.setItem(NOTIFICATIONS_KEY, String(newValue))
    
    // Request permission if enabling
    if (newValue && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        setPermission(perm)
      })
    }
  }

  const getPermissionText = () => {
    switch (permission) {
      case 'granted':
        return 'İzin verildi'
      case 'denied':
        return 'İzin reddedildi'
      default:
        return 'Bekliyor'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Geri dön"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Ayarlar</h1>
        </div>

        {/* Settings sections */}
        <div className="space-y-6">
          {/* Notifications section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Bildirimler</h2>
            
            {/* Notification toggle */}
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p className="font-medium">Hatırlatıcı bildirimleri</p>
                <p className="text-sm text-gray-400">Durum: {getPermissionText()}</p>
              </div>
              <button
                onClick={handleToggleNotifications}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
                aria-pressed={notificationsEnabled}
                aria-label="Hatırlatıcı bildirimlerini aç/kapat"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Permission denied message */}
            {permission === 'denied' && (
              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <p className="text-sm text-yellow-200">
                  Bildirimler engellendi. Tarayıcı ayarlarından bildirimleri etkinleştirin:
                </p>
                <ul className="text-sm text-yellow-300 mt-2 list-disc list-inside">
                  <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Site ayarları → Bildirimler</li>
                  <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → İzinler → Bildirimler</li>
                  <li>Safari: Ayarlar → Siteler → Bildirimler</li>
                </ul>
              </div>
            )}
          </div>

          {/* Theme section (future-proof) */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Görünüm</h2>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Koyu tema</p>
                <p className="text-sm text-gray-400">Yakında</p>
              </div>
              <span className="text-sm text-gray-500">—</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
