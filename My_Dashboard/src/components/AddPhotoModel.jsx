import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import '../css/PhotoModal.css';

const AddPhotoModal = ({ albumId, onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    onAdd(albumId, title, url);
    setTitle('');
    setUrl('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Photo</h2>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

AddPhotoModal.propTypes = {
  albumId: PropTypes.number.isRequired,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddPhotoModal;
