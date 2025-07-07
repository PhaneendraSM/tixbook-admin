import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const KPICards = ({ data }) => (
  <Row className="mb-4">
    {data.map((item, idx) => (
      <Col md={4} key={idx}>
        <Card className="text-center">
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
            <Card.Text className="fs-3 fw-bold">{item.value}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default KPICards;
