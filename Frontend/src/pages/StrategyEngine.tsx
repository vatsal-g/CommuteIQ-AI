import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from "react";
import axios from "axios";

const letterStyles: any = {
  A: {
    background: 'rgba(245,158,11,.14)',
    color: '#fde68a',
  },
  B: {
    background: 'rgba(59,130,246,.14)',
    color: '#bfdbfe',
  },
  C: {
    background: 'rgba(16,185,129,.14)',
    color: '#a7f3d0',
  },
  D: {
    background: 'rgba(34,197,94,.14)',
    color: '#bbf7d0',
  },
}

export default function StrategyEngine() {
  const navigate = useNavigate()
const [strategies, setStrategies] = useState<any[]>([])

useEffect(() => {
  const fetchStrategies = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/strategies"
      )

      setStrategies(res.data.strategies)
    } catch (error) {
      console.error(error)
    }
  }

  fetchStrategies()
}, [])
  return (
    <motion.section className="page-enter page-content"
      style={{ minHeight: 'calc(100vh - 76px)', padding: 'clamp(28px,4vw,40px) clamp(18px,5vw,64px) 118px' }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}>

      <div className="flex items-start gap-4 mb-[22px]" style={{ maxWidth: 980 }}>
        <span className="inline-flex items-center justify-center w-[42px] h-[42px] flex-shrink-0 rounded-md text-[13px] font-bold"
          style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.04)', color: 'var(--text-soft)' }}>03</span>
        <div>
          <h2 style={{ fontSize: 'clamp(34px,4.7vw,60px)', lineHeight: 1, fontWeight: 810 }}>ABCD Strategy Engine</h2>
          <p className="mt-3" style={{ maxWidth: 650, color: 'var(--text-soft)', fontSize: 17, lineHeight: 1.55 }}>
            CommuteIQ generated four ranked ways to reach Cyber City by 9 AM.
          </p>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        {strategies.map(s => (
          <article key={s.letter}
            className="relative grid gap-3.5 p-[18px] rounded-lg overflow-hidden transition-all duration-180 hover:-translate-y-0.5 cursor-pointer"
            style={{
              minHeight: 318,
              border: s.recommended ? '1px solid rgba(16,185,129,.54)' : '1px solid var(--line)',
              background: 'rgba(15,23,42,.62)',
              boxShadow: s.recommended ? '0 20px 60px rgba(16,185,129,.11)' : undefined,
            }}
            onClick={() =>
  navigate('/strategy-details', {
    state: {
      strategy: s,
    },
  })
}>
            {s.recommended && (
              <div className="absolute top-3.5 right-3.5 inline-flex items-center justify-center min-h-[26px] px-2.5 rounded-full text-[11px] font-extrabold"
                style={{ border: '1px solid rgba(16,185,129,.32)', background: 'rgba(16,185,129,.1)', color: '#a7f3d0' }}>
                Recommended
              </div>
            )}
            <div className="grid gap-3 items-start">
              <span className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-md text-[12px] font-extrabold"
                style={letterStyles[s.letter]}>{s.letter}</span>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{s.label}</h3>
              <span className="inline-flex items-center justify-center min-h-[26px] px-2.5 rounded-full text-[11px] font-extrabold w-max"
                style={{ border: '1px solid rgba(16,185,129,.32)', background: 'rgba(16,185,129,.1)', color: '#a7f3d0' }}>
                {s.time}
              </span>
            </div>
            <strong style={{ fontSize: 38, lineHeight: 1 }}>{s.price}</strong>
            <dl>
              {s.stats.map(([k, v]: [string, string]) => (                <div key={k} className="flex items-center justify-between gap-4 pt-3" style={{ borderTop: '1px solid var(--line)' }}>
                  <dt style={{ color: 'var(--muted)', fontSize: 13 }}>{k}</dt>
                  <dd style={{ margin: 0, color: 'var(--text-soft)', fontSize: 13, fontWeight: 750 }}>{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between gap-5 mt-[18px] px-[18px] py-3.5 rounded-lg"
        style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,.62)' }}>
        <div>
          <span className="inline-flex items-center justify-center min-h-[26px] px-2.5 rounded-full text-[11px] font-extrabold"
            style={{ border: '1px solid rgba(16,185,129,.32)', background: 'rgba(16,185,129,.1)', color: '#a7f3d0' }}>
            AI Recommendation
          </span>
          <p className="mt-2" style={{ maxWidth: 760, color: 'var(--text-soft)', lineHeight: 1.55 }}>
            Strategy C is best because it avoids the highest crowd window while keeping arrival within the requested budget and time.
          </p>
        </div>
        <button
          onClick={() =>
            navigate('/strategy-details', {
              state: {
                strategy: strategies.find((x: any) => x.recommended),
              },
            })
          }
          className="flex-shrink-0 inline-flex items-center justify-center min-h-[48px] px-5 rounded-md text-sm font-bold transition-transform hover:-translate-y-px"
          style={{ border: '1px solid rgba(79,70,229,.68)', background: 'var(--primary)', color: 'var(--text)', boxShadow: '0 18px 42px rgba(79,70,229,.32)' }}
        >
          View Details
        </button>
      </div>
    </motion.section>
  )
}
