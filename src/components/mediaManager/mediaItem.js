import React from 'react';

const MediaItem = ({ media, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(media)}
      style={{
        border: isSelected ? '2px solid #007bff' : '1px solid #ccc',
        padding: 5,
        margin: 5,
        cursor: 'pointer',
        width: 120,
        height: 120,
        overflow: 'hidden',
      }}
    >
      {media.type === 'image' ? (
        <img
          src={media.url}
          alt={media.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <video width="100%" height="100%" controls>
          <source src={media.url} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default MediaItem;
