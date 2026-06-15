import { useState, useCallback } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import AuthModal from './components/AuthModal'
import LandingPage from './pages/LandingPage'
import JourneyPlanner from './pages/JourneyPlanner'
import StrategyEngine from './pages/StrategyEngine'
import StrategyDetails from './pages/StrategyDetails'
import TravelInsights from './pages/TravelInsights'
import LeaveLaterSimulator from './pages/LeaveLaterSimulator'
import Carpool from './pages/Carpool'
import AICopilot from './pages/AICopilot'
import SavedRoutes from './pages/SavedRoutes'
import Preferences from './pages/Preferences'
import AccountSettings from './pages/AccountSettings'
import LiveMap from "./pages/Livemap";

interface ProtectedPageProps {
  children: React.ReactNode
  onAuthOpen: () => void
}

function ProtectedPage({ children, onAuthOpen }: ProtectedPageProps) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    setTimeout(() => { navigate('/'); onAuthOpen() }, 0)
    return null
  }
  return <>{children}</>
}

function AppInner() {
  const [authOpen, setAuthOpen] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const navigate = useNavigate()

  const openAuth = useCallback((path?: string) => {
    if (path) setPendingPath(path)
    setAuthOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setAuthOpen(false)
    setPendingPath(null)
  }, [])

  const handleAuthSuccess = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath)
      setPendingPath(null)
    }
  }, [pendingPath, navigate])

  return (
    <>
      <MainLayout onAuthOpen={() => openAuth()}>
        <Routes>
          <Route path="/" element={<LandingPage onAuthOpen={openAuth} />} />
          <Route
            path="/journey"
            element={
              <ProtectedPage onAuthOpen={() => openAuth('/journey')}>
                <JourneyPlanner />
              </ProtectedPage>
            }
          />
          <Route
            path="/strategies"
            element={
              <ProtectedPage onAuthOpen={() => openAuth('/strategies')}>
                <StrategyEngine />
              </ProtectedPage>
            }
          />
          <Route path="/strategy-details" element={<StrategyDetails />} />
          <Route
            path="/travel-insights"
            element={
              <ProtectedPage onAuthOpen={() => openAuth('/travel-insights')}>
                <TravelInsights />
              </ProtectedPage>
            }
          />
          <Route path="/leave-later" element={<LeaveLaterSimulator />} />
          <Route path="/carpool" element={<Carpool />} />
          <Route path="/copilot" element={<AICopilot />} />
          
<Route path="/saved-routes" element={<ProtectedPage onAuthOpen={openAuth}><SavedRoutes /></ProtectedPage>} />
<Route path="/preferences" element={<ProtectedPage onAuthOpen={openAuth}><Preferences /></ProtectedPage>} />
<Route path="/account-settings" element={<ProtectedPage onAuthOpen={openAuth}><AccountSettings /></ProtectedPage>} />
<Route path="/livemap" element={<LiveMap />} />
</Routes>
      </MainLayout>

      <AuthModal
        isOpen={authOpen}
        onClose={closeAuth}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
