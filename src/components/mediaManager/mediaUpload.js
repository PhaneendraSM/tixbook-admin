import React, { useState } from 'react';
import axios from 'axios';
import { create } from '../../services/mediaService';
import { toast } from 'react-hot-toast';

const MediaUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);

    try {
      const res = await create(formData)// backend API
      onUpload(res.data); // push new media to library
      setFile(null);
    } catch (err) {
      toast.error('Upload failed! Please try again later.');
    }
  };

  return (
    <div className="mb-3">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="btn btn-primary mt-2" onClick={handleUpload} disabled={!file}>
        Upload
      </button>
    </div>
  );
};

export default MediaUpload;
