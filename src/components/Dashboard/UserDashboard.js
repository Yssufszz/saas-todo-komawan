import React from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { TodoList } from '../Todo/TodoList';
import { useAuth } from '../../hooks/useAuth';

const UserDashboard = () => {
  const { user, profile, loading } = useAuth();

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
            @media (max-width: 576px) {
              .custom-spinner-card {
                padding: 1.5rem !important;
              }
              .custom-spinner-text {
                font-size: 1rem !important;
              }
            }
          `}
        </style>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={6}>
            <Card
              className="custom-card custom-spinner-card"
              style={{
                background: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '16px',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                animation: 'fadeInUp 0.8s ease-out',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
                padding: '2rem'
              }}
              role="region"
              aria-label="Loading State"
            >
              <Card.Body className="text-center">
                <Spinner
                  animation="border"
                  role="status"
                  className="custom-spinner"
                  style={{ color: '#60a5fa', width: '3rem', height: '3rem' }}
                >
                  <span className="visually-hidden">Memuat...</span>
                </Spinner>
                <p
                  className="mt-2 custom-spinner-text"
                  style={{ color: '#d1d5db', fontSize: '1.25rem' }}
                >
                  Memuat...
                </p>
              </Card.Body>
            </Card>
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
            @media (max-width: 576px) {
              .custom-error-card {
                padding: 1.5rem !important;
              }
              .custom-error-title {
                font-size: 1.25rem !important;
              }
              .custom-error-text {
                font-size: 0.9rem !important;
              }
            }
          `}
        </style>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={6}>
            <Card
              className="custom-card custom-error-card"
              style={{
                background: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '16px',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                animation: 'fadeInUp 0.8s ease-out',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
                padding: '2rem'
              }}
              role="region"
              aria-label="Error State"
            >
              <Card.Body className="text-center">
                <h5
                  className="custom-error-title"
                  style={{
                    color: '#f87171',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '1rem'
                  }}
                >
                  Tidak dapat memuat data pengguna
                </h5>
                <p
                  className="text-muted custom-error-text"
                  style={{ color: '#9ca3af', fontSize: '1rem' }}
                >
                  Silakan login kembali
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e3a8a, #111827)',
        minHeight: '100vh'
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

          .custom-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .custom-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4) !important;
          }

          @media (max-width: 576px) {
            .dashboard-title {
              font-size: 1.5rem !important;
            }
            .dashboard-subtitle {
              font-size: 0.9rem !important;
            }
            .role-text {
              font-size: 0.8rem !important;
              margin-top: 0.5rem !important;
            }
            .welcome-card {
              padding: 1.5rem !important;
            }
            .container-padding {
              padding: 1rem !important;
            }
          }
        `}
      </style>
      <Container
        className="mt-5 container-padding"
        style={{ padding: '2rem 1rem', animation: 'fadeInUp 0.8s ease-out' }}
      >
        <Row>
          <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
            <Card
              className="mb-4 custom-card welcome-card"
              style={{
                background: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '16px',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
                padding: '2rem'
              }}
              role="region"
              aria-label="Welcome Section"
            >
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8} xs={12}>
                    <h4
                      className="dashboard-title"
                      style={{
                        color: '#60a5fa',
                        textShadow: '0 0 12px rgba(96, 165, 250, 0.6)',
                        fontWeight: '700',
                        fontSize: '2rem',
                        marginBottom: '0.5rem'
                      }}
                    >
                      Selamat datang, {user.email}!
                    </h4>
                    <p
                      className="text-muted dashboard-subtitle"
                      style={{
                        color: '#d1d5db',
                        fontSize: '1rem',
                        marginBottom: 0
                      }}
                    >
                      Kelola todo list Anda dengan mudah
                    </p>
                  </Col>
                  <Col
                    md={4}
                    xs={12}
                    className="text-md-end text-center"
                    style={{ marginTop: '0' }}
                  >
                    <div
                      className="role-text"
                      style={{
                        color: profile?.role === 'admin' ? '#facc15' : '#9ca3af',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                    >
                      Role: {profile?.role || 'user'}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <TodoList />
    </div>
  );
};

export { UserDashboard };