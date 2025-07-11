# Admin Booking Feature

## Overview
This feature allows administrators to create bookings on behalf of customers directly from the admin panel. No payment integration is required - it's purely for seat booking management.

## New Components

### 1. AdminBooking Component (`src/components/events/adminBooking.js`)
- **Purpose**: Allows admins to select events, view seatmaps, and make bookings
- **Features**:
  - Event selection dropdown
  - Interactive seat map with visual seat selection
  - Customer details form (name, email, phone)
  - Real-time price calculation
  - Booking confirmation modal

### 2. MyBookings Page (`src/pages/myBookings.js`)
- **Purpose**: Lists all bookings created by the admin
- **Features**:
  - Search and filter bookings
  - View customer details, event info, and seat information
  - Delete bookings
  - Link to create new bookings

## API Integration

### Booking Service (`src/services/bookingService.js`)
Added `createBooking` function that calls the backend API:
```javascript
POST /api/booking
Body: {
  "seats": "{}", // JSON string of seat data
  "seatId": "", // Primary seat ID
  "eventId": "68078fc209bcb4cbde4c412b"
}
```

## Navigation

### Sidebar Menu Items
- **My Bookings**: Lists admin-created bookings
- **Create Booking**: Opens the booking interface

### Routes
- `/my-bookings`: My Bookings page
- `/admin-booking`: Admin Booking interface

## Workflow

1. **Select Event**: Admin chooses an event from the dropdown
2. **View Seat Map**: Interactive seat map shows available seats with color coding:
   - Gold: VIP seats
   - Purple: Premium seats
   - Light blue: Standard seats
3. **Select Seats**: Click on seats to select/deselect them
4. **Enter Customer Details**: Fill in customer name, email, and optional phone
5. **Confirm Booking**: Review and confirm the booking
6. **View in My Bookings**: All bookings appear in the My Bookings list

## Technical Details

### Seat Map Rendering
- Uses `react-konva` for interactive canvas rendering
- Generates seats based on event's seat configuration
- Supports different seat categories and pricing
- Visual feedback for selected seats

### Data Structure
The booking payload includes:
- `seats`: JSON string containing array of seat objects
- `seatId`: Primary seat identifier
- `eventId`: Event ID
- `customerName`: Customer's name
- `customerEmail`: Customer's email
- `customerPhone`: Customer's phone (optional)

### Error Handling
- Form validation for required fields
- API error handling with user-friendly messages
- Loading states for better UX

## Benefits

1. **No Existing Functionality Disruption**: Completely separate from seat configuration
2. **Clean Separation of Concerns**: Dedicated components for booking vs. seat management
3. **User-Friendly Interface**: Intuitive seat selection and booking process
4. **Comprehensive Management**: Full booking lifecycle management
5. **Scalable Design**: Easy to extend with additional features

## Future Enhancements

- Seat availability checking
- Bulk booking functionality
- Booking modification capabilities
- Export booking data
- Advanced filtering and reporting 