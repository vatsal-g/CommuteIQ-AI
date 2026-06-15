import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'

interface LayoutProps {
  children: ReactNode
  onAuthOpen: () => void
}

export default function MainLayout({ children, onAuthOpen }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar onAuthOpen={onAuthOpen} />
      <main style={{ paddingTop: 76 }}>
        {children}
      </main>
    </div>
  )
}
