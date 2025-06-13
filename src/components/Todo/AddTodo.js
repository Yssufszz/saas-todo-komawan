// src/components/Todo/AddTodo.js
import React, { useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { supabase } from '../../utils/supabase'
import { encrypt } from '../../utils/encryption'
import { useAuth } from '../../hooks/useAuth'

const AddTodo = ({ onTodoAdded }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const encryptedDescription = encrypt(formData.description)
      
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: encryptedDescription,
            completed: false
          }
        ])
        .select()

      if (error) throw error

      setFormData({ title: '', description: '' })
      onTodoAdded()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Tambah Todo Baru</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Judul</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Masukkan judul todo"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi todo"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Menambah...' : 'Tambah Todo'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}