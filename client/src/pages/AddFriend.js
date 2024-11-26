// src/pages/AddFriend.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function AddFriend() {
  const loggedInUser = JSON.parse(localStorage.getItem('googleToken'));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Brown' },
  ]); // Placeholder results
  const [addedFriends, setAddedFriends] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddFriend = async (friend) => {
    const response = await fetch('/api/friends', {method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({ user_id: loggedInUser.id, friend_id: friend.id,}),
    });
    if (response.ok) {
      setAddedFriends([...addedFriends, friend.id]);
      alert(`${friend.name} added as a friend!`);
    }
    else {
      alert('Could not add as friend or maybe already a friend');
      console.log(response.json());
    } 
  };

  const search = async () => {
    const response = await fetch(`http://localhost:3000/api/users/email/${searchQuery}`, {method: 'GET'});
    const data = await response.json();
    if (response.ok) {
      setMessage('');
      setSearchResults([{ id: data.user_id, name: data.username }]);
    }
    else {
      setMessage(data.error || data.message);
      setSearchResults([]);
    }
    return;
  }

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

      {/*Search Button*/}
      <button
        onClick={ () => search()}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>

      {/* Placeholder Results */}
      <div className="w-full max-w-md">
        <p className="text-gray-500 mb-2">Search Results:</p>
        <p>{message}</p>
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
      <Navbar />
    </div>
  );
}

export default AddFriend;
