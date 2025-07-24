// src/pages/Events.js
import React, { useState } from 'react';
import { Container, Alert, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/common/dataTable';
import CustomPagination from '../components/common/customPagination';
import SearchField from '../components/common/searchField';
import usePagination from '../hooks/listData';
import EventForm from '../components/events/eventForm';
import {getEvents, addEvent, updateEvent, deleteEvent, publishEventById } from '../services/eventService';
import { Pencil, Trash2, CircleCheckBig, FilePen} from 'lucide-react'; 
import toast from 'react-hot-toast';

const Events = () => {
  const {
    data: events,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    loading,
    error,
    refetch
  } = usePagination(getEvents);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // For editing an event
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
const [confirmAction, setConfirmAction] = useState(null); // 'publish' or 'draft'
const [actionEventId, setActionEventId] = useState(null);

  // Open modal for adding a new event
  const handleAdd = () => {
    setSelectedEvent(null);
    // setModalTitle("Add Event");
    // setShowModal(true);
    navigate('/events/new');
  };

  // Open modal for editing an existing event
  const handleEdit = (event) => {
    setSelectedEvent(event);
    // setModalTitle("Edit Event");
    // setShowModal(true);
    navigate(`/events/edit/${event._id}`);
  };

  // Delete an event after confirmation
  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        toast.success("Event deleted successfully");
        refetch(); // Reload events after deletion
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  //  const handlePublish = async (eventId) => {
  //   if (window.confirm("Are you sure you want to publish this event?")) {
  //     try {
  //       await publishEventById(eventId, { status: 'published' });
  //        toast.success("Event published successfully");
  //       refetch(); // Reload events after deletion
  //     } catch (err) {
  //      toast.error(err.response?.data?.message || "Publish failed");
  //     }
  //   }
  // };

  // const handleDraft = async (eventId) => {
  //   if (window.confirm("Are you sure you want to draft this event?")) {
  //     try {
  //       await publishEventById(eventId, { status: 'draft' });
  //        toast.success("Event marked as draft");
  //       refetch(); // Reload events after deletion
  //     } catch (err) {
  //      toast.error(err.response?.data?.message || "Draft failed");
  //     }
  //   }
  // };


  const handlePublish = (eventId) => {
  setConfirmAction('publish');
  setActionEventId(eventId);
  setShowConfirmModal(true);
};

const handleDraft = (eventId) => {
  setConfirmAction('draft');
  setActionEventId(eventId);
  setShowConfirmModal(true);
};

  // Submit handler for the EventForm modal (for add/edit)
  const handleModalSubmit = async (formData) => {
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, formData);
      } else {
        console.log(formData);
        await addEvent(formData);
      }
      setShowModal(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  // Define the table columns for events
  const columns = [
    { header: "#" },
    { header: "Title" },
    { header: "Date" },
    { header: "Venue" },
    { header: "Status" },
    { header: "Actions" }
  ];

  // Render each event row using the DataTable component's renderRow function
  const renderRow = (event, index) => (
    <tr key={event._id}>
      <td>{(page - 1) * 10 + index + 1}</td>
      <td>{event.title}</td>
      <td>{new Date(event.date).toLocaleDateString()}</td>
      <td>{event.venue}</td>
      <td>{event.status === 'publish' ? 'Published' : 'Draft'}</td>
      <td className='event-actions'>
          {/* Edit */}
          <a
            className="me-2 border-0 me-3"
            onClick={() => handleEdit(event)}
            title="Edit Event"
          >
            <Pencil className="text-primary" />
          </a>

          {/* Publish */}
          <a
            className="border-0 me-3"
            onClick={() => handlePublish(event._id)}
            title="Publish Event"
          >
            <CircleCheckBig className="text-success" />
          </a>

          {/* Draft */}
          <a
            className="border-0 me-3"
            onClick={() => handleDraft(event._id)}
            title="Move to Draft"
          >
            <FilePen className="text-warning" />
          </a>

          {/* Delete */}
          <a
            className="border-0 me-3"
            onClick={() => handleDelete(event._id)}
            title="Delete Event"
          >
            <Trash2 className="text-danger" />
          </a>
        </td>
    </tr>
  );

  // Handle search submission by resetting the page (the hook will refetch automatically)
  const handleSearchSubmit = () => {
    setPage(1);
  };

  return (
    <><Container className="mt-4">
      <h1 className="mb-4">Event Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-3">
        <SearchField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={handleSearchSubmit}
          placeholder="Search by title, venue..." />
      </div>
      <div className="mb-3">
        <Button variant="success" onClick={handleAdd}>Add Event</Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DataTable columns={columns} data={events} renderRow={renderRow} />
          <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
      <Modal size='xl' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm
            initialData={selectedEvent}
            onSubmit={handleModalSubmit}
            onCancel={() => setShowModal(false)} />
        </Modal.Body>
      </Modal>
    </Container><Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {confirmAction === 'publish' ? 'Confirm Publish' : 'Confirm Draft'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {confirmAction} this event?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant={confirmAction === 'publish' ? 'success' : 'warning'}
            onClick={async () => {
              try {
                await publishEventById(actionEventId, { status: confirmAction });
                toast.success(
                  `Event ${confirmAction === 'publish' ? 'published' : 'marked as draft'} successfully`
                );
                refetch();
              } catch (err) {
                toast.error(err.response?.data?.message || 'Operation failed');
              } finally {
                setShowConfirmModal(false);
              }
            } }
          >
            Yes, {confirmAction}
          </Button>
        </Modal.Footer>
      </Modal></>


  );
};

export default Events;
