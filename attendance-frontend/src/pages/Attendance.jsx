import { useState, useEffect } from 'react'
import axios from 'axios'

function Attendance({ token }) {
  const params = new URLSearchParams(window.location.search)
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [saved, setSaved] = useState(false)
  const [percentages, setPercentages] = useState({})
  const [filterYear, setFilterYear] = useState(params.get('year') || 'all')
  const [filterDept, setFilterDept] = useState(params.get('dept') || 'all')
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:8081/api/students', { headers })
      .then(res => {
        setStudents(res.data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:8081/api/attendance/date/${date}`, { headers })
      .then(res => {
        const map = {}
        res.data.forEach(a => { map[a.student.id] = a.status })
        setAttendance(map)
      })
  }, [date])

  const markAttendance = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const saveAttendance = async () => {
    for (const studentId of Object.keys(attendance)) {
      await axios.post('http://localhost:8081/api/attendance/mark', {
        studentId: studentId.toString(),
        status: attendance[studentId],
        date: date
      }, { headers })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const loadPercentage = async (studentId) => {
    if (percentages[studentId]) return
    const res = await axios.get(`http://localhost:8081/api/attendance/percentage/${studentId}`, { headers })
    setPercentages(prev => ({ ...prev, [studentId]: res.data.toFixed(1) }))
  }

  const departments = [...new Set(students.map(s => s.department))]

  const filteredStudents = students.filter(s => {
    const yearMatch = filterYear === 'all' || s.year === parseInt(filterYear)
    const deptMatch = filterDept === 'all' || s.department === filterDept
    return yearMatch && deptMatch
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1>✅ Mark Attendance</h1>
        <div className="date-picker">
          <label>Date: </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>

      {saved && <div className="success">✅ Attendance saved successfully!</div>}

      <div className="filters">
        <div className="filter-group">
          <label>Filter by Year:</label>
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)}>
            <option value="all">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Department:</label>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <p className="total">Showing {filteredStudents.length} of {students.length} students</p>
      </div>

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Attendance %</th>
                <th>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id} onMouseEnter={() => loadPercentage(s.id)}>
                  <td>{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td>{s.department}</td>
                  <td>Year {s.year}</td>
                  <td>
                    <span className={`percentage ${
                      percentages[s.id] >= 75 ? 'green' :
                      percentages[s.id] >= 50 ? 'orange' : 'red'
                    }`}>
                      {percentages[s.id] ? `${percentages[s.id]}%` : '-'}
                    </span>
                  </td>
                  <td>
                    <div className="attendance-buttons">
                      <button
                        className={`btn-present ${attendance[s.id] === 'PRESENT' ? 'active' : ''}`}
                        onClick={() => markAttendance(s.id, 'PRESENT')}>
                        Present
                      </button>
                      <button
                        className={`btn-absent ${attendance[s.id] === 'ABSENT' ? 'active' : ''}`}
                        onClick={() => markAttendance(s.id, 'ABSENT')}>
                        Absent
                      </button>
                      <button
                        className={`btn-late ${attendance[s.id] === 'LATE' ? 'active' : ''}`}
                        onClick={() => markAttendance(s.id, 'LATE')}>
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && <p className="no-data">No students found!</p>}
        </div>
      )}

      {filteredStudents.length > 0 && (
        <button className="btn-save" onClick={saveAttendance}>
          💾 Save Attendance
        </button>
      )}
    </div>
  )
}

export default Attendance