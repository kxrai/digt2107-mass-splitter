import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

function ReceiptList({ receipts, setReceipts }) {
  const editReceipt = (id) => {
    const existingReceipt = receipts.find((r) => r.id === id);
    if (existingReceipt) {
      alert(`Editing Receipt: ${existingReceipt.description || 'No Description'}`);
      // You can replace this with actual edit functionality
    }
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
                <p><span className="font-semibold">${receipt.amount.toFixed(2)}</span> - {receipt.description || 'No description'}</p>
                <p className="text-sm text-gray-500">{receipt.date}</p>
              </div>
              <button className="btn btn-sm bg-green-500 text-white hover:bg-green-600" onClick={() => editReceipt(receipt.id)}>
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReceiptList;
