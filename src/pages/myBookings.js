import React, { useState, useRef } from 'react';
import { Container, Button, Alert, Card, Row, Col, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faInfoCircle, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CustomPagination from '../components/common/customPagination';
import usePagination from '../hooks/listData';
import SearchField from '../components/common/searchField';
import DataTable from '../components/common/dataTable';
import { getAllBookings, deleteBooking } from '../services/bookingService';
import eventImage from '../assets/images/ticket-bg1.jpg';

const MyBookings = () => {
  const { data: bookings, search, setSearch, page, setPage, totalPages, loading, error, refetch } =
    usePagination(getAllBookings);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentQRIndex, setCurrentQRIndex] = useState(0);
  const ticketRef = useRef(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteBooking(id);
      refetch();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking);
    setCurrentQRIndex(0);
    setShowModal(true);
  };

  const handleQRNavigation = (direction) => {
    if (!selectedBooking || !selectedBooking.seats) return;
    
    if (direction === 'next') {
      setCurrentQRIndex((prev) => 
        prev < selectedBooking.seats.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentQRIndex((prev) => 
        prev > 0 ? prev - 1 : selectedBooking.seats.length - 1
      );
    }
  };

  const downloadTicketsAsPDF = async () => {
    if (!selectedBooking || !selectedBooking.seats) return;

    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < selectedBooking.seats.length; i++) {
        // Set current QR index for this ticket
        setCurrentQRIndex(i);
        
        // Wait for the DOM to update
        await new Promise(resolve => setTimeout(resolve, 200));

        // Get the ticket element
        const ticketElement = document.querySelector('.modal-ticket');
        if (!ticketElement) continue;

        try {
          // Add PDF-ready class for better rendering
          ticketElement.classList.add('pdf-ready');

          // Capture the ticket as canvas
          const canvas = await html2canvas(ticketElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: ticketElement.offsetWidth,
            height: ticketElement.offsetHeight,
            logging: false,
            removeContainer: true
          });

          // Remove PDF-ready class
          ticketElement.classList.remove('pdf-ready');

          // Convert canvas to image
          const imgData = canvas.toDataURL('image/png', 1.0);

          // Calculate dimensions to fit the ticket on the page
          const imgWidth = pageWidth - 20; // 10mm margin on each side
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Center the image on the page
          const x = 10;
          const y = (pageHeight - imgHeight) / 2;

          // Add the ticket to PDF
          pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

          // Add a new page if this isn't the last ticket
          if (i < selectedBooking.seats.length - 1) {
            pdf.addPage();
          }
        } catch (error) {
          console.error('Error generating PDF for ticket', i, ':', error);
        }
      }

      // Download the PDF
      const fileName = `${selectedBooking.customerName}_tickets_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error in PDF generation:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const getSectionBackgroundColor = (section) => {
    if (!section) return 'linear-gradient(135deg, #E6E6FA 0%, #9370DB 100%)'; // Default purple gradient
    
    const sectionLower = section.toLowerCase();
    
    if (sectionLower.includes('vvip') || sectionLower.includes('premium') || sectionLower.includes('vv') || sectionLower.includes('sponsors')) {
      return 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)'; // Gold gradient
    } else if (sectionLower.includes('vip') || sectionLower.includes('VVV') || sectionLower.includes('vvv')) {
      return 'linear-gradient(to bottom, #cccccc 0%, #474747 0%, #d9d9d9 52%, #3e3e3e 97%)'; // Silver gradient
    } else if (sectionLower.includes('reserved')) {
      return 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)'; // Sky blue gradient
    } else if (sectionLower.includes('standard')) {
      return 'linear-gradient(135deg, #98FB98 0%, #32CD32 100%)'; // Light green gradient
    } else if (sectionLower.includes('general')) {
      return 'linear-gradient(135deg, #F0E68C 0%, #DAA520 100%)'; // Khaki gradient
    } else {
      return 'linear-gradient(135deg, #E6E6FA 0%, #9370DB 100%)'; // Default purple gradient
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
    { header: "#", width: "8%" },
    { header: "Customer", width: "15%" },
    { header: "Event", width: "15%" },
    { header: "Seats", width: "20%" },
    { header: "Booked At", width: "15%" },
    { header: "Actions", width: "20%" }
  ];

  const renderRow = (booking, index) => {
    // Format seats display
    const formatSeats = (seats) => {
      if (!seats) return 'N/A';
      
      try {
        let seatsArray;
        
        if (typeof seats === 'string') {
          // Handle double-escaped JSON by parsing twice if needed
          let parsedSeats = seats;
          
          // First, try to parse normally
          try {
            seatsArray = JSON.parse(parsedSeats);
          } catch (firstError) {
            // If that fails, try parsing the escaped string
            // Replace escaped quotes with regular quotes
            parsedSeats = parsedSeats.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            seatsArray = JSON.parse(parsedSeats);
          }
        } else if (Array.isArray(seats)) {
          seatsArray = seats;
        } else {
          return 'N/A';
        }
        
        return seatsArray.map(seat => 
          `${seat.section} - Seat Number : ${seat.seatNumber}`
        ).join(', ');
      } catch (error) {
        console.error('Error parsing seats:', error);
        return 'N/A';
      }
    };

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
          <small>{formatSeats(booking.seats)}</small>
        </td>
        <td>{new Date(booking.bookingDate).toLocaleString()}</td>
        <td>
          <Button title='View Ticket' className="me-2 bg-transparent border-0" size="sm" onClick={() => handleViewTicket(booking)}>
          <FontAwesomeIcon icon={faInfoCircle} className="me-1" color='#000' size='lg' />
          </Button>
          <Button title='Delete Booking' variant="danger" className="bg-transparent border-0" size="sm" onClick={() => handleDelete(booking._id)}>
           <FontAwesomeIcon icon={faTrash} className="me-1" color='red' size='lg' />
          </Button>
        </td>
      </tr>
    );
  };

  // Get event image for the ticket
  // const eventImage = selectedBooking?.event?.image || 'https://via.placeholder.com/400x300?text=Event+Image';

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
          {/* <div className='pb-4'>
            <SearchField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSubmit={handleSearchSubmit}
              placeholder="Search bookings by customer name, email, or event..."
            />
          </div> */}
          
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

      {/* Booking Ticket Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered id='bookingModal'>
        <Modal.Body className="p-0">
          <div className="position-absolute" style={{ top: '10px', right: '10px', zIndex: 1 }}>
            <button 
              type="button" 
              className="btn-close me-2" 
              onClick={() => setShowModal(false)} 
              aria-label="Close" 
            />
           
          </div>
          {selectedBooking && (
            <>
              <div ref={ticketRef} className="row d-flex flex-wrap bg-white rounded position-relative overflow-hidden modal-ticket">
                {/* Left Ticket Section */}
                <div className="d-flex col-md-8 px-0 position-relative">
                  <img src={eventImage} alt="Event" className="img-fluid h-100"/>
                  
                </div>

                {/* Right Pricing Section */}
                <div 
                  className="col-md-4 p-md-4 text-start ticket-rhs position-relative d-flex align-items-center justify-content-center"
                  style={{
                    background: getSectionBackgroundColor(selectedBooking.seats?.[currentQRIndex]?.section),
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    position: 'relative',
                    minHeight: '400px'
                  }}
                >
                  <div className="position-absolute" style={{ top: '10px', left: '20px', zIndex: 1 }}>
                  <Button
              variant="success"
              size="sm"
              onClick={downloadTicketsAsPDF}
              title="Download All Tickets"
            >
              <FontAwesomeIcon icon={faDownload} className="me-1" />
              Download Tickets
            </Button>
            </div>
                  
                  {/* QR Code Section */}
                  <div className="text-center mt-4">
                    {selectedBooking.seats && selectedBooking.seats.length > 0 && (
                      <>
                        {/* Seat Info Display */}
                        <div className="mb-3">
                          <h6 style={{ color: '#fff', marginBottom: '10px' }}>
                            {selectedBooking.seats[currentQRIndex]?.section} - Row {selectedBooking.seats[currentQRIndex]?.rowNumber}, Seat {selectedBooking.seats[currentQRIndex]?.seatNumber}
                          </h6>
                          {selectedBooking.seats.length > 1 && (
                            <p style={{ color: '#fff', fontSize: '14px' }}>
                              {currentQRIndex + 1} of {selectedBooking.seats.length} tickets
                            </p>
                          )}
                          
                        </div>
                        {/* QR Code Container */}
                        <div className="qr-container">
                          <QRCodeSVG
                            value={`https://tixbook.com/booking/${selectedBooking.seats[currentQRIndex]?.qrCodeToken || selectedBooking._id}`}
                            size={150}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                            key={`qr-${selectedBooking.seats[currentQRIndex]?.qrCodeToken || selectedBooking._id}-${currentQRIndex}`}
                          />

                          {/* Navigation Arrows */}
                          {selectedBooking.seats.length > 1 && (
                            <>
                              <button
                                onClick={() => handleQRNavigation('prev')}
                                className="qr-nav-button prev"
                              >
                                <FontAwesomeIcon icon={faChevronLeft} />
                              </button>
                              <button
                                onClick={() => handleQRNavigation('next')}
                                className="qr-nav-button next"
                              >
                                <FontAwesomeIcon icon={faChevronRight} />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Dots Indicator */}
                        {selectedBooking.seats.length > 1 && (
                          <div className="qr-dots">
                            {selectedBooking.seats.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentQRIndex(index)}
                                className={`qr-dot ${index === currentQRIndex ? 'active' : 'inactive'}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyBookings; 