// src/components/AddReceipt.js
import React, { useState } from 'react';
import { DocumentPlusIcon } from '@heroicons/react/24/outline'; 
import { v4 as uuidv4 } from 'uuid';

function AddReceipt({ receipts, setReceipts }) {
  const [receipt, setReceipt] = useState({ amount: '', date: '', description: '' });
  const [editId, setEditId] = useState(null); // New: Track the receipt being edited

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const addOrUpdateReceipt = async () => {
    if (receipt.amount && receipt.date) {
      try {
        if (editId) {
          // New: Update existing receipt
          const response = await fetch(`http://localhost:3000/api/receipts/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              total_amount: parseFloat(receipt.amount),
              receipt_date: receipt.date,
              group_id: 1,
              billers: 'John',
            }),
          });

          if (response.ok) {
            setReceipts((prev) =>
              prev.map((item) =>
                item.id === editId
                  ? { ...item, amount: parseFloat(receipt.amount), date: receipt.date, description: receipt.description }
                  : item
              )
            );
            setEditId(null); // Reset edit mode
          } else {
            console.error('Failed to update receipt');
          }
        } else {
          // Create new receipt
          const response = await fetch('http://localhost:3000/api/receipts/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              total_amount: parseFloat(receipt.amount),
              receipt_date: receipt.date,
              group_id: 1,
              billers: 'John',
            }),
          });

          const data = await response.json();
          if (response.ok) {
            setReceipts([
              ...receipts,
              { id: data.receiptId, amount: parseFloat(receipt.amount), date: receipt.date, description: receipt.description },
            ]);
          } else {
            console.error('Failed to add receipt');
          }
        }
        setReceipt({ amount: '', date: '', description: '' }); // Reset form
      } catch (error) {
        console.error('Failed to connect to the server');
      }
    }
  };

  const deleteReceipt = async (id) => {
    // New: Delete receipt functionality
    try {
      const response = await fetch(`http://localhost:3000/api/receipts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setReceipts((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete receipt');
      }
    } catch (error) {
      console.error('Failed to connect to the server');
    }
  };

  const startEdit = (id) => {
    // New: Start editing a receipt
    const receiptToEdit = receipts.find((item) => item.id === id);
    setReceipt({ amount: receiptToEdit.amount, date: receiptToEdit.date, description: receiptToEdit.description });
    setEditId(id); // Set the ID of the receipt being edited
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Add Receipt</h2>
        <div className="form-control">
          <input type="number" name="amount" value={receipt.amount} onChange={handleChange} placeholder="Amount" />
          <input type="date" name="date" value={receipt.date} onChange={handleChange} placeholder="Date" />
          <textarea name="description" value={receipt.description} onChange={handleChange} placeholder="Description" />
          <button className="btn btn-primary" onClick={addOrUpdateReceipt}>
            {editId ? 'Update Receipt' : 'Save Receipt'} {/* New: Dynamic button text */}
          </button>
        </div>
        <ul>
          {receipts.map((item) => (
            <li key={item.id}>
              {item.amount} - {item.date} - {item.description}
              <button onClick={() => startEdit(item.id)}>Edit</button> {/* New: Edit button */}
              <button onClick={() => deleteReceipt(item.id)}>Delete</button> {/* New: Delete button */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}