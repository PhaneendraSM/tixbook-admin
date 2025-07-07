import React, { useState } from 'react';
import { Container, Alert, Modal, Button } from 'react-bootstrap';
import DataTable from '../components/common/dataTable';
import CustomPagination from '../components/common/customPagination';
import SearchField from '../components/common/searchField';
import usePagination from '../hooks/listData';
import OrganizerForm from '../components/admin/organizerForm';
import { getOrganizer, addOrganizer, updateOrganizer, disableOrganizer, enableOrganizer } from '../services/organizerService';

const Organizer = () => {
  const {
    data: organizers,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    loading,
    error,
    refetch
  } = usePagination(getOrganizer);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null); // For editing an Organizer
  const [modalTitle, setModalTitle] = useState('');
  const [showDisabled, setShowDisabled] = useState(true); // Show all organizers by default

  const handleAdd = () => {
    setSelectedOrganizer(null);
    setModalTitle("Add Organizer");
    setShowModal(true);
  };

  const handleEdit = (organizer) => {
    setSelectedOrganizer(organizer);
    setModalTitle("Edit Organizer");
    setShowModal(true);
  };

  const handleToggleStatus = async (id, isCurrentlyDisabled) => {
    const action = isCurrentlyDisabled ? "enable" : "disable";
    if (window.confirm(`Are you sure you want to ${action} this organizer?`)) {
      try {
        if (isCurrentlyDisabled) {
          await enableOrganizer(id);
        } else {
          await disableOrganizer(id);
        }
        refetch(); 
      } catch (err) {
        alert(err.response?.data?.message || `${action} failed`);
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (selectedOrganizer) {
        await updateOrganizer(selectedOrganizer._id, formData);
      } else {
        await addOrganizer(formData);
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
    { header: "Company" },
    { header: "Contact Number" },
    { header: "Status" },
    { header: "Actions" }
  ];

  const renderRow = (data, index) => (
    <tr key={data._id} className={data.isDisabled ? 'table-secondary' : ''}>
      <td>{(page - 1) * 10 + index + 1}</td>
      <td>{data.name}</td>
      <td>{data.email}</td>
      <td>{data.role}</td>
      <td>{data.company}</td>
      <td>{data.contactNumber}</td>
      <td>
        {data.isDisabled ? (
          <span className="badge bg-danger">Disabled</span>
        ) : (
          <span className="badge bg-success">Active</span>
        )}
      </td>
      <td>
        <Button 
          variant="warning" 
          size="sm" 
          className="me-2" 
          onClick={() => handleEdit(data)}
          disabled={data.isDisabled}
        >
          Edit
        </Button>
        <Button 
          variant={data.isDisabled ? "success" : "danger"} 
          size="sm" 
          onClick={() => handleToggleStatus(data._id, data.isDisabled)}
        >
          {data.isDisabled ? "Enable" : "Disable"}
        </Button>
      </td>
    </tr>
  );

  // Handle search submission by resetting the page (the hook will refetch automatically)
  const handleSearchSubmit = () => {
    setPage(1);
  };

  // Filter organizers based on disabled status
  const filteredOrganizers = showDisabled 
    ? organizers 
    : organizers?.filter(org => !org.isDisabled) || [];

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Organizer Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-3">
        <SearchField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={handleSearchSubmit}
          placeholder="Search by name, email, company..."
        />
      </div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Button variant="success" onClick={handleAdd}>Add Organizer</Button>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="showDisabled"
            checked={showDisabled}
            onChange={(e) => setShowDisabled(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showDisabled">
            Show Disabled Organizers
          </label>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DataTable columns={columns} data={filteredOrganizers} renderRow={renderRow} />
          <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrganizerForm
            initialData={selectedOrganizer}
            onSubmit={handleModalSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Organizer; 