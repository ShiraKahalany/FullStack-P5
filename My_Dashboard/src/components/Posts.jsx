// src/components/Posts.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaComments, FaSave, FaPlus, FaSearch } from 'react-icons/fa';
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
  const [editMode, setEditMode] = useState(false);
  const [updatedPostTitle, setUpdatedPostTitle] = useState('');
  const [updatedPostBody, setUpdatedPostBody] = useState('');

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
      const new_id = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
      const response = await axios.post('http://localhost:3000/posts', {
        id: new_id,
        title: newPostTitle,
        body: newPostBody,
        userId: user.id,
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
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
        setComments([]);
      }
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  const handleSelectPost = async (post) => {
    setSelectedPost(post);
    setEditMode(false);
    try {
      const response = await axios.get(`http://localhost:3000/comments?postId=${post.id}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments', err);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/posts/${selectedPost.id}`, {
        title: updatedPostTitle,
        body: updatedPostBody,
        userId: user.id,
      });
      setPosts(posts.map(post => (post.id === selectedPost.id ? response.data : post)));
      setEditMode(false);
    } catch (err) {
      console.error('Error updating post', err);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post('http://localhost:3000/comments', {
        body: newComment,
        postId: selectedPost.id,
        name: user.username,
        email: user.email,
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

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setUpdatedPostTitle(selectedPost.title);
      setUpdatedPostBody(selectedPost.body);
    }
  };

  return (
    <div className="posts-container">
      <h2>Posts</h2>
      <div className="search-bar">
        <input
         className='search-box'
          type="text"
          placeholder="Search by serial number or title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}><FaSearch /></button>
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
        <button onClick={handleAddPost}><FaPlus /> Add Post</button>
      </div>
      <ul className="posts-list">
        {posts.map(post => (
          <li key={post.id} className={selectedPost && selectedPost.id === post.id ? 'selected' : ''}>
            <div className="post-item">
              <span>{post.id}. {post.title}</span>
              <div className="post-actions">
                <button onClick={() => handleSelectPost(post)}><FaComments /></button>
                <button onClick={() => handleDeletePost(post.id)}><FaTrash /></button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {selectedPost && (
        <div className="selected-post">
          <h3>
            {!editMode ? selectedPost.title : (
              <input
                type="text"
                value={updatedPostTitle}
                onChange={(e) => setUpdatedPostTitle(e.target.value)}
              />
            )}
          </h3>
          <p>
            {!editMode ? selectedPost.body : (
              <textarea
                value={updatedPostBody}
                onChange={(e) => setUpdatedPostBody(e.target.value)}
              />
            )}
          </p>
          {!editMode ? (
            <button onClick={toggleEditMode}><FaEdit /> Edit</button>
          ) : (
            <button onClick={handleUpdatePost}><FaSave /> Save</button>
          )}
          <div className="comments-section">
            <h4>Comments</h4>
            <ul className="comments-list">
              {comments.map(comment => (
                <li key={comment.id}>
                  <p><strong>{comment.name}</strong>: {comment.body}</p>
                  {comment.email === user.email && (
                    <button onClick={() => handleDeleteComment(comment.id)}><FaTrash /></button>
                  )}
                </li>
              ))}
            </ul>
            <textarea
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}><FaPlus /> Add Comment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
