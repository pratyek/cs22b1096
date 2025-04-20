import React, { useState, useEffect, useCallback } from 'react';
import { fetchPosts, fetchUsers, fetchPostComments } from '../services/api';
import { getRandomImage } from '../utils/helpers';
import '../styles/Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch the latest posts
  const fetchLatestPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Fetch latest posts
      const postsData = await fetchPosts('latest');
      const latestPosts = postsData.posts || [];
      
      // 2. Enhance posts with additional data
      const enhancedPosts = await Promise.all(
        latestPosts.map(async (post) => {
          try {
            // Get comments for each post
            const commentsData = await fetchPostComments(post.id);
            const comments = commentsData.comments || [];
            
            return {
              ...post,
              commentCount: comments.length,
              image: getRandomImage(post.id),
              timestamp: new Date().getTime() - Math.floor(Math.random() * 86400000) // Random timestamp within last 24h
            };
          } catch (error) {
            console.error(`Error fetching comments for post ${post.id}:`, error);
            return {
              ...post,
              commentCount: 0,
              image: getRandomImage(post.id),
              timestamp: new Date().getTime() - Math.floor(Math.random() * 86400000)
            };
          }
        })
      );
      
      // 3. Sort posts by timestamp (newest first)
      const sortedPosts = enhancedPosts.sort((a, b) => b.timestamp - a.timestamp);
      
      setPosts(sortedPosts);
      setError(null);
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      setError('Failed to load feed. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch users
  const fetchAllUsers = useCallback(async () => {
    try {
      const userData = await fetchUsers();
      setUsers(userData.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
    fetchLatestPosts();
    
    // Set up polling to update feed regularly
    const intervalId = setInterval(() => {
      fetchLatestPosts();
    }, 60000); // Refresh every 60 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchLatestPosts, fetchAllUsers]);

  const refreshFeed = () => {
    fetchLatestPosts();
  };

  if (loading && posts.length === 0) return <div className="loading">Loading feed...</div>;

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Feed</h2>
        <button className="refresh-button" onClick={refreshFeed}>
          Refresh
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {posts.length === 0 ? (
        <div className="no-posts">No posts found in feed.</div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="feed-post-card">
              <div className="post-header">
                <h3>{users[post.userid] || 'Unknown User'}</h3>
                <span className="post-time">
                  {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <img src={post.image} alt="Post" className="post-image" />
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              <div className="post-footer">
                <span className="comment-count">
                  {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {loading && posts.length > 0 && (
        <div className="loading-more">Updating feed...</div>
      )}
    </div>
  );
}

export default Feed;
