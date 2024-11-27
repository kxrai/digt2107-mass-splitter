import React, { useState } from 'react';

function AddReceipt() {
  const [receipts, setReceipts] = useState([]);
  const [receipt, setReceipt] = useState({ id: '', amount: '', date: '', description: '', groupName: '' });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const fetchGroupByName = async (groupName) => {
    try {
      const response = await fetch(`/api/groups/name/${groupName}`);
      if (!response.ok) {
        throw new Error('Group not found');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching group ID:', error);
      alert('Could not find group. Please check the group name.');
      throw error;
    }
  };

  const addOrUpdateReceipt = async () => {
    if (receipt.amount && receipt.date && receipt.groupName) {
      try {
        const group = await fetchGroupByName(receipt.groupName);
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/receipts/${receipt.date}` : '/api/receipts/create';

        const receiptData = {
          amount: parseFloat(receipt.amount),
          date: receipt.date,
          description: receipt.description,
          group_id: group.group_id,
          billers: JSON.parse(group.billers),
        };

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(receiptData),
        });

        if (!response.ok) {
          throw new Error('Failed to save receipt');
        }

        const data = await response.json();

        if (editId) {
          setReceipts((prev) =>
            prev.map((item) => (item.id === editId ? { id: editId, ...receiptData } : item))
          );
        } else {
          setReceipts((prev) => [...prev, { id: data.date, ...receiptData }]);
        }

        setEditId(null);
        setReceipt({ id: '', amount: '', date: '', description: '', groupName: '' });
      } catch (error) {
        console.error('Error saving receipt:', error);
        alert('Failed to save the receipt. Please try again.');
      }
    } else {
      alert('Please fill in all fields, including the group name.');
    }
  };

  const deleteReceipt = async (date, id) => {
    try {
      const response = await fetch(`/api/receipts/${date}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete receipt');
      }
      setReceipts((prev) => prev.filter((item) => item.date !== date));
    } catch (error) {
      console.error('Error deleting receipt:', error);
      alert('Failed to delete the receipt.');
    }
  };

  const startEdit = (date) => {
    const receiptToEdit = receipts.find((item) => item.date === date);
    setReceipt({
      id: receiptToEdit.date,
      amount: receiptToEdit.amount,
      date: receiptToEdit.date,
      description: receiptToEdit.description,
      groupName: receiptToEdit.groupName,
    });
    setEditId(date);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Add Receipt</h2>
        <div className="form-control">
          <input
            type="number"
            name="amount"
            value={receipt.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="input input-bordered mb-4"
          />
          <input
            type="date"
            name="date"
            value={receipt.date}
            onChange={handleChange}
            placeholder="Date"
            className="input input-bordered mb-4"
          />
          <textarea
            name="description"
            value={receipt.description}
            onChange={handleChange}
            placeholder="Description"
            className="textarea textarea-bordered mb-4"
          />
          <input
            type="text"
            name="groupName"
            value={receipt.groupName}
            onChange={handleChange}
            placeholder="Group Name"
            className="input input-bordered mb-4"
          />
          <button className="btn btn-primary" onClick={addOrUpdateReceipt}>
            {editId ? 'Update Receipt' : 'Save Receipt'}
          </button>
        </div>

        {receipts.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Current Receipts:</h3>
            <ul>
              {receipts.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span>
                    ${item.amount.toFixed(2)} on {item.date} - {item.description}
                  </span>
                  <div>
                    <button
                      className="btn btn-sm btn-secondary mr-2"
                      onClick={() => startEdit(item.date)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => deleteReceipt(item.date, item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddReceipt;
