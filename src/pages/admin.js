import React, { useState } from 'react';
import { Container, Alert, Modal, Button } from 'react-bootstrap';
import DataTable from '../components/common/dataTable';
import CustomPagination from '../components/common/customPagination';
import SearchField from '../components/common/searchField';
import usePagination from '../hooks/listData';
import AdminForm from '../components/admin/adminForm';
import {getAdmin, addAdmin, updateAdmin, deleteAdmin } from '../services/adminService';

const Admin = () => {
  const {
    data: admin,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    loading,
    error,
    refetch
  } = usePagination(getAdmin);

  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // For editing an Admin
  const [modalTitle, setModalTitle] = useState('');

  const handleAdd = () => {
    setSelectedAdmin(null);
    setModalTitle("Add Admin");
    setShowModal(true);
  };


  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setModalTitle("Edit Admin");
    setShowModal(true);
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdmin(id);
        refetch(); 
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (selectedAdmin) {
        await updateAdmin(selectedAdmin._id, formData);
      } else {
        await addAdmin(formData);
      }
      setShowModal(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };


  const columns = [
    { header: "#" },
    { header: "Name" },
    { header: "Email" },
    { header: "Role" },
    { header: "Actions" }
  ];

 
  const renderRow = (data, index) => (
    <tr key={data._id}>
      <td>{(page - 1) * 10 + index + 1}</td>
      <td>{data.name}</td>
      <td>{data.email}</td>
      <td>{data.role}</td>
      <td>
        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(data)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => handleDelete(data._id)}>
          Delete
        </Button>
      </td>
    </tr>
  );

  // Handle search submission by resetting the page (the hook will refetch automatically)
  const handleSearchSubmit = () => {
    setPage(1);
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Admin Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-3">
        <SearchField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={handleSearchSubmit}
          placeholder="Search by name, email..."
        />
      </div>
      <div className="mb-3">
        <Button variant="success" onClick={handleAdd}>Add Admin</Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DataTable columns={columns} data={admin} renderRow={renderRow} />
          <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminForm
            initialData={selectedAdmin}
            onSubmit={handleModalSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Admin;
