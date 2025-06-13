import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../../utils/supabase';
import { logLogin } from '../../utils/auth';

const Login = ({ onShowRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  const validatePassword = (password) => {
    return password.length >= 6 ? '' : 'Password must be at least 6 characters long';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    if (name === 'email') {
      setValidationErrors({ ...validationErrors, email: validateEmail(value) });
    } else if (name === 'password') {
      setValidationErrors({ ...validationErrors, password: validatePassword(value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setValidationErrors({ email: emailError, password: passwordError });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      if (data.user) {
        console.log('Login berhasil');
        await logLogin(data.user.id);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a, #111827)',
        padding: '1rem',
        overflow: 'hidden'
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

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
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

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}
      </style>
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card
            className="custom-card"
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
            aria-label="Login Form"
          >
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
                Welcome Back
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
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    aria-describedby="emailHelp"
                    style={{
                      backgroundColor: '#1f2937',
                      borderColor: validationErrors.email ? '#f87171' : '#4b5563',
                      color: '#f3f4f6',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      padding: '0.85rem',
                      fontSize: '1rem'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#60a5fa')}
                    onBlur={(e) => (e.target.style.borderColor = validationErrors.email ? '#f87171' : '#4b5563')}
                  />
                  {validationErrors.email && (
                    <Form.Text style={{ color: '#f87171', fontSize: '0.875rem' }}>
                      {validationErrors.email}
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
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    aria-describedby="passwordHelp"
                    style={{
                      backgroundColor: '#1f2937',
                      borderColor: validationErrors.password ? '#f87171' : '#4b5563',
                      color: '#f3f4f6',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      padding: '0.85rem',
                      fontSize: '1rem'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#60a5fa')}
                    onBlur={(e) => (e.target.style.borderColor = validationErrors.password ? '#f87171' : '#4b5563')}
                  />
                  {validationErrors.password && (
                    <Form.Text style={{ color: '#f87171', fontSize: '0.875rem' }}>
                      {validationErrors.password}
                    </Form.Text>
                  )}
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading || validationErrors.email || validationErrors.password}
                  style={{
                    background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                    border: 'none',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                  }}
                  aria-label="Login Button"
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
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <Button
                    variant="link"
                    onClick={onShowRegister}
                    className="p-0"
                    style={{
                      color: '#93c5fd',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#60a5fa')}
                    onMouseLeave={(e) => (e.target.style.color = '#93c5fd')}
                    aria-label="Register Link"
                  >
                    Don't have an account? Sign up here
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { Login };