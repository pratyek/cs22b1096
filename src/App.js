import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Social Media Dashboard</h1>
          <nav className="app-nav">
            <Link to="/" className="nav-link">Top Users</Link>
            <Link to="/trending" className="nav-link">Trending Posts</Link>
            <Link to="/feed" className="nav-link">Feed</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<TopUsers />} />
            <Route path="/trending" element={<TrendingPosts />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;