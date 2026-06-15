import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import axios from 'axios'

const timelineSteps = [
  { icon: 'M', title: 'Metro Yellow Line', sub: 'Home to Rajiv Chowk', time: '18 min' },
  { icon: 'M', title: 'Metro Blue Line', sub: 'Rajiv Chowk to HUDA City Centre', time: '22 min' },
  { icon: 'C', title: 'AI Carpool', sub: 'HUDA City Centre to office', time: '10 min' },
]

export default function StrategyDetails() {
  const [recommendation, setRecommendation] = useState<any>(null)

useEffect(() => {
  axios
    .get("http://localhost:5000/api/recommendation")
    .then((res) => {
      setRecommendation(res.data)
    })
    .catch((err) => {
      console.error(err)
    })
}, [])
  return (
    <motion.section className="page-enter page-content"
      style={{ minHeight: 'calc(100vh - 76px)', padding: 'clamp(34px,5vw,58px) clamp(18px,5vw,64px) 118px' }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}>

      <div className="flex items-start gap-4 mb-7" style={{ maxWidth: 980 }}>
        <span className="inline-flex items-center justify-center w-[42px] h-[42px] flex-shrink-0 rounded-md text-[13px] font-bold"
          style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.04)', color: 'var(--text-soft)' }}>04</span>
        <div>
         <h2
  style={{
    fontSize: 'clamp(34px,5vw,68px)',
    lineHeight: 1,
    fontWeight: 810
  }}
>
  {recommendation?.recommended_mode || "Loading Strategy..."}
</h2>
          <p
  className="mt-3"
  style={{
    maxWidth: 650,
    color: 'var(--text-soft)',
    fontSize: 17,
    lineHeight: 1.55
  }}
>
  {recommendation?.reason || "Fetching recommendation..."}
</p>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(320px,420px)' }}>
        {/* Timeline panel */}
        <div className="rounded-lg p-[18px]" style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,.62)' }}>
          <div className="grid gap-2.5 mb-[18px]" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[
  `${recommendation?.estimated_time_saved || 0} min saved`,
  `${recommendation?.confidence || 0}% confidence`,
  recommendation?.recommended_mode || "Route",
  "AI Powered"
].map(m => (
              <span key={m} className="inline-flex items-center justify-center rounded-md text-[13px] font-bold"
                style={{ minHeight: 58, border: '1px solid var(--line)', background: 'rgba(255,255,255,.035)', color: 'var(--text-soft)' }}>{m}</span>
            ))}
          </div>
          <ol className="route-timeline">
            {timelineSteps.map(step => (
              <li key={step.title} className="relative grid items-center gap-3.5 rounded-lg"
                style={{ gridTemplateColumns: '48px 1fr auto', minHeight: 112, padding: 16, border: '1px solid var(--line)', background: 'rgba(255,255,255,.028)' }}>
                <span className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-md text-[12px] font-extrabold"
                  style={{ background: 'rgba(79,70,229,.15)', color: '#c7d2fe' }}>{step.icon}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p style={{ marginTop: 6, color: 'var(--muted)', fontSize: 14 }}>{step.sub}</p>
                </div>
                <time style={{ color: 'var(--text-soft)', fontWeight: 760 }}>{step.time}</time>
              </li>
            ))}
          </ol>
        </div>

        {/* Side panels */}
        <div className="grid gap-3.5 p-3.5 rounded-lg" style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,.62)' }}>
          <div className="grid gap-2 p-4 rounded-md" style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.035)' }}>
            <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 780, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Delay prediction</span>
            <strong style={{ fontSize: 30 }}>12 min risk</strong>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.55, fontSize: 14 }}>Confidence is 86% because the Blue Line has recurring slowdown at this time.</p>
            <div className="flex items-end gap-[7px] mt-2" style={{ height: 54 }}>
              {[1,2,3,4,5,6].map(i => (
                <i key={i} className={`sparkline-bar flex-1 rounded-t-full rounded-b-[3px]`}
                  style={{ display: 'block', background: 'rgba(79,70,229,.84)' }} />
              ))}
            </div>
          </div>
          <div className="grid gap-2 p-4 rounded-md" style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.035)' }}>
            <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 780, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Crowd prediction</span>
            <strong style={{ fontSize: 30 }}>Low after 8:50</strong>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.55, fontSize: 14 }}>Comfort improves if you avoid the 8:30–8:45 boarding wave.</p>
          </div>
          <div className="grid gap-2 p-4 rounded-md" style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.035)' }}>
            <span className="inline-flex items-center justify-center min-h-[26px] px-2.5 rounded-full text-[11px] font-extrabold w-max"
              style={{ border: '1px solid rgba(16,185,129,.32)', background: 'rgba(16,185,129,.1)', color: '#a7f3d0' }}>
              AI explanation
            </span>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.55, fontSize: 14 }}>
              This route trades 8 extra minutes for a major drop in crowd density, a lower transfer risk, and a more predictable last mile.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
