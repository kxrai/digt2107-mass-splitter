import React from 'react';
import Navbar from '../components/Navbar';

function UserProfile() {
  // Retrieve the user from localStorage
  const storedUser = localStorage.getItem('googleToken');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="grid-bg min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>

        {/* Check if user exists before rendering */}
        {loggedInUser ? (
          <div className="text-center">
            <img
              src={loggedInUser.picture || "https://via.placeholder.com/150"} // Fallback image
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">{loggedInUser.name}</h2>
            <p className="text-gray-600">{loggedInUser.email}</p>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No user data found. Please log in.</p>
        )}
      </div>

      {/* Navbar at the bottom */}
      <Navbar />
    </div>
  );
}

export default UserProfile;
