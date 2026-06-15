import { NavLink } from 'react-router-dom'

const steps = [
  { to: '/', label: '01' },
  { to: '/journey', label: '02' },
  { to: '/strategies', label: '03' },
  { to: '/strategy-details', label: '04' },
  { to: '/travel-insights', label: '05' },
  { to: '/leave-later', label: '06' },
  { to: '/carpool', label: '07' },
  { to: '/copilot', label: '08' },
]

export default function Stepper() {
  return (
    <>
      {/* Desktop: vertical right rail */}
      <nav
        className="fixed z-[25] md:flex hidden flex-col items-center gap-1.5 p-[7px] rounded-full"
        style={{
          top: 'calc(50% + 38px)',
          right: 22,
          transform: 'translateY(-50%)',
          border: '1px solid var(--line)',
          background: 'rgba(7,10,16,0.78)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 16px 60px rgba(0,0,0,.34)',
        }}
        aria-label="Page navigation"
      >
        {steps.map(s => (
          <NavLink
            key={s.to}
            to={s.to}
            end={s.to === '/'}
            className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-full text-[12px] font-extrabold transition-all duration-180"
            style={({ isActive }) => ({
              background: isActive ? '#f8fafc' : undefined,
              color: isActive ? '#0b0f17' : 'var(--muted)',
            })}
          >{s.label}</NavLink>
        ))}
      </nav>

      {/* Mobile: horizontal bottom bar */}
      <nav
        className="fixed md:hidden flex items-center gap-1 p-[7px] rounded-full z-[25] overflow-x-auto"
        style={{
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 'calc(100vw - 32px)',
          border: '1px solid var(--line)',
          background: 'rgba(7,10,16,0.78)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 16px 60px rgba(0,0,0,.34)',
        }}
        aria-label="Page navigation mobile"
      >
        {steps.map(s => (
          <NavLink
            key={s.to}
            to={s.to}
            end={s.to === '/'}
            className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-full text-[12px] font-extrabold flex-shrink-0 transition-all duration-180"
            style={({ isActive }) => ({
              background: isActive ? '#f8fafc' : undefined,
              color: isActive ? '#0b0f17' : 'var(--muted)',
            })}
          >{s.label}</NavLink>
        ))}
      </nav>
    </>
  )
}
