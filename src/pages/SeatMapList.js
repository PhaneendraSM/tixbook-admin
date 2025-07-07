import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Pagination } from 'react-bootstrap';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getSeatingPlan, deleteSeatingPlanById } from '../services/eventService';
import toast from 'react-hot-toast';

const SeatMapList = () => {
  const [seatMaps, setSeatMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    loadSeatMaps();
  }, [currentPage]);

  const loadSeatMaps = async () => {
    try {
      setLoading(true);
      const response = await getSeatingPlan(currentPage, '', limit);
      const { data, total, totalPages: pages } = response;
      setSeatMaps(data);
      setTotalPages(pages);
      setTotalItems(total);
    } catch (error) {
      console.error('Error loading seat maps:', error);
      toast.error('Failed to load seat maps');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/seating-editor');
  };

  const handleEdit = (id) => {
    navigate(`/seating-editor/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this seat map?')) {
      try {
        await deleteSeatingPlanById(id);
        toast.success('Seat map deleted successfully');
        loadSeatMaps(); // Reload the list
      } catch (error) {
        console.error('Error deleting seat map:', error);
        toast.error('Failed to delete seat map');
      }
    }
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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Seat Maps</h1>
          <p className="text-muted mb-0">Total: {totalItems} seat maps</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleCreateNew}
          className="d-flex align-items-center gap-2"
        >
          <Plus size={18} /> Create New Seat Map
        </Button>
      </div>

      <Row className="g-4 mb-4">
        {seatMaps.map((seatMap) => (
          <Col key={seatMap._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-start">
                  <span className="">{seatMap.name}</span>
                  <div className="btn-group">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleEdit(seatMap._id)}
                      className="d-flex align-items-center"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(seatMap._id)}
                      className="d-flex align-items-center"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text className="text-muted small">
                  Created: {new Date(seatMap.updatedAt).toLocaleDateString()} 
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-transparent border-top-0">
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={() => handleEdit(seatMap._id)}
                >
                  Edit Seat Map
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination>
            {renderPagination()}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default SeatMapList; 