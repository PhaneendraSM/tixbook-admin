import React, { useEffect, useState } from 'react';
import StatCard from '../components/dashboard/statCard';
import DashboardChart from '../components/dashboard/chart';
import DashboardBarChart from '../components/dashboard/barChart';
import RecentTable from '../components/common/customTable';


import { Container, Row, Col } from 'react-bootstrap';
import { PeopleFill, CalendarEvent, TicketFill, CashStack } from 'react-bootstrap-icons';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 2,
    events: 4,
    bookings: 12,
    revenue: 10000,
  });

  const bookingLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const bookingData = [30, 45, 60, 50, 80];

  const revenueLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const revenueData = [1000, 1500, 1800, 1300, 2200];

  const categoryLabels = ['Music', 'Comedy', 'Theatre', 'Workshop', 'Festival'];
  const categoryCounts = [12, 5, 8, 3, 10];

  const recentBookingsColumns = [
    { label: 'User', key: 'user' },
    { label: 'Event', key: 'event' },
    { label: 'Seats', key: 'seats' },
    { label: 'Total Price', key: 'price' },
    { label: 'Status', key: 'status' },
    { label: 'Booked At', key: 'date' },
  ];

  const recentBookingsData = [
    {
      user: 'John Doe',
      event: 'Live Music Night',
      seats: '2 (A1, A2)',
      price: '₹2000',
      status: 'Confirmed',
      date: '2025-04-16',
    },
    {
      user: 'Meera Singh',
      event: 'Comedy Bash',
      seats: '1 (B3)',
      price: '₹999',
      status: 'Pending',
      date: '2025-04-15',
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
    //   const res = await axios.get('/api/dashboard/stats'); // Update this to your API
    //   setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <Container>
      <Row className="g-4">
        <Col md={3}>
          <StatCard
            title="Users"
            value={stats.users}
            icon={<PeopleFill />}
            change="+8%"
            isPositive
            bg="bg-success"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Events"
            value={stats.events}
            icon={<CalendarEvent />}
            change="+5%"
            isPositive
            bg="bg-info"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Bookings"
            value={stats.bookings}
            icon={<TicketFill />}
            change="-2%"
            isPositive={false}
            bg="bg-warning"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Revenue"
            value={`₹${stats.revenue}`}
            icon={<CashStack />}
            change="+12%"
            isPositive
            bg="bg-dark"
          />
        </Col>
      </Row>


      <Row>
        <Col md={6}>
          <DashboardChart
            title="Bookings Over Time"
            labels={bookingLabels}
            data={bookingData}
            color="rgba(54, 162, 235, 1)"
          />
        </Col>
        <Col md={6}>
          <DashboardChart
            title="Revenue Over Time"
            labels={revenueLabels}
            data={revenueData}
            color="rgba(255, 99, 132, 1)"
          />
        </Col>
      </Row>


      <Row>
        <Col md={12}>
          <DashboardBarChart
            title="Events by Category"
            labels={categoryLabels}
            data={categoryCounts}
            backgroundColor={[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ]}
          />
        </Col>
      </Row>


      <RecentTable
        title="Recent Bookings"
        columns={recentBookingsColumns}
        data={recentBookingsData}
      />
    </Container>
  );
};

export default Dashboard;
