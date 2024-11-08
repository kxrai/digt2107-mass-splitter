// src/App.js
import React, { useState } from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
=======
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
>>>>>>> Login-Page
import BillEntry from './components/BillEntry';
import PartyMembers from './components/PartyMembers';
import BillSplitter from './components/BillSplitter';
import SplitResult from './components/SplitResult';
import HomePage from './pages/HomePage.js';
<<<<<<< HEAD
import SplitHistory from './pages/SplitHistory.js';
import AddFriend from './pages/AddFriend.js';
import CreateGroup from './pages/CreateGroup.js';
import AddReceipt from './components/AddReceipt';
import SplitBill from './pages/SplitBill.js';

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

=======
import LoginPage from './pages/LoginPage';

>>>>>>> Login-Page
function MainApp() {
  const [billItems, setBillItems] = useState([]);
  const [partyMembers, setPartyMembers] = useState([]);
  const [splitResult, setSplitResult] = useState(null);

  // Check if the user is logged in based on localStorage
  const loggedIn = Boolean(localStorage.getItem('loggedIn'));
  const navigate = useNavigate();
  const handleLogout = () => {
    googleLogout(); // Log out from Google
    localStorage.removeItem('loggedIn'); //Remove token from storage
    localStorage.removeItem('googleToken');
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div style={{textAlign: 'right'}}>
        {loggedIn ? (
          <button onClick={() => handleLogout()} className='font-bold m-4 text-blue-500 hover:text-blue-700'>Logout</button>
        ) : (
          <a className='font-bold m-4 text-blue-500 hover:text-blue-700' href="/login">Login/Sign-up</a>
        )}
        
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">MASS Splitter</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BillEntry billItems={billItems} setBillItems={setBillItems} />
          <PartyMembers partyMembers={partyMembers} setPartyMembers={setPartyMembers} />
        </div>
        <BillSplitter
          billItems={billItems}
          partyMembers={partyMembers}
          setSplitResult={setSplitResult}
        />
        {splitResult && (
          <SplitResult partyMembers={partyMembers} splitResult={splitResult} />
        )}
        {/* Button to navigate to Home */}
        <HomeButton />
      </div>
    </div>
  );
}

function App() {
<<<<<<< HEAD
=======
  // Check if the user is logged in based on localStorage
  const loggedIn = Boolean(localStorage.getItem('loggedIn'));

  // Protect the route by redirecting if not logged in or redirecting if logged in 
  const ProtectedRoute = ({ children }) => {
      return loggedIn ? children : <Navigate to="/login" />;
    };

>>>>>>> Login-Page
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/home" element={<HomePage />} />
<<<<<<< HEAD
        <Route path="/split-history" element={<SplitHistory />} />
        <Route path="/add-friend" element={<AddFriend />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/split-bill" element={<SplitBill />} />
=======
        <Route path="/login" element={<LoginPage />} />
        {/*This is how you would use a protected route for the dashboard page*/}
        {/*<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />*/}
>>>>>>> Login-Page
      </Routes>
    </Router>
  );
}

export default App;
