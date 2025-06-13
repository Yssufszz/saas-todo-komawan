import { Container, Row, Col, Button } from 'react-bootstrap';
import './css/LandingPage.css';

export const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <Container fluid className="landing-container">
      <section className="hero-section text-center" aria-labelledby="hero-title">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h1 id="hero-title" className="display-4 fw-bold title">KerjainWoy 🚀</h1>
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
            <div className="hero-banner mt-4">
              <p className="banner-text">Gabung sekarang dan jadi produktif! 🎉</p>
              <Button
                variant="success"
                onClick={onShowRegister}
                className="custom-button banner-button"
                aria-label="Get Started Button"
              >
                Mulai Sekarang
              </Button>
            </div>
          </Col>
        </Row>
      </section>

      <section className="features-section mt-5" aria-labelledby="features-title">
        <h2 id="features-title" className="section-title text-center">Fitur Keren Kami</h2>
        <Row className="justify-content-center feature-row">
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
      </section>

      <section className="testimonials-section mt-5" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" className="section-title text-center">Apa Kata Pengguna?</h2>
        <Row className="justify-content-center">
          {[
            {
              name: 'Budi P.',
              text: 'KerjainWoy bikin hidupku lebih teratur. Tugas kuliah gak numpuk lagi!'
            },
            {
              name: 'Siti A.',
              text: 'Notifikasinya top banget, gak pernah lupa deadline project lagi.'
            },
            {
              name: 'Rian K.',
              text: 'Progress trackernya bikin semangat buat ngejar target tiap hari.'
            }
          ].map((testimonial, index) => (
            <Col xs={12} md={4} className="mb-4" key={testimonial.name}>
              <div className={`testimonial-card testimonial-card-${index + 1}`}>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-name">— {testimonial.name}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      <footer className="footer-section mt-5" role="contentinfo">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <p className="footer-text">Ikuti Kami</p>
            <div className="social-links d-flex justify-content-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Follow us on Twitter/X"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Follow us on Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Follow us on GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
            <p className="footer-text mt-3">
              &copy; {new Date().getFullYear()} KerjainWoy. All rights reserved.
            </p>
          </Col>
        </Row>
      </footer>
    </Container>
  );
};