// src/components/Dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Alert, Spinner, Nav } from 'react-bootstrap'
import { supabase } from '../../utils/supabase'
import { TodoList } from '../Todo/TodoList'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0
  })
  const [users, setUsers] = useState([])
  const [loginLogs, setLoginLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = async () => {
    try {
      const [usersRes, todosRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('todos').select('*')
      ])

      if (usersRes.error) throw usersRes.error
      if (todosRes.error) throw todosRes.error

      const todos = todosRes.data || []
      setUsers(usersRes.data || [])
      
      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalTodos: todos.length,
        completedTodos: todos.filter(t => t.completed).length,
        pendingTodos: todos.filter(t => !t.completed).length
      })
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchLoginLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('login_logs')
        .select(`
          *,
          profiles (email)
        `)
        .order('login_time', { ascending: false })
        .limit(50)

      if (error) throw error
      setLoginLogs(data || [])
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchStats(), fetchLoginLogs()])
      setLoading(false)
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Admin Dashboard</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
              >
                Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'logs'}
                onClick={() => setActiveTab('logs')}
              >
                Login Logs
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'todos'}
                onClick={() => setActiveTab('todos')}
              >
                All Todos
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'overview' && (
            <Row>
              <Col md={3}>
                <Card className="bg-primary text-white mb-3">
                  <Card.Body className="text-center">
                    <h3>{stats.totalUsers}</h3>
                    <p className="mb-0">Total Users</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-info text-white mb-3">
                  <Card.Body className="text-center">
                    <h3>{stats.totalTodos}</h3>
                    <p className="mb-0">Total Todos</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-success text-white mb-3">
                  <Card.Body className="text-center">
                    <h3>{stats.completedTodos}</h3>
                    <p className="mb-0">Completed</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-warning text-white mb-3">
                  <Card.Body className="text-center">
                    <h3>{stats.pendingTodos}</h3>
                    <p className="mb-0">Pending</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === 'users' && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Daftar Users</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Tanggal Daftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'logs' && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Login Logs (50 Terakhir)</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Waktu Login</th>
                      <th>User Agent</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.profiles?.email || 'N/A'}</td>
                        <td>{new Date(log.login_time).toLocaleString()}</td>
                        <td>
                          <small className="text-muted">
                            {log.user_agent ? log.user_agent.substring(0, 50) + '...' : 'N/A'}
                          </small>
                        </td>
                        <td>{log.ip_address || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'todos' && (
            <TodoList showAllTodos={true} />
          )}
        </Col>
      </Row>
    </Container>
  )
}

export { UserDashboard, AdminDashboard }