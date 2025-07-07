import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { loginAdmin } from '../services/authService';
import logo from '../assets/images/Tixbook_logo_white-1.svg'; 
import { Eye, EyeOff } from 'lucide-react';


function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      localStorage.setItem('adminToken', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <section className="login-section">
       {/* Floating bubbles container */}
<div className="bubbles-container">
  {[
    { size: 30, top: '10%', left: '15%', orbitRadius: '40px', duration: 20, delay: 0 },
    { size: 40, top: '25%', left: '70%', orbitRadius: '150px', duration: 25, delay: 5 },
    { size: 25, top: '60%', left: '30%', orbitRadius: '30px', duration: 18, delay: 2 },
    { size: 50, top: '80%', left: '80%', orbitRadius: '70px', duration: 30, delay: 7 },
    { size: 20, top: '50%', left: '50%', orbitRadius: '25px', duration: 22, delay: 1 },
    { size: 35, top: '40%', left: '85%', orbitRadius: '45px', duration: 28, delay: 4 },
    { size: 15, top: '70%', left: '10%', orbitRadius: '20px', duration: 16, delay: 6 },
    { size: 45, top: '15%', left: '40%', orbitRadius: '60px', duration: 35, delay: 3 },
  ].map(({ size, top, left, orbitRadius, duration, delay }, i) => (
    <div
       key={i}
  className="bubble"
  style={{
    width: size,
    height: size,
    top: top,
    left: left,
    '--orbit-radius': orbitRadius,
    animationName: 'revolve',
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationIterationCount: 'infinite',
    animationFillMode: 'forwards',           // fix flicker
    transform: `rotate(0deg) translateX(${orbitRadius}) rotate(0deg)`,  // initial transform
  }}
    />
  ))}
</div>

    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="p-4">
            <Card.Body>
              <img src={logo} alt='logo' className='img-fluid text-center mx-auto pb-4 d-flex login-logo' />
              <h4 className="text-center mb-4 text-white">Login</h4>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3 text-white">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group id="password" className="mb-3 text-white">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer', color: '#000' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                  </div>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <Link to="/forgot-password" className='text-white'>Forgot Password?</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </section>
  );
}

export default AdminLogin;
