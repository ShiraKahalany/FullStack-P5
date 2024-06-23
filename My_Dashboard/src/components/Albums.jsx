import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import albumBackground from '../img/album-background.jpg';
import emptyAlbum from '../img/empty_album.png';
import '../css/Albums.css';

const Albums = () => {
  const { user } = useContext(AuthContext);
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newPhoto, setNewPhoto] = useState(null); // New state for photo upload
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchAlbums();
    }
  }, [user]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/albums?userId=${user.id}`);
      setAlbums(response.data);
    } catch (err) {
      console.error('Error fetching albums', err);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAlbumClick = async (album) => {
    setSelectedAlbum(album);
    setCurrentPhotoIndex(0);
    fetchPhotos(album.id);
  };

  const fetchPhotos = async (albumId) => {
    try {
      const response = await axios.get(`http://localhost:3000/photos?albumId=${albumId}`);
      setPhotos(response.data);
    } catch (err) {
      console.error('Error fetching photos', err);
    }
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const handleAddAlbum = async () => {
    if (newAlbumTitle.trim()) {
      try {
        const { data: runningIdData } = await axios.get('http://localhost:3000/running_id?type=albums_id');
        const newId = runningIdData[0].number;

        await axios.put('http://localhost:3000/running_id/1', {
          type: 'albums_id',
          number: newId + 1
        });

        const response = await axios.post('http://localhost:3000/albums', {
          id: newId,
          userId: user.id,
          title: newAlbumTitle,
        });
        setAlbums([...albums, response.data]);
        setNewAlbumTitle('');
      } catch (err) {
        console.error('Error adding album', err);
      }
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await axios.delete(`http://localhost:3000/photos/${photoId}`);
      setPhotos(photos.filter(photo => photo.id !== photoId));
    } catch (err) {
      console.error('Error deleting photo', err);
    }
  };

  const handleUpdatePhoto = async (photoId, newTitle) => {
    try {
      const response = await axios.patch(`http://localhost:3000/photos/${photoId}`, { title: newTitle });
      setPhotos(photos.map(photo => (photo.id === photoId ? response.data : photo)));
    } catch (err) {
      console.error('Error updating photo', err);
    }
  };

  const handleFileChange = (e) => {
    setNewPhoto(e.target.files[0]);
  };

  const handleUploadPhoto = async () => {
    if (newPhoto && selectedAlbum) {
      try {
        const { data: runningIdData } = await axios.get('http://localhost:3000/running_id?type=photos_id');
        const newId = runningIdData[0].number;

        await axios.put('http://localhost:3000/running_id/3', {
          type: 'photos_id',
          number: newId + 1
        });

        const formData = new FormData();
        formData.append('albumId', selectedAlbum.id);
        formData.append('id', newId);
        formData.append('title', newPhoto.name);
        formData.append('url', URL.createObjectURL(newPhoto));

        const response = await axios.post('http://localhost:3000/photos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPhotos([...photos, response.data]);
        setNewPhoto(null);
      } catch (err) {
        console.error('Error uploading photo', err);
      }
    }
  };

  return (
    <div className="albums-container">
      <h2>Albums</h2>
      <input
        type="text"
        placeholder="Search albums by serial number or title"
        value={search}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="albums-grid">
        {albums
          .filter(album => album.title.includes(search) || album.id.toString().includes(search))
          .map((album, index) => (
            <div key={album.id} className="album-card" onClick={() => handleAlbumClick(album)}>
              <div className="album-number">{index + 1}</div>
              <img src={albumBackground} alt={album.title} className="album-image" />
              <div className="album-title">{album.title}</div>
            </div>
          ))}
      </div>
      <div className="add-album">
        <input
          type="text"
          placeholder="New album title"
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
          className="new-album-input"
        />
        <button onClick={handleAddAlbum} className="add-album-button">Add Album</button>
      </div>
      {selectedAlbum && (
        <div className="photo-viewer-overlay">
          <div className="photo-viewer">
            <FontAwesomeIcon icon={faArrowLeft} className="arrow" onClick={handlePreviousPhoto} />
            <div className="photo-display">
              {photos.length > 0 ? (
                <>
                  <img src={photos[currentPhotoIndex].thumbnailUrl} alt={photos[currentPhotoIndex].title} className="photo" />
                  <p>{photos[currentPhotoIndex].title}</p>
                  <input
                    type="text"
                    value={photos[currentPhotoIndex].title}
                    onChange={(e) => handleUpdatePhoto(photos[currentPhotoIndex].id, e.target.value)}
                    className="photo-title-input"
                  />
                  <button onClick={() => handleDeletePhoto(photos[currentPhotoIndex].id)} className="delete-photo-button">Delete</button>
                </>
              ) : (
                <img src={emptyAlbum} alt="Empty Album" className="photo" />
              )}
              <input type="file" onChange={handleFileChange} className="upload-input" />
              <button onClick={handleUploadPhoto} className="upload-button">Upload Photo</button>
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="arrow" onClick={handleNextPhoto} />
            <FontAwesomeIcon icon={faTimes} className="close-button" onClick={() => setSelectedAlbum(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Albums;
