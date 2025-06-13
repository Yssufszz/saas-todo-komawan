import React, { useState } from 'react';
import { Card, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { supabase } from '../../utils/supabase';
import { decrypt, encrypt } from '../../utils/encryption';

const TodoItem = ({ todo, onTodoUpdated, isAdmin = false }) => {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: decrypt(todo.description)
  });
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id);

      if (error) throw error;
      onTodoUpdated();
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus todo ini?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todo.id);

      if (error) throw error;
      onTodoUpdated();
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const encryptedDescription = encrypt(editData.description);

      const { error } = await supabase
        .from('todos')
        .update({
          title: editData.title,
          description: encryptedDescription
        })
        .eq('id', todo.id);

      if (error) throw error;

      setEditing(false);
      onTodoUpdated();
    } catch (error) {
      console.error('Error editing todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card
      className={`mb-3 custom-card ${todo.completed ? 'completed' : ''}`}
      style={{
        background: todo.completed
          ? 'rgba(209, 213, 219, 0.9)'
          : 'rgba(31, 41, 55, 0.95)',
        border: '1px solid rgba(96, 165, 250, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
        animation: 'fadeInUp 0.8s ease-out',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden'
      }}
      role="region"
      aria-label={`Todo Item: ${todo.title}`}
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

          .custom-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .custom-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4) !important;
          }

          .form-control:focus {
            box-shadow: 0 0 0 0.25rem rgba(96, 165, 250, 0.25) !important;
          }

          .custom-button {
            transition: all 0.3s ease;
            min-width: 80px;
            touch-action: manipulation;
          }

          .custom-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3) !important;
          }

          @media (max-width: 576px) {
            .todo-item-container {
              flex-direction: column;
              align-items: stretch;
            }
            .todo-item-buttons {
              flex-direction: column;
              align-items: stretch;
              margin-top: 1rem;
              margin-left: 0;
            }
            .custom-button {
              margin-bottom: 0.5rem;
              margin-right: 0 !important;
              padding: 0.75rem;
              font-size: 0.9rem;
            }
            .todo-item-content h5 {
              font-size: 1.1rem;
            }
            .todo-item-content p {
              font-size: 0.9rem;
            }
            .todo-item-content small {
              font-size: 0.8rem;
            }
            .form-control {
              font-size: 0.9rem;
              padding: 0.75rem;
            }
            .form-group {
              margin-bottom: 1rem !important;
            }
          }
        `}
      </style>
      <Card.Body style={{ padding: '1.5rem' }}>
        <div className="d-flex todo-item-container" style={{ alignItems: 'flex-start' }}>
          <div className="flex-grow-1 todo-item-content">
            {editing ? (
              <div>
                <Form.Group className="mb-3 form-group">
                  <Form.Control
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan judul todo"
                    aria-describedby="titleHelp"
                    style={{
                      backgroundColor: todo.completed ? '#e5e7eb' : '#1f2937',
                      borderColor: '#4b5563',
                      color: todo.completed ? '#1f2937' : '#f3f4f6',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      padding: '0.85rem',
                      fontSize: '1rem'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#60a5fa')}
                    onBlur={(e) => (e.target.style.borderColor = '#4b5563')}
                  />
                </Form.Group>
                <Form.Group className="mb-3 form-group">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    placeholder="Masukkan deskripsi todo"
                    aria-describedby="descriptionHelp"
                    style={{
                      backgroundColor: todo.completed ? '#e5e7eb' : '#1f2937',
                      borderColor: '#4b5563',
                      color: todo.completed ? '#1f2937' : '#f3f4f6',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      padding: '0.85rem',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#60a5fa')}
                    onBlur={(e) => (e.target.style.borderColor = '#4b5563')}
                  />
                </Form.Group>
                <div className="d-flex">
                  <Button
                    className="custom-button"
                    variant="success"
                    size="sm"
                    onClick={handleEdit}
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                      border: 'none',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)',
                      marginRight: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 15px rgba(22, 163, 74, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(22, 163, 74, 0.4)';
                    }}
                    aria-label="Simpan Todo Button"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          style={{ marginRight: '0.5rem' }}
                        />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan'
                    )}
                  </Button>
                  <Button
                    className="custom-button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditing(false)}
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(90deg, #4b5563, #6b7280)',
                      border: 'none',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 15px rgba(75, 85, 99, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 15px rgba(75, 85, 99, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(75, 85, 99, 0.4)';
                    }}
                    aria-label="Batal Edit Button"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h5
                  style={{
                    color: todo.completed ? '#6b7280' : '#f3f4f6',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}
                >
                  {todo.title}
                  {todo.completed && (
                    <Badge
                      style={{
                        backgroundColor: '#22c55e',
                        color: '#fff',
                        fontWeight: '600',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '12px',
                        marginLeft: '0.5rem',
                        fontSize: '0.8rem'
                      }}
                    >
                      Selesai
                    </Badge>
                  )}
                </h5>
                {todo.description && (
                  <p
                    style={{
                      color: todo.completed ? '#6b7280' : '#d1d5db',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    {decrypt(todo.description)}
                  </p>
                )}
                <small
                  style={{
                    color: todo.completed ? '#9ca3af' : '#9ca3af',
                    fontSize: '0.875rem'
                  }}
                >
                  Dibuat: {new Date(todo.created_at).toLocaleString()}
                </small>
              </div>
            )}
          </div>

          {!editing && (
            <div className="todo-item-buttons" style={{ marginLeft: '1rem' }}>
              <Button
                className="custom-button"
                variant={todo.completed ? 'warning' : 'success'}
                size="sm"
                onClick={handleToggleComplete}
                disabled={loading}
                style={{
                  background: todo.completed
                    ? 'linear-gradient(90deg, #d97706, #facc15)'
                    : 'linear-gradient(90deg, #16a34a, #22c55e)',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  boxShadow: todo.completed
                    ? '0 4px 15px rgba(217, 119, 6, 0.4)'
                    : '0 4px 15px rgba(22, 163, 74, 0.4)',
                  marginRight: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = todo.completed
                    ? '0 6px 15px rgba(217, 119, 6, 0.6)'
                    : '0 6px 15px rgba(22, 163, 74, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = todo.completed
                    ? '0 4px 15px rgba(217, 119, 6, 0.4)'
                    : '0 4px 15px rgba(22, 163, 74, 0.4)';
                }}
                aria-label={todo.completed ? 'Batal Selesai Button' : 'Tandai Selesai Button'}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: '0.5rem' }}
                    />
                    Memproses...
                  </>
                ) : todo.completed ? (
                  'Batal'
                ) : (
                  'Selesai'
                )}
              </Button>
              <Button
                className="custom-button"
                variant="outline-primary"
                size="sm"
                onClick={() => setEditing(true)}
                disabled={loading}
                style={{
                  borderColor: '#60a5fa',
                  color: '#60a5fa',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(96, 165, 250, 0.3)',
                  background: 'transparent',
                  marginRight: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#60a5fa';
                  e.target.style.color = '#fff';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 15px rgba(96, 165, 250, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#60a5fa';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(96, 165, 250, 0.3)';
                }}
                aria-label="Edit Todo Button"
              >
                Edit
              </Button>
              <Button
                className="custom-button"
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
                style={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ef4444';
                  e.target.style.color = '#fff';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 15px rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#ef4444';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                }}
                aria-label="Hapus Todo Button"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: '0.5rem' }}
                    />
                    Menghapus...
                  </>
                ) : (
                  'Hapus'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodoItem;