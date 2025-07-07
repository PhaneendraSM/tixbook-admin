import React from 'react';
import { Table } from 'react-bootstrap';

const ReportTable = ({ data }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>User</th>
        <th>Event</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {data.length > 0 ? (
        data.map((row, idx) => (
          <tr key={idx}>
            <td>{row.user}</td>
            <td>{row.event}</td>
            <td>{row.amount}</td>
            <td>{row.status}</td>
            <td>{row.date}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center">No data</td>
        </tr>
      )}
    </tbody>
  </Table>
);

export default ReportTable;
