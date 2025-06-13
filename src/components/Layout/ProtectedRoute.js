// src/components/Layout/ProtectedRoute.js
import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Container, Row, Col, Spinner } from 'react-bootstrap'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <Container className="mt-5">
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

  if (!user) {
    return null
  }

  if (adminOnly && profile?.role !== 'admin') {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="alert alert-danger text-center">
              <h4>Akses Ditolak</h4>
              <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  return children
}

export { ProtectedRoute }