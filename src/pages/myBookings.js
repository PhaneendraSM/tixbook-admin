import React from 'react';
import { Container, Button, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomPagination from '../components/common/customPagination';
import usePagination from '../hooks/listData';
import SearchField from '../components/common/searchField';
import DataTable from '../components/common/dataTable';
import { getAllBookings, deleteBooking } from '../services/bookingService';

const MyBookings = () => {
  const { data: bookings, search, setSearch, page, setPage, totalPages, loading, error, refetch } =
    usePagination(getAllBookings);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteBooking(id);
      refetch();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSearchSubmit = () => {
    setPage(1);
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  const columns = [
    { header: "#" },
    { header: "Customer" },
    { header: "Event" },
    { header: "Seats" },
    { header: "Amount" },
    { header: "Status" },
    { header: "Booked At" },
    { header: "Actions" }
  ];

  const renderRow = (booking, index) => {
    // Parse seats if it's a string
    let seatsInfo = 'N/A';
    if (booking.seats) {
      try {
        const seats = typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats;
        if (Array.isArray(seats)) {
          seatsInfo = seats.map(seat => seat.seatId).join(', ');
        } else {
          seatsInfo = booking.seats;
        }
      } catch (e) {
        seatsInfo = booking.seats;
      }
    }

    return (
      <tr key={booking._id}>
        <td>{(page - 1) * 10 + index + 1}</td>
        <td>
          <div>
            <strong>{booking.customerName || 'N/A'}</strong>
            <br />
            <small className="text-muted">{booking.customerEmail || 'N/A'}</small>
            {booking.customerPhone && (
              <>
                <br />
                <small className="text-muted">{booking.customerPhone}</small>
              </>
            )}
          </div>
        </td>
        <td>
          <div>
            <strong>{booking.event?.title || 'N/A'}</strong>
            <br />
            <small className="text-muted">
              {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}
            </small>
          </div>
        </td>
        <td>
          <small>{seatsInfo}</small>
        </td>
        <td>₹{booking.totalPrice || 0}</td>
        <td>{getStatusBadge(booking.paymentStatus)}</td>
        <td>{new Date(booking.bookingDate).toLocaleString()}</td>
        <td>
          <Button variant="danger" size="sm" onClick={() => handleDelete(booking._id)}>
            Delete
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1>My Bookings</h1>
          <p className="text-muted">Manage bookings created by admin</p>
        </Col>
        <Col xs="auto">
          <Link to="/admin-booking">
            <Button variant="primary">
              Create New Booking
            </Button>
          </Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <div className='pb-4'>
            <SearchField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSubmit={handleSearchSubmit}
              placeholder="Search bookings by customer name, email, or event..."
            />
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <p>Loading bookings...</p>
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={bookings} renderRow={renderRow} />
              <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyBookings; 