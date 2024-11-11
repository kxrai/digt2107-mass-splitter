// src/pages/GroupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function GroupPage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Email validation function
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Function to add a member by email
  const handleAddMember = async () => {
    if (memberEmail.trim() === '') {
      setErrorMessage('Please enter an email address');
      return;
    }
    if (!isValidEmail(memberEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (members.some((member) => member.email === memberEmail)) {
      setErrorMessage('Member already added');
      return;
    }
    try {
      // Assuming an endpoint that verifies and adds member by email
      const response = await axios.post('/api/groups/add-member', { email: memberEmail });
      setMembers([...members, response.data]); // Adds member to state if valid
      setMemberEmail(''); // Clear input
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('User not found');
      }
    }
  };

  // Function to remove a member
  const handleRemoveMember = (email) => {
    setMembers(members.filter((member) => member.email !== email));
  };

  // Function to save group
  const handleSaveGroup = async () => {
    if (groupName.trim() === '' || members.length === 0) {
      setErrorMessage('Please enter a group name and add at least one member');
      return;
    }
    try {
      // Assuming an endpoint to create a group with members
      await axios.post('/api/groups/create', { name: groupName, members });
      navigate('/'); // Redirect to homepage after saving
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to create group. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mt-6">Create Group</h1>

      <div className="w-11/12 md:w-3/4 lg:w-1/2 mt-4 bg-white p-6 rounded-lg shadow-md">
        {/* Display error message at the top */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {/* Group Name Input */}
        <div>
          <label htmlFor="groupName" className="block text-gray-700 font-medium">
            Group Name
          </label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mt-2 px-3 py-2 border rounded w-full"
            placeholder="Enter group name"
          />
        </div>

        {/* Member Email Input */}
        <div className="mt-4">
          <label htmlFor="memberEmail" className="block text-gray-700 font-medium">
            Add Member by Email
          </label>
          <div className="flex mt-2">
            <input
              id="memberEmail"
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="px-3 py-2 border rounded-l w-full"
              placeholder="Enter email to add"
            />
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r"
            >
              Add
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="mt-6">
          <p className="font-medium text-gray-700">Group Members</p>
          <ul className="mt-2 space-y-2">
            {members.map((member) => (
              <li key={member.email} className="flex items-center justify-between">
                <span>{member.email}</span>
                <button
                  onClick={() => handleRemoveMember(member.email)}
                  className="text-red-500 font-semibold text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {members.length === 0 && <p className="text-gray-500 mt-2">No members added yet.</p>}
        </div>

        {/* Save Group Button */}
        <button
          onClick={handleSaveGroup}
          className="w-full mt-6 py-2 bg-green-500 text-white font-semibold rounded"
        >
          Save Group
        </button>
      </div>
      <Navbar />
    </div>
  );
}

export default GroupPage;