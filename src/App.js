// src/App.js
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Navbar } from './components/Layout/Navbar'
import { ProtectedRoute } from './components/Layout/ProtectedRoute'
import { LandingPage } from './components/LandingPage' // <-- Impor LandingPage
import { Login } from './components/Auth/Login'
import { Register } from './components/Auth/Register'
import { VerifyOTP } from './components/Auth/VerifyOTP'
import { UserDashboard } from './components/Dashboard/UserDashboard'
import { AdminDashboard } from './components/Dashboard/AdminDashboard'
import { Container, Row, Col, Spinner } from 'react-bootstrap'

function App() {
  const { user, loading } = useAuth()
  // Atur 'landing' sebagai tampilan awal
  const [authView, setAuthView] = useState('landing')
  const [registrationEmail, setRegistrationEmail] = useState('')

  const handleShowRegister = () => {
    setAuthView('register')
  }

  const handleShowLogin = () => {
    setAuthView('login')
  }

  const handleRegisterSuccess = (email) => {
    setRegistrationEmail(email)
    setAuthView('verify')
  }

  const handleVerifySuccess = () => {
    setAuthView('login')
    setRegistrationEmail('')
  }

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Memuat aplikasi...</p>
          </Col>
        </Row>
      </Container>
    )
  }

  // Logika untuk pengguna yang belum terotentikasi
  if (!user) {
    return (
      <div>
        {/* Tampilkan LandingPage saat authView adalah 'landing' */}
        {authView === 'landing' && (
          <LandingPage
            onShowLogin={handleShowLogin}
            onShowRegister={handleShowRegister}
          />
        )}

        {authView === 'login' && (
          <Login onShowRegister={handleShowRegister} />
        )}

        {authView === 'register' && (
          <div>
            <Register onRegisterSuccess={handleRegisterSuccess} />
            <Container className="mt-3">
              <Row className="justify-content-center">
                <Col md={6} lg={4}>
                  <div className="text-center">
                    <button
                      className="btn btn-link"
                      onClick={handleShowLogin}
                    >
                      Sudah punya akun? Login di sini
                    </button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )}
        
       {authView === 'verify' && (
          <div>
            <VerifyOTP
              email={registrationEmail}
              onVerifySuccess={handleVerifySuccess}
            />
            <Container className="mt-3">
              <Row className="justify-content-center">
                <Col md={6} lg={4}>
                  <div className="text-center">
                    <button
                      className="btn btn-link"
                      onClick={handleShowLogin}
                    >
                      Kembali ke Login
                    </button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
    )
  }

  // Logika untuk pengguna yang sudah login
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App