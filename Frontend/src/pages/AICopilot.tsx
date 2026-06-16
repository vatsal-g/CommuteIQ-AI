import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import ReactMarkdown from "react-markdown";
interface Message {
  role: 'user' | 'ai'
  content: string
  time: string
  list?: string[]
}

const initialMessages: Message[] = [
  {
    role: 'user',
    content: 'Reach Cyber City by 9 AM under Rs100.',
    time: '08:20 AM',
  },
  {
    role: 'ai',
    content: 'I recommend Strategy C. ETA is 50 minutes, expected cost is Rs75, reliability is 93%, and stress is 2/10.',
    time: '08:21 AM',
    list: [
      'Low crowd after the current peak window',
      'Fewer transfer risks than the fastest route',
      'Last-mile carpool saves Rs22 and 1.4 kg CO2',
    ],
  },
]

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('What if I leave 20 minutes later?')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
  const text = input.trim()

  if (!text || loading) return

  const userMsg: Message = {
    role: 'user',
    content: text,
    time: now(),
  }

  setMessages(prev => [...prev, userMsg])
  setInput('')
  setLoading(true)

  try {
    const res = await fetch('https://commuteiq-ai-backend.onrender.com/api/copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text,
      }),
    })

    const data = await res.json()

    const reply =
      data.reply ||
      'Unable to generate response'

    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        content: reply,
        time: now(),
      },
    ])
  } catch {
    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        content: 'Connection error. Please check your backend server.',
        time: now(),
      },
    ])
  } finally {
    setLoading(false)
  }
}

      
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

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
        >08</span>
        <div>
          <h2 style={{ fontSize: 'clamp(34px,5vw,68px)', lineHeight: 1, fontWeight: 810 }}>AI Commute Copilot</h2>
          <p className="mt-3" style={{ maxWidth: 650, color: 'var(--text-soft)', fontSize: 17, lineHeight: 1.55 }}>
            Ask why a strategy was chosen, what changed, or how to optimize it.
          </p>
        </div>
      </div>

      {/* Chat shell */}
      <div
        className="grid gap-3.5 rounded-lg p-4 mx-auto"
        style={{
          maxWidth: 880,
          border: '1px solid var(--line)',
          background: 'rgba(15,23,42,.62)',
        }}
      >
        {/* Messages */}
        <div className="grid gap-3.5">
          {messages.map((m, i) => (
            <div
              key={i}
              className="grid gap-2 p-4 rounded-lg"
              style={{
                maxWidth: '72%',
                justifySelf: m.role === 'user' ? 'end' : 'start',
                border: '1px solid var(--line)',
                background: m.role === 'user' ? 'rgba(79,70,229,.16)' : 'rgba(255,255,255,.04)',
              }}
            >
              <strong style={{ fontSize: 14 }}>{m.role === 'user' ? 'You' : 'CommuteIQ'}</strong>
              <div
  style={{
    color: 'var(--text-soft)',
    lineHeight: 1.55,
    margin: 0,
  }}
>
  <ReactMarkdown>{m.content}</ReactMarkdown>
</div>
              {m.list && (
                <ul className="grid gap-[5px] mt-1 pl-[18px]">
                  {m.list.map((item, j) => (
                    <li key={j} style={{ color: 'var(--text-soft)', lineHeight: 1.55 }}>{item}</li>
                  ))}
                </ul>
              )}
              <time style={{ color: 'var(--muted)', fontSize: 12 }}>{m.time}</time>
            </div>
          ))}

          {loading && (
  <div
    className="grid gap-2 p-4 rounded-lg"
    style={{
      maxWidth: '72%',
      border: '1px solid var(--line)',
      background: 'rgba(255,255,255,.04)'
    }}
  >
    <strong style={{ fontSize: 14 }}>CommuteIQ</strong>

    <div
      className="flex gap-1.5 items-center"
      style={{ height: 20 }}
    >
      {[0,1,2].map(d => (
        <motion.span
          key={d}
          className="w-2 h-2 rounded-full block"
          style={{ background: 'var(--muted)' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: d * 0.2
          }}
        />
      ))}
    </div>
  </div>
)}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="grid gap-2.5 pt-3"
          style={{ gridTemplateColumns: '1fr auto', borderTop: '1px solid var(--line)' }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask the commute copilot…"
            aria-label="Ask the commute copilot"
            className="w-full h-12 px-3.5 rounded-md"
            style={{
              border: '1px solid var(--line)',
              background: 'rgba(255,255,255,.045)',
              color: 'var(--text)',
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 h-12 rounded-md text-sm font-bold transition-all disabled:opacity-40"
            style={{
              minWidth: 88,
              border: '1px solid rgba(79,70,229,.68)',
              background: 'var(--primary)',
              color: 'var(--text)',
              fontWeight: 780,
            }}
          >
            <Send size={14} />
{loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </motion.section>
  )
}
