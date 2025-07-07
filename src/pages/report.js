import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Filters from '../components/reports/filters'
import KPICards from '../components/reports/kpiCards';
import Charts from '../components/reports/charts';
import ReportTable from '../components/reports/table';

const ReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const kpiData = [
    { title: 'Total Sales', value: '₹85,000' },
    { title: 'Bookings', value: '120' },
    { title: 'Events', value: '15' },
  ];

  const chartData = [
    { category: 'Music', sales: 30000 },
    { category: 'Comedy', sales: 20000 },
    { category: 'Drama', sales: 15000 },
  ];

  const tableData = [
    {
      user: 'Alice',
      event: 'Jazz Night',
      amount: '₹2000',
      status: 'Success',
      date: '2025-04-16',
    },
    {
      user: 'Bob',
      event: 'Standup Show',
      amount: '₹1000',
      status: 'Failed',
      date: '2025-04-15',
    },
  ];

  return (
    <Container fluid>
      <h3 className="my-4">Reports & Analytics</h3>
      {/* <Filters
        startDate={startDate}
        endDate={endDate}
        onStartChange={(e) => setStartDate(e.target.value)}
        onEndChange={(e) => setEndDate(e.target.value)}
      /> */}
      <KPICards data={kpiData} />
      <Charts data={chartData} />
      <h5 className="my-4">Detailed Bookings</h5>
      <ReportTable data={tableData} />
    </Container>
  );
};

export default ReportPage;
