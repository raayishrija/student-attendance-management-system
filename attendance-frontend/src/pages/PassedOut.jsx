import { useState, useEffect } from 'react'
import axios from 'axios'

function PassedOut({ token }) {
  const [students, setStudents] = useState([])
  const [percentages, setPercentages] = useState({})
  const [filterDept, setFilterDept] = useState('all')

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get('http://localhost:8081/api/students/passedout', { headers })
      .then(res => {
        setStudents(res.data)
        res.data.forEach(s => {
          axios.get(`http://localhost:8081/api/attendance/percentage/${s.id}`, { headers })
            .then(r => setPercentages(prev => ({ ...prev, [s.id]: r.data.toFixed(1) })))
        })
      })
  }, [])

  const departments = [...new Set(students.map(s => s.department))]

  const filteredStudents = students.filter(s => {
    return filterDept === 'all' || s.department === filterDept
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎓 Passed Out Students</h1>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Filter by Department:</label>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <p className="total">Showing {filteredStudents.length} of {students.length} passed out students</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Father Name</th>
              <th>Mother Name</th>
              <th>DOB</th>
              <th>Department</th>
              <th>Status</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.id}>
                <td>{s.rollNo}</td>
                <td>{s.name}</td>
                <td>{s.fatherName}</td>
                <td>{s.motherName}</td>
                <td>{s.dob}</td>
                <td>{s.department}</td>
                <td><span className="badge-passedout">Passed Out</span></td>
                <td>
                  <span className={`percentage ${
                    percentages[s.id] >= 75 ? 'green' :
                    percentages[s.id] >= 50 ? 'orange' : 'red'
                  }`}>
                    {percentages[s.id] || 0}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && <p className="no-data">No passed out students found!</p>}
      </div>
    </div>
  )
}

export default PassedOut