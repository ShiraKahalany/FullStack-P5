import React, { useEffect } from 'react';

// Function to fetch JSON data and store it in local storage
const loadAndStoreData = async () => {
  try {
    // Fetch the JSON data from the db.json file
    const response = await fetch('db.json');
    const data = await response.json();
    
    // Store different parts of the JSON data in local storage under different keys
    localStorage.setItem('users', JSON.stringify(data.users));
    localStorage.setItem('posts', JSON.stringify(data.posts));
    localStorage.setItem('todos', JSON.stringify(data.todos));
    localStorage.setItem('albums', JSON.stringify(data.todos));


    // Add other keys as necessary
    if (data.photos) {
      localStorage.setItem('photos', JSON.stringify(data.photos));
    }
    if (data.comments) {
      localStorage.setItem('comments', JSON.stringify(data.comments));
    }

    console.log('Data successfully stored in local storage');
  } catch (error) {
    console.error('Error fetching and storing data:', error);
  }
};

const DbLoader = () => {
  useEffect(() => {
    loadAndStoreData();
  }, []);

  return (
    <div>
      <h1>Loading JSON to Local Storage</h1>
    </div>
  );
};

export default DbLoader;
