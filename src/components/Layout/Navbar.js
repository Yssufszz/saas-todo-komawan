// src/components/Layout/Navbar.js
import React from 'react'
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap'
import { useAuth } from '../../hooks/useAuth'

const Navbar = () => {
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (!user) return null

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand href="#home">
          Todo App
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            {profile?.role === 'admin' && (
              <Nav.Link href="#admin">Admin Panel</Nav.Link>
            )}
          </Nav>
          
          <Nav className="ms-auto">
            <Nav.Item className="d-flex align-items-center me-3">
              <span className="text-light">
                {user.email} 
                {profile?.role === 'admin' && (
                  <span className="badge bg-warning text-dark ms-2">Admin</span>
                )}
              </span>
            </Nav.Item>
            <Button variant="outline-light" size="sm" onClick={handleSignOut}>
              Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}