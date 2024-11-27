// // src/components/AddReceipt.js
// import React, { useState } from 'react';
// import { DocumentPlusIcon } from '@heroicons/react/24/outline'; 
// import { v4 as uuidv4 } from 'uuid';

// function AddReceipt({ receipts, setReceipts }) {
//   const [receipt, setReceipt] = useState({ amount: '', date: '', description: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setReceipt((prev) => ({ ...prev, [name]: value }));
//   };

//   const addReceipt = async () => {
//     if (receipt.amount && receipt.date) {
//       try {
//         const response = await fetch('http://localhost:3000/api/receipts/create', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 total_amount: 100.0,
//                 receipt_date: '2024-11-01',
//                 group_id: 1,
//                 billers: 'John', // Make sure this aligns with your database schema
//             }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setReceipts([
//             ...receipts,
//             {
//               id: uuidv4(),
//               amount: parseFloat(receipt.amount),
//               date: receipt.date,
//               description: receipt.description,
//             },
//           ]);  
//           setReceipt({ amount: '', date: '', description: '' });
//         } else {
//             alert('Please enter both amount and date for the receipt.');
//             console.log(data.error || 'Failed to add receipt');
//         }
//       } catch (error) {
//         console.log('Failed to connect to the server');
//       }
//     };
//   };

//   return (
//     <div className="card bg-base-100 shadow-xl">
//       <div className="card-body">
//         <h2 className="card-title flex items-center">
//           <DocumentPlusIcon className="h-5 w-5 mr-2" />
//           Add Receipt
//         </h2>
//         <div className="form-control">
//           {/* Added id and aria-label for better accessibility and testing */}
//           <label htmlFor="amount" className="label">Total Amount</label>
//           <input
//             type="number"
//             name="amount"
//             id="amount"                          
//             aria-label="Total Amount"            
//             placeholder="e.g., 50.00"
//             value={receipt.amount}
//             onChange={handleChange}
//             className="input input-bordered mb-4"
//             required
//           />
//           {/* Added id and aria-label for better accessibility and testing */}
//           <label htmlFor="date" className="label">Date</label>
//           <input
//             type="date"
//             name="date"
//             id="date"                             
//             aria-label="Date"                    
//             value={receipt.date}
//             onChange={handleChange}
//             className="input input-bordered mb-4"
//             required
//           />
//           {/* Added id and aria-label for better accessibility and testing */}
//           <label htmlFor="description" className="label">Description (Optional)</label>
//           <textarea
//             name="description"
//             id="description"                     
//             aria-label="Description"             
//             placeholder="e.g., Dinner at restaurant"
//             value={receipt.description}
//             onChange={handleChange}
//             className="textarea textarea-bordered mb-4"
//           />
//           <button className="btn btn-primary" onClick={addReceipt}>
//             <DocumentPlusIcon className="h-5 w-5 mr-2" />
//             Save Receipt
//           </button>
//         </div>
//         {receipts.length > 0 && (
//           <div className="mt-4">
//             <h3 className="font-bold">Current Receipts:</h3>
//             <ul className="list-disc list-inside">
//               {receipts.map((receiptItem) => (
//                 <li key={receiptItem.id}>
//                   ${receiptItem.amount.toFixed(2)} on {receiptItem.date} - {receiptItem.description}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AddReceipt;

import React, { useState } from 'react';
import { DocumentPlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import '../App.css';


function AddReceipt({ receipts, setReceipts }) {
  const [receipt, setReceipt] = useState({ id: '', amount: '', date: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(1); // Default split count is 1

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const addOrUpdateReceipt = () => {
    if (receipt.amount && receipt.date) {
      if (isEditing) {
        // Update receipt
        setReceipts((prevReceipts) =>
          prevReceipts.map((r) =>
            r.id === receipt.id ? { ...receipt, amount: parseFloat(receipt.amount) } : r
          )
        );
        setIsEditing(false);
      } else {
        // Add receipt
        const newReceipt = {
          id: uuidv4(),
          amount: parseFloat(receipt.amount),
          date: receipt.date,
          description: receipt.description,
        };
        setReceipts([...receipts, newReceipt]);
      }
      setReceipt({ id: '', amount: '', date: '', description: '' });
    } else {
      alert('Please provide both amount and date for the receipt.');
    }
  };

  const editReceipt = (id) => {
    const existingReceipt = receipts.find((r) => r.id === id);
    if (existingReceipt) {
      setReceipt(existingReceipt);
      setIsEditing(true);
    }
  };

  const deleteReceipt = (id) => {
    setReceipts((prevReceipts) => prevReceipts.filter((r) => r.id !== id));
  };

  const toggleSelectReceipt = (id) => {
    if (selectedReceipts.includes(id)) {
      setSelectedReceipts(selectedReceipts.filter((receiptId) => receiptId !== id));
    } else {
      setSelectedReceipts([...selectedReceipts, id]);
    }
  };

  const selectAllReceipts = () => {
    if (selectedReceipts.length === receipts.length) {
      // Deselect all if everything is already selected
      setSelectedReceipts([]);
    } else {
      // Select all
      setSelectedReceipts(receipts.map((r) => r.id));
    }
  };

  const calculateCombinedSplit = () => {
    const selected = receipts.filter((r) => selectedReceipts.includes(r.id));
    const totalAmount = selected.reduce((sum, receipt) => sum + receipt.amount, 0);
    const splitEvenly = splitCount > 0 ? (totalAmount / splitCount).toFixed(2) : 0;
    return { totalAmount, splitEvenly };
  };

  const openSplitModal = () => {
    if (selectedReceipts.length === 0) {
      alert('Please select at least one receipt to split.');
      return;
    }
    setSplitModalOpen(true);
  };

  return (
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
          <button className="btn bg-blue-500 text-white hover:bg-blue-600" onClick={addOrUpdateReceipt}>
            <DocumentPlusIcon className="h-5 w-5 mr-2" />
            {isEditing ? 'Update Receipt' : 'Add Receipt'}
          </button>
        </div>
        {receipts.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold text-blue-800">Current Receipts:</h3>
            <button
              className="btn btn-outline bg-blue-100 hover:bg-blue-200 text-blue-800 mt-2 mb-4"
              onClick={selectAllReceipts}
            >
              {selectedReceipts.length === receipts.length ? 'Deselect All' : 'Select All'}
            </button>
            <ul className="space-y-2">
              {receipts.map((receiptItem) => (
                <li key={receiptItem.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                <div>
                  <p className="font-semibold">
                    ${receiptItem.amount.toFixed(2)} - {receiptItem.description || 'No description'}
                  </p>
                  <p className="text-sm text-gray-500">{receiptItem.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: '#A3E4A5', color: 'white' }} // Pastel green
                    onClick={() => editReceipt(receiptItem.id)}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteReceipt(receiptItem.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>

              ))}
            </ul>
            <button
              className="btn bg-blue-500 text-white hover:bg-blue-600 mt-4"
              onClick={openSplitModal}
            >
              Split Selected Evenly
            </button>
          </div>
        )}
        {splitModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box bg-blue-50">
              <h3 className="font-bold text-lg text-blue-800">Split Selected Receipts Evenly</h3>
              <div className="mt-4">
                <label htmlFor="splitCount" className="label text-blue-700">Number of People</label>
                <input
                  type="number"
                  id="splitCount"
                  value={splitCount}
                  onChange={(e) => setSplitCount(parseInt(e.target.value) || 1)}
                  className="input input-bordered mb-4 text-blue-900 bg-white"
                  min="1"
                  placeholder="e.g., 3"
                />
                <p>Total Amount: <span className="font-bold text-blue-800">${calculateCombinedSplit().totalAmount.toFixed(2)}</span></p>
                <p>Split Amount per Person: <span className="font-bold text-blue-800">${calculateCombinedSplit().splitEvenly}</span></p>
              </div>
              <div className="modal-action">
                <button
                  className="btn bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setSplitModalOpen(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddReceipt;
