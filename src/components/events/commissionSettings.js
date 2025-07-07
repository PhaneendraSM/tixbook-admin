import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const CommissionSettings = ({ initialData, onBack, onSaveEvent }) => {
  const [partnerCommissionPercentage, setPartnerCommissionPercentage] = useState(initialData.partnerCommissionPercentage || '');
  const [agentCommissionPercentage, setAgentCommissionPercentage] = useState(initialData.agentCommissionPercentage || '');
  const [platformFeePercentage, setPlatformFeePercentage] = useState(initialData.platformFeePercentage || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveEvent({
      partnerCommissionPercentage,
      agentCommissionPercentage,
      platformFeePercentage,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4>Commission Settings</h4>
      <Form.Group controlId="partnerCommission">
        <Form.Label>Partner Commission Percentage</Form.Label>
        <Form.Control
          type="number"
          value={partnerCommissionPercentage}
          onChange={(e) => setPartnerCommissionPercentage(e.target.value)}
          required
          min="0"
          max="100"
        />
      </Form.Group>

      <Form.Group controlId="agentCommission" className="mt-3">
        <Form.Label>Agent Commission Percentage</Form.Label>
        <Form.Control
          type="number"
          value={agentCommissionPercentage}
          onChange={(e) => setAgentCommissionPercentage(e.target.value)}
          required
          min="0"
          max="100"
        />
      </Form.Group>

      <Form.Group controlId="platformFee" className="mt-3">
        <Form.Label>Platform Fee Percentage</Form.Label>
        <Form.Control
          type="number"
          value={platformFeePercentage}
          onChange={(e) => setPlatformFeePercentage(e.target.value)}
          required
          min="0"
          max="100"
        />
      </Form.Group>

      <div className="mt-4 d-flex justify-content-end">
        <Button variant="secondary" className='me-3' onClick={onBack}>Back</Button>{' '}
        <Button variant="primary" type="submit">Save Event</Button>
      </div>
    </Form>
  );
};

export default CommissionSettings;
