// src/pages/CreateGroup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateGroup() {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const navigate = useNavigate();

  const friends = ['Friend 1', 'Friend 2', 'Friend 3', 'Friend 4']; // Placeholder friend list

  const toggleFriendSelection = (friend) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friend)
        ? prevSelected.filter((f) => f !== friend)
        : [...prevSelected, friend]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-6">Create Group</h1>

      <p className="text-gray-500 mb-4">Select friends to add to the group:</p>

      {/* Friend List */}
      <div className="w-full max-w-md space-y-2">
        {friends.map((friend, index) => (
          <div
            key={index}
            onClick={() => toggleFriendSelection(friend)}
            className={`p-2 border rounded cursor-pointer ${
              selectedFriends.includes(friend) ? 'bg-blue-100' : 'bg-white'
            }`}
          >
            {friend}
          </div>
        ))}
      </div>

      {/* Selected Friends Display */}
      <div className="w-full max-w-md mt-6">
        <h2 className="text-lg font-semibold">Selected Friends:</h2>
        {selectedFriends.length > 0 ? (
          <ul className="list-disc pl-5">
            {selectedFriends.map((friend, index) => (
              <li key={index}>{friend}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No friends selected</p>
        )}
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

export default CreateGroup;
