import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Form } from 'react-bootstrap';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../hooks/useAuth';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

const TodoList = ({ showAllTodos = false }) => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTodos = async () => {
    if (!user) return;

    try {
      let query = supabase.from('todos').select('*');

      if (!showAllTodos) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (user?.id) {
    fetchTodos();
  } else if (!authLoading) {
    setLoading(false);
  }
}, [user?.id, showAllTodos, authLoading, fetchTodos]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  if (authLoading || loading) {
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
          <Col className="text-center">
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

  if (!user) {
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
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .custom-alert {
              animation: fadeIn 0.8s ease-out;
            }
          `}
        </style>
        <Row>
          <Col xs={12} sm={10} md={8} lg={6}>
            <Alert
              variant="warning"
              className="custom-alert"
              style={{
                backgroundColor: 'rgba(250, 204, 21, 0.9)',
                color: '#1f2937',
                border: 'none',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(4px)'
              }}
              role="alert"
            >
              Anda harus login untuk melihat todo list.
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container
      className="mt-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #111827)',
        padding: '2rem 1rem',
        animation: 'fadeIn 0.8s ease-out'
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          .custom-select:focus {
            box-shadow: 0 0 0 0.25rem rgba(96, 165, 250, 0.25) !important;
            border-color: #60a5fa !important;
          }

          .custom-alert {
            animation: fadeIn 0.8s ease-out;
          }

          .error-shake {
            animation: shake 0.5s;
          }

          @media (max-width: 576px) {
            .todo-list-title {
              font-size: 1.5rem;
            }
            .custom-select {
              width: 100% !important;
              font-size: 0.9rem;
              padding: 0.75rem;
            }
            .filter-container {
              margin-bottom: 1.5rem !important;
            }
          }
        `}
      </style>
      <Row>
        <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
          <h2
            className="todo-list-title"
            style={{
              color: '#60a5fa',
              textShadow: '0 0 12px rgba(96, 165, 250, 0.6)',
              fontWeight: '700',
              marginBottom: '2rem',
              fontSize: '2rem',
              textAlign: 'center'
            }}
          >
            {showAllTodos ? 'Semua Todo' : 'Todo Saya'}
          </h2>

          {error && (
            <Alert
              variant="danger"
              className="error-shake custom-alert"
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

          {!showAllTodos && <AddTodo onTodoAdded={fetchTodos} />}

          <div className="filter-container" style={{ marginBottom: '2rem' }}>
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="custom-select"
              style={{
                backgroundColor: '#1f2937',
                borderColor: '#4b5563',
                color: '#f3f4f6',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '1rem',
                width: '200px',
                transition: 'all 0.3s ease'
              }}
              aria-label="Filter Todo"
            >
              <option value="all">Semua Todo</option>
              <option value="pending">Belum Selesai</option>
              <option value="completed">Sudah Selesai</option>
            </Form.Select>
          </div>

          {filteredTodos.length === 0 ? (
            <Alert
              variant="info"
              className="custom-alert"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(4px)'
              }}
              role="alert"
            >
              {filter === 'all'
                ? 'Belum ada todo.'
                : filter === 'completed'
                ? 'Belum ada todo yang selesai.'
                : 'Belum ada todo yang belum selesai.'}
            </Alert>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onTodoUpdated={fetchTodos}
                isAdmin={isAdmin}
              />
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export { TodoList, TodoItem, AddTodo };