// src/components/Dashboard/UserDashboard.js
import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { TodoList } from '../Todo/TodoList'
import { useAuth } from '../../hooks/useAuth'

const UserDashboard = () => {
  const { user, profile } = useAuth()

  return (
    <div>
      <Container className="mt-4">
        <Row>
          <Col>
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <h4>Selamat datang, {user.email}!</h4>
                    <p className="text-muted mb-0">
                      Kelola todo list Anda dengan mudah
                    </p>
                  </Col>
                  <Col md={4} className="text-md-end">
                    <div className="text-muted">
                      <small>Role: {profile?.role || 'user'}</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <TodoList />
    </div>
  )
}