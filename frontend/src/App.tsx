import './App.css'
import GettingStarted from './Components/GettingStarted'
import LoginPage from './Components/LoginPage'
import MainPage from './Components/MainPage'
import SignUpPage from './Components/SignUpPage'
import {Routes, Route, Navigate} from 'react-router-dom'
import Settings from './Components/Settings'

import { AuthProvider, useAuth } from './AuthContext'
import Calendar from './Components/Calendar'
import TotalEntries from './Components/TotalEntries'
import type { JSX } from 'react'

{/** Safegaurd to post login pages*/}
function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GettingStarted />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/me"
        element={
          <RequireAuth>
            <MainPage />
          </RequireAuth>
        }
      />
      <Route
        path="/Settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route
        path="/Calendar"
        element={
          <RequireAuth>
            <Calendar />
          </RequireAuth>
        }
      />
      <Route
        path="/TotalEntries"
        element={
          <RequireAuth>
            <TotalEntries />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
