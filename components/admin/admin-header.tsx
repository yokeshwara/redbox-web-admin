'use client'

import { useRouter } from 'next/navigation'
import { Search, Bell, LogOut, Settings, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ProfileUpdateModal } from './profile-update-modal'
import { profileAPI } from '@/lib/api/profile'
import { useToast } from '@/hooks/use-toast'
import { setToken, clearToken } from '@/lib/api/auth'
import { logoutUser } from '@/lib/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AdminHeader() {
  const router = useRouter()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [adminName, setAdminName] = useState('Admin User')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [currentProfile, setCurrentProfile] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState('')
  const { toast } = useToast()
  const [notifications] = useState([
    {
      title: 'New branch added',
      time: '2 minutes ago',
    },
    {
      title: 'Profile updated',
      time: '1 hour ago',
    },
    {
      title: 'New review received',
      time: 'Yesterday',
    },
  ])

  useEffect(() => {
    fetchProfile()

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  const fetchProfile = async () => {
    try {
      const profile = await profileAPI.getProfile()
      console.log('[v0] Profile fetched:', profile)
      setCurrentProfile(profile)
      setAdminName(profile.full_name || profile.name || 'Admin User')
      if (profile.profile_image) {
        setProfileImage(profile.profile_image)
      }
    } catch (error) {
      console.log('[v0] Profile fetch error (expected if not logged in):', error)
      // Fall back to default values silently - this is expected when no token exists
      setAdminName('Admin User')
    }
  }

  const handleProfileUpdateSuccess = async () => {
    await fetchProfile()
    setShowProfileModal(false)
  }

  const handleSettingsClick = () => {
    router.push('/admin/settings')
  }

  const handleLogout = () => {
    clearToken()
    logoutUser('/admin/login')
  }

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      setToken(tokenInput.trim())
      console.log('[v0] Token set successfully. Refreshing page...')
      setTokenInput('')
      setShowTokenInput(false)
      // Reload page to pick up new token
      window.location.reload()
    }
  }

  return (
    <>
      <header className="sticky top-0 h-20 bg-white border-b border-primary/20 flex items-center justify-between px-4 sm:px-6 md:px-8 z-10 shadow-sm">

        {/* Left - Search (Hidden Mobile) */}
        <div className="hidden sm:flex items-center gap-2 bg-primary/5 border border-primary/30 rounded-lg px-4 py-2 flex-1 max-w-xs md:max-w-md hover:border-primary transition-all">
          <Search size={16} className="text-primary" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* Center - Status (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-center">
          {showTokenInput ? (
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/30 rounded-lg px-3 py-2">
              <input
                type="password"
                placeholder="Paste API token..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetToken()}
                className="bg-transparent outline-none text-sm flex-1 w-48"
                autoFocus
              />
              <button
                onClick={handleSetToken}
                className="text-primary text-sm font-semibold hover:text-primary/80 transition"
              >
                Set
              </button>
              <button
                onClick={() => {
                  setShowTokenInput(false)
                  setTokenInput('')
                }}
                className="text-muted-foreground text-sm hover:text-foreground transition"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Active</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {currentTime}
              </div>
              <button
                onClick={() => setShowTokenInput(true)}
                className="ml-4 text-xs text-primary hover:text-primary/80 underline"
                title="Click to add API token for testing"
              >
                [+ Token]
              </button>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative p-2 rounded-lg text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary transition"
                title="Notifications"
              >
                <Bell size={20} />

                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72">
              <div className="px-3 py-2 border-b">
                <p className="font-semibold text-sm">Notifications</p>
              </div>

              {notifications.length > 0 ? (
                <>
                  {notifications.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="flex flex-col items-start gap-1 cursor-pointer"
                    >
                      <span className="text-sm font-medium">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-primary font-semibold justify-center cursor-pointer">
                    View All Notifications
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem disabled>
                  No notifications
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-lg text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary transition"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary transition font-semibold"
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          {/* Desktop Profile */}
          <div
            className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-primary/20 cursor-pointer hover:bg-primary/5 rounded-lg px-3 py-1 transition"
            onClick={() => setShowProfileModal(true)}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {adminName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-sm">
              <p className="font-semibold">{adminName}</p>
              <p className="text-xs text-primary">Administrator</p>
            </div>
          </div>

          {/* Mobile Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="md:hidden p-2 rounded-lg text-primary hover:bg-primary/10 border border-primary/30">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-sm">
                    {adminName.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mr-1">

              <div className="px-3 py-2">
                <p className="text-sm font-semibold">
                  {adminName}
                </p>
                <p className="text-xs text-primary">
                  Administrator
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowProfileModal(true)}
                className="cursor-pointer"
              >
                <User size={16} className="mr-2" />
                Update Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-primary"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>

      <ProfileUpdateModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSuccess={handleProfileUpdateSuccess}
        currentProfile={currentProfile}
      />
    </>
  )
}
