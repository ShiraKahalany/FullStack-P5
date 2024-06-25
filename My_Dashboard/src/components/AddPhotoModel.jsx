import React, { useState } from 'react';
import '../css/AddPhotoModal.css';

const AddPhotoModal = ({ albumId, onAdd, onClose }) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');

  const handleAddPhoto = () => {
    onAdd(albumId, photoTitle, photoUrl);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Photo</h2>
        <input
          type="text"
          placeholder="Add Title"
          value={photoTitle}
          onChange={(e) => setPhotoTitle(e.target.value)}
          className="modal-input"
        />
        <input
          type="text"
          placeholder="Add URL"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button onClick={handleAddPhoto} className="add-photo-button">Add</button>
          <button onClick={onClose} className="close-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddPhotoModal;
