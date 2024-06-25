import React, { useState } from 'react';
import '../css/UpdatePhotoModal.css';

const UpdatePhotoModal = ({ photo, onUpdate, onClose }) => {
  const [newTitle, setNewTitle] = useState(photo.title);
  const [newURL, setNewURL] = useState(photo.thumbnailUrl);

  const handleUpdatePhoto = () => {
    onUpdate(photo.id, newTitle, newURL);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Photo</h2>
        <input
          type="text"
          placeholder="Photo Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={newURL}
          onChange={(e) => setNewURL(e.target.value)}
        />
        <button onClick={handleUpdatePhoto} className="update-photo-button">Update Photo</button>
        <button onClick={onClose} className="close-button">Cancel</button>
      </div>
    </div>
  );
};

export default UpdatePhotoModal;
