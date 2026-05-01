import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import GuestBanner from './components/GuestBanner'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import ArticleHub from './pages/ArticleHub'
import HabitTracker from './pages/HabitTracker'
import Progress from './pages/Progress'
import MiniGames from './pages/MiniGames'
import ProjectLogin from './pages/ProjectLogin'
import { hasProjectAccess } from './utils/projectAuth'
import { getSnapshot, hasCompletedOnboarding } from './utils/recommendations'

const isGuestUser = () => localStorage.getItem('bb_is_guest') === 'true'
const guestHasOnboarded = () => {
  const snapshot = getSnapshot()
  return hasCompletedOnboarding(snapshot)
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const LS_HABITS = 'bb_guest_habits'
const LS_MIGRATED = 'bb_migrated_user' // tracks which user ID has already been migrated

function HandleAuthTransition() {
  const { isSignedIn, user } = useUser()
  const { getToken } = useAuth()

  useEffect(() => {
    if (!isSignedIn || !user) return

    const userId = user.id
    const alreadyMigrated = localStorage.getItem(LS_MIGRATED) === userId
    const guestHabits = JSON.parse(localStorage.getItem(LS_HABITS) || '[]')

    if (alreadyMigrated) {
      // This user was already migrated — just clear guest flag silently
      localStorage.removeItem('bb_is_guest')
      return
    }

    if (guestHabits.length > 0) {
      // Option B: guest has history → migrate it to their account then wipe
      ;(async () => {
        try {
          const token = await getToken()
          // Post each guest habit to the API
          for (const habit of guestHabits) {
            await fetch(`${API}/habits`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sleep_hours: habit.sleep_hours,
                screen_time: habit.screen_time,
                physical_activity: habit.physical_activity,
                date: habit.date
              })
            })
          }
          // Mark this user as migrated and wipe guest data
          localStorage.setItem(LS_MIGRATED, userId)
          localStorage.removeItem('bb_is_guest')
          localStorage.removeItem(LS_HABITS)
          localStorage.removeItem('bb_total_checkins')
          localStorage.removeItem('bb_guest_id')
        } catch (err) {
          console.error('Migration failed:', err)
          // Still clear guest flag even if migration fails
          localStorage.removeItem('bb_is_guest')
        }
      })()
    } else {
      // Option A: no guest history → just clear guest flag, show account history
      localStorage.removeItem('bb_is_guest')
      localStorage.removeItem('bb_total_checkins')
      localStorage.removeItem('bb_guest_id')
      // Guest habits stay untouched (empty anyway)
    }
  }, [isSignedIn, user?.id])

  return null
}

function RequireAuth({ children }) {
  if (isGuestUser()) return children
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  )
}

function RequireProjectAccess({ children }) {
  const location = useLocation()

  if (!hasProjectAccess()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

function RequireCompletedOnboarding({ children }) {
  const { isSignedIn } = useUser()
  const snapshot = getSnapshot()
  const isCompleted = hasCompletedOnboarding(snapshot)
  if (!isCompleted && !isSignedIn && !isGuestUser()) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

// Guests who've already completed onboarding get redirected to dashboard
function OnboardingRoute() {
  if (isGuestUser() && guestHasOnboarded()) {
    return <Navigate to="/dashboard" replace />
  }
  return <><Navbar /><GuestBanner /><Onboarding /></>
}

export default function App() {
  return (
    <BrowserRouter>
      <HandleAuthTransition />
      <Routes>
        <Route path="/login" element={<ProjectLogin />} />
        <Route path="/" element={<RequireProjectAccess><Home /></RequireProjectAccess>} />
        <Route path="/onboarding" element={<RequireProjectAccess><OnboardingRoute /></RequireProjectAccess>} />
        <Route path="/dashboard" element={<RequireProjectAccess><RequireAuth><Navbar /><GuestBanner /><RequireCompletedOnboarding><Dashboard /></RequireCompletedOnboarding></RequireAuth></RequireProjectAccess>} />
        <Route path="/habits"    element={<RequireProjectAccess><RequireAuth><Navbar /><GuestBanner /><HabitTracker /></RequireAuth></RequireProjectAccess>} />
        <Route path="/progress"  element={<RequireProjectAccess><RequireAuth><Navbar /><GuestBanner /><Progress /></RequireAuth></RequireProjectAccess>} />
        <Route path="/games"     element={<RequireProjectAccess><Navbar /><GuestBanner /><MiniGames /></RequireProjectAccess>} />
        <Route path="/articles"  element={<RequireProjectAccess><RequireAuth><Navbar /><GuestBanner /><RequireCompletedOnboarding><ArticleHub /></RequireCompletedOnboarding></RequireAuth></RequireProjectAccess>} />
      </Routes>
    </BrowserRouter>
  )
}
