// src/components/Photos.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import '../css/Photos.css';

const Photos = () => {
  const { userId, albumId } = useParams();
  const { user } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/photos?albumId=${albumId}`);
        setPhotos(response.data);
      } catch (err) {
        console.error('Error fetching photos', err);
      }
    };

    fetchPhotos();
  }, [albumId]);

  return (
    <div className="photos-container">
      <h2>Photos in Album {albumId} for User {userId}</h2>
      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Photos;
