// src/components/Albums.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Albums() {
  const [albums, setAlbums] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await axios.get(`http://localhost:5000/albums?userId=${user.id}`);
      setAlbums(response.data);
    };
    fetchAlbums();
  }, [user.id]);

  return (
    <div>
      <h2>Your Albums</h2>
      <ul>
        {albums.map(album => (
          <li key={album.id}>
            {album.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Albums;
