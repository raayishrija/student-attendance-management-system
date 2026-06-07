import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard({ token }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    year1: 0,
    year2: 0,
    year3: 0,
    year4: 0,
    passedOut: 0
  })
  const [deptStats, setDeptStats] = useState([])

  const navigate = useNavigate()
  const headers = { Authorization: `Bearer ${token}` }
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    axios.get('http://localhost:8081/api/students', { headers })
      .then(res => {
        const students = res.data
        setStats(prev => ({
          ...prev,
          totalStudents: students.length,
          year1: students.filter(s => s.year === 1).length,
          year2: students.filter(s => s.year === 2).length,
          year3: students.filter(s => s.year === 3).length,
          year4: students.filter(s => s.year === 4).length,
        }))
        const deptMap = {}
        students.forEach(s => {
          if (!deptMap[s.department]) deptMap[s.department] = 0
          deptMap[s.department]++
        })
        const deptArray = Object.entries(deptMap).map(([name, count]) => ({ name, count }))
        setDeptStats(deptArray)
      })

    axios.get('http://localhost:8081/api/students/passedout', { headers })
      .then(res => {
        setStats(prev => ({ ...prev, passedOut: res.data.length }))
      })

    axios.get(`http://localhost:8081/api/attendance/date/${today}`, { headers })
      .then(res => {
        const attendance = res.data
        setStats(prev => ({
          ...prev,
          presentToday: attendance.filter(a => a.status === 'PRESENT').length,
          absentToday: attendance.filter(a => a.status === 'ABSENT').length,
          lateToday: attendance.filter(a => a.status === 'LATE').length
        }))
      })
  }, [])

  const deptColors = ['#1a73e8','#34a853','#ea4335','#fbbc04','#7c4dff','#00acc1','#e65100','#2e7d32']

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      <p>Welcome back, Teacher! Today is {new Date().toDateString()}</p>

      <h2 className="section-title">📅 Today's Attendance</h2>
      <div className="stats-grid">
        <div className="stat-card blue">
          <h3>Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>
        <div className="stat-card green">
          <h3>Present Today</h3>
          <p>{stats.presentToday}</p>
        </div>
        <div className="stat-card red">
          <h3>Absent Today</h3>
          <p>{stats.absentToday}</p>
        </div>
        <div className="stat-card orange">
          <h3>Late Today</h3>
          <p>{stats.lateToday}</p>
        </div>
      </div>

      <h2 className="section-title">📚 Students by Year</h2>
      <div className="stats-grid">
        <div className="stat-card year-card y1" onClick={() => navigate('/attendance?year=1')}>
          <h3>1st Year</h3>
          <p>{stats.year1}</p>
          <span>Click to mark attendance</span>
        </div>
        <div className="stat-card year-card y2" onClick={() => navigate('/attendance?year=2')}>
          <h3>2nd Year</h3>
          <p>{stats.year2}</p>
          <span>Click to mark attendance</span>
        </div>
        <div className="stat-card year-card y3" onClick={() => navigate('/attendance?year=3')}>
          <h3>3rd Year</h3>
          <p>{stats.year3}</p>
          <span>Click to mark attendance</span>
        </div>
        <div className="stat-card year-card y4" onClick={() => navigate('/attendance?year=4')}>
          <h3>4th Year</h3>
          <p>{stats.year4}</p>
          <span>Click to mark attendance</span>
        </div>
      </div>

      <h2 className="section-title">🏫 Students by Department</h2>
      <div className="dept-grid">
        {deptStats.map((dept, index) => (
          <div
            key={dept.name}
            className="dept-card"
            style={{ background: deptColors[index % deptColors.length] }}
            onClick={() => navigate(`/attendance?dept=${encodeURIComponent(dept.name)}`)}
          >
            <h3>{dept.name}</h3>
            <p>{dept.count}</p>
            <span>Click to mark attendance</span>
          </div>
        ))}
      </div>

      <h2 className="section-title">🎓 Passed Out</h2>
      <div className="stats-grid">
        <div className="stat-card purple" onClick={() => navigate('/passedout')}>
          <h3>Passed Out Students</h3>
          <p>{stats.passedOut}</p>
          <span>Click to view</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard