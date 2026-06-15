import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function JourneyPlanner() {
  const navigate = useNavigate()

  return (
    <motion.section
      className="page-enter page-content"
      style={{ minHeight: 'calc(100vh - 76px)', padding: 'clamp(34px,5vw,58px) clamp(18px,5vw,64px) 118px' }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}
    >
      <div className="flex items-start gap-4 mb-7" style={{ maxWidth: 980 }}>
        <span className="inline-flex items-center justify-center w-[42px] h-[42px] flex-shrink-0 rounded-md text-[13px] font-bold"
          style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.04)', color: 'var(--text-soft)' }}>02</span>
        <div>
          <h2 style={{ fontSize: 'clamp(34px,5vw,68px)', lineHeight: 1, fontWeight: 810 }}>Plan Journey</h2>
          <p className="mt-3" style={{ maxWidth: 650, color: 'var(--text-soft)', fontSize: 17, lineHeight: 1.55 }}>
            Set the commute constraints. CommuteIQ turns the search into strategies.
          </p>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(300px,400px) minmax(0,1fr)', minHeight: 610 }}>
        {/* Form */}
        <div className="grid gap-4 p-[18px] rounded-lg" style={{ alignContent: 'start', border: '1px solid var(--line)', background: 'rgba(15,23,42,.62)' }}>
          {[
            { label: 'From', type: 'text', defaultValue: 'Home, Rajiv Chowk' },
            { label: 'To', type: 'text', defaultValue: 'Cyber City, Gurugram' },
          ].map(f => (
            <label key={f.label} className="grid gap-2" style={{ color: 'var(--text-soft)', fontSize: 13, fontWeight: 700 }}>
              {f.label}
              <input type={f.type} defaultValue={f.defaultValue}
                className="w-full h-12 px-3.5 rounded-md"
                style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.045)', color: 'var(--text)' }} />
            </label>
          ))}

          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <label className="grid gap-2" style={{ color: 'var(--text-soft)', fontSize: 13, fontWeight: 700 }}>
              Budget
              <select className="w-full h-12 px-3.5 rounded-md"
                style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.045)', color: 'var(--text)' }}>
                <option>Under Rs100</option>
                <option>Under Rs50</option>
                <option>No limit</option>
              </select>
            </label>
            <label className="grid gap-2" style={{ color: 'var(--text-soft)', fontSize: 13, fontWeight: 700 }}>
              Arrive by
              <input type="time" defaultValue="09:00"
                className="w-full h-12 px-3.5 rounded-md"
                style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.045)', color: 'var(--text)' }} />
            </label>
          </div>

          <label className="grid gap-2" style={{ color: 'var(--text-soft)', fontSize: 13, fontWeight: 700 }}>
            Preference
            <select className="w-full h-12 px-3.5 rounded-md"
              style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.045)', color: 'var(--text)' }}>
              <option>Balanced intelligence</option>
              <option>Lowest stress</option>
              <option>Lowest carbon</option>
              <option>Fastest possible</option>
            </select>
          </label>

          <button onClick={() => navigate('/strategies')}
            className="w-full h-12 rounded-md text-sm font-bold mt-1 transition-transform hover:-translate-y-px"
            style={{ border: '1px solid rgba(79,70,229,.68)', background: 'var(--primary)', color: 'var(--text)', boxShadow: '0 18px 42px rgba(79,70,229,.32)' }}>
            Find Best Strategies
          </button>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden"
          style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', minHeight: 610, border: '1px solid var(--line)', background: 'rgba(15,23,42,.62)' }}>
          <div className="flex items-center justify-between gap-4 px-4 py-3.5"
            style={{ borderBottom: '1px solid var(--line)', color: 'var(--text-soft)', fontSize: 13, fontWeight: 720 }}>
            <span>Live route canvas</span>
            <div className="flex gap-2">
              {['+', '−'].map(c => (
                <button key={c} className="w-8 h-8 rounded-md text-sm font-bold"
                  style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.04)', color: 'var(--text)' }}>{c}</button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden" style={{ background: '#0d1421', minHeight: 480 }}>
            <div className="map-grid" />
            <svg viewBox="0 0 700 480" className="absolute inset-0 w-full h-full" role="img" aria-label="Interactive route map">
              <path fill="none" stroke="rgba(255,255,255,0.17)" strokeWidth="18" strokeLinecap="round"
                d="M68 390 C140 312 220 330 288 250 C374 150 448 178 508 110 C562 50 610 78 650 42" />
              <path className="active-route"
                d="M68 390 C140 312 220 330 288 250 C374 150 448 178 508 110 C562 50 610 78 650 42" />
              <circle cx="68" cy="390" r="14" fill="#f8fafc" stroke="#0b0f17" strokeWidth="7" />
              <circle cx="650" cy="42" r="14" fill="var(--comfort)" stroke="#0b0f17" strokeWidth="7" />
            </svg>

            {[
              { label: '8:30', sub: 'Metro crowd rising', style: { left: '8%', bottom: '18%' } },
              { label: '+12 min', sub: 'Blue Line delay risk', style: { right: '8%', top: '18%' } },
            ].map(c => (
              <div key={c.label} className="absolute grid gap-[3px] w-[150px] p-[11px] rounded-md backdrop-blur-md"
                style={{ ...c.style, border: '1px solid var(--line)', background: 'rgba(7,10,16,.78)' }}>
                <strong>{c.label}</strong>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>{c.sub}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 px-4 py-3.5"
            style={{ borderTop: '1px solid var(--line)', color: 'var(--text-soft)', fontSize: 13, fontWeight: 720 }}>
            <span className="inline-flex items-center gap-2" style={{ color: 'var(--muted)' }}>
              <i className="w-[7px] h-[7px] rounded-full block" style={{ background: 'var(--comfort)' }} />
              Using live road, metro, crowd, and weather signals
            </span>
            <strong>Confidence 86%</strong>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
