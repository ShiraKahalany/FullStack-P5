import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import '../css/PhotoModal.css';


const UpdatePhotoModal = ({ photo, onUpdate, onClose }) => {
  const [title, setTitle] = useState(photo.title);
  const [url, setUrl] = useState(photo.url);

  const handleUpdate = () => {
    onUpdate(photo.id, title, url);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Update Photo</h2>
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
        <button onClick={handleUpdate}>Update</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

UpdatePhotoModal.propTypes = {
  photo: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UpdatePhotoModal;
