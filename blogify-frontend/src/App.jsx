import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Layout & Global Components
import Navbar from './components/Navbar';

// Lazy load pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PostDetails = React.lazy(() => import('./pages/PostDetails'));

const LoadingFallback = () => (
  <div className="container animate-pulse" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--accent-primary)' }}>
    <h2>Loading...</h2>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/post/:id" element={<PostDetails />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
