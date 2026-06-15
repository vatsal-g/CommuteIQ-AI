import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Bookmark, Settings, LogOut, Sliders } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const initial = user.name.charAt(0).toUpperCase()

  return (
    <div ref={ref} className="relative" style={{ justifySelf: 'end' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
        style={{ background: 'var(--primary)', color: '#fff', border: '2px solid rgba(79,70,229,0.4)', boxShadow: '0 0 0 3px rgba(79,70,229,0.15)' }}
        aria-label="Open profile menu"
      >
        {initial}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-12 w-56 rounded-lg overflow-hidden z-50"
            style={{ border: '1px solid var(--line)', background: 'rgba(12,18,30,.98)', boxShadow: 'var(--shadow)' }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
          >
            {/* User info */}
            <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--line)' }}>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{user.name}</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{user.email}</p>
              <button onClick={() => alert("Edit Profile prototype")} className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-all"
                style={{ border: '1px solid var(--line)', color: 'var(--text-soft)', background: 'rgba(255,255,255,0.04)' }}>
                <Pencil size={11} /> Edit Profile
              </button>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {[
                { icon: <Bookmark size={14} />, label: 'Saved Routes', path:'/saved-routes' },
                { icon: <Sliders size={14} />, label: 'Preferences', path:'/preferences' },
                { icon: <Settings size={14} />, label: 'Account Settings', path:'/account-settings' },
              ].map(item => (
                <button key={item.label} onClick={() => { navigate((item as any).path); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
                  style={{ color: 'var(--text-soft)' }}>
                  <span style={{ color: 'var(--muted)' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--line)' }} className="py-1">
              <button onClick={() => { logout(); setOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
                style={{ color: 'var(--danger)' }}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
