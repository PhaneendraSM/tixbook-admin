// src/components/auth/ForgotPasswordForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { forgotPassword } from '../../services/authService';

const ForgotPasswordForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      // You might receive a success message from your API
      setMessage(data.message || 'Please check your email for further instructions.');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-form container py-5">
      <div className='row justify-content-center mb-4 align-items-center'>
        <div className='col-md-6'>
          <h2 className='text-center'>Forgot Password</h2>
           <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <div className='text-center mt-4 d-flex justify-content-center align-items-center'>
         <Link to="/login" className='text-decoration-none btn btn-secondary me-3'>Back to Login</Link>
           <Button variant="primary" type="submit" disabled={loading} className="">
        {loading ? 'Sending...' : 'Reset Password'}
      </Button>
      </div>
    
    </Form>
        </div>
      </div>
    
    
   
    </div>
  );
};

export default ForgotPasswordForm;
