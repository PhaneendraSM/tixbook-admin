// src/components/admin/GenericForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const GenericForm = ({ fields, initialValues = {}, onSubmit, onCancel }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    // initialize form state
    const initVals = initialValues || {};
    const initData = {};
    fields.forEach(field => {
      initData[field.name] =
        initVals[field.name] !== undefined
          ? initVals[field.name]
          : '';
    });
    setData(initData);
  }, [fields, initialValues]);

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = e => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <Form onSubmit={submit}>
      {fields.map(f => (
        <Form.Group key={f.name} className="mb-3">
          <Form.Label>{f.label}</Form.Label>
          <Form.Control 
            type={f.type || 'text'} 
            name={f.name} 
            value={data[f.name]} 
            onChange={handleChange} 
            required={f.required} 
          />
        </Form.Group>
      ))}
      <Button type="submit" className="me-2">Save</Button>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    </Form>
  );
};

export default GenericForm;
