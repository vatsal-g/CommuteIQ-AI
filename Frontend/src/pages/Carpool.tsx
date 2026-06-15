import { useState } from 'react'
import { motion } from 'framer-motion'

const modes = [
  { icon: 'W', label: 'Walk', detail: '12 min · Rs0' },
  { icon: 'E', label: 'E-rickshaw', detail: '8 min · Rs25' },
  { icon: 'A', label: 'Auto', detail: '6 min · Rs40' },
]

export default function Carpool() {
  const [selected, setSelected] = useState(1)

  return (
    <motion.section
      className="page-enter page-content"
      style={{ minHeight: 'calc(100vh - 76px)', padding: 'clamp(34px,5vw,58px) clamp(18px,5vw,64px) 118px' }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}
    >
      {/* Heading */}
      <div className="flex items-start gap-4 mb-7" style={{ maxWidth: 980 }}>
        <span
          className="inline-flex items-center justify-center w-[42px] h-[42px] flex-shrink-0 rounded-md text-[13px] font-bold"
          style={{ border: '1px solid var(--line)', background: 'rgba(255,255,255,.04)', color: 'var(--text-soft)' }}
        >07</span>
        <div>
          <h2 style={{ fontSize: 'clamp(34px,5vw,68px)', lineHeight: 1, fontWeight: 810 }}>Smart Last-Mile &amp; Carpool</h2>
          <p className="mt-3" style={{ maxWidth: 650, color: 'var(--text-soft)', fontSize: 17, lineHeight: 1.55 }}>
            Finish the commute with lower cost, lower carbon, and fewer unknowns.
          </p>
        </div>
      </div>

      {/* Mode cards */}
      <div className="grid gap-4 mb-[18px]" style={{ gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}>
        {modes.map((m, i) => (
          <article
            key={m.label}
            className="grid gap-2.5 cursor-pointer transition-all duration-180 hover:-translate-y-0.5"
            style={{
              minHeight: 170, padding: 18, borderRadius: 'var(--radius)',
              border: i === selected ? '1px solid rgba(16,185,129,.48)' : '1px solid var(--line)',
              background: i === selected ? 'rgba(16,185,129,.08)' : 'rgba(15,23,42,.62)',
            }}
            onClick={() => setSelected(i)}
          >
            <span
              className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-md text-[12px] font-extrabold"
              style={{ background: 'rgba(79,70,229,.15)', color: '#c7d2fe' }}
            >{m.icon}</span>
            <strong>{m.label}</strong>
            <p style={{ color: 'var(--muted)', margin: 0 }}>{m.detail}</p>
          </article>
        ))}
      </div>

      {/* Carpool panel */}
      <div
        className="grid gap-[22px] rounded-lg p-5"
        style={{
          gridTemplateColumns: '1fr minmax(300px,0.86fr)',
          border: '1px solid var(--line)',
          background: 'rgba(15,23,42,.62)',
        }}
      >
        <div>
          <span
            className="inline-flex items-center justify-center min-h-[26px] px-2.5 rounded-full text-[11px] font-extrabold w-max"
            style={{ border: '1px solid rgba(16,185,129,.32)', background: 'rgba(16,185,129,.1)', color: '#a7f3d0' }}
          >Recommended match</span>
          <h3 style={{ maxWidth: 520, marginTop: 14, fontSize: 32, lineHeight: 1.1, fontWeight: 700 }}>
            3 nearby commuters found within 1.5 km
          </h3>
          <div className="flex mt-6" aria-label="Nearby commuters">
            {['RS','AK','NM'].map((init) => (
              <span
                key={init}
                className="inline-flex items-center justify-center w-[46px] h-[46px] rounded-full -mr-2.5 text-[12px] font-extrabold"
                style={{ border: '1px solid var(--line)', background: 'var(--panel-solid)', color: 'var(--text-soft)' }}
              >{init}</span>
            ))}
          </div>
        </div>

        {/* Savings grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {[
            { label: 'Estimated cost', value: 'Rs18' },
            { label: 'CO2 saved', value: '1.4 kg' },
            { label: 'Walk distance', value: '850 m', full: true },
          ].map((item) => (
            <div
              key={item.label}
              className="grid gap-2 p-4 rounded-md"
              style={{
                minHeight: 116,
                border: '1px solid var(--line)',
                background: 'rgba(255,255,255,.035)',
                gridColumn: item.full ? '1 / -1' : undefined,
              }}
            >
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{item.label}</span>
              <strong style={{ fontSize: 30, lineHeight: 1 }}>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
