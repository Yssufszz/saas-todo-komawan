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
      // Coba beberapa pendekatan untuk mengambil user data
      let usersData = []
      
      // Method 1: Coba dari profiles dulu
      const profilesRes = await supabase.from('profiles').select('*')
      
      if (!profilesRes.error && profilesRes.data && profilesRes.data.length > 0) {
        usersData = profilesRes.data
        console.log('Users from profiles:', usersData)
      } else {
        // Method 2: Coba dari auth.users (jika ada akses)
        try {
          const authUsersRes = await supabase.auth.admin.listUsers()
          if (authUsersRes.data && authUsersRes.data.users) {
            usersData = authUsersRes.data.users.map(user => ({
              id: user.id,
              email: user.email,
              role: user.user_metadata?.role || 'user',
              created_at: user.created_at
            }))
            console.log('Users from auth:', usersData)
          }
        } catch (authError) {
          console.log('Cannot access auth.users:', authError.message)
          
          // Method 3: Coba query RPC atau view khusus
          try {
            const rpcRes = await supabase.rpc('get_all_users')
            if (!rpcRes.error && rpcRes.data) {
              usersData = rpcRes.data
              console.log('Users from RPC:', usersData)
            }
          } catch (rpcError) {
            console.log('RPC get_all_users not available:', rpcError.message)
          }
        }
      }

      // Ambil todos
      const todosRes = await supabase.from('todos').select('*')
      if (todosRes.error) throw todosRes.error

      const todos = todosRes.data || []
      setUsers(usersData)
      
      setStats({
        totalUsers: usersData.length,
        totalTodos: todos.length,
        completedTodos: todos.filter(t => t.completed).length,
        pendingTodos: todos.filter(t => !t.completed).length
      })

      console.log('Final stats:', {
        totalUsers: usersData.length,
        totalTodos: todos.length,
        completedTodos: todos.filter(t => t.completed).length,
        pendingTodos: todos.filter(t => !t.completed).length
      })

    } catch (error) {
      console.error('Error fetching stats:', error)
      setError(error.message)
    }
  }

  const fetchLoginLogs = async () => {
    try {
      console.log('Fetching login logs...')
      
      // Method 1: Direct query dengan join
      const { data: logsData, error: logsError } = await supabase
        .from('login_logs')
        .select(`
          *,
          profiles!login_logs_user_id_fkey (
            id,
            email,
            role
          )
        `)
        .order('login_time', { ascending: false })
        .limit(50)

      if (!logsError && logsData) {
        console.log('Login logs with profiles:', logsData)
        setLoginLogs(logsData)
        return
      }

      console.log('Direct join failed, trying manual approach...')
      
      // Method 2: Manual join jika foreign key tidak bekerja
      const logsResult = await supabase
        .from('login_logs')
        .select('*')
        .order('login_time', { ascending: false })
        .limit(50)
      
      if (logsResult.error) throw logsResult.error
      
      console.log('Raw login logs:', logsResult.data)
      
      // Get unique user IDs
      const userIds = [...new Set(logsResult.data?.map(log => log.user_id).filter(Boolean))]
      console.log('User IDs from logs:', userIds)
      
      if (userIds.length > 0) {
        // Coba ambil dari profiles
        let profilesData = []
        
        const profilesResult = await supabase
          .from('profiles')
          .select('id, email, role')
          .in('id', userIds)
        
        if (!profilesResult.error && profilesResult.data) {
          profilesData = profilesResult.data
          console.log('Profiles data:', profilesData)
        } else {
          console.log('Profiles query failed, trying auth approach...')
          
          // Jika profiles tidak ada, coba ambil dari auth (jika memungkinkan)
          try {
            const authRes = await supabase.auth.admin.listUsers()
            if (authRes.data && authRes.data.users) {
              profilesData = authRes.data.users
                .filter(user => userIds.includes(user.id))
                .map(user => ({
                  id: user.id,
                  email: user.email,
                  role: user.user_metadata?.role || 'user'
                }))
              console.log('Auth users data:', profilesData)
            }
          } catch (authError) {
            console.log('Auth query failed:', authError.message)
          }
        }
        
        // Manual join
        const profilesMap = new Map(profilesData.map(p => [p.id, p]))
        
        const enrichedLogs = logsResult.data?.map(log => ({
          ...log,
          profiles: profilesMap.get(log.user_id) || {
            email: 'Unknown User',
            role: 'unknown'
          }
        })) || []
        
        console.log('Enriched logs:', enrichedLogs)
        setLoginLogs(enrichedLogs)
      } else {
        setLoginLogs(logsResult.data || [])
      }
      
    } catch (error) {
      console.error('Failed to fetch login logs:', error)
      setError(`Failed to fetch login logs: ${error.message}`)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchStats(), fetchLoginLogs()])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setError(`Failed to load dashboard: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Helper function to log user login
  const logUserLogin = async (userId, ipAddress = null, userAgent = null) => {
    try {
      const { error } = await supabase
        .from('login_logs')
        .insert([
          {
            user_id: userId,
            login_time: new Date().toISOString(),
            ip_address: ipAddress,
            user_agent: userAgent
          }
        ])
      
      if (error) {
        console.error('Failed to log user login:', error)
      } else {
        console.log('User login logged successfully for user:', userId)
      }
    } catch (error) {
      console.error('Login logging error:', error)
    }
  }

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
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
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
                Users ({users.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'logs'}
                onClick={() => setActiveTab('logs')}
              >
                Login Logs ({loginLogs.length})
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
                      <th>ID</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Tanggal Daftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user.id}>
                          <td><small className="text-muted">{user.id}</small></td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td>{user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</td>
                        </tr>
                      ))
                    )}
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
                      <th>User ID</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Waktu Login</th>
                      <th>User Agent</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginLogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No login logs found
                        </td>
                      </tr>
                    ) : (
                      loginLogs.map(log => (
                        <tr key={log.id}>
                          <td><small className="text-muted">{log.user_id}</small></td>
                          <td>{log.profiles?.email || 'N/A'}</td>
                          <td>
                            <span className={`badge ${log.profiles?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                              {log.profiles?.role || 'unknown'}
                            </span>
                          </td>
                          <td>{new Date(log.login_time).toLocaleString()}</td>
                          <td>
                            <small className="text-muted">
                              {log.user_agent ? log.user_agent.substring(0, 50) + '...' : 'N/A'}
                            </small>
                          </td>
                          <td>{log.ip_address || 'N/A'}</td>
                        </tr>
                      ))
                    )}
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

export { AdminDashboard }