// src/services/api.js

// For development with Create React App's proxy
const API_BASE_URL = '/evaluation-service'; 

// Updated authentication token
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ1MTI3OTc3LCJpYXQiOjE3NDUxMjc2NzcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE2OGYzYTBjLTg1MTAtNDU1My04NGMzLTM2N2E2ZjIyZGRjZSIsInN1YiI6ImNzMjJiMTA5NkBpaWl0ZG0uYWMuaW4ifSwiZW1haWwiOiJjczIyYjEwOTZAaWlpdGRtLmFjLmluIiwibmFtZSI6InByYXR5ZWsgdGh1bXVsYSIsInJvbGxObyI6ImNzMjJiMTA5NiIsImFjY2Vzc0NvZGUiOiJ3Y0hIcnAiLCJjbGllbnRJRCI6ImE2OGYzYTBjLTg1MTAtNDU1My04NGMzLTM2N2E2ZjIyZGRjZSIsImNsaWVudFNlY3JldCI6IlBCelZEbXFGVENyZGFQZnMifQ.Q8zqL8Dq0SzkQgbs6ziCtO5NlfH_Bp_Ta-f5LPY6tX4";

// Authentication credentials for refreshing the token when needed
const AUTH_CREDENTIALS = {
  email: "cs22b1096@iiitdm.ac.in",
  name: "pratyek thumula",
  rollNo: "cs22b1096",
  accessCode: "wcHHrp",
  clientID: "a68f3a0c-8510-4553-84c3-367a6f22ddce",
  clientSecret: "PBzVDmqFTCrdaPfs"
};

// Function to refresh the auth token
export const refreshAuthToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(AUTH_CREDENTIALS)
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`);
    }

    const data = await response.json();
    return data.token; // Assuming the token is returned in a 'token' field
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Helper function for authenticated API requests
const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error with API request to ${url}:`, error);
    throw error;
  }
};

// API endpoints
export const fetchUsers = async () => {
  return fetchWithAuth(`${API_BASE_URL}/users`);
};

export const fetchUserPosts = async (userId) => {
  return fetchWithAuth(`${API_BASE_URL}/users/${userId}/posts`);
};

export const fetchPosts = async (type = 'latest') => {
  return fetchWithAuth(`${API_BASE_URL}/posts?type=${type}`);
};

export const fetchPostComments = async (postId) => {
  return fetchWithAuth(`${API_BASE_URL}/posts/${postId}/comments`);
};

export default {
  fetchUsers,
  fetchUserPosts,
  fetchPosts,
  fetchPostComments,
  refreshAuthToken
};