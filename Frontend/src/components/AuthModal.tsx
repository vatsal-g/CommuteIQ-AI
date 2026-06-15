import { useState, useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setError(''); setName(''); setEmail(''); setPassword(''); setConfirm('')
      setTimeout(() => emailRef.current?.focus(), 60)
    }
  }, [isOpen, mode])

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const handleSubmit = () => {
    setError('')
    if (mode === 'signup') {
      if (!name.trim()) { setError('Full name is required'); return }
      if (!email.trim()) { setError('Email is required'); return }
      if (password !== confirm) { setError('Passwords do not match'); return }
      if (register(name, email, password)) { onSuccess?.(); onClose() }
    } else {
      if (!email.trim()) { setError('Email is required'); return }
      if (login(email, password)) { onSuccess?.(); onClose() }
      else setError('Invalid credentials')
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const toggle = () => {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setError('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[999] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={e => { if (e.target === overlayRef.current) onClose() }}
        >
          <motion.div
            className="relative w-full max-w-[460px] rounded-lg p-7"
            style={{
              border: '1px solid var(--line)',
              background: 'linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02)),rgba(12,18,30,.95)',
              boxShadow: 'var(--shadow)'
            }}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-180"
              style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: 16 }}
              aria-label="Close"
            >
              <X size={15} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-[15px] h-[15px] rounded-[5px] mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.72),rgba(255,255,255,0) 42%),var(--primary)', boxShadow: '0 0 0 5px rgba(79,70,229,.12)' }} />
              <h2 className="text-3xl font-extrabold mb-2.5">Welcome to CommuteIQ</h2>
              <p style={{ color: 'var(--text-soft)', lineHeight: 1.6, fontSize: 14 }}>
                Sign in to access personalized commute intelligence,<br />saved journeys, and AI recommendations.
              </p>
            </div>

            {/* Form */}
            <div className="grid gap-4" onKeyDown={handleKeyDown}>
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.label
                    className="grid gap-2"
                    style={{ color: 'var(--text-soft)', fontSize: 13, fontWeight: 700 }}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                  >
                    Full Name
                    <input type="text" placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)}
                      className="w-full h-12 px-3.5 rounded-md"
                      style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,0.045)', color: 'var(--text)' }} />
                  </motion.label>
                )}
              </AnimatePresence>

              <label className="grid gap-2" style={{ color: 'var(--text-soft)', fontSize: 13, fontWeight: 700 }}>
                Email
                <input ref={emailRef} type="email" placeholder="rahul@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-md"
                  style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,0.045)', color: 'var(--text)' }} />
              </label>

              <label className="grid gap-2" style={{ color: 'var(--text-soft)', fontSize: 13, fontWeight: 700 }}>
                Password
                <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-md"
                  style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,0.045)', color: 'var(--text)' }} />
              </label>

              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.label
                    className="grid gap-2"
                    style={{ color: 'var(--text-soft)', fontSize: 13, fontWeight: 700 }}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                  >
                    Confirm Password
                    <input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      className="w-full h-12 px-3.5 rounded-md"
                      style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,0.045)', color: 'var(--text)' }} />
                  </motion.label>
                )}
              </AnimatePresence>

              {error && <p className="text-sm text-center" style={{ color: 'var(--danger)' }}>{error}</p>}

              <button onClick={handleSubmit} className="mt-1 h-12 rounded-md font-bold text-sm transition-transform hover:-translate-y-px"
                style={{ border: '1px solid rgba(79,70,229,0.68)', background: 'var(--primary)', color: 'var(--text)', boxShadow: '0 18px 42px rgba(79,70,229,.32)' }}>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="flex items-center gap-3" style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 700 }}>
                <span className="flex-1 h-px" style={{ background: 'var(--line)' }} />
                OR
                <span className="flex-1 h-px" style={{ background: 'var(--line)' }} />
              </div>

              <button className="w-full h-12 rounded-md font-bold text-sm transition-transform hover:-translate-y-px"
                style={{ border: '1px solid var(--line-strong)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}
                onClick={() => { login('demo@commuteiq.in', 'demo'); onSuccess?.(); onClose() }}>
                Continue with Google
              </button>

              <p className="text-center mt-1.5" style={{ color: 'var(--muted)', fontSize: 14 }}>
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <a href="#" onClick={e => { e.preventDefault(); toggle() }} style={{ color: 'var(--text)', fontWeight: 700 }}>
                  {mode === 'signin' ? 'Create Account' : 'Sign In'}
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
