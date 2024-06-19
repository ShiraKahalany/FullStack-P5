// src/components/Posts.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import '../css/Posts.css';

const Posts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/posts?userId=${user.id}`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      fetchPosts();
    } else {
      const filteredPosts = posts.filter(
        post =>
          post.id.toString().includes(searchQuery) ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPosts(filteredPosts);
    }
  };

  const handleAddPost = async () => {
    try {
      const response = await axios.post('http://localhost:3000/posts', {
        userId: user.id,
        title: newPostTitle,
        body: newPostBody,
      });
      setPosts([...posts, response.data]);
      setNewPostTitle('');
      setNewPostBody('');
    } catch (err) {
      console.error('Error adding post', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  const handleSelectPost = async (post) => {
    setSelectedPost(post);
    try {
      const response = await axios.get(`http://localhost:3000/comments?postId=${post.id}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments', err);
    }
  };

  const handleAddComment = async () => {
    try {
      const commentsNum = axios.get('http://localhost:3000/comments').length + 1;
      const response = await axios.post('http://localhost:3000/comments', {
        postId: selectedPost.id,
        id : commentsNum ,
        name: user.username,
        email: user.email,
        body: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3000/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment', err);
    }
  };

  return (
    <div className="posts-container">
      <h2>Posts</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by serial number or title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="add-post">
        <input
          type="text"
          placeholder="New post title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="New post body"
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>
      <ul className="posts-list">
        {posts.map(post => (
          <li key={post.id} className={selectedPost && selectedPost.id === post.id ? 'selected' : ''}>
            <div className="post-item">
              <span>{post.id}. {post.title}</span>
              <button onClick={() => handleSelectPost(post)}>Select</button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedPost && (
        <div className="selected-post">
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.body}</p>
          <div className="comments-section">
            <h4>Comments</h4>
            <ul className="comments-list">
              {comments.map(comment => (
                <li key={comment.id}>
                  <p><strong>{comment.name}</strong>: {comment.body}</p>
                  {comment.email === user.email && (
                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                  )}
                </li>
              ))}
            </ul>
            <textarea
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
