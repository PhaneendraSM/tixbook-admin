import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const Filters = ({ startDate, endDate, onStartChange, onEndChange }) => (
  <Row className="mb-4">
    <Col md={4}>
      <Form.Group controlId="startDate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control type="date" value={startDate} onChange={onStartChange} />
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group controlId="endDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control type="date" value={endDate} onChange={onEndChange} />
      </Form.Group>
    </Col>
  </Row>
);

export default Filters;
