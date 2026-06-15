import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

interface LandingPageProps {
  onAuthOpen: (path?: string) => void
}

export default function LandingPage({ onAuthOpen }: LandingPageProps) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handlePlan = () => {
    if (isAuthenticated) navigate('/journey')
    else onAuthOpen('/journey')
  }

  const handleStrategy = () => {
    if (isAuthenticated) navigate('/strategies')
    else onAuthOpen('/strategies')
  }

  return (
    <motion.section
      className="page-enter page-content relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,0.94fr) minmax(min(420px,100%),1.06fr)',
        gridTemplateRows: 'auto 1fr auto',
        gap: '28px 46px',
        alignItems: 'center',
        minHeight: 'calc(100vh - 76px)',
        padding: 'clamp(34px,5vw,58px) clamp(18px,5vw,64px) 118px',
      }}
    >
      {/* Kicker — full width */}
      <div
        className="col-span-full justify-self-center inline-flex items-center gap-2.5 min-h-[28px] px-3 rounded-md"
        style={{
          border: '1px solid var(--line)',
          background: 'rgba(15,23,42,0.72)',
          color: 'var(--muted)',
          fontSize: 11, fontWeight: 780,
          textTransform: 'uppercase', letterSpacing: '0.12em',
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--comfort)', boxShadow: '0 0 0 5px rgba(16,185,129,.13)' }}
        />
        New Delhi, India
      </div>

      {/* Hero copy */}
      <div style={{ maxWidth: 650 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(48px,6.7vw,104px)', lineHeight: 0.94, fontWeight: 830 }}>
          Know the smartest way before you leave.
        </h1>
        <p style={{ margin: '24px 0 0', maxWidth: 580, color: 'var(--text-soft)', fontSize: 'clamp(17px,1.5vw,20px)', lineHeight: 1.58 }}>
          CommuteIQ compares speed, cost, crowding, stress, reliability, and carbon impact to recommend a commute strategy that fits your day.
        </p>
        <div className="flex flex-wrap gap-3.5 mt-8">
          <button
            onClick={handlePlan}
            className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-md text-sm font-bold transition-transform hover:-translate-y-px"
            style={{ border: '1px solid rgba(79,70,229,.68)', background: 'var(--primary)', color: 'var(--text)', boxShadow: '0 18px 42px rgba(79,70,229,.32)' }}
          >
            Plan Your Journey
          </button>
          <button
            onClick={handleStrategy}
            className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-md text-sm font-bold transition-transform hover:-translate-y-px"
            style={{ border: '1px solid var(--line-strong)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}
          >
            View Strategy Engine
          </button>
        </div>
      </div>

      {/* Product preview */}
      <div
        className="relative rounded-lg p-3.5"
        aria-label="CommuteIQ product preview"
        style={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(0,1fr) 160px',
          gap: 14,
          minHeight: 484,
          border: '1px solid var(--line)',
          background: 'linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.025)),rgba(12,18,30,.82)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Rail dots */}
        <div
          className="flex flex-col items-center gap-2.5 pt-4 rounded-lg"
          style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,0.62)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--primary)', boxShadow: '0 0 0 5px rgba(79,70,229,.15)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(148,163,184,.28)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(148,163,184,.28)' }} />
        </div>

        {/* Route map panel */}
        <div
          className="rounded-lg overflow-hidden grid"
          style={{ gridTemplateRows: 'auto 1fr', border: '1px solid var(--line)', background: 'rgba(15,23,42,0.62)' }}
        >
          <div className="flex items-center justify-between gap-4 p-4" style={{ borderBottom: '1px solid var(--line)' }}>
            <div className="grid gap-2">
              <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 780, textTransform: 'uppercase', letterSpacing: '0.12em' }}>AI recommendation</span>
              <strong>Leave in 20 minutes</strong>
            </div>
            <span
              className="inline-flex items-center min-h-[26px] px-2.5 rounded-full text-[11px] font-extrabold"
              style={{ border: '1px solid rgba(16,185,129,.32)', background: 'rgba(16,185,129,.1)', color: '#a7f3d0' }}
            >Comfort +18%</span>
          </div>

          {/* Route visual */}
          <div className="relative overflow-hidden" style={{ background: '#0d1421' }}>
            <div className="map-grid" />
            <svg viewBox="0 0 520 260" className="absolute inset-0 w-full h-full" role="img" aria-label="Route line from home to office">
              <defs>
                <linearGradient id="heroGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#4f46e5" />
                  <stop offset=".52" stopColor="#10b981" />
                  <stop offset="1" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path d="M72 190 C128 122 175 224 232 145 C284 72 324 96 374 72 C430 44 456 82 478 34"
                fill="none" stroke="url(#heroGrad)" strokeWidth="9" strokeLinecap="round" />
              <circle cx="72" cy="190" r="12" fill="#f8fafc" stroke="#0b0f17" strokeWidth="7" />
              <circle cx="478" cy="34" r="12" fill="#f8fafc" stroke="#0b0f17" strokeWidth="7" />
            </svg>

            {/* Floating data cards */}
            <div className="absolute grid gap-1 w-[118px] p-3 rounded-md backdrop-blur-md"
              style={{ left: 18, bottom: 18, border: '1px solid var(--line)', background: 'rgba(7,10,16,.78)' }}>
              <span style={{ color: 'var(--muted)', fontSize: 12 }}>Reliability</span>
              <strong style={{ fontSize: 22 }}>93%</strong>
            </div>
            <div className="absolute grid gap-1 w-[118px] p-3 rounded-md backdrop-blur-md"
              style={{ right: 18, top: 88, border: '1px solid var(--line)', background: 'rgba(7,10,16,.78)' }}>
              <span style={{ color: 'var(--muted)', fontSize: 12 }}>Stress</span>
              <strong style={{ fontSize: 22 }}>2/10</strong>
            </div>
          </div>
        </div>

        {/* Side mini-panels */}
        <div
          className="grid gap-3.5 p-3.5 rounded-lg"
          style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,0.62)', alignContent: 'start' }}
        >
          <div className="grid gap-2 p-3.5 rounded-md" style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.035)' }}>
            <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 780, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Best strategy</span>
            <strong>Comfort</strong>
            <div className="h-[7px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.08)' }}>
              <span className="block h-full rounded-full" style={{ width: '78%', background: 'var(--comfort)' }} />
            </div>
          </div>
          <div className="grid gap-2 p-3.5 rounded-md" style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.035)' }}>
            <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 780, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Crowd forecast</span>
            <strong>Low after 8:50</strong>
            <div className="grid gap-[5px]" style={{ gridTemplateColumns: 'repeat(5,1fr)' }} aria-hidden="true">
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{
                  display: 'block',
                  height: i === 1 ? 20 : i === 2 ? 28 : i === 3 ? 34 : 20,
                  borderRadius: 3,
                  background: i <= 3 ? 'var(--comfort)' : 'rgba(148,163,184,.22)',
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overview strip — full width */}
      <div
        className="col-span-full grid gap-3.5 mt-2"
        style={{ gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}
      >
        {[
          { icon: 'A', title: 'ABCD Strategy Engine', desc: 'Four clear choices tuned for speed, budget, comfort, and emissions.' },
          { icon: 'AI', title: 'Predictive intelligence', desc: 'Delay, crowd, reliability, and stress models explain what changes.' },
          { icon: 'LM', title: 'Last-mile decisions', desc: 'Compare walk, auto, e-rickshaw, shared rides, and nearby commuters.' },
        ].map(item => (
          <article
            key={item.title}
            className="grid gap-2.5 min-h-[128px] p-[18px] rounded-lg"
            style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,.46)' }}
          >
            <span
              className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-md text-[12px] font-extrabold"
              style={{ background: 'rgba(79,70,229,.15)', color: '#c7d2fe' }}
            >{item.icon}</span>
            <h3 style={{ fontSize: 15, margin: 0, fontWeight: 700 }}>{item.title}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.48, margin: 0 }}>{item.desc}</p>
          </article>
        ))}
      </div>
    </motion.section>
  )
}
