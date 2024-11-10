import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import HomePage from './pages/HomePage.js';
import SplitHistory from './pages/SplitHistory.js';
import AddFriend from './pages/AddFriend.js';
import CreateGroup from './pages/CreateGroup.js';
import AddReceipt from './components/AddReceipt';
import SplitBill from './pages/SplitBill.js';
import LoginPage from './pages/LoginPage';
import ninjaImage from './assets/ninja_picture.png'; // Adjust path as needed
import UserProfile from './pages/UserProfile.js';

// Base style for full-page background image
const baseBackgroundStyle = {
  backgroundImage: `url(${ninjaImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center top',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: '#A2E8F0', // Fallback color for any uncovered space
};

function HomeButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/home')}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go to Home
    </button>
  );
}

function MainApp() {
  const [billItems, setBillItems] = useState([]);
  const [partyMembers, setPartyMembers] = useState([]);
  const [splitResult, setSplitResult] = useState(null);

  // Check if the user is logged in based on localStorage
  const loggedIn = Boolean(localStorage.getItem('loggedIn'));
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('googleToken');
    navigate("/login");
  };

  return (
    <>
      {/* Inline CSS for media queries */}
      <style>
        {`
          .responsive-background {
            background-size: contain;
          }

          /* Apply different background size on larger screens */
          @media (min-width: 768px) {
            .responsive-background {
              background-size: 80%; /* Adjust to 80% to show more of the full image on desktop */
              background-position: center; /* Center the image for better alignment */
            }
          }
        `}
      </style>
      
      <div style={baseBackgroundStyle} className="responsive-background">
        {/* Transparent overlay container for content */}
        <div style={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
          <h1 className="text-4xl font-bold mb-8">MASS SPLITTER</h1>
          
          {/* Login or Logout Button */}
          <div style={{ marginBottom: '20px' }}>
            {loggedIn ? (
              <button onClick={handleLogout} className='font-bold text-blue-500 hover:text-blue-700'>Logout</button>
            ) : (
              <a className='font-bold text-blue-500 hover:text-blue-700' href="/login">Login/Sign-up</a>
            )}
          </div>

          {/* Home Button */}
          <HomeButton />
        </div>
      </div>
    </>
  );
}

function App() {
  // Check if the user is logged in based on localStorage
  const loggedIn = Boolean(localStorage.getItem('loggedIn'));

  const ProtectedRoute = ({ children }) => {
    return loggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/split-history" element={<SplitHistory />} />
        <Route path="/add-friend" element={<AddFriend />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/add-receipt" element={<AddReceipt />} />
        <Route path="/split-bill" element={<SplitBill />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
