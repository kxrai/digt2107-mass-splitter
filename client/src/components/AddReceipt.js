import React, { useState, useEffect, useRef } from 'react';
import { DocumentPlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import '../App.css';

function AddReceipt({ receipts, setReceipts }) {
  const [receipt, setReceipt] = useState({ id: '', amount: '', date: '', description: '', groupId: '' });
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track locked group selection
  const [isEditing, setIsEditing] = useState(false);

  const dateInputRef = useRef(null); // Reference for the date input field

  // Fetch groups user is in
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('googleToken'));

        let userGroups = [];
        if (userInfo) {
          const email = userInfo.email;
          const response = await fetch(`http://localhost:3000/api/groups/email/${email}`, { method: 'GET', headers: {
            'Cache-Control': 'no-cache',  // Disable cache
            'Pragma': 'no-cache',        // Disable cache for older HTTP versions
        } });
          if (response.ok) {
            userGroups = await response.json();
          }
        }
        setGroups(userGroups);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchGroups();
  }, []);

  // Update new value
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  // Add receipt
  const addOrUpdateReceipt = async () => {
    if (receipt.amount && receipt.date && receipt.groupId) {
      const newReceipt = {
        id: uuidv4(),
        amount: parseFloat(receipt.amount),
        date: receipt.date,
        description: receipt.description,
        group_id: receipt.groupId,
      };

      setReceipts([...receipts, newReceipt]);
      setReceipt({ id: '', amount: '', date: '', description: '', groupId: selectedGroup || receipt.groupId });

      // Lock the group selection after first receipt is added
      if (!selectedGroup) setSelectedGroup(receipt.groupId);
      localStorage.setItem('selectedGroup', (receipt.groupId)); // Save group
      console.log(localStorage.getItem('selectedGroup'));
    } else {
      alert('Please provide amount, date, and select a group.');
    }
  };

  return (
    // Form to add receipt
    <div className="card bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center text-blue-800">
          <DocumentPlusIcon className="h-5 w-5 mr-2" />
          {isEditing ? 'Edit Receipt' : 'Add Receipt'}
        </h2>
        <div className="form-control">
          <label htmlFor="amount" className="label text-blue-700">Total Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="e.g., 50.00"
            value={receipt.amount}
            onChange={handleChange}
            className="input input-bordered mb-4 text-blue-900 bg-white"
          />

          <label htmlFor="date" className="label text-blue-700">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              ref={dateInputRef}
              value={receipt.date}
              onChange={handleChange}
              className="input input-bordered mb-4 text-blue-900 bg-white"
            />

          <label htmlFor="description" className="label text-blue-700">Description (Optional)</label>
          <textarea
            name="description"
            id="description"
            placeholder="e.g., Dinner at restaurant"
            value={receipt.description}
            onChange={handleChange}
            className="textarea textarea-bordered mb-4 text-blue-900 bg-white"
          />
          {/* Only display groups a user is in */}
          <label htmlFor="groupId" className="label text-blue-700">Select Group</label>
          <select
            name="groupId"
            id="groupId"
            value={receipt.groupId || selectedGroup || ''}
            onChange={handleChange}
            className="select select-bordered mb-4 text-blue-900 bg-white"
            disabled={!!selectedGroup} // Lock dropdown after first selection
          >
            <option value="">-- Select a Group --</option>
            {groups.map((group) => (
              <option key={group.group_id} value={group.group_id}>
                {group.group_name}
              </option>
            ))}
          </select>

          <button className="btn bg-blue-500 text-white hover:bg-blue-600" onClick={addOrUpdateReceipt}>
            <DocumentPlusIcon className="h-5 w-5 mr-2" />
            {isEditing ? 'Update Receipt' : 'Add Receipt'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddReceipt;
