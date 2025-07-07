import React from 'react';
import DynamicForm from '../../components/common/form';

const UserForm = ({ initialData, onSubmit, onCancel }) => {
  
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
  ];

  return (
    <DynamicForm
      fields={fields}
      initialValues={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitText="Save User"
      cancelText="Cancel"
    />
  );
};

export default UserForm;
