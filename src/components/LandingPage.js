import { Container, Row, Col, Button } from 'react-bootstrap';
import './css/LandingPage.css';

export const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <Container fluid className="landing-container text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-4 fw-bold title">KerjainWoy 🚀</h1>
          <p className="lead mt-3 lead-text">
            Aplikasi to-do list yang bantu kamu nyusun, nyicil, dan nyelesaiin tugas-tugas hidup. Gak ada lagi alasan "lupa" atau "mager"!
          </p>
          <p className="sub-text">
            Mulai dari tugas kuliah, kerjaan sampingan, sampai ngingetin buat nonton anime tiap hari Sabtu 📝.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="primary" onClick={onShowLogin}>
              Login
            </Button>
            <Button variant="outline-secondary" onClick={onShowRegister}>
              Daftar
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5 justify-content-center">
        <Col md={4} className="mb-4">
          <div className="feature-card">
            <h5 className="feature-title">📅 Jadwal Tertata</h5>
            <p className="feature-text">Buat, atur, dan cek list tugas dengan mudah. Gak bakal keteteran lagi.</p>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="feature-card">
            <h5 className="feature-title">🔔 Reminder & Notifikasi</h5>
            <p className="feature-text">Dapet pengingat tugas penting supaya kamu gak mendadak panik pas deadline.</p>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="feature-card">
            <h5 className="feature-title">📈 Progress Tracker</h5>
            <p className="feature-text">Liat perkembanganmu, dari yang rebahan jadi produktif.</p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}