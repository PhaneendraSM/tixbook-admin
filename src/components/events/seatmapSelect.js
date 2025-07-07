import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getSeatingPlan } from '../../services/eventService';
import toast from 'react-hot-toast';

const SeatmapSelect = ({ eventId, onBack, onSaveEvent, onCreateSeatmap, onNext, initialData }) => {
  const [seatmaps, setSeatmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeatmap, setSelectedSeatmap] = useState(initialData?.seatingPlan || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    loadSeatmaps();
  }, [currentPage]);

  const loadSeatmaps = async () => {
    try {
      setLoading(true);
      const response = await getSeatingPlan(currentPage, '', limit);
      if (response && response.data) {
        setSeatmaps(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
      } else {
        console.error('Invalid seatmap response:', response);
        toast.error('Failed to load seatmaps');
      }
    } catch (error) {
      console.error('Error loading seatmaps:', error);
      toast.error('Failed to load seatmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatmapSelect = (seatmapId) => {
    setSelectedSeatmap(seatmapId);
  };

  const handleNext = () => {
    if (!selectedSeatmap) {
      toast.error('Please select a seatmap or create a new one');
      return;
    }
    onNext({ seatingPlan: selectedSeatmap });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    items.push(
      <Pagination.First 
        key="first" 
        onClick={() => handlePageChange(1)} 
        disabled={currentPage === 1}
      />
    );

    // Previous page
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      />
    );

    // Page numbers
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Next page
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      />
    );

    // Last page
    items.push(
      <Pagination.Last 
        key="last" 
        onClick={() => handlePageChange(totalPages)} 
        disabled={currentPage === totalPages}
      />
    );

    return items;
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0">Select Seat Map</h4>
          <p className="text-muted mb-0">Total: {totalItems} seatmaps</p>
        </div>
        <Button variant="outline-primary" onClick={onCreateSeatmap}>
          Create New Seat Map
        </Button>
      </div>

      <Row className="g-4">
        {seatmaps.map((seatmap) => (
          <Col key={seatmap._id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              className={`h-100 cursor-pointer ${selectedSeatmap === seatmap._id ? 'border-primary' : ''}`}
              onClick={() => handleSeatmapSelect(seatmap._id)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <Form.Check
                  type="radio"
                  id={`seatmap-${seatmap._id}`}
                  checked={selectedSeatmap === seatmap._id}
                  onChange={() => handleSeatmapSelect(seatmap._id)}
                  label={`${seatmap.name}`}
                  className="mb-2"
                />
                <Card.Text className="text-muted small">
                  Created: {new Date(seatmap.updatedAt).toLocaleDateString()}
                </Card.Text>
                <Card.Text className="small">
                  Sections: {seatmap.sections?.length || 0}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {renderPagination()}
          </Pagination>
        </div>
      )}

      <div className="mt-4 d-flex justify-content-end">
        <Button variant="secondary" className='me-3' onClick={onBack}>Back</Button>
        <Button 
          variant="primary" 
          onClick={handleNext}
          disabled={!selectedSeatmap}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SeatmapSelect;
