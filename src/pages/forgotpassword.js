// src/pages/ForgotPassword.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../components/auth/forgot-password-form';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Optionally, redirect to login page after success
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Forgot Password</h2>
              <ForgotPasswordForm onSuccess={handleSuccess} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
