// src/pages/AddFriend.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddFriend() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ]); // Placeholder results
  const [addedFriends, setAddedFriends] = useState([]);
  const navigate = useNavigate();

  const handleAddFriend = (friend) => {
    setAddedFriends([...addedFriends, friend.id]);
    alert(`${friend.name} added as a friend!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-6">Add Friend</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for friends..."
        className="w-full max-w-md p-2 border border-gray-300 rounded mb-4"
      />

      {/* Placeholder Results */}
      <div className="w-full max-w-md">
        <p className="text-gray-500 mb-2">Search Results:</p>
        <ul className="space-y-2">
          {searchResults.map((friend) => (
            <li
              key={friend.id}
              className="p-2 bg-white border rounded flex justify-between items-center"
            >
              <span>{friend.name}</span>
              {addedFriends.includes(friend.id) ? (
                <span className="text-green-500">Added</span>
              ) : (
                <button
                  onClick={() => handleAddFriend(friend)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Add Friend
                </button>
              )}
            </li>
          ))}
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
