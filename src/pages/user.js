// src/pages/Users.js
import React, { useState }  from 'react';
import { Container, InputGroup, FormControl, Button, Alert, Table, Modal } from 'react-bootstrap';
import CustomPagination from '../components/common/customPagination';
import usePagination from '../hooks/listData';
import SearchField from '../components/common/searchField';
import DataTable from '../components/common/dataTable';
import { deleteUsers, getUsers, updateUser } from '../services/userService';
import UserForm from '../components/admin/userForm';

const Users = () => {
  const { data: users, search, setSearch, page, setPage, totalPages, loading, error, refetch } =
    usePagination(getUsers);

    const [showModal, setShowModal] = useState(false);
      const [selectedAdmin, setSelectedAdmin] = useState(null); // For editing an Admin
      const [modalTitle, setModalTitle] = useState('');
    
    //   const handleAdd = () => {
    //     setSelectedAdmin(null);
    //     setModalTitle("Add Admin");
    //     setShowModal(true);
    //   };


    //     const handleEdit = (admin) => {
    //       setSelectedAdmin(admin);
    //       setModalTitle("Edit Admin");
    //       setShowModal(true);
    //     };
      
      
    //     const handleDelete = async (id) => {
    //       if (window.confirm("Are you sure you want to delete this admin?")) {
    //         try {
    //           await deleteAdmin(id);
    //           refetch(); 
    //         } catch (err) {
    //           alert(err.response?.data?.message || "Delete failed");
    //         }
    //       }
    //     };
      
        const handleModalSubmit = async (formData) => {
          try {
            if (selectedAdmin) {
              await updateUser(selectedAdmin._id, formData);
            } 
            setShowModal(false);
            refetch();
          } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
          }
        };

         const handleEdit = (admin) => {
          setSelectedAdmin(admin);
          setModalTitle("Edit User");
          setShowModal(true);
        };
      
      
        const handleDelete = async (id) => {
          if (window.confirm("Are you sure you want to delete this admin?")) {
            try {
              await deleteUsers(id);
              refetch(); 
            } catch (err) {
              alert(err.response?.data?.message || "Delete failed");
            }
          }
        };

    const handleSearchSubmit = () => {
        setPage(1);
      };


      const columns = [
        { header: "#" },
        { header: "Name" },
        { header: "Email" }
      ];

      const renderRow = (user, index) => (
        <tr key={user._id}>
          <td>{(page - 1) * 10 + index + 1}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
           <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>
                    Delete
                  </Button>
                </td>
        </tr>
      );


  return (
    <Container className="mt-4">
      <h1 className="mb-4">User Management</h1>
      {/* {error && <Alert variant="danger">{error}</Alert>} */}
      <div className='pb-4'>
        <SearchField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSubmit={handleSearchSubmit}
            placeholder="Search by name or email"
        />
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DataTable columns={columns} data={users} renderRow={renderRow} />
          <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
       <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm
            initialData={selectedAdmin}
            onSubmit={handleModalSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Users;
