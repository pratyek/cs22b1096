import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserPosts, fetchPostComments } from '../services/api';
import { getRandomImage } from '../utils/helpers';
import '../styles/TopUsers.css';

function TopUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopUsers = async () => {
      try {
        setLoading(true);
        // 1. Fetch all users
        const userData = await fetchUsers();
        const allUsers = userData.users;
        
        // 2. Process each user to get their posts and calculate comment counts
        const usersWithCommentCounts = await Promise.all(
          Object.entries(allUsers).map(async ([userId, username]) => {
            try {
              // Get user's posts
              const postsData = await fetchUserPosts(userId);
              const posts = postsData.posts || [];
              
              // For each post, get comments and calculate total
              let commentCount = 0;
              await Promise.all(
                posts.map(async (post) => {
                  try {
                    const commentsData = await fetchPostComments(post.id);
                    const comments = commentsData.comments || [];
                    commentCount += comments.length;
                  } catch (error) {
                    console.error(`Error fetching comments for post ${post.id}:`, error);
                  }
                })
              );
              
              return {
                id: userId,
                username,
                postCount: posts.length,
                commentCount,
                image: getRandomImage(parseInt(userId))
              };
            } catch (error) {
              console.error(`Error processing user ${userId}:`, error);
              return {
                id: userId,
                username,
                postCount: 0,
                commentCount: 0,
                image: getRandomImage(parseInt(userId))
              };
            }
          })
        );
        
        // 3. Sort users by comment count (descending) and take top 5
        const topUsers = usersWithCommentCounts
          .sort((a, b) => b.commentCount - a.commentCount)
          .slice(0, 5);
          
        setUsers(topUsers);
      } catch (error) {
        console.error('Error fetching top users:', error);
        setError('Failed to load top users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getTopUsers();
  }, []);

  if (loading) return <div className="loading">Loading top users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="top-users-container">
      <h2>Top Users</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img src={user.image} alt={user.username} className="user-image" />
            <h3>{user.username}</h3>
            <div className="user-stats">
              <div className="stat">
                <span className="stat-label">Posts:</span>
                <span className="stat-value">{user.postCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Comments:</span>
                <span className="stat-value">{user.commentCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopUsers;