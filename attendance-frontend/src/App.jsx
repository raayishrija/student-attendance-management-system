import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import PassedOut from './pages/PassedOut'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <BrowserRouter>
      {token && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
        <Route path="/students" element={token ? <Students token={token} /> : <Navigate to="/login" />} />
        <Route path="/attendance" element={token ? <Attendance token={token} /> : <Navigate to="/login" />} />
        <Route path="/passedout" element={token ? <PassedOut token={token} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App