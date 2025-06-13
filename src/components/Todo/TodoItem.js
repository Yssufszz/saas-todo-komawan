// src/components/Todo/TodoItem.js
import React, { useState } from 'react'
import { Card, Button, Form, Badge } from 'react-bootstrap'
import { supabase } from '../../utils/supabase'
import { decrypt, encrypt } from '../../utils/encryption'

const TodoItem = ({ todo, onTodoUpdated, isAdmin = false }) => {
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: todo.title,
    description: decrypt(todo.description)
  })
  const [loading, setLoading] = useState(false)

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id)

      if (error) throw error
      onTodoUpdated()
    } catch (error) {
      console.error('Error updating todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus todo ini?')) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todo.id)

      if (error) throw error
      onTodoUpdated()
    } catch (error) {
      console.error('Error deleting todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    setLoading(true)
    try {
      const encryptedDescription = encrypt(editData.description)
      
      const { error } = await supabase
        .from('todos')
        .update({
          title: editData.title,
          description: encryptedDescription
        })
        .eq('id', todo.id)

      if (error) throw error
      
      setEditing(false)
      onTodoUpdated()
    } catch (error) {
      console.error('Error editing todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Card className={`mb-3 ${todo.completed ? 'bg-light' : ''}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            {editing ? (
              <div>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleEdit}
                    disabled={loading}
                    className="me-2"
                  >
                    Simpan
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditing(false)}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h5 className={todo.completed ? 'text-decoration-line-through text-muted' : ''}>
                  {todo.title}
                  {todo.completed && <Badge bg="success" className="ms-2">Selesai</Badge>}
                </h5>
                {todo.description && (
                  <p className={`mb-2 ${todo.completed ? 'text-muted' : ''}`}>
                    {decrypt(todo.description)}
                  </p>
                )}
                <small className="text-muted">
                  Dibuat: {new Date(todo.created_at).toLocaleString()}
                </small>
              </div>
            )}
          </div>
          
          {!editing && (
            <div className="ms-3">
              <Button
                variant={todo.completed ? "warning" : "success"}
                size="sm"
                onClick={handleToggleComplete}
                disabled={loading}
                className="me-2"
              >
                {todo.completed ? 'Batal' : 'Selesai'}
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setEditing(true)}
                disabled={loading}
                className="me-2"
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
              >
                Hapus
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}