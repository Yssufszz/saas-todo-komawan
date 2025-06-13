import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../../utils/supabase';
import { encrypt } from '../../utils/encryption';
import { useAuth } from '../../hooks/useAuth';

const AddTodo = ({ onTodoAdded }) => {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    title: ''
  });

  const validateTitle = (title) => {
    return title.trim() ? '' : 'Title is required';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'title') {
      setValidationErrors({ ...validationErrors, title: validateTitle(value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const titleError = validateTitle(formData.title);
    if (titleError) {
      setValidationErrors({ ...validationErrors, title: titleError });
      return;
    }

    if (!user) {
      setError('You must be logged in to add a todo');
      return;
    }

    setLoading(true);

    try {
      const encryptedDescription = encrypt(formData.description);

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
        .select();

      if (error) throw error;

      setFormData({ title: '', description: '' });
      setValidationErrors({ title: '' });
      onTodoAdded();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return null;
  }

  if (!user) {
    return (
      <Card
        className="mb-4 custom-card"
        style={{
          background: 'rgba(31, 41, 55, 0.95)',
          border: '1px solid rgba(96, 165, 250, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
          animation: 'fadeInUp 0.8s ease-out',
          backdropFilter: 'blur(8px)',
          overflow: 'hidden'
        }}
        role="region"
        aria-label="Unauthenticated Warning"
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
          `}
        </style>
        <Card.Body style={{ padding: '2rem' }}>
          <Alert
            variant="warning"
            style={{
              backgroundColor: 'rgba(250, 204, 21, 0.9)',
              color: '#1f2937',
              border: 'none',
              borderRadius: '10px',
              padding: '1rem',
              animation: 'fadeIn 0.5s ease-out'
            }}
            role="alert"
          >
            You must be logged in to add a todo.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      className="mb-4 custom-card"
      style={{
        background: 'rgba(31, 41, 55, 0.95)',
        border: '1px solid rgba(96, 165, 250, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
        animation: 'fadeInUp 0.8s ease-out',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden'
      }}
      role="region"
      aria-label="Add Todo Form"
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

          .error-shake {
            animation: shake 0.5s;
          }
        `}
      </style>
      <Card.Body style={{ padding: '2.5rem' }}>
        <Card.Title
          style={{
            color: '#60a5fa',
            textShadow: '0 0 12px rgba(96, 165, 250, 0.6)',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2rem',
            fontWeight: '700'
          }}
        >
          Add New Todo
        </Card.Title>

        {error && (
          <Alert
            variant="danger"
            className="error-shake"
            style={{
              backgroundColor: 'rgba(248, 113, 113, 0.9)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.5rem',
              animation: 'fadeIn 0.5s ease-out'
            }}
            role="alert"
          >
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" style={{ marginBottom: '1.75rem' }}>
            <Form.Label
              style={{
                color: '#d1d5db',
                fontWeight: '500',
                fontSize: '1rem'
              }}
            >
              Title
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter todo title"
              aria-describedby="titleHelp"
              style={{
                backgroundColor: '#1f2937',
                borderColor: validationErrors.title ? '#f87171' : '#4b5563',
                color: '#f3f4f6',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                padding: '0.85rem',
                fontSize: '1rem'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#60a5fa')}
              onBlur={(e) => (e.target.style.borderColor = validationErrors.title ? '#f87171' : '#4b5563')}
            />
            {validationErrors.title && (
              <Form.Text style={{ color: '#f87171', fontSize: '0.875rem' }}>
                {validationErrors.title}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" style={{ marginBottom: '1.75rem' }}>
            <Form.Label
              style={{
                color: '#d1d5db',
                fontWeight: '500',
                fontSize: '1rem'
              }}
            >
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter todo description"
              aria-describedby="descriptionHelp"
              style={{
                backgroundColor: '#1f2937',
                borderColor: '#4b5563',
                color: '#f3f4f6',
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

          <Button
            variant="primary"
            type="submit"
            disabled={loading || validationErrors.title}
            style={{
              background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
              border: 'none',
              padding: '0.85rem 1.5rem',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
            }}
            aria-label="Add Todo Button"
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
                Adding...
              </>
            ) : (
              'Add Todo'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddTodo;