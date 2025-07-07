import React from 'react';
import { Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Charts = ({ data }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>Event Sales by Category</Card.Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </Card.Body>
  </Card>
);

export default Charts;
