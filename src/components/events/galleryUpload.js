import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GalleryUpload = ({ eventId, onNext, onBack }) => {
  return (
    <div>
      <h4>Choose Gallery Images</h4>
      {/* Add upload UI here */}

        <p>Upload images for your event gallery. You can add multiple images at once.</p>

      <div className="mt-3 d-flex justify-content-end">
        <Button variant="secondary" className='me-3' onClick={onBack}>Back</Button>{' '}
        <Button variant="primary" onClick={() => onNext({ gallery: [] })}>Next</Button>
      </div>
    </div>
  );
};

export default GalleryUpload;
