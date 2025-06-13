import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner, Nav } from 'react-bootstrap';
import { supabase } from '../../utils/supabase';
import { TodoList } from '../Todo/TodoList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0
  });
  const [users, setUsers] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Utility function to wrap promises with a timeout
  const withTimeout = (promise, ms = 10000) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    );
    return Promise.race([promise, timeout]);
  };

  const fetchStats = useCallback(async () => {
    try {
      let usersData = [];
      const profilesRes = await withTimeout(supabase.from('profiles').select('*'));
      
      if (!profilesRes.error && profilesRes.data && profilesRes.data.length > 0) {
        usersData = profilesRes.data;
      } else {
        try {
          const authUsersRes = await withTimeout(supabase.auth.admin.listUsers());
          if (authUsersRes.data && authUsersRes.data.users) {
            usersData = authUsersRes.data.users.map(user => ({
              id: user.id,
              email: user.email,
              role: user.user_metadata?.role || 'user',
              created_at: user.created_at
            }));
          }
        } catch (authError) {
          console.error('Error fetching auth users:', authError.message);
          try {
            const rpcRes = await withTimeout(supabase.rpc('get_all_users'));
            if (!rpcRes.error && rpcRes.data) {
              usersData = rpcRes.data;
            }
          } catch (rpcError) {
            console.error('Error fetching users via RPC:', rpcError.message);
          }
        }
      }

      const todosRes = await withTimeout(supabase.from('todos').select('*'));
      if (todosRes.error) throw todosRes.error;

      const todos = todosRes.data || [];
      setUsers(usersData);
      
      setStats({
        totalUsers: usersData.length,
        totalTodos: todos.length,
        completedTodos: todos.filter(t => t.completed).length,
        pendingTodos: todos.filter(t => !t.completed).length
      });
    } catch (error) {
      console.error('Error in fetchStats:', error.message);
      setError(`Failed to fetch stats: ${error.message}`);
    }
  }, []); // Empty dependency array since fetchStats doesn't depend on props/state

  const fetchLoginLogs = useCallback(async () => {
    try {
      const { data: logsData, error: logsError } = await withTimeout(
        supabase
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
      );

      if (!logsError && logsData) {
        setLoginLogs(logsData);
        return;
      }
      
      const logsResult = await withTimeout(
        supabase
          .from('login_logs')
          .select('*')
          .order('login_time', { ascending: false })
          .limit(50)
      );
      
      if (logsResult.error) throw logsResult.error;
      
      const userIds = [...new Set(logsResult.data?.map(log => log.user_id).filter(Boolean))];
      
      if (userIds.length > 0) {
        let profilesData = [];
        const profilesResult = await withTimeout(
          supabase
            .from('profiles')
            .select('id, email, role')
            .in('id', userIds)
        );
        
        if (!profilesResult.error && profilesResult.data) {
          profilesData = profilesResult.data;
        } else {
          try {
            const authRes = await withTimeout(supabase.auth.admin.listUsers());
            if (authRes.data && authRes.data.users) {
              profilesData = authRes.data.users
                .filter(user => userIds.includes(user.id))
                .map(user => ({
                  id: user.id,
                  email: user.email,
                  role: user.user_metadata?.role || 'user'
                }));
            }
          } catch (authError) {
            console.error('Error fetching profiles via auth:', authError.message);
          }
        }
        
        const profilesMap = new Map(profilesData.map(p => [p.id, p]));
        const enrichedLogs = logsResult.data?.map(log => ({
          ...log,
          profiles: profilesMap.get(log.user_id) || {
            email: 'Unknown User',
            role: 'unknown'
          }
        })) || [];
        
        setLoginLogs(enrichedLogs);
      } else {
        setLoginLogs(logsResult.data || []);
      }
    } catch (error) {
      console.error('Error in fetchLoginLogs:', error.message);
      setError(`Failed to fetch login logs: ${error.message}`);
    }
  }, []); // Empty dependency array since fetchLoginLogs doesn't depend on props/state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching dashboard data...');
        await Promise.all([fetchStats(), fetchLoginLogs()]);
        console.log('Dashboard data fetched successfully');
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        setError(`Failed to load dashboard: ${error.message}`);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [fetchStats, fetchLoginLogs]); // Add dependencies here

  if (loading) {
    return (
      <Container
        className="mt-5"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a, #111827)',
          padding: '1rem'
        }}
      >
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            .custom-spinner {
              animation: pulse 1.5s infinite;
            }
          `}
        </style>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={6} className="text-center">
            <Spinner
              animation="border"
              role="status"
              className="custom-spinner"
              style={{ color: '#60a5fa', width: '3rem', height: '3rem' }}
            >
              <span className="visually-hidden">Memuat...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="mt-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #111827)',
        padding: '2rem',
        animation: 'fadeInUp 0.8s ease-out',
        overflowX: 'hidden'
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes glow {
            0% { text-shadow: 0 0 5px rgba(96, 165, 250, 0.5); }
            50% { text-shadow: 0 0 15px rgba(96, 165, 250, 0.8); }
            100% { text-shadow: 0 0 5px rgba(96, 165, 250, 0.5); }
          }

          .custom-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            background: rgba(31, 41, 55, 0.95);
            border: 1px solid rgba(96, 165, 250, 0.3);
            border-radius: 16px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(8px);
            overflow: hidden;
          }

          .custom-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4) !important;
          }

          .custom-nav-tabs .nav-link {
            color: #f3f4f6;
            background: transparent;
            border: none;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            border-radius: 8px;
          }

          .custom-nav-tabs .nav-link:hover {
            color: #60a5fa;
            background: rgba(96, 165, 250, 0.1);
            transform: translateY(-2px);
          }

          .custom-nav-tabs .nav-link.active {
            color: #60a5fa;
            background: rgba(96, 165, 250, 0.2);
            border-bottom: 3px solid #60a5fa;
            transform: translateY(0);
          }

          .custom-table th {
            background: rgba(75, 85, 99, 0.5);
            color: #1f2937;
            border: none;
            padding: 1rem;
          }

          .custom-table td {
            color: #1f2937;
            border-color: rgba(75, 85, 99, 0.3);
            padding: 1rem;
          }

          .custom-table tbody tr:hover {
            background: rgba(96, 165, 250, 0.1);
            transform: scale(1.01);
            transition: all 0.2s ease;
          }

          .dashboard-title {
            animation: glow 2s infinite ease-in-out;
          }

          .stat-card {
            animation-delay: calc(var(--order) * 0.2s);
          }

          @media (min-width: 577px) {
            .custom-table {
              overflow-x: hidden;
            }
          }

          @media (max-width: 576px) {
            .container-fluid {
              padding: 1rem !important;
            }
            .dashboard-title {
              font-size: 1.5rem !important;
            }
            .custom-nav-tabs {
              flex-wrap: nowrap;
              overflow-x: auto;
              white-space: nowrap;
              -webkit-overflow-scrolling: touch;
              padding-bottom: 0.5rem;
            }
            .custom-nav-tabs .nav-link {
              padding: 0.5rem 1rem;
              font-size: 0.9rem;
            }
            .stat-card {
              margin-bottom: 1rem !important;
            }
            .stat-value {
              font-size: 1.75rem !important;
            }
            .stat-label {
              font-size: 0.9rem !important;
            }
            .table-header {
              font-size: 1rem !important;
            }
            .custom-table {
              font-size: 0.85rem;
            }
            .custom-table td, .custom-table th {
              padding: 0.5rem !important;
            }
            .custom-table-responsive {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
          }
        `}
      </style>
      <Row>
        <Col xs={12} xl={10} className="mx-auto">
          <h2
            className="dashboard-title"
            style={{
              color: '#60a5fa',
              fontWeight: '700',
              marginBottom: '2rem',
              fontSize: '2rem',
              textAlign: 'center'
            }}
          >
            Admin Dashboard
          </h2>

          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError('')}
              className="custom-alert error-shake"
              style={{
                backgroundColor: 'rgba(248, 113, 113, 0.9)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(4px)'
              }}
              role="alert"
            >
              {error}
            </Alert>
          )}

          <Nav variant="tabs" className="mb-4 custom-nav-tabs">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                aria-current={activeTab === 'overview' ? 'page' : undefined}
              >
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
                aria-current={activeTab === 'users' ? 'page' : undefined}
              >
                Users ({users.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'logs'}
                onClick={() => setActiveTab('logs')}
                aria-current={activeTab === 'logs' ? 'page' : undefined}
              >
                Login Logs ({loginLogs.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'todos'}
                onClick={() => setActiveTab('todos')}
                aria-current={activeTab === 'todos' ? 'page' : undefined}
              >
                All Todos
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'overview' && (
            <Row>
              {[
                { value: stats.totalUsers, label: 'Total Users', gradient: '#2563eb, #60a5fa', order: 1 },
                { value: stats.totalTodos, label: 'Total Todos', gradient: '#06b6d4, #22d3ee', order: 2 },
                { value: stats.completedTodos, label: 'Completed', gradient: '#16a34a, #22c55e', order: 3 },
                { value: stats.pendingTodos, label: 'Pending', gradient: '#d97706, #facc15', order: 4 }
              ].map(stat => (
                <Col xs={12} sm={6} md={3} className="stat-card" key={stat.label} style={{ animation: 'fadeInUp 0.8s ease-out', animationDelay: `calc(${stat.order} * 0.2s)` }}>
                  <Card
                    className="custom-card"
                    style={{ background: `linear-gradient(135deg, ${stat.gradient})` }}
                  >
                    <Card.Body className="text-center">
                      <h3
                        className="stat-value"
                        style={{
                          color: '#fff',
                          fontSize: '2rem',
                          fontWeight: '700',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {stat.value}
                      </h3>
                      <p
                        className="stat-label"
                        style={{ color: '#f3f4f6', fontSize: '1rem', margin: 0 }}
                      >
                        {stat.label}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {activeTab === 'users' && (
            <Card className="custom-card">
              <Card.Header
                className="table-header"
                style={{
                  background: 'rgba(75, 85, 99, 0.5)',
                  color: '#1f2937',
                  border: 'none',
                  padding: '1rem',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}
              >
                Daftar Users
              </Card.Header>
              <Card.Body style={{ padding: '0' }}>
                <div className="custom-table-responsive">
                  <Table responsive className="custom-table">
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
                          <td colSpan="4" className="text-center" style={{ color: '#1f2937' }}>
                            Tidak ada pengguna ditemukan
                          </td>
                        </tr>
                      ) : (
                        users.map(user => (
                          <tr key={user.id}>
                            <td style={{ color: '#1f2937' }}>{user.id}</td>
                            <td>{user.email}</td>
                            <td>
                              <span
                                className={`badge ${
                                  user.role === 'admin' ? 'bg-danger' : 'bg-primary'
                                }`}
                                style={{
                                  padding: '0.5rem 1rem',
                                  fontSize: '0.85rem',
                                  borderRadius: '8px'
                                }}
                              >
                                {user.role || 'user'}
                              </span>
                            </td>
                            <td>
                              {user.created_at
                                ? new Date(user.created_at).toLocaleString()
                                : 'N/A'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'logs' && (
            <Card className="custom-card">
              <Card.Header
                className="table-header"
                style={{
                  background: 'rgba(75, 85, 99, 0.5)',
                  color: '#1f2937',
                  border: 'none',
                  padding: '1rem',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}
              >
                Login Logs (50 Terakhir)
              </Card.Header>
              <Card.Body style={{ padding: '0' }}>
                <div className="custom-table-responsive">
                  <Table responsive className="custom-table">
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
                          <td colSpan="6" className="text-center" style={{ color: '#1f2937' }}>
                            Tidak ada log login ditemukan
                          </td>
                        </tr>
                      ) : (
                        loginLogs.map(log => (
                          <tr key={log.id}>
                            <td style={{ color: '#1f2937' }}>{log.user_id}</td>
                            <td>{log.profiles?.email || 'N/A'}</td>
                            <td>
                              <span
                                className={`badge ${
                                  log.profiles?.role === 'admin'
                                    ? 'bg-danger'
                                    : 'bg-primary'
                                }`}
                                style={{
                                  padding: '0.5rem 1rem',
                                  fontSize: '0.85rem',
                                  borderRadius: '8px'
                                }}
                              >
                                {log.profiles?.role || 'unknown'}
                              </span>
                            </td>
                            <td>{new Date(log.login_time).toLocaleString()}</td>
                            <td style={{ color: '#1f2937' }}>
                              {log.user_agent
                                ? log.user_agent.substring(0, 50) + '...'
                                : 'N/A'}
                            </td>
                            <td>{log.ip_address || 'N/A'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'todos' && <TodoList showAllTodos={true} />}
        </Col>
      </Row>
    </Container>
  );
};

export { AdminDashboard };