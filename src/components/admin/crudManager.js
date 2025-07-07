// src/components/admin/CrudManager.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import GenericForm from './genericForm';

const CrudManager = ({ 
  title, 
  service,      // e.g. '/categories', '/genres', '/languages'
  columns,       // [ { key: 'name', label: 'Name' }, ... ]
  formFields     // [ { name: 'name', label: 'Name', type: 'text' }, ... ]
}) => {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchItems = async () => {
    console.log("CrudManager: fetching items from service", service);
    const res = await service.list();
    console.log("CrudManager: fetched itemssssssss", res.data);
    setItems(res.data);
  };

  useEffect(() => {
    console.log("CrudManager: fetching items from service", service);
    if (!service || typeof service.list !== 'function') {
      console.error('CrudManager: missing or invalid `service` prop', service);
      return;
    }
    fetchItems();
  }, [service]);

  const handleSave = async data => {
    if (editing) {
      await service.update(editing._id, data);
    } else {
      await service.create(data);
    }
    setShow(false);
    setEditing(null);
    fetchItems();
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this item?')) {
      await service.remove(id);
      fetchItems();
    }
  };

  return (
    <>
      <h4 className="mb-3">{title}</h4>
      <Button onClick={() => { setEditing(null); setShow(true); }} className="mb-2">
        Add {title}
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map(item => (
            <tr key={item._id}>
              {columns.map(c => <td key={c.key}>{item[c.key]}</td>)}
              <td>
                <Button size="sm" onClick={() => { setEditing(item); setShow(true); }}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit' : 'Add'} {title.slice(0, -1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GenericForm 
            fields={formFields} 
            initialValues={editing} 
            onSubmit={handleSave} 
            onCancel={() => setShow(false)} 
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CrudManager;
