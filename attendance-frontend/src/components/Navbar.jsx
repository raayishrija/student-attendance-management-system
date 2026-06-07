import { Link, useLocation } from 'react-router-dom'

function Navbar({ onLogout }) {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🎓 Attendance System
      </div>
      <div className="navbar-links">
        <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">
          Dashboard
        </Link>
        <Link className={location.pathname === '/students' ? 'active' : ''} to="/students">
          Students
        </Link>
        <Link className={location.pathname === '/attendance' ? 'active' : ''} to="/attendance">
          Attendance
        </Link>
        <Link className={location.pathname === '/passedout' ? 'active' : ''} to="/passedout">
          Passed Out
        </Link>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar