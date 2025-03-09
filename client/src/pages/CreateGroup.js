import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import groupPlaceholder from '../assets/group_placeholder.jpg';

function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [billers, setBillers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

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
      const response = await fetch(`http://localhost:3000/api/users/email/${memberEmail}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('User not found');
      }
      const user = await response.json();
      setMembers([...members, { id: user.user_id, email: user.email, name: user.username }]);
      setMemberEmail('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch user');
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter((member) => member.email !== email));
    setBillers(billers.filter((billerEmail) => billerEmail !== email));
  };

  const handleSelectBiller = (name) => {
    if (!members.some((member) => member.name === name)) {
      setErrorMessage('The selected biller must be a member of the group');
      return;
    }
    if (!billers.includes(name)) {
      setBillers([...billers, name]);
      setErrorMessage('');
    }
  };

  const handleDeselectBiller = (name) => {
    setBillers(billers.filter((billerName) => billerName !== name));
  };

  const handleSaveGroup = async () => {
    if (groupName.trim() === '' || members.length === 0) {
      setErrorMessage('Please enter a group name and add at least one member');
      return;
    }

    try {
      const createGroupResponse = await fetch('http://localhost:3000/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_name: groupName, billers: billers }),
      });

      if (!createGroupResponse.ok) {
        throw new Error('Failed to create group');
      }

      const groupData = await createGroupResponse.json();
      const groupId = groupData.groupId;

      for (const member of members) {
        await fetch('http://localhost:3000/api/groups/addMember', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group_id: groupId, user_id: member.id }),
        });
      }
      setErrorMessage('Group created successfully!');
      setTimeout(() => {
        navigate('/home');
      }, 3000);
      
    } catch (error) {
      setErrorMessage('Failed to create group. Please try again.' || error.message);
    }
  };

  const getRandomColor = (groupName) => {
    const colors = ["#F87171", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA", "#F472B6"];
    const index = groupName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-gray-50">
        <h1 className="text-2xl font-semibold mt-6">Create Group</h1>
        <div className="w-11/12 md:w-3/4 lg:w-1/2 mt-4 bg-white p-6 rounded-lg shadow-md">
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
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

          {/* Generated Letter Avatar OR Mock Image */}
          <div className="flex items-center justify-center mt-4">
            {groupName.trim() ? (
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-300 shadow-md"
                style={{ backgroundColor: getRandomColor(groupName) }}
              >
                <span className="text-white text-xl font-bold">
                  {groupName.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <img
                src={groupPlaceholder}
                alt="Group Placeholder"
                className="w-16 h-16 object-cover rounded-full border border-gray-300 shadow-md"
              />
            )}
          </div>

          {/* Member Email Section */}
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
              <button onClick={handleAddMember} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r">
                Add
              </button>
            </div>
          </div>

          {/* Group Members Section */}
          <div className="mt-6">
            <p className="font-medium text-gray-700">Group Members</p>
            <ul className="mt-2 space-y-2">
              {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between">
                  <span>{member.name}</span>
                  <button onClick={() => handleRemoveMember(member.email)} className="text-red-500 font-semibold text-sm">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {members.length === 0 && <p className="text-gray-500 mt-2">No members added yet.</p>}
          </div>

          {/* Designate Billers Section */}
          <div className="mt-6">
            <p className="font-medium text-gray-700">Designate Billers</p>
            <ul className="mt-2 space-y-2">
              {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between">
                  <span>{member.name}</span>
                  {billers.includes(member.name) ? (
                    <button onClick={() => handleDeselectBiller(member.name)} className="text-red-500 font-semibold text-sm">
                      Remove as Biller
                    </button>
                  ) : (
                    <button onClick={() => handleSelectBiller(member.name)} className="text-blue-500 font-semibold text-sm">
                      Add as Biller
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {billers.length === 0 && <p className="text-gray-500 mt-2">No billers designated yet.</p>}
          </div>

          <button onClick={handleSaveGroup} className="w-full mt-6 py-2 bg-green-500 text-white font-semibold rounded">
            Save Group
          </button>
        </div>
        <Navbar />
      </div>
    </>
  );
}

export default CreateGroup;
