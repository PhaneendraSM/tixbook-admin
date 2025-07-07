import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MediaItem from './mediaItem';
import {list} from '../../services/mediaService';

const MediaLibrary = ({ selected, onSelect, multiple }) => {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    // Fetch media items from the server
    list().then((res) => setMediaList(res.data));
    // axios.get('/api/media').then((res) => setMediaList(res.data));
  }, []);

  const handleSelect = (media) => {
    if (multiple) {
      const alreadySelected = selected.find((m) => m._id === media._id);
      if (alreadySelected) {
        onSelect(selected.filter((m) => m._id !== media._id));
      } else {
        onSelect([...selected, media]);
      }
    } else {
      onSelect([media]);
    }
  };

  return (
    <div className="d-flex flex-wrap">
      {mediaList.map((media) => (
        <MediaItem
          key={media._id}
          media={media}
          isSelected={selected.some((m) => m._id === media._id)}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default MediaLibrary;
