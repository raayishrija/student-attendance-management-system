import { useState, useEffect } from 'react'
import axios from 'axios'

function Students({ token }) {
  const params = new URLSearchParams(window.location.search)
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filterYear, setFilterYear] = useState(params.get('year') || 'all')
  const [filterDept, setFilterDept] = useState(params.get('dept') || 'all')
  const [form, setForm] = useState({
    rollNo: '', name: '', fatherName: '', motherName: '',
    dob: '', department: '', year: 1, passedOut: false
  })

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = () => {
    axios.get('http://localhost:8081/api/students', { headers })
      .then(res => setStudents(res.data))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:8081/api/students', form, { headers })
    setShowForm(false)
    setForm({ rollNo: '', name: '', fatherName: '', motherName: '', dob: '', department: '', year: 1, passedOut: false })
    fetchStudents()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this student?')) {
      await axios.delete(`http://localhost:8081/api/students/${id}`, { headers })
      fetchStudents()
    }
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
        <h1>👨‍🎓 Students</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add New Student</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Roll No</label>
                <input value={form.rollNo} onChange={e => setForm({...form, rollNo: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Father Name</label>
                <input value={form.fatherName} onChange={e => setForm({...form, fatherName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Mother Name</label>
                <input value={form.motherName} onChange={e => setForm({...form, motherName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Year</label>
                <select value={form.year} onChange={e => setForm({...form, year: parseInt(e.target.value)})}>
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary">Add Student</button>
          </form>
        </div>
      )}

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
              <th>Year</th>
              <th>Actions</th>
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
                <td>Year {s.year}</td>
                <td>
                  <button className="btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && <p className="no-data">No students found!</p>}
      </div>
    </div>
  )
}

export default Students