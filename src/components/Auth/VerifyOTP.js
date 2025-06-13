// src/components/Auth/VerifyOTP.js
import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

const VerifyOTP = ({ email, onVerifySuccess }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title className="mb-4">✅ Pendaftaran Berhasil</Card.Title>
              <Alert variant="success">
                Cek email Anda di <strong>{email}</strong> untuk link verifikasi akun.
              </Alert>
              <p className="text-muted mt-3">
                Setelah akun diverifikasi melalui link tersebut, Anda dapat login.
              </p>
              <Button
                variant="primary"
                onClick={onVerifySuccess}
                className="w-100 mt-2"
              >
                Ke Halaman Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { VerifyOTP };