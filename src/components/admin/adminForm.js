import React from 'react';
import DynamicForm from '../../components/common/form';

const AdminForm = ({ initialData, onSubmit, onCancel }) => {
  
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
      placeholder: initialData ? 'Leave blank to keep unchanged' : 'Enter Role',
      required: initialData ? false : true,
      options :[
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'eventmanager', label: 'Event Manager' },
        { value: 'eventcreator', label: 'Event Creator' },
]
    },
  ];

  return (
    <DynamicForm
      fields={fields}
      initialValues={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitText="Save Admin"
      cancelText="Cancel"
    />
  );
};

export default AdminForm;
