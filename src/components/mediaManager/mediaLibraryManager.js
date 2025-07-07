import React, { useState } from 'react';
import { Container, Alert, Modal, Button } from 'react-bootstrap';
import DataTable from '../common/dataTable';
import CustomPagination from '../common/customPagination';
import SearchField from '../common/searchField';
import usePagination from '../../hooks/listData';
import DynamicForm from '../common/form';
import * as mediaService from '../../services/mediaService';
import MediaUpload from './mediaUpload';

const fields = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter media title',
    required: true
  },
  {
    name: 'url',
    label: 'Image URL',
    type: 'text',
    placeholder: 'Enter image URL',
    required: true
  }
];

const MediaLibraryManager = () => {
  const {
    data: mediaItems,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    loading,
    error,
    refetch
  } = usePagination(mediaService.list);

  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  

  const handleAdd = () => {
    setSelectedMedia(null);
    setModalTitle('Add Media');
    setShowModal(true);
  };

  const handleEdit = (media) => {
    setSelectedMedia(media);
    setModalTitle('Edit Media');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      try {
        await mediaService.remove(id);
        refetch();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (selectedMedia) {
        await mediaService.update(selectedMedia._id, formData);
      } else {
        await mediaService.create(formData);
      }
      setShowModal(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleSearchSubmit = () => {
    setPage(1);
  };

  const columns = [
    { header: '#' },
    { header: 'Preview' },
    { header: 'Title' },
    { header: 'Actions' }
  ];

  const renderRow = (data, index) => (
    <tr key={data._id}>
      <td>{(page - 1) * 10 + index + 1}</td>
      <td>
        <img src={data.url} alt={data.title} height="50" />
      </td>
      <td>{data.title}</td>
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

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Media Library</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-3">
        <SearchField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={handleSearchSubmit}
          placeholder="Search by title..."
        />
      </div>
      <div className="mb-3">
        <Button variant="success" onClick={handleAdd}>Add Media</Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DataTable columns={columns} data={mediaItems} renderRow={renderRow} />
          <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
   <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>{modalTitle}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <MediaUpload
      onUpload={async (uploadedMedia) => {
        try {
          await mediaService.create({
            title: uploadedMedia.originalFilename,
            url: uploadedMedia.url
          });
          setShowModal(false);
          refetch();
        } catch (err) {
          alert(err.response?.data?.message || 'Upload failed');
        }
      }}
    />
  </Modal.Body>
</Modal>



    </Container>
  );
};

export default MediaLibraryManager;
