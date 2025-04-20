import React, { useState, useEffect } from 'react';
import { fetchPosts, fetchPostComments, fetchUsers } from '../services/api';
import { getRandomImage } from '../utils/helpers';
import '../styles/TrendingPosts.css';

function TrendingPosts() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const getUsers = async () => {
      try {
        const userData = await fetchUsers();
        setUsers(userData.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const getTrendingPosts = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch all posts with 'popular' type
        const postsData = await fetchPosts('popular');
        const posts = postsData.posts || [];
        
        // 2. For each post, fetch comments to determine the most commented posts
        const postsWithComments = await Promise.all(
          posts.map(async (post) => {
            try {
              const commentsData = await fetchPostComments(post.id);
              const comments = commentsData.comments || [];
              
              return {
                ...post,
                commentCount: comments.length,
                comments,
                image: getRandomImage(post.id)
              };
            } catch (error) {
              console.error(`Error fetching comments for post ${post.id}:`, error);
              return {
                ...post,
                commentCount: 0,
                comments: [],
                image: getRandomImage(post.id)
              };
            }
          })
        );
        
        // 3. Sort posts by comment count (descending)
        const sortedPosts = postsWithComments.sort((a, b) => b.commentCount - a.commentCount);
        
        // 4. Find the maximum comment count
        const maxCommentCount = sortedPosts.length > 0 ? sortedPosts[0].commentCount : 0;
        
        // 5. Get all posts with the maximum comment count
        const topPosts = sortedPosts.filter(post => post.commentCount === maxCommentCount);
        
        setTrendingPosts(topPosts);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setError('Failed to load trending posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getUsers();
    getTrendingPosts();
  }, []);

  if (loading) return <div className="loading">Loading trending posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trending-posts-container">
      <h2>Trending Posts</h2>
      {trendingPosts.length === 0 ? (
        <div className="no-posts">No trending posts found.</div>
      ) : (
        <div className="posts-grid">
          {trendingPosts.map((post) => (
            <div key={post.id} className="post-card">
              <img src={post.image} alt="Post" className="post-image" />
              <div className="post-content">
                <h3>{users[post.userid] || 'Unknown User'}</h3>
                <p>{post.content}</p>
                <div className="post-stats">
                  <div className="stat">
                    <span className="stat-value">{post.commentCount}</span>
                    <span className="stat-label"> comments</span>
                  </div>
                </div>
              </div>
              <div className="post-comments">
                <h4>Top Comments</h4>
                {post.comments.length > 0 ? (
                  <ul className="comments-list">
                    {post.comments.slice(0, 3).map((comment) => (
                      <li key={comment.id} className="comment">
                        {comment.content}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-comments">No comments yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingPosts;