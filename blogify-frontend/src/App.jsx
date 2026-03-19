import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Layout & Global Components
import Navbar from './components/Navbar';

// Lazy load pages for performance
const Landing = React.lazy(() => import('./pages/Landing'));
const Feed = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PostDetails = React.lazy(() => import('./pages/PostDetails'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Profile = React.lazy(() => import('./pages/Profile'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const EditPost = React.lazy(() => import('./pages/EditPost'));
const Bookmarks = React.lazy(() => import('./pages/Bookmarks'));
const Notifications = React.lazy(() => import('./pages/Notifications'));

const LoadingFallback = () => (
  <div className="container animate-pulse" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--accent-primary)' }}>
    <h2>Loading...</h2>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navbar />
          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/post/:id" element={<PostDetails />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
