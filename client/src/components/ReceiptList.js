import React, { useState, useRef } from 'react';
import { PencilSquareIcon, CalendarIcon } from '@heroicons/react/24/outline';

function ReceiptList({ receipts, setReceipts }) {
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [editedValues, setEditedValues] = useState({ id: '', amount: '', date: '', description: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const dateInputRef = useRef(null); // Reference to the date input

  // Open Edit Modal & Populate Fields
  const editReceipt = (id) => {
    const existingReceipt = receipts.find((r) => r.id === id);
    if (existingReceipt) {
      setEditingReceipt(existingReceipt.id);
      setEditedValues(existingReceipt);
      setShowEditModal(true);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedValues((prev) => ({ ...prev, [name]: value }));
  };

  // Save Changes to Receipt
  const saveChanges = () => {
    setReceipts((prevReceipts) =>
      prevReceipts.map((r) => (r.id === editingReceipt ? { ...r, ...editedValues } : r))
    );
    setShowEditModal(false);
  };

  return (
    <div className="card bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-800">Added Receipts</h2>
      {receipts.length === 0 ? (
        <p className="text-gray-500">No receipts added yet.</p>
      ) : (
        <ul className="list-disc list-inside">
          {receipts.map((receipt) => (
            <li key={receipt.id} className="flex justify-between items-center p-2 bg-gray-100 rounded mb-2">
              <div>
                <p><span className="font-semibold">${Number(receipt.amount).toFixed(2)}</span> - {receipt.description || 'No description'}</p>
                <p className="text-sm text-gray-500">{receipt.date}</p>
              </div>
              <button
                className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                onClick={() => editReceipt(receipt.id)}
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* DaisyUI Edit Modal*/}
      {showEditModal && (
        <dialog className="modal modal-open">
          <div className="modal-box" style={{ backgroundColor: '#cff3e8' }}> {/* Light blue modal */}
            <h3 className="font-bold text-lg text-blue-900">Edit Receipt</h3>

            {/* Amount Input */}
            <label for="amount" className="label text-blue-700">Total Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={editedValues.amount}
              onChange={handleChange}
              className="input input-bordered mb-4 w-full text-blue-900 bg-white"
            />

            {/* Date Input */}
            <label for="date" className="label text-blue-700">Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                id="date"
                ref={dateInputRef} // Reference for triggering
                value={editedValues.date}
                onChange={handleChange}
                className="input input-bordered w-full text-blue-900 bg-white"
              />
            </div>

            {/* Description Input */}
            <label for="description" className="label text-blue-700">Description</label>
            <textarea
              name="description"
              id="description"
              value={editedValues.description}
              onChange={handleChange}
              className="textarea textarea-bordered mb-4 w-full text-blue-900 bg-white"
            />

            {/* Modal Action Buttons */}
            <div className="modal-action">
              <button className="btn btn-error" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={saveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default ReceiptList;
