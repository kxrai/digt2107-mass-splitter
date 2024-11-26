// src/components/PartyMembers.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserPlusIcon } from '@heroicons/react/24/outline'; // Updated import path and icon name

function PartyMembers({ partyMembers, setPartyMembers }) {
  const [memberName, setMemberName] = useState('');

  const addMember = () => {
    if (memberName) {
      setPartyMembers([
        ...partyMembers,
        { id: uuidv4(), name: memberName },
      ]);
      setMemberName('');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Add Party Members</h2>
        <div className="form-control">
          <label className="label">Member Name</label>
          <input
            type="text"
            placeholder="e.g., Alice"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="input input-bordered mb-4"
          />
          <button className="btn btn-secondary" onClick={addMember}>
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>
        {partyMembers.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Current Party Members:</h3>
            <ul className="list-disc list-inside">
              {partyMembers.map((member) => (
                <li key={member.id}>{member.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default PartyMembers;
