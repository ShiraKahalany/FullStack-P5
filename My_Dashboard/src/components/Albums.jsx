import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import albumBackground from '../img/album-background.jpg';
import emptyAlbum from '../img/empty_album.png';
import AddPhotoModal from './AddPhotoModel';
import UpdatePhotoModal from './UpdatePhotoModal';

import '../css/Albums.css';

const Albums = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [photoToUpdate, setPhotoToUpdate] = useState(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchAlbums();
    }
  }, [user, userId]);

  const openUpdateModal = (photo) => {
    setPhotoToUpdate(photo);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setPhotoToUpdate(null);
  };

  const handleOpenAddPhotoModal = () => {
    setShowAddPhotoModal(true);
  };

  const handleCloseAddPhotoModal = () => {
    setShowAddPhotoModal(false);
  };

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/albums?userId=${userId}`);
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
    await fetchTotalPhotos(album.id);
    await fetchPhoto(album.id, 0);
  };

  const fetchPhoto = async (albumId, index) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/photos?albumId=${albumId}&_start=${index}&_limit=1`);
      setPhotos(response.data);
    } catch (err) {
      console.error('Error fetching photo', err);
    }
    setLoading(false);
  };

  const fetchTotalPhotos = async (albumId) => {
    try {
      const response = await axios.get(`http://localhost:3000/photos?albumId=${albumId}`);
      setTotalPhotos(response.data.length);
    } catch (err) {
      console.error('Error fetching total photos', err);
    }
  };

  const handleNextPhoto = async () => {
    const nextIndex = (currentPhotoIndex + 1) % totalPhotos;
    setCurrentPhotoIndex(nextIndex);
    await fetchPhoto(selectedAlbum.id, nextIndex);
  };

  const handlePreviousPhoto = async () => {
    const prevIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
    setCurrentPhotoIndex(prevIndex);
    await fetchPhoto(selectedAlbum.id, prevIndex);
  };

  const handleAddAlbum = async () => {
    if (newAlbumTitle.trim() === '') {
      alert('Please enter an album title.');
      return;
    }

    try {
      const albumsData = await axios.get('http://localhost:3000/albums');
      const allAlbums = albumsData.data;
      const maxId = allAlbums.length > 0 ? Math.max(...allAlbums.map(album => parseInt(album.id, 10))) : 0;
      const newId = maxId + 1;
  
      const newAlbumData = {
        id: (newId).toString(),  
        userId: parseInt(userId),  
        title: newAlbumTitle,
      };

      const response = await axios.post('http://localhost:3000/albums', newAlbumData);
      setAlbums([...albums, response.data]);
      setNewAlbumTitle('');
    } catch (error) {
      console.error('Error adding album:', error);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    try {
      const photosResponse = await axios.get(`http://localhost:3000/photos?albumId=${albumId}`);
      const photosToDelete = photosResponse.data;
  
      await Promise.all(photosToDelete.map(async (photo) => {
        try {
          console.log(`Deleting photo with ID ${photo.id}`);
          await axios.delete(`http://localhost:3000/photos/${photo.id}`);
        } catch (err) {
          console.error(`Error deleting photo with ID ${photo.id}`, err);
        }
      }));

      await axios.delete(`http://localhost:3000/albums/${albumId}`);
      setAlbums((prevAlbums) => prevAlbums.filter(album => album.id !== albumId));
      if (selectedAlbum && selectedAlbum.id === albumId) {
        setSelectedAlbum(null);
        setPhotos([]);
      }
    } catch (err) {
      console.error('Error deleting album and photos', err);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await axios.delete(`http://localhost:3000/photos/${photoId}`);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      handleNextPhoto();
    } catch (err) {
      console.error('Error deleting photo', err);
    }
  };

  const handleUpdatePhoto = async (photoId, newTitle, newURL) => {
    try {
      const response = await axios.patch(`http://localhost:3000/photos/${photoId}`, {
        title: newTitle,
        url: newURL,
        thumbnailUrl: newURL
      });
      setPhotos(photos.map(photo => (photo.id === photoId ? response.data : photo)));
    } catch (err) {
      console.error('Error updating photo', err);
    }
  };

  const handleAddPhoto = async (albumId, title, url) => {
    if (url.trim() === '') {
      alert('Please enter a photo URL.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/photos');
      const allPhotos = response.data;
      const maxId = allPhotos.length > 0 ? Math.max(...allPhotos.map(photo => photo.id)) : 0;
      const newPhotoData = {
        albumId: parseInt(albumId),
        id: (maxId + 1).toString(),
        title: title,
        url: url,
        thumbnailUrl: url
      };

      await axios.post('http://localhost:3000/photos', newPhotoData);

      await fetchTotalPhotos(albumId);
      await fetchPhoto(albumId, totalPhotos);
    } catch (error) {
      console.error('Error adding new photo:', error);
      alert('Failed to add photo. Please try again later.');
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
            <div key={album.id} className="album-card">
              <div className="album-number">{index + 1}</div>
              <img src={albumBackground} alt={album.title} className="album-image" onClick={() => handleAlbumClick(album)} />
              <div className="album-title">{album.title}</div>
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="delete-album-icon"
                onClick={() => handleDeleteAlbum(album.id)}
              />
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
                  <img src={photos[0].thumbnailUrl} alt={photos[0].title} className="photo" />
                  <p>{photos[0].title}</p>
                  <div className="photo-update">
                    <button onClick={() => openUpdateModal(photos[0])}>Update Photo</button>
                  </div>
                  <button onClick={() => handleDeletePhoto(photos[0].id)} className="delete-photo-button">Delete</button>
                </>
              ) : (
                <img src={emptyAlbum} alt="Empty Album" className="photo" />
              )}
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="arrow" onClick={handleNextPhoto} />
            <FontAwesomeIcon icon={faTimes} className="close-button" onClick={() => setSelectedAlbum(null)} />
          </div>
          <button onClick={handleOpenAddPhotoModal} className="add-photo-button">Add Photo</button>
        </div>
      )}

      {showAddPhotoModal && (
        <AddPhotoModal
          albumId={selectedAlbum.id}
          onAdd={handleAddPhoto}
          onClose={handleCloseAddPhotoModal}
        />
      )}

      {isUpdateModalOpen && (
        <UpdatePhotoModal
          photo={photoToUpdate}
          onClose={closeUpdateModal}
          onUpdate={handleUpdatePhoto}
        />
      )}
    </div>
  );
};

export default Albums;
