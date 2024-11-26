// src/components/BillEntry.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from '@heroicons/react/24/outline'; // Updated import path

function BillEntry({ billItems, setBillItems }) {
  const [item, setItem] = useState({ name: '', cost: '' });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const addBillItem = () => {
    if (item.name && item.cost) {
      setBillItems([
        ...billItems,
        { id: uuidv4(), name: item.name, cost: parseFloat(item.cost) },
      ]);
      setItem({ name: '', cost: '' });
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Enter Bill Items</h2>
        <div className="form-control">
          <label className="label">Item Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Burger"
            value={item.name}
            onChange={handleChange}
            className="input input-bordered mb-4"
          />
          <label className="label">Item Cost ($)</label>
          <input
            type="number"
            name="cost"
            placeholder="e.g., 12.99"
            value={item.cost}
            onChange={handleChange}
            className="input input-bordered mb-4"
          />
          <button className="btn btn-primary" onClick={addBillItem}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>
        {billItems.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Current Bill Items:</h3>
            <ul className="list-disc list-inside">
              {billItems.map((billItem) => (
                <li key={billItem.id}>
                  {billItem.name}: ${billItem.cost.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default BillEntry;
