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
  const [newPhoto, setNewPhoto] = useState({ url: '' }); // State for new photo URL
  const [loading, setLoading] = useState(false);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');


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
      const { data: runningIdData } = await axios.get('http://localhost:3000/running_id?type=albums_id');
      const maxId = albums.length > 0 ? Math.max(...albums.map(album => album.id)) : 0;
  
    
      const newAlbumData={
        id: maxId + 1,
        userId: user.id,
        title: newAlbumTitle,
      };
      const response = await axios.post('http://localhost:3000/albums', newAlbumData);
 
  
      console.log('Album successfully added:', response.data);
      setAlbums([...albums, response.data]);
      setNewAlbumTitle('');
  
    } catch (error) {
      console.error('Error adding album:', error);
      alert('Failed to add album. Please try again later.');
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

  const handleUpdatePhoto = async (photoId, newTitle) => {
    try {
      const response = await axios.patch(`http://localhost:3000/photos/${photoId}`, { title: newTitle });
      setPhotos(photos.map(photo => (photo.id === photoId ? response.data : photo)));
    } catch (err) {
      console.error('Error updating photo', err);
    }
  };

  const handleImageUrlChange = (e) => {
    setNewPhoto({
      ...newPhoto,
      url: e.target.value, // Update newPhoto state with URL input
    });
  };

  const handleAddPhoto = async () => {
    if (newPhoto.url.trim() === '') {
      alert('Please enter a photo URL.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/photos');
      const allPhotos = response.data;
      const maxId = allPhotos.length > 0 ? Math.max(...allPhotos.map(photo => photo.id)) : 0;
      const newPhotoData = {
        albumId: selectedAlbum.id,
        id: maxId + 1,
        title: newPhotoTitle,
        url: newPhoto.url,
        thumbnailUrl: newPhoto.url 
      };

      const postResponse = await axios.post('http://localhost:3000/photos', newPhotoData);

      // Fetch updated photos
      await fetchTotalPhotos(selectedAlbum.id);
      await fetchPhoto(selectedAlbum.id, totalPhotos);

      // Reset the newPhoto state after successful addition
      setNewPhoto({ url: '' });

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
                  <img src={photos[0].thumbnailUrl} alt={photos[0].title} className="photo" />
                  <p>{photos[0].title}</p>
                  <input
                    type="text"
                    value={photos[0].title}
                    onChange={(e) => handleUpdatePhoto(photos[0].id, e.target.value)}
                    className="photo-title-input"
                  />
                  <button onClick={() => handleDeletePhoto(photos[0].id)} className="delete-photo-button">Delete</button>
                </>
              ) : (
                <img src={emptyAlbum} alt="Empty Album" className="photo" />
              )}
              <input
                type="text"
                placeholder="Photo Title"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                className="new-photo-title-input"
              />
              <input
                type="text"
                value={newPhoto.url}
                onChange={handleImageUrlChange}
                className="upload-input"
                placeholder="Enter Image URL"
              />
              <button onClick={handleAddPhoto} className="add-button">
                Add Photo
              </button>
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
