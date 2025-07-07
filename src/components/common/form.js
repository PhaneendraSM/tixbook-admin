import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const DynamicForm = ({
  fields,
  initialValues = {}, // Default to an empty object
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel"
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Use initialValues or an empty object as a safe fallback
    const safeInitialValues = initialValues || {};
    const initData = {};
    console.log("Initializing form with fields:", fields); // Debug log
    console.log("Initial values:", safeInitialValues); // Debug log
    
    fields.forEach(field => {
      let value = safeInitialValues[field.name];

      if (field.type === "date" && value) {
        value = new Date(value).toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      }

      initData[field.name] =
        value !== undefined
          ? value
          : field.type === "checkbox"
          ? false
          : "";
      
      console.log(`Field ${field.name}:`, initData[field.name]); // Debug log
    });
    
    console.log("Final init data:", initData); // Debug log
    setFormData(initData);
  }, [fields, initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    console.log("Field Value:", fieldValue); // Debugging line
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Before Submit:", formData); // Debugging line
    console.log("Form Data Keys:", Object.keys(formData)); // Debug log
    console.log("Map field value:", formData.map); // Debug log
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit} className='row'>
      {fields.map(field => {
        switch (field.type) {
          case "text":
          case "email":
          case "password":
          case "date":
          case "number":
            return (
              <Form.Group key={field.name} controlId={`form-${field.name}`} className="mb-3 col-md-6">
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                />
              </Form.Group>
            );
          case "textarea":
            return (
              <Form.Group key={field.name} controlId={`form-${field.name}`} className="mb-3 col-md-6">
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  as="textarea"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                />
              </Form.Group>
            );
          case "select":
            return (
              <Form.Group key={field.name} controlId={`form-${field.name}`} className="mb-3 col-md-6">
                <Form.Label>{field.label}</Form.Label>
                <Form.Select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                >
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            );
          case "checkbox":
            return (
              <Form.Group key={field.name} controlId={`form-${field.name}`} className="mb-3 col-md-6">
                <Form.Check
                  type="checkbox"
                  name={field.name}
                  label={field.label}
                  checked={!!formData[field.name]}
                  onChange={handleChange}
                />
              </Form.Group>
            );
            case "radio":
              return (
                <Form.Group key={field.name} controlId={`form-${field.name}`} className="mb-3 col-md-6">
                  <Form.Label>{field.label}</Form.Label>
                  <div className='d-flex gap-2'>
                  {field.options?.map(option => (
                    <Form.Check
                      key={option.value}
                      type="radio"
                      name={field.name}
                      label={option.label}
                      value={option.value}
                      checked={formData[field.name] === option.value}
                      onChange={handleChange}
                      className='pet-radio'
                    />
                  ))}
                  </div>
                 
                </Form.Group>
              );
            case "time":
              return (
                <Form.Group key={field.name} controlId={`form-${field.name}`} className="mb-3 col-md-6">
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="time"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </Form.Group>
              );
          default:
            return null;
        }
      })}
      <div className='d-flex justify-content-end mt-4'>
          {onCancel && (
        <Button variant="secondary" onClick={onCancel} className="me-3">
          {cancelText}
        </Button>
      )}
         <Button variant="primary" type="submit" >
        {submitText}
      </Button>
      </div>
     
    </Form>
  );
};

export default DynamicForm;
