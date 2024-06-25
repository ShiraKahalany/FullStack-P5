import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaComments, FaSave, FaPlus } from 'react-icons/fa';
import AuthContext from '../contexts/AuthContext';
import '../css/Posts.css';

const Posts = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updatedPostTitle, setUpdatedPostTitle] = useState('');
  const [updatedPostBody, setUpdatedPostBody] = useState('');
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, userId]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/posts?userId=${userId}`);
      setPosts(response.data);
      setFilteredPosts(response.data); // Initialize filteredPosts with all posts
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post, index) => {
        const serialNumber = (index + 1).toString();
        return serialNumber.includes(searchQuery) || post.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredPosts(filtered);
    }
  };
  

  const handleAddPost = async () => {
    try {
      const postssResponse = await axios.get('http://localhost:3000/posts');
      const allPosts = postssResponse.data;
      const maxpostId = allPosts.length > 0 ? Math.max(...allPosts.map(post => parseInt(post.id))) : 0;
      const response = await axios.post('http://localhost:3000/posts', {
        id: (maxpostId+1).toString(),
        title: newPostTitle,
        body: newPostBody,
        userId: parseInt(userId),
      });
      const newPosts = [...posts, response.data];
      setPosts(newPosts);
      setFilteredPosts(newPosts); // Update filteredPosts as well
      setNewPostTitle('');
      setNewPostBody('');
    } catch (err) {
      console.error('Error adding post', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Fetch all comments for the post
      const commentsResponse = await axios.get(`http://localhost:3000/comments?postId=${postId}`);
      const commentsToDelete = commentsResponse.data;
  
      // Delete each comment
      await Promise.all(commentsToDelete.map(async (comment) => {
        try {
          await axios.delete(`http://localhost:3000/comments/${comment.id}`);
        } catch (err) {
          console.error(`Error deleting comment with ID ${comment.id}`, err);
        }
      }));
  
      // Delete the post
      await axios.delete(`http://localhost:3000/posts/${postId}`);
  
      // Update the posts state
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts); // Update filteredPosts as well
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
        setComments([]);
      }
    } catch (err) {
      console.error('Error deleting post and comments', err);
    }
  };

  const handleSelectPost = async (post) => {
    setSelectedPost(post);
    setEditMode(false);
    setCommentsVisible(false); // Hide comments initially when selecting a post
  };

  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/posts/${selectedPost.id}`, {
        title: updatedPostTitle,
        body: updatedPostBody,
        userId: parseInt(userId),
      });
      const updatedPosts = posts.map(post => (post.id === selectedPost.id ? response.data : post));
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts); // Update filteredPosts as well
      setSelectedPost(response.data); // Update the selected post immediately
      setEditMode(false);
    } catch (err) {
      console.error('Error updating post', err);
    }
  };

  const handleAddComment = async () => {
    try {
      // Fetch all comments to determine the max ID
      const commentsResponse = await axios.get('http://localhost:3000/comments');
      const allComments = commentsResponse.data;
      const maxId = allComments.length > 0 ? Math.max(...allComments.map(comment => parseInt(comment.id))) : 0;

      const response = await axios.post('http://localhost:3000/comments', {
        postId: parseInt(selectedPost.id),
        id: (maxId + 1).toString(),
        name: user.username,
        email: user.email,
        body: newComment,
        userID: parseInt(user.id)
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentResponse = await axios.get(`http://localhost:3000/comments/${commentId}`);
      const comment = commentResponse.data;
      if (parseInt(comment.userID) === parseInt(user.id)) {
        await axios.delete(`http://localhost:3000/comments/${commentId}`);
        setComments(comments.filter(comment => comment.id !== commentId));
      } else {
        // Display an error message
        alert('You can only delete comments you have written.');
      }
    } catch (err) {
      console.error(`Error deleting comment with ID ${commentId}`, err);
    }
  };

  const handleEditComment = (commentId, body) => {
    const commentToEdit = comments.find(comment => comment.id === commentId);
    if (parseInt(commentToEdit.userID) === parseInt(user.id)) {
      setEditCommentId(commentId);
      setUpdatedComment(body);
    } else {
      alert('You can only edit comments you have written.');
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const commentResponse = await axios.get(`http://localhost:3000/comments/${commentId}`);
      const comment = commentResponse.data;
      const response = await axios.put(`http://localhost:3000/comments/${commentId}`, {
        ...comment,
        body: updatedComment
      });
      setComments(comments.map(comment => (comment.id === commentId ? response.data : comment)));
      setEditCommentId(null);
      setUpdatedComment('');
    } catch (err) {
      console.error(`Error updating comment with ID ${commentId}`, err);
    }
  };

  const handleCancelEditComment = () => {
    setEditCommentId(null);
    setUpdatedComment('');
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setUpdatedPostTitle(selectedPost.title);
      setUpdatedPostBody(selectedPost.body);
    }
  };

  const toggleCommentsVisibility = async () => {
    if (!commentsVisible) {
      try {
        const response = await axios.get(`http://localhost:3000/comments?postId=${selectedPost.id}`);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments', err);
      }
    }
    setCommentsVisible(!commentsVisible);
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
        {filteredPosts.map((post, index) => (
          <li key={post.id} className={selectedPost && selectedPost.id === post.id ? 'selected' : ''}>
            <div className="post-item">
              <span>{index + 1}. {post.title}</span>
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
            <div>
              <button onClick={handleUpdatePost}><FaSave /> Save</button>
              <button onClick={toggleEditMode}>Cancel</button>
            </div>
          )}
          <div className="comments-section">
            <button onClick={toggleCommentsVisibility} className="toggle-comments">
              {commentsVisible ? 'Hide Comments' : 'Show Comments'}
            </button>
            {commentsVisible && (
              <div>
                <h4>Comments</h4>
                <ul className="comments-list">
                  {comments.map(comment => (
                    <li key={comment.id}>
                      <div className="comment-item">
                        {editCommentId === comment.id ? (
                          <div>
                            <input
                              type="text"
                              value={updatedComment}
                              onChange={(e) => setUpdatedComment(e.target.value)}
                            />
                            <div className='commentCandS'>
                            <button onClick={() => handleUpdateComment(comment.id)}><FaSave /> Save</button>
                            <button onClick={handleCancelEditComment}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <span>{comment.body}</span>
                        )}
                        {editCommentId !== comment.id && (
                          <div className='commentsSandE'>
                            <button onClick={() => handleEditComment(comment.id, comment.body)}><FaEdit /></button>
                            <button onClick={() => handleDeleteComment(comment.id)}><FaTrash /></button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="add-comment">
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
        </div>
      )}
    </div>
  );
};

export default Posts;
