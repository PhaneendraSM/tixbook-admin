import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Button, ProgressBar, Row, Col, Card } from 'react-bootstrap';
import EventForm from '../components/events/eventForm';
import GalleryUpload from '../components/events/galleryUpload';
import SeatmapSelect from '../components/events/seatmapSelect';
import CommissionSettings from '../components/events/commissionSettings';
import { addEvent, updateEvent, getEventById } from '../services/eventService';
import toast, { Toaster } from 'react-hot-toast';

const AddEventFlow = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); // Check for edit mode
  const isEditMode = !!eventId;

  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({});
  const [savedEventId, setSavedEventId] = useState(eventId || null); // support both add/edit
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 4;
  const stepTitles = ['Event Details', 'Gallery Upload', 'Seatmap Selection', 'Commission Settings'];

  useEffect(() => {
    if (isEditMode) {
      // Fetch existing event data for editing
      getEventById(eventId)
        .then(res => {
          setEventData(res);
        })
        .catch(() => toast.error('Failed to load event data'));
    }
  }, [eventId]);

  const saveEventData = async (newData) => {
    try {
      setIsSaving(true);
      console.log('New data received:', newData); // Debug log
      console.log('Current event data:', eventData); // Debug log
      const updatedData = { ...eventData, ...newData };
      console.log('Updated data to save:', updatedData); // Debug log
      
      if (isEditMode) {
        await updateEvent(eventId, updatedData);
        toast.success('Event updated successfully!');
      } else if (savedEventId) {
        // If we have a saved event ID, update the existing event
        await updateEvent(savedEventId, updatedData);
        toast.success('Event updated successfully!');
      } else {
        // First time saving - create new event
        const response = await addEvent(updatedData);
        const newEventId = response.data._id || response._id;
        setSavedEventId(newEventId);
        toast.success('Event saved successfully!');
      }
      
      setEventData(updatedData);
      return true;
    } catch (err) {
      console.error('Save error details:', err); // Debug log
      toast.error(err.response?.data?.message || 'Failed to save event');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async (data) => {
    // Save the current step data
    const saveSuccess = await saveEventData(data);
    
    if (saveSuccess) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => setStep(prev => prev - 1);
  const handleCancel = () => setTimeout(() => navigate('/events'), 100);

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateEvent(eventId, eventData);
        toast.success('Event updated successfully!');
      } else if (savedEventId) {
        // If we have a saved event ID, update the existing event
        await updateEvent(savedEventId, eventData);
        toast.success('Event updated successfully!');
      } else {
        // First time saving - create new event
        const response = await addEvent(eventData);
        const newEventId = response.data._id || response._id;
        setSavedEventId(newEventId);
        toast.success('Event added successfully!');
      }
      setTimeout(() => navigate('/events'), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    }
  };

  const goToSeatingEditor = () => navigate('/seating-editor');

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return (
          <EventForm
            initialData={eventData}
            onSubmit={handleNext}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        );
      case 2:
        return (
          <GalleryUpload
            eventId={savedEventId}
            onNext={handleNext}
            onBack={handleBack}
            isSaving={isSaving}
          />
        );
      case 3:
        return (
           <SeatmapSelect
            eventId={savedEventId}
            initialData={eventData}
            onBack={handleBack}
            onSaveEvent={handleSubmit}
            onCreateSeatmap={goToSeatingEditor}
            onNext={handleNext}
            isSaving={isSaving}
          />
        );
        case 4:
        return (
         <CommissionSettings
      initialData={eventData}
      onBack={handleBack}
      onSaveEvent={async (commissionData) => {
        const fullData = { ...eventData, ...commissionData };
        setEventData(fullData);
        try {
          if (isEditMode) {
            await updateEvent(eventId, fullData);
            toast.success('Event updated successfully!');
          } else if (savedEventId) {
            // If we have a saved event ID, update the existing event
            await updateEvent(savedEventId, fullData);
            toast.success('Event updated successfully!');
          } else {
            // First time saving - create new event
            const response = await addEvent(fullData);
            const newEventId = response.data._id || response._id;
            setSavedEventId(newEventId);
            toast.success('Event added successfully!');
          }
          navigate('/events');
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to save event');
        }
      }}
      isSaving={isSaving}
    />
        );
      default:
        return null;
    }
  };

  return (
    <Container className="mt-4">
      <Toaster position="top-right" />
      <Card>
        <Card.Header>
          <h4 className="mb-0">{isEditMode ? 'Edit Event' : 'Add New Event'}</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                {stepTitles.map((title, index) => (
                  <div
                    key={index}
                    className={`text-center flex-fill d-flex flex-column align-items-center ${index + 1 === step ? 'text-primary' : 'text-muted'}`}
                  >
                    <div className={`rounded-circle border border-2 ${index + 1 <= step ? 'bg-primary text-white' : 'bg-light'} mb-1`} style={{ width: '30px', height: '30px', lineHeight: '30px' }}>
                      {index + 1}
                    </div>
                    <small>{title}</small>
                  </div>
                ))}
              </div>
              <ProgressBar now={(step / totalSteps) * 100} className="mt-2" />
            </Col>
          </Row>
          {renderStepComponent()}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddEventFlow;
