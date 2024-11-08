// src/components/AddReceipt.js
import React, { useState } from 'react';
import { DocumentPlusIcon } from '@heroicons/react/24/outline'; // Will need to change icon for a receipt icon instead
import { v4 as uuidv4 } from 'uuid';

function AddReceipt({ receipts, setReceipts }) {
  const [receipt, setReceipt] = useState({ amount: '', date: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const addReceipt = () => {
    if (receipt.amount && receipt.date) {
      setReceipts([
        ...receipts,
        {
          id: uuidv4(),
          amount: parseFloat(receipt.amount),
          date: receipt.date,
          description: receipt.description,
        },
      ]);
      setReceipt({ amount: '', date: '', description: '' });
    } else {
      alert('Please enter both amount and date for the receipt.');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center">
          <DocumentPlusIcon className="h-5 w-5 mr-2" />
          Add Receipt
        </h2>
        <div className="form-control">
          <label className="label">Total Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="e.g., 50.00"
            value={receipt.amount}
            onChange={handleChange}
            className="input input-bordered mb-4"
            required
          />
          <label className="label">Date</label>
          <input
            type="date"
            name="date"
            value={receipt.date}
            onChange={handleChange}
            className="input input-bordered mb-4"
            required
          />
          <label className="label">Description (Optional)</label>
          <textarea
            name="description"
            placeholder="e.g., Dinner at restaurant"
            value={receipt.description}
            onChange={handleChange}
            className="textarea textarea-bordered mb-4"
          />
          <button className="btn btn-primary" onClick={addReceipt}>
            <DocumentPlusIcon className="h-5 w-5 mr-2" />
            Save Receipt
          </button>
        </div>
        {receipts.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Current Receipts:</h3>
            <ul className="list-disc list-inside">
              {receipts.map((receiptItem) => (
                <li key={receiptItem.id}>
                  ${receiptItem.amount.toFixed(2)} on {receiptItem.date} - {receiptItem.description}
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