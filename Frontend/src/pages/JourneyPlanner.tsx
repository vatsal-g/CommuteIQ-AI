import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LiveMap from './Livemap'

export default function JourneyPlanner() {
  const navigate = useNavigate()

  const [source, setSource] = useState('Rajiv Chowk')
  const [destination, setDestination] = useState('Cyber City Gurugram')

  return (
    <motion.section
      className="page-enter page-content"
      style={{
        minHeight: 'calc(100vh - 76px)',
        padding: 'clamp(34px,5vw,58px) clamp(18px,5vw,64px) 118px'
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
    >
      <div
        className="flex items-start gap-4 mb-7"
        style={{ maxWidth: 980 }}
      >
        <span
          className="inline-flex items-center justify-center w-[42px] h-[42px] flex-shrink-0 rounded-md text-[13px] font-bold"
          style={{
            border: '1px solid var(--line)',
            background: 'rgba(255,255,255,.04)',
            color: 'var(--text-soft)'
          }}
        >
          02
        </span>

        <div>
          <h2
            style={{
              fontSize: 'clamp(34px,5vw,68px)',
              lineHeight: 1,
              fontWeight: 810
            }}
          >
            Plan Journey
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
            Set the commute constraints. CommuteIQ turns the search into strategies.
          </p>
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'minmax(300px,400px) minmax(0,1fr)',
          minHeight: 610
        }}
      >
        {/* LEFT PANEL */}
        <div
          className="grid gap-4 p-[18px] rounded-lg"
          style={{
            alignContent: 'start',
            border: '1px solid var(--line)',
            background: 'rgba(15,23,42,.62)'
          }}
        >
          {/* FROM */}
          <label
            className="grid gap-2"
            style={{
              color: 'var(--text-soft)',
              fontSize: 13,
              fontWeight: 700
            }}
          >
            From

            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-12 px-3.5 rounded-md"
              style={{
                border: '1px solid var(--line)',
                background: 'rgba(255,255,255,.045)',
                color: 'var(--text)'
              }}
            />
          </label>

          {/* TO */}
          <label
            className="grid gap-2"
            style={{
              color: 'var(--text-soft)',
              fontSize: 13,
              fontWeight: 700
            }}
          >
            To

            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full h-12 px-3.5 rounded-md"
              style={{
                border: '1px solid var(--line)',
                background: 'rgba(255,255,255,.045)',
                color: 'var(--text)'
              }}
            />
          </label>

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <label
              className="grid gap-2"
              style={{
                color: 'var(--text-soft)',
                fontSize: 13,
                fontWeight: 700
              }}
            >
              Budget

              <select
                className="w-full h-12 px-3.5 rounded-md"
                style={{
                  border: '1px solid var(--line)',
                  background: 'rgba(255,255,255,.045)',
                  color: 'var(--text)'
                }}
              >
                <option>Under Rs100</option>
                <option>Under Rs50</option>
                <option>No limit</option>
              </select>
            </label>

            <label
              className="grid gap-2"
              style={{
                color: 'var(--text-soft)',
                fontSize: 13,
                fontWeight: 700
              }}
            >
              Arrive by

              <input
                type="time"
                defaultValue="09:00"
                className="w-full h-12 px-3.5 rounded-md"
                style={{
                  border: '1px solid var(--line)',
                  background: 'rgba(255,255,255,.045)',
                  color: 'var(--text)'
                }}
              />
            </label>
          </div>

          <label
            className="grid gap-2"
            style={{
              color: 'var(--text-soft)',
              fontSize: 13,
              fontWeight: 700
            }}
          >
            Preference

            <select
              className="w-full h-12 px-3.5 rounded-md"
              style={{
                border: '1px solid var(--line)',
                background: 'rgba(255,255,255,.045)',
                color: 'var(--text)'
              }}
            >
              <option>Balanced intelligence</option>
              <option>Lowest stress</option>
              <option>Lowest carbon</option>
              <option>Fastest possible</option>
            </select>
          </label>

          <button
            onClick={() => navigate('/strategies')}
            className="w-full h-12 rounded-md text-sm font-bold mt-1 transition-transform hover:-translate-y-px"
            style={{
              border: '1px solid rgba(79,70,229,.68)',
              background: 'var(--primary)',
              color: 'var(--text)',
              boxShadow: '0 18px 42px rgba(79,70,229,.32)'
            }}
          >
            Find Best Strategies
          </button>
        </div>

        {/* MAP */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            minHeight: 610,
            border: '1px solid var(--line)',
            background: 'rgba(15,23,42,.62)'
          }}
        >
       <LiveMap />
        </div>
      </div>
    </motion.section>
  )
}