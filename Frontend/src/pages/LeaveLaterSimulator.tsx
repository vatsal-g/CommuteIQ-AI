import { motion } from 'framer-motion'

const rows = [
  { option: 'Leave now', eta: '50 min', crowd: 'High', stress: '6/10', rec: 'Possible, less comfortable', highlight: false },
  { option: 'Leave +20 min', eta: '54 min', crowd: 'Low', stress: '2/10', rec: 'Best balance', highlight: true },
  { option: 'Leave +40 min', eta: '59 min', crowd: 'Very low', stress: '1/10', rec: 'Calmest, later arrival', highlight: false },
]

export default function LeaveLaterSimulator() {
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
        >06</span>
        <div>
          <h2 style={{ fontSize: 'clamp(34px,5vw,68px)', lineHeight: 1, fontWeight: 810 }}>Leave Later Simulator</h2>
          <p className="mt-3" style={{ maxWidth: 650, color: 'var(--text-soft)', fontSize: 17, lineHeight: 1.55 }}>
            Compare departure windows before committing to the route.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,.62)' }}
        role="table" aria-label="Leave later comparison">
        {/* Head */}
        <div className="grid items-center px-[18px]"
          style={{
            gridTemplateColumns: '1.1fr 0.7fr 0.8fr 0.7fr 1.3fr',
            gap: 12, minHeight: 54,
            background: 'rgba(255,255,255,.035)',
            color: 'var(--muted)', fontSize: 12, fontWeight: 780,
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }} role="row">
          {['Option','ETA','Crowd','Stress','Recommendation'].map(h => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {rows.map((r) => (
          <div
            key={r.option}
            className="grid items-center px-[18px]"
            style={{
              gridTemplateColumns: '1.1fr 0.7fr 0.8fr 0.7fr 1.3fr',
              gap: 12, minHeight: 76,
              borderTop: '1px solid var(--line)',
              color: 'var(--text-soft)',
              background: r.highlight ? 'rgba(16,185,129,.09)' : undefined,
            }}
            role="row"
          >
            <span style={{ color: r.highlight ? 'var(--text)' : undefined, fontWeight: r.highlight ? 700 : undefined }}>
              {r.option}
            </span>
            <span>{r.eta}</span>
            <span>{r.crowd}</span>
            <span>{r.stress}</span>
            <span>{r.rec}</span>
          </div>
        ))}
      </div>

      {/* AI Recommendation */}
      <div className="grid gap-3 mt-4 px-[18px] py-3.5 rounded-lg"
        style={{ border: '1px solid var(--line)', background: 'rgba(15,23,42,.62)', justifyContent: 'start', alignItems: 'start' }}>
        <span
          className="inline-flex items-center justify-center min-h-[26px] px-2.5 rounded-full text-[11px] font-extrabold w-max"
          style={{ border: '1px solid rgba(16,185,129,.32)', background: 'rgba(16,185,129,.1)', color: '#a7f3d0' }}
        >AI Recommendation</span>
        <p style={{ color: 'var(--text-soft)', lineHeight: 1.55 }}>
          Leave after 20 minutes. You gain a calmer commute without missing the arrival target.
        </p>
      </div>
    </motion.section>
  )
}
