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
        <h2>Add Photo</h2>
        <input
          type="text"
          placeholder="Photo Title"
          value={photoTitle}
          onChange={(e) => setPhotoTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
        <button onClick={handleAddPhoto} className="add-photo-button">Add Photo</button>
        <button onClick={onClose} className="close-button">Cancel</button>
      </div>
    </div>
  );
};

export default AddPhotoModal;
