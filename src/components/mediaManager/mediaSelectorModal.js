import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import MediaUpload from './mediaUpload';
import MediaLibrary from './mediaLibrary';

const MediaSelectorModal = ({ show, onHide, onSelect, multiple = false }) => {
  const [selected, setSelected] = useState([]);

  const handleDone = () => {
    onSelect(multiple ? selected : selected[0]);
    setSelected([]);
    onHide();
  };

  const handleUpload = (newMedia) => {
    setSelected((prev) => [...prev, newMedia]);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Media</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MediaUpload onUpload={handleUpload} />
        <MediaLibrary selected={selected} onSelect={setSelected} multiple={multiple} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleDone} disabled={selected.length === 0}>Done</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MediaSelectorModal;
