// src/components/Todo/TodoList.js
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Alert, Spinner, Form } from 'react-bootstrap'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../hooks/useAuth'
import TodoItem from './TodoItem'
import AddTodo from './AddTodo'

const TodoList = ({ showAllTodos = false }) => {
  const { user, isAdmin } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchTodos = async () => {
    try {
      let query = supabase.from('todos').select('*')
      
      if (!showAllTodos) {
        query = query.eq('user_id', user.id)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [user.id, showAllTodos])

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    return true
  })

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
          <h2>{showAllTodos ? 'Semua Todo' : 'Todo Saya'}</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {!showAllTodos && <AddTodo onTodoAdded={fetchTodos} />}
          
          <div className="mb-3">
            <Form.Select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="all">Semua Todo</option>
              <option value="pending">Belum Selesai</option>
              <option value="completed">Sudah Selesai</option>
            </Form.Select>
          </div>
          
          {filteredTodos.length === 0 ? (
            <Alert variant="info">
              {filter === 'all' ? 'Belum ada todo.' : 
               filter === 'completed' ? 'Belum ada todo yang selesai.' : 
               'Belum ada todo yang belum selesai.'}
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
  )
}

export { TodoList, TodoItem, AddTodo }