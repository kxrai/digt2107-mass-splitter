import React, { useState, useEffect } from 'react';
import { DocumentPlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import '../App.css'; // ✅ Keep the CSS styling

function AddReceipt({ receipts, setReceipts }) {
  const [receipt, setReceipt] = useState({ id: '', amount: '', date: '', description: '', groupId: '' });
  const [groups, setGroups] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch user groups from backend and add "testGroup-1"
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('googleToken'));
        let userGroups = [];

        if (userInfo) {
          const response = await fetch(`http://localhost:5000/api/groups?email=${userInfo.email}`);
          if (response.ok) {
            userGroups = await response.json();
          } else {
            console.error('Failed to fetch user groups');
          }
        }

        // ✅ Ensure "testGroup-1" is always included
        const testGroup = {
          group_id: 9999, // Unique ID for testing
          group_name: "testGroup-1",
          billers: ["testAlicia", "testMahjabin", "testSienna", "testSteeve"],
        };

        // ✅ Merge the test group and fetched groups
        const updatedGroups = [testGroup, ...userGroups];

        // ✅ Log the groups to check if "testGroup-1" is included
        console.log("Fetched Groups:", updatedGroups);

        setGroups(updatedGroups);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

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
      setReceipt({ id: '', amount: '', date: '', description: '', groupId: '' });
    } else {
      alert('Please provide amount, date, and select a group.');
    }
  };

  return (
    <div className="card bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center text-blue-800">
          <DocumentPlusIcon className="h-5 w-5 mr-2" />
          {isEditing ? 'Edit Receipt' : 'Add Receipt'}
        </h2>
        <div className="form-control">
          {/* ✅ Styled Input Fields */}
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

          {/* ✅ Dropdown for Selecting Group */}
          <label htmlFor="groupId" className="label text-blue-700">Select Group</label>
          <select
            name="groupId"
            id="groupId"
            value={receipt.groupId}
            onChange={handleChange}
            className="select select-bordered mb-4 text-blue-900 bg-white"
          >
            <option value="">-- Select a Group --</option>
            {groups.map((group) => (
              <option key={group.group_id} value={group.group_id}>
                {group.group_name}
              </option>
            ))}
          </select>

          {/* ✅ Styled Add Receipt Button */}
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
