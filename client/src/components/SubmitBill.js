import React, { useState, useEffect } from 'react';

function SubmitBill({ receipts }) {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState('');
  const [splitMethod, setSplitMethod] = useState('even');
  const [groups, setGroups] = useState([]);

  // Fetch groups from API
  useEffect(() => {
    fetch('/api/groups')
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch((err) => console.error('Error fetching groups:', err));
  }, []);

  const handleSubmitBill = async () => {
    if (!selectedGroup || !selectedReceipt) {
      alert('Please select a group and a receipt.');
      return;
    }

    const billData = {
      group_id: selectedGroup,
      receipt_id: selectedReceipt,
      split_method: splitMethod,
    };

    try {
      const response = await fetch('/api/bills/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData),
      });

      if (response.ok) {
        alert('Bill submitted successfully!');
      } else {
        alert('Failed to submit bill.');
      }
    } catch (error) {
      console.error('Error submitting bill:', error);
    }
  };

  return (
    <div className="card bg-blue-100 shadow-lg p-4">
      <h2 className="text-lg font-bold text-blue-800">Submit Bill</h2>
      
      {/* Select Group */}
      <label className="block mt-2 text-blue-700">Select Group</label>
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="select select-bordered w-full bg-white"
      >
        <option value="">-- Select a Group --</option>
        {groups.map((group) => (
          <option key={group.group_id} value={group.group_id}>
            {group.group_name}
          </option>
        ))}
      </select>

      {/* Select Receipt */}
      <label className="block mt-2 text-blue-700">Select Receipt</label>
      <select
        value={selectedReceipt}
        onChange={(e) => setSelectedReceipt(e.target.value)}
        className="select select-bordered w-full bg-white"
      >
        <option value="">-- Select a Receipt --</option>
        {receipts.map((receipt) => (
          <option key={receipt.id} value={receipt.id}>
            {receipt.description} - ${receipt.amount.toFixed(2)}
          </option>
        ))}
      </select>

      {/* Select Split Option */}
      <label className="block mt-2 text-blue-700">Split Option</label>
      <select
        value={splitMethod}
        onChange={(e) => setSplitMethod(e.target.value)}
        className="select select-bordered w-full bg-white"
      >
        <option value="even">Even Split</option>
        <option value="percentage">Custom Percentage</option>
      </select>

      {/* Submit Bill Button */}
      <button
        className="btn bg-blue-500 text-white hover:bg-blue-600 mt-4 w-full"
        onClick={handleSubmitBill}
      >
        Submit Bill
      </button>
    </div>
  );
}

export default SubmitBill;
