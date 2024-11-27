// src/components/AddReceipt.js
import React, { useState } from 'react';

function AddReceipt() {
  // Mock data for testing purposes
  const [receipts, setReceipts] = useState([
    { id: '1', amount: 100, date: '2024-11-26', description: 'Dinner' },
    { id: '2', amount: 50, date: '2024-11-25', description: 'Taxi' },
  ]);

  const [receipt, setReceipt] = useState({ amount: '', date: '', description: '' });
  const [editId, setEditId] = useState(null); // Track the receipt being edited

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const addOrUpdateReceipt = async () => {
    if (receipt.amount && receipt.date) {
      if (editId) {
        // Update an existing receipt
        setReceipts((prev) =>
          prev.map((item) =>
            item.id === editId
              ? { ...item, amount: parseFloat(receipt.amount), date: receipt.date, description: receipt.description }
              : item
          )
        );
        setEditId(null); // Reset edit mode
      } else {
        // Add a new receipt
        setReceipts((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 15), // Generate a mock ID for the new receipt
            amount: parseFloat(receipt.amount),
            date: receipt.date,
            description: receipt.description,
          },
        ]);
      }
      setReceipt({ amount: '', date: '', description: '' }); // Reset form
    }
  };

  const deleteReceipt = (id) => {
    // Delete a receipt
    setReceipts((prev) => prev.filter((item) => item.id !== id));
  };

  const startEdit = (id) => {
    // Start editing a receipt
    const receiptToEdit = receipts.find((item) => item.id === id);
    setReceipt({ amount: receiptToEdit.amount, date: receiptToEdit.date, description: receiptToEdit.description });
    setEditId(id); // Set the ID of the receipt being edited
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
          <button className="btn btn-primary" onClick={addOrUpdateReceipt}>
            {editId ? 'Update Receipt' : 'Save Receipt'}
          </button>
        </div>

        {receipts.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Current Receipts:</h3> {/* Added the subheading here */}
            <ul>
              {receipts.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span>
                    ${item.amount.toFixed(2)} on {item.date} - {item.description}
                  </span>
                  <div>
                    <button
                      className="btn btn-sm btn-secondary mr-2"
                      onClick={() => startEdit(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => deleteReceipt(item.id)}
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