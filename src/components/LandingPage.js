import { Container, Row, Col, Button } from 'react-bootstrap';
import './css/LandingPage.css';

export const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <Container fluid className="landing-container text-center">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="display-4 fw-bold title">KerjainWoy 🚀</h1>
          <p className="lead mt-3 lead-text">
            Aplikasi to-do list yang bantu kamu nyusun, nyicil, dan nyelesaiin tugas-tugas hidup. Gak ada lagi alasan "lupa" atau "mager"!
          </p>
          <p className="sub-text">
            Mulai dari tugas kuliah, kerjaan sampingan, sampai ngingetin buat nonton anime tiap hari Sabtu 📝.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <Button
              variant="primary"
              onClick={onShowLogin}
              className="custom-button"
              aria-label="Login Button"
            >
              Login
            </Button>
            <Button
              variant="outline-secondary"
              onClick={onShowRegister}
              className="custom-button"
              aria-label="Daftar Button"
            >
              Daftar
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5 justify-content-center feature-row">
        {[
          {
            title: '📅 Jadwal Tertata',
            text: 'Buat, atur, dan cek list tugas dengan mudah. Gak bakal keteteran lagi.'
          },
          {
            title: '🔔 Reminder & Notifikasi',
            text: 'Dapet pengingat tugas penting supaya kamu gak mendadak panik pas deadline.'
          },
          {
            title: '📈 Progress Tracker',
            text: 'Liat perkembanganmu, dari yang rebahan jadi produktif.'
          }
        ].map((feature, index) => (
          <Col xs={12} md={4} className="mb-4" key={feature.title}>
            <div className={`feature-card feature-card-${index + 1}`}>
              <h5 className="feature-title">{feature.title}</h5>
              <p className="feature-text">{feature.text}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};