import React from 'react';
import DynamicForm from '../../components/common/form';

const OrganizerForm = ({ initialData, onSubmit, onCancel }) => {
  
  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: initialData ? 'Leave blank to keep unchanged' : 'Enter password',
      required: initialData ? false : true,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'Select role',
      required: true,
      options: [
        { value: 'lead', label: 'Lead' },
        { value: 'assistant', label: 'Assistant' },
        { value: 'manager', label: 'Manager' }
      ]
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text',
      placeholder: 'Enter company name',
      required: true
    },
    {
      name: 'contactNumber',
      label: 'Contact Number',
      type: 'text',
      placeholder: 'Enter contact number',
      required: true
    }
  ];

  return (
    <DynamicForm
      fields={fields}
      initialValues={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitText="Save Organizer"
      cancelText="Cancel"
    />
  );
};

export default OrganizerForm; 