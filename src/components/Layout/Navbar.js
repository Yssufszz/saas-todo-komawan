import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <BootstrapNavbar
      expand="lg"
      style={{
        background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.95), rgba(17, 24, 39, 0.95))',
        borderBottom: '1px solid rgba(96, 165, 250, 0.3)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        animation: 'fadeInDown 0.8s ease-out'
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .nav-link {
            transition: color 0.3s ease, transform 0.3s ease;
            color: #d1d5db !important;
          }

          .nav-link:hover {
            color: #60a5fa !important;
            transform: translateY(-2px);
          }

          .navbar-brand {
            transition: color 0.3s ease, transform 0.3s ease;
          }

          .navbar-brand:hover {
            color: #60a5fa !important;
            transform: translateY(-2px);
          }

          .custom-button {
            transition: all 0.3s ease;
          }

          .custom-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.6) !important;
          }
        `}
      </style>
      <Container>
        <BootstrapNavbar.Brand
          href="#"
          style={{
            color: '#f3f4f6',
            fontWeight: '700',
            fontSize: '1.5rem',
            textShadow: '0 0 8px rgba(96, 165, 250, 0.5)'
          }}
        >
          KerjainWoy
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="#"
              style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
              aria-label="Dashboard Link"
            >
              Dashboard
            </Nav.Link>
            {profile?.role === 'admin' && (
              <Nav.Link
                href="admin"
                style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                aria-label="Admin Panel Link"
              >
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center">
            <Nav.Item
              className="d-flex align-items-center me-3"
              style={{ color: '#d1d5db', fontSize: '0.95rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {user.email}
                {profile?.role === 'admin' && (
                  <span
                    className="badge ms-2"
                    style={{
                      backgroundColor: '#facc15',
                      color: '#1f2937',
                      fontWeight: '600',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}
                  >
                    Admin
                  </span>
                )}
              </span>
            </Nav.Item>
            <Button
              className="custom-button"
              variant="outline-light"
              size="sm"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              style={{
                background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                color: '#f3f4f6',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(90deg, #1d4ed8, #2563eb)';
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(90deg, #2563eb, #3b82f6)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.4)';
              }}
              aria-label="Logout Button"
            >
              {isLoggingOut ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginRight: '0.5rem' }}
                  />
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export { Navbar };