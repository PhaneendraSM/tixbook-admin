import React from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';

const SearchField = ({ value, onChange, onSubmit, placeholder = "Search...", buttonText = "Search", className = "" }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit} className={className}>
      <InputGroup  className="mb-3">
        <FormControl
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ width: '80%' }}
        />
        <Button style={{ width: '20%' }} type="submit" variant="primary">
          {buttonText}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchField;
