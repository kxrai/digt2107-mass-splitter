// src/pages/AddFriend.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function AddFriend() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-6">Add Friend</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for friends..."
        className="w-full max-w-md p-2 border border-gray-300 rounded mb-4"
      />

      {/* Placeholder Results */}
      <div className="w-full max-w-md">
        <p className="text-gray-500 mb-2">Search Results (mockup):</p>
        <ul className="space-y-2">
          <li className="p-2 bg-white border rounded">Friend 1</li>
          <li className="p-2 bg-white border rounded">Friend 2</li>
          <li className="p-2 bg-white border rounded">Friend 3</li>
        </ul>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Homepage
      </button>
    </div>
  );
}

export default AddFriend;
