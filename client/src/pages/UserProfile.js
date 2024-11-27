import React from 'react';
import Navbar from '../components/Navbar'; // Adjust the path as necessary

function UserProfile() {
  const loggedInUser = JSON.parse(localStorage.getItem('googleToken'));
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>

        {/* User Info Section */}
        <div className="text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold">{loggedInUser.name}</h2>
          <p className="text-gray-600">{loggedInUser.email}</p>

          {/* Additional User Info */}
          <div className="mt-4">
        
          </div>
        </div>
      </div>

      {/* Navbar at the bottom */}
      <Navbar />
    </div>
  );
}

export default UserProfile;