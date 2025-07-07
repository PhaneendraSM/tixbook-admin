// src/components/dashboard/StatCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { ArrowUpRight, ArrowDownRight } from 'react-bootstrap-icons';

const StatCard = ({ title, value, icon, change, isPositive, bg }) => {
  return (
    <Card className={`text-white ${bg ? bg : 'bg-primary'} mb-4`} style={{ minWidth: '200px' }}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="mb-0">{title}</Card.Title>
          <h4 className="mb-0">{value}</h4>
          {change && (
            <small>
              {isPositive ? <ArrowUpRight /> : <ArrowDownRight />}
              {change}
            </small>
          )}
        </div>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
