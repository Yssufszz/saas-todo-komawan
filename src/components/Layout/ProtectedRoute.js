import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Memuat data...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="warning" className="text-center">
              <h4>Sesi Berakhir</h4>
              <p>Silakan login kembali untuk melanjutkan.</p>
              <a href="/login" className="btn btn-primary">
                Login
              </a>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (adminOnly && profile?.role !== 'admin') {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="danger" className="text-center">
              <h4>Akses Ditolak</h4>
              <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
              <a href="/" className="btn btn-primary">
                Kembali ke Dashboard
              </a>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return children;
};

export { ProtectedRoute };