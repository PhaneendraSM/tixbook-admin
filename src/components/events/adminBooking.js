import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import toast from 'react-hot-toast';
import { getAllEvents } from '../../services/eventService';
import { createBooking } from '../../services/bookingService';
import { getSeatingPlanById } from '../../services/eventService';

const AdminBooking = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatingPlan, setSeatingPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      setEvents(response.data?.data || []);
    } catch (err) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSeats = (seatingPlanData) => {
    // Handle the array structure - take the first item
    const plan = Array.isArray(seatingPlanData) ? seatingPlanData[0] : seatingPlanData;
    
    if (!plan || !plan.sections) {
      console.log('No seating plan data:', seatingPlanData);
      return [];
    }
    
    const seats = [];
    const seatWidth = 25;
    const seatHeight = 25;
    const gap = 5;
    const sectionsPerRow = 5; // Show 5 sections per row
    let currentY = gap;

    plan.sections.forEach((section, sectionIndex) => {
      const rowIndex = Math.floor(sectionIndex / sectionsPerRow);
      const colIndex = sectionIndex % sectionsPerRow;
      const x = gap + (colIndex * 200); // 200px width per section group
      const y = currentY + (rowIndex * 150); // 150px height per section group
      
      section.rows.forEach((row, rowIndex) => {
        row.seats.forEach((seat, seatIndex) => {
          seats.push({
            x: x + (seatIndex * (seatWidth + gap)),
            y: y + (rowIndex * (seatHeight + gap)),
            row: row.rowNumber,
            section: section.name,
            seatNumber: seat.seatNumber,
            seatId: seat._id,
            price: seat.price,
            fill: seat.reserved ? '#ccc' : seat.color,
            category: seat.level,
            reserved: seat.reserved,
            originalColor: seat.color
          });
        });
      });
      
      // Update currentY for the next row of sections
      if (colIndex === sectionsPerRow - 1) {
        currentY += 150;
      }
    });
    
    console.log('Generated seats:', seats.length);
    return seats;
  };

  const getSeatColor = (section, rowOverride, categories) => {
    const category = rowOverride !== 'DEFAULT' ? rowOverride : categories[section].category;
    switch(category) {
      case 'VIP':
        return '#FFD700'; // Gold for VIP
      case 'PREMIUM':
        return '#DA70D6'; // Orchid for Premium
      default:
        return 'lightblue'; // Standard
    }
  };

  const handleSeatClick = (seat) => {
    // Check if this is a space seat (empty level and price)
    if (!seat.level && seat.price === 0) {
      toast.error('This is an aisle space and cannot be booked');
      return;
    }
    
    if (seat.reserved) {
      toast.error('This seat is already reserved');
      return;
    }
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.seatId === seat.seatId);
      if (isSelected) {
        return prev.filter(s => s.seatId !== seat.seatId);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleEventSelect = async (event) => {
    setSelectedEvent(event);
    setSelectedSeats([]);
    setSeatingPlan(null);
    
    if (event && event.seatingPlan) {
      try {
        setLoading(true);
        const seatingPlanData = await getSeatingPlanById(event.seatingPlan);
        console.log('Seating plan data received:', seatingPlanData);
        setSeatingPlan(seatingPlanData);
      } catch (err) {
        toast.error('Failed to fetch seating plan');
        console.error('Error fetching seating plan:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBookingSubmit = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    if (!bookingData.customerName || !bookingData.customerEmail) {
      toast.error('Please fill in customer details');
      return;
    }

    try {
      setLoading(true);

      const bookingPayload = {
        seats: selectedSeats.map(seat => ({
          seatId: seat.seatId,
          section: seat.section,
          row: seat.row,
          seatNumber: seat.seatNumber,
          price: seat.price,
          category: seat.category
        })),
        eventId: selectedEvent._id,
        seatId: selectedEvent.seatingPlan, // Add seatmap ID
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone
      };

      await createBooking(bookingPayload);
      toast.success('Booking created successfully!');
      setSelectedSeats([]);
      setBookingData({
        customerName: '',
        customerEmail: '',
        customerPhone: ''
      });
      
      setShowBookingModal(false);
    } catch (err) {
      toast.error('Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
      
      // Refresh the seating layout to show updated seat status
      if (selectedEvent && selectedEvent.seatingPlan) {
        // Use setTimeout to ensure this runs after the loading state is cleared
        setTimeout(async () => {
          try {
            console.log('Refreshing seating plan after booking...');
            const seatingPlanData = await getSeatingPlanById(selectedEvent.seatingPlan);
            console.log('New seating plan data:', seatingPlanData);
            setSeatingPlan(seatingPlanData);
          } catch (err) {
            console.error('Error refreshing seating plan:', err);
          }
        }, 100);
      }
    }
  };

  const generateSeatMapElements = (seatingPlanData, selectedSeats, handleSeatClick) => {
    // Handle the array structure - take the first item
    const plan = Array.isArray(seatingPlanData) ? seatingPlanData[0] : seatingPlanData;
    if (!plan || !plan.sections) return { elements: [], width: 800, height: 600 };

    const seatWidth = 28;
    const seatHeight = 28;
    const seatGap = 8;
    const rowGap = 10;
    const sectionGap = 30;
    const sectionLabelWidth = 90;
    const rowLabelWidth = 0; // Not used, but can be added for row numbers
    let y = 40; // Start below the stage
    let maxRowSeats = 0;
    let elements = [];

    // Draw stage
    elements.push(
      <Rect key="stage-bg" x={sectionLabelWidth} y={0} width={700} height={28} fill="#666" cornerRadius={4} />
    );
    elements.push(
      <Text key="stage-label" x={sectionLabelWidth + 300} y={5} text="STAGE" fontSize={18} fill="#fff" width={120} align="center" />
    );

    plan.sections.forEach((section, sectionIndex) => {
      // Section label
      elements.push(
        <Text
          key={`section-label-${sectionIndex}`}
          x={0}
          y={y + 5}
          text={section.name}
          fontSize={14}
          fill="#444"
          width={sectionLabelWidth - 10}
          align="right"
        />
      );
      let sectionStartY = y;
      section.rows.forEach((row, rowIndex) => {
        // Row label (optional)
        // elements.push(
        //   <Text
        //     key={`row-label-${sectionIndex}-${rowIndex}`}
        //     x={sectionLabelWidth}
        //     y={y + 6}
        //     text={`Row ${row.rowNumber}`}
        //     fontSize={10}
        //     fill="#888"
        //     width={rowLabelWidth}
        //     align="right"
        //   />
        // );
        row.seats.forEach((seat, seatIndex) => {
          // Check if this is a space seat (empty level and price)
          // const isSpace = !seat.level && seat.price === 0;
          const isSpace = (
            (!seat.level || seat.level === '') &&
            (seat.price === 0 || seat.price === null) &&
            (seat.seatNumber === null || seat.seatNumber === undefined)
          ); 
          if (isSpace) {
            // Render space/aisle - just leave empty space
            const seatX = sectionLabelWidth + seatIndex * (seatWidth + seatGap);
            const seatY = y;
            elements.push(
              <Rect
                key={`space-${sectionIndex}-${rowIndex}-${seatIndex}`}
                x={seatX}
                y={seatY}
                width={seatWidth}
                height={seatHeight}
                fill="transparent"
                stroke="#ddd"
                strokeWidth={1}
                strokeDasharray={[3, 3]}
                opacity={0.5}
              />
            );
          } else {
            // Render regular seat
            const seatObj = {
              ...seat,
              seatId: seat._id,
              section: section.name,
              row: row.rowNumber
            };
            const seatX = sectionLabelWidth + seatIndex * (seatWidth + seatGap);
            const seatY = y;
            const isSelected = selectedSeats.some(s => s.seatId === seat._id);
            elements.push(
              <Group key={`seat-${sectionIndex}-${rowIndex}-${seatIndex}`} onClick={() => handleSeatClick(seatObj)}>
                <Rect
                  x={seatX}
                  y={seatY}
                  width={seatWidth}
                  height={seatHeight}
                  fill={isSelected ? '#1976d2' : seat.reserved ? '#e74c3c' : '#43a047'}
                  stroke={isSelected ? '#fff' : seat.reserved ? '#c0392b' : '#222'}
                  strokeWidth={isSelected ? 2 : 1}
                  cornerRadius={6}
                  opacity={seat.reserved ? 0.8 : 1}
                />
                <Text
                  x={seatX}
                  y={seatY + 7}
                  width={seatWidth}
                  text={`${seat.seatNumber}`}
                  fontSize={12}
                  fill={isSelected ? '#fff' : seat.reserved ? '#fff' : '#222'}
                  align="center"
                />
              </Group>
            );
          }
        });
        maxRowSeats = Math.max(maxRowSeats, row.seats.length);
        y += seatHeight + rowGap;
      });
      y += sectionGap;
    });
    // Calculate canvas size
    const width = sectionLabelWidth + maxRowSeats * (seatWidth + seatGap) + 40;
    const height = y + 40;
    return { elements, width, height };
  };

  const seatMap = seatingPlan ? generateSeatMapElements(seatingPlan, selectedSeats, handleSeatClick) : { elements: [], width: 800, height: 600 };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Admin Booking</h1>

      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Select Event</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading events...</p>
              ) : (
                <Form.Select 
                  value={selectedEvent?._id || ''} 
                  onChange={(e) => {
                    const event = events.find(ev => ev._id === e.target.value);
                    handleEventSelect(event);
                  }}
                >
                  <option value="">Choose an event...</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Card.Body>
          </Card>

          {selectedEvent && (
            <Card className="mt-3">
              <Card.Header>
                <h5>Event Details</h5>
              </Card.Header>
              <Card.Body>
                <p><strong>Title:</strong> {selectedEvent.title}</p>
                <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                <p><strong>Venue:</strong> {selectedEvent.venue}</p>
              </Card.Body>
            </Card>
          )}

          {selectedSeats.length > 0 && (
            <Card className="mt-3">
              <Card.Header>
                <h5>Selected Seats ({selectedSeats.length})</h5>
              </Card.Header>
              <Card.Body>
                {selectedSeats.map(seat => (
                  <div key={seat.seatId} className="d-flex justify-content-between mb-2">
                    <span>{seat.section} - Seat {seat.seatNumber}</span>
                    {/* <span>₹{seat.price}</span> */}
                  </div>
                ))}
                <hr />
                {/* <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}</strong>
                </div> */}
                <Button 
                  variant="primary" 
                  className="w-100 mt-3"
                  onClick={() => setShowBookingModal(true)}
                >
                  Book Seats
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>Seat Map</h5>
            </Card.Header>
            <Card.Body>
              {selectedEvent ? (
                <div style={{ overflow: 'auto', maxHeight: '600px', background: '#fafbfc', borderRadius: 8, border: '1px solid #eee' }}>
                  {loading ? (
                    <div className="text-center py-4">
                      <p>Loading seat map...</p>
                    </div>
                  ) : seatingPlan ? (
                    <>
                      <Stage width={seatMap.width} height={seatMap.height}>
                        <Layer>
                          {seatMap.elements}
                        </Layer>
                      </Stage>
                      {/* Legend */}
                      <div style={{ display: 'flex', gap: 24, marginTop: 16, marginLeft: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 18, height: 18, background: '#43a047', borderRadius: 4, border: '1px solid #222' }}></div> <span style={{ fontSize: 13, color: '#222' }}>Available</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 18, height: 18, background: '#1976d2', borderRadius: 4, border: '1px solid #222' }}></div> <span style={{ fontSize: 13, color: '#222' }}>Selected</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 18, height: 18, background: '#e74c3c', borderRadius: 4, border: '1px solid #c0392b' }}></div> <span style={{ fontSize: 13, color: '#222' }}>Booked</span></div>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-muted">No seating plan available for this event</p>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted">Please select an event to view the seat map</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name *</Form.Label>
              <Form.Control
                type="text"
                value={bookingData.customerName}
                onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                placeholder="Enter customer name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Customer Email *</Form.Label>
              <Form.Control
                type="email"
                value={bookingData.customerEmail}
                onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})}
                placeholder="Enter customer email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Customer Phone</Form.Label>
              <Form.Control
                type="tel"
                value={bookingData.customerPhone}
                onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
                placeholder="Enter customer phone (optional)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBookingSubmit}
            disabled={loading}
          >
            {loading ? 'Creating Booking...' : 'Confirm Booking'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminBooking; 