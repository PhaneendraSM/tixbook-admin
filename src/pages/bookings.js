import React from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import CustomPagination from '../components/common/customPagination';
import usePagination from '../hooks/listData';
import SearchField from '../components/common/searchField';
import DataTable from '../components/common/dataTable';
import { getAllBookings, deleteBooking } from '../services/bookingService';

const BookingsList = () => {
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

  const columns = [
    { header: "#" },
    { header: "User" },
    { header: "Event" },
    { header: "Seats" },
    { header: "Amount" },
    { header: "Status" },
    { header: "Booked At" },
    { header: "Actions" }
  ];

  const renderRow = (booking, index) => (
    <tr key={booking._id}>
      <td>{(page - 1) * 10 + index + 1}</td>
      <td>{booking.user || 'N/A'}</td>
      <td>{booking.event?.title || 'N/A'}</td>
      <td>{booking.seats}</td>
      <td>₹{booking.totalPrice}</td>
      <td>{booking.paymentStatus}</td>
      <td>{new Date(booking.bookingDate).toLocaleString()}</td>
      <td>
        <Button variant="danger" size="sm" onClick={() => handleDelete(booking._id)}>
          Delete
        </Button>
      </td>
    </tr>
  );

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Bookings Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className='pb-4'>
        <SearchField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={handleSearchSubmit}
          placeholder="Search bookings..."
        />
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DataTable columns={columns} data={bookings} renderRow={renderRow} />
          <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </Container>
  );
};

export default BookingsList;
