// src/components/Posts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(`http://localhost:5000/posts?userId=${user.id}`);
      setPosts(response.data);
    };
    fetchPosts();
  }, [user.id]);

  return (
    <div>
      <h2>Your Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
