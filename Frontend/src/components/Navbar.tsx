import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileMenu from './ProfileMenu'

interface NavbarProps {
  onAuthOpen: () => void
}

const navLinks = [
  { to: '/journey', label: 'Plan' },
  { to: '/strategies', label: 'Strategies' },
  { to: '/travel-insights', label: 'Intel' },
  { to: '/livemap', label: 'Map' },
  { to: '/carpool', label: 'Carpool' },
  { to: '/copilot', label: 'Copilot' },
]

export default function Navbar({ onAuthOpen }: NavbarProps) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleStart = () => {
    if (isAuthenticated) navigate('/journey')
    else onAuthOpen()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-20 grid items-center gap-6"
      style={{
        gridTemplateColumns: '1fr auto 1fr',
        height: 76,
        padding: '0 clamp(20px,5vw,64px)',
        borderBottom: '1px solid var(--line)',
        background: 'rgba(7,10,16,0.78)',
        backdropFilter: 'blur(18px)',
      }}>
      {/* Brand */}
      <NavLink to="/" className="inline-flex items-center gap-2.5 font-extrabold w-max" aria-label="CommuteIQ home">
        <span className="w-[15px] h-[15px] rounded-[5px] flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.72),rgba(255,255,255,0) 42%),var(--primary)', boxShadow: '0 0 0 5px rgba(79,70,229,.12)' }} />
        <span>CommuteIQ</span>
      </NavLink>

      {/* Nav */}
      <nav className="hidden md:inline-flex items-center gap-2 p-[5px] rounded-full"
        style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,0.64)' }}
        aria-label="Primary navigation">
        {navLinks.map(l => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) =>
              `inline-flex items-center min-h-[34px] px-3.5 rounded-full text-[13px] font-semibold transition-all duration-180 ${isActive ? 'text-white bg-white/7' : ''}`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--text)' : 'var(--muted)',
              background: isActive ? 'rgba(255,255,255,0.07)' : undefined
            })}>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      {isAuthenticated ? (
        <ProfileMenu />
      ) : (
        <button onClick={handleStart}
          className="justify-self-end hidden sm:inline-flex items-center justify-center min-h-[42px] px-[18px] rounded-md text-[13px] font-extrabold transition-transform hover:-translate-y-px"
          style={{ border: '1px solid rgba(79,70,229,.4)', background: '#f8fafc', color: '#08111f', boxShadow: '0 14px 34px rgba(79,70,229,.2)' }}>
          Start Journey
        </button>
      )}
    </header>
  )
}
