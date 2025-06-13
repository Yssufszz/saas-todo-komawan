import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) return null;

  return (
    <>
      <BootstrapNavbar
        expand="lg"
        style={{
          background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.9), rgba(17, 24, 39, 0.9))',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(96, 165, 250, 0.4)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          animation: 'slideIn 0.6s ease-out',
        }}
        role="navigation"
        aria-label="Main Navigation"
      >
        <style>
          {`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes slideInSidebar {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .navbar-brand {
              color: #e5e7eb !important;
              font-weight: 700;
              font-size: 1.75rem;
              text-shadow: 0 0 10px rgba(96, 165, 250, 0.6);
              transition: all 0.3s ease;
            }

            .navbar-brand:hover {
              color: #93c5fd !important;
              transform: scale(1.05);
            }

            .nav-link {
              color: #d1d5db !important;
              font-size: 1.1rem;
              padding: 0.6rem 1.2rem !important;
              position: relative;
              transition: color 0.3s ease;
            }

            .nav-link::after {
              content: '';
              position: absolute;
              width: 0;
              height: 2px;
              bottom: 0;
              left: 0;
              background: #60a5fa;
              transition: width 0.3s ease;
            }

            .nav-link:hover::after {
              width: 100%;
            }

            .nav-link:hover {
              color: #60a5fa !important;
              transform: translateY(-2px);
            }

            .custom-button {
              position: relative;
              background: linear-gradient(90deg, #2563eb, #3b82f6);
              border: none;
              padding: 0.6rem 1.8rem;
              border-radius: 10px;
              font-weight: 600;
              font-size: 0.95rem;
              color: #f3f4f6;
              box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
              overflow: hidden;
              transition: all 0.3s ease;
            }

            .custom-button:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 25px rgba(37, 99, 235, 0.6);
              background: linear-gradient(90deg, #1d4ed8, #2563eb);
            }

            .custom-button::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              width: 0;
              height: 0;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
              transform: translate(-50%, -50%);
              transition: width 0.6s ease, height 0.6s ease;
            }

            .custom-button:active::before {
              width: 200px;
              height: 200px;
            }

            .sidebar {
              position: fixed;
              top: 0;
              right: 0;
              width: 280px;
              height: 100%;
              background: linear-gradient(180deg, rgba(29, 78, 216, 0.95), rgba(17, 24, 39, 0.95));
              backdrop-filter: blur(12px);
              z-index: 1100;
              padding: 2rem 1rem;
              display: flex;
              flex-direction: column;
              transform: translateX(100%);
              transition: transform 0.4s ease, opacity 0.4s ease;
              opacity: 0;
            }

            .sidebar.open {
              transform: translateX(0);
              opacity: 1;
              animation: slideInSidebar 0.4s ease-out forwards;
            }

            .sidebar-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              z-index: 1099;
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.4s ease, visibility 0.4s ease;
            }

            .sidebar-overlay.open {
              opacity: 1;
              visibility: visible;
            }

            .sidebar-nav-link {
              color: #d1d5db !important;
              font-size: 1.2rem;
              padding: 0.8rem 1rem;
              margin: 0.5rem 0;
              border-radius: 8px;
              transition: all 0.3s ease;
              opacity: 0;
            }

            .sidebar.open .sidebar-nav-link {
              animation: fadeIn 0.3s ease-out forwards;
            }

            .sidebar-nav-link:nth-child(1) { animation-delay: 0.1s; }
            .sidebar-nav-link:nth-child(2) { animation-delay: 0.2s; }
            .sidebar-nav-link:nth-child(3) { animation-delay: 0.3s; }
            .sidebar-nav-link:nth-child(4) { animation-delay: 0.4s; }

            .sidebar-nav-link:hover {
              background: rgba(96, 165, 250, 0.2);
              color: #60a5fa !important;
              transform: translateX(10px);
            }

            .hamburger {
              display: none;
              flex-direction: column;
              justify-content: space-around;
              width: 30px;
              height: 25px;
              background: transparent;
              border: none;
              cursor: pointer;
              padding: 0;
              z-index: 1200;
            }

            .hamburger span {
              width: 100%;
              height: 3px;
              background: #e5e7eb;
              border-radius: 10px;
              transition: all 0.3s ease;
            }

            .hamburger.open span:nth-child(1) {
              transform: rotate(45deg) translate(5px, 5px);
            }

            .hamburger.open span:nth-child(2) {
              opacity: 0;
            }

            .hamburger.open span:nth-child(3) {
              transform: rotate(-45deg) translate(7px, -7px);
            }

            @media (max-width: 767.98px) {
              .navbar-collapse {
                display: none !important;
              }
              .hamburger {
                display: flex;
              }
              .navbar-brand {
                font-size: 1.5rem;
              }
            }

            @media (min-width: 768px) {
              .sidebar, .sidebar-overlay, .hamburger {
                display: none !important;
              }
            }
          `}
        </style>
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/" style={{ display: 'flex', alignItems: 'center' }}>
            KerjainWoy
          </BootstrapNavbar.Brand>

          <button
            className={`hamburger ${isSidebarOpen ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar Menu"
            aria-expanded={isSidebarOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" aria-label="Dashboard Link">
                Dashboard
              </Nav.Link>
              {profile?.role === 'admin' && (
                <Nav.Link as={Link} to="/admin" aria-label="Admin Panel Link">
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
                        background: 'linear-gradient(90deg, #facc15, #f4d03f)',
                        color: '#1f2937',
                        fontWeight: '600',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '14px',
                        fontSize: '0.85rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      Admin
                    </span>
                  )}
                </span>
              </Nav.Item>
              <Button
                className="custom-button"
                onClick={handleSignOut}
                disabled={isLoggingOut}
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

      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Nav className="flex-column">
          <Nav.Link
            as={Link}
            to="/"
            className="sidebar-nav-link"
            onClick={toggleSidebar}
            aria-label="Dashboard Link"
          >
            Dashboard
          </Nav.Link>
          {profile?.role === 'admin' && (
            <Nav.Link
              as={Link}
              to="/admin"
              className="sidebar-nav-link"
              onClick={toggleSidebar}
              aria-label="Admin Panel Link"
            >
              Admin Panel
            </Nav.Link>
          )}
          <Nav.Item
            className="sidebar-nav-link"
            style={{ color: '#d1d5db', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {user.email}
              {profile?.role === 'admin' && (
                <span
                  className="badge ms-2"
                  style={{
                    background: 'linear-gradient(90deg, #facc15, #f4d03f)',
                    color: '#1f2937',
                    fontWeight: '600',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '14px',
                    fontSize: '0.85rem',
                  }}
                >
                  Admin
                </span>
              )}
            </span>
          </Nav.Item>
          <Button
            className="custom-button sidebar-nav-link"
            onClick={() => {
              toggleSidebar();
              handleSignOut();
            }}
            disabled={isLoggingOut}
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
      </div>
    </>
  );
};

export { Navbar };