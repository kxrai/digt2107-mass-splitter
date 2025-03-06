// import React, { useState } from 'react';

// function AddReceipt() {
//   const [receipts, setReceipts] = useState([]);
//   const [receipt, setReceipt] = useState({ id: '', amount: '', date: '', description: '', groupName: '' });
//   const [editId, setEditId] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setReceipt((prev) => ({ ...prev, [name]: value }));
//   };

//   const fetchGroupByName = async (groupName) => {
//     try {
//       const response = await fetch(`/api/groups/name/${groupName}`);
//       if (!response.ok) {
//         throw new Error('Group not found');
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching group ID:', error);
//       alert('Could not find group. Please check the group name.');
//       throw error;
//     }
//   };

//   const addOrUpdateReceipt = async () => {
//     if (receipt.amount && receipt.date && receipt.groupName) {
//       try {
//         const group = await fetchGroupByName(receipt.groupName);
//         const method = editId ? 'PUT' : 'POST';
//         const url = editId ? `/api/receipts/${receipt.date}` : '/api/receipts/create';

//         const receiptData = {
//           amount: parseFloat(receipt.amount),
//           date: receipt.date,
//           description: receipt.description,
//           group_id: group.group_id,
//           billers: JSON.parse(group.billers),
//         };

//         const response = await fetch(url, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(receiptData),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to save receipt');
//         }

//         const data = await response.json();

//         if (editId) {
//           setReceipts((prev) =>
//             prev.map((item) => (item.id === editId ? { id: editId, ...receiptData } : item))
//           );
//         } else {
//           setReceipts((prev) => [...prev, { id: data.date, ...receiptData }]);
//         }

//         setEditId(null);
//         setReceipt({ id: '', amount: '', date: '', description: '', groupName: '' });
//       } catch (error) {
//         console.error('Error saving receipt:', error);
//         alert('Failed to save the receipt. Please try again.');
//       }
//     } else {
//       alert('Please fill in all fields, including the group name.');
//     }
//   };

//   const deleteReceipt = async (date, id) => {
//     try {
//       const response = await fetch(`/api/receipts/${date}`, { method: 'DELETE' });
//       if (!response.ok) {
//         throw new Error('Failed to delete receipt');
//       }
//       setReceipts((prev) => prev.filter((item) => item.date !== date));
//     } catch (error) {
//       console.error('Error deleting receipt:', error);
//       alert('Failed to delete the receipt.');
//     }
//   };

//   const startEdit = (date) => {
//     const receiptToEdit = receipts.find((item) => item.date === date);
//     setReceipt({
//       id: receiptToEdit.date,
//       amount: receiptToEdit.amount,
//       date: receiptToEdit.date,
//       description: receiptToEdit.description,
//       groupName: receiptToEdit.groupName,
//     });
//     setEditId(date);
//   };

//   return (
//     <div className="card bg-base-100 shadow-xl">
//       <div className="card-body">
//         <h2 className="card-title">Add Receipt</h2>
//         <div className="form-control">
//           <input
//             type="number"
//             name="amount"
//             value={receipt.amount}
//             onChange={handleChange}
//             placeholder="Amount"
//             className="input input-bordered mb-4"
//           />
//           <input
//             type="date"
//             name="date"
//             value={receipt.date}
//             onChange={handleChange}
//             placeholder="Date"
//             className="input input-bordered mb-4"
//           />
//           <textarea
//             name="description"
//             value={receipt.description}
//             onChange={handleChange}
//             placeholder="Description"
//             className="textarea textarea-bordered mb-4"
//           />
//           <input
//             type="text"
//             name="groupName"
//             value={receipt.groupName}
//             onChange={handleChange}
//             placeholder="Group Name"
//             className="input input-bordered mb-4"
//           />
//           <button className="btn btn-primary" onClick={addOrUpdateReceipt}>
//             {editId ? 'Update Receipt' : 'Save Receipt'}
//           </button>
//         </div>

//         {receipts.length > 0 && (
//           <div className="mt-4">
//             <h3 className="font-bold">Current Receipts:</h3>
//             <ul>
//               {receipts.map((item) => (
//                 <li key={item.id} className="flex items-center justify-between">
//                   <span>
//                     ${item.amount.toFixed(2)} on {item.date} - {item.description}
//                   </span>
//                   <div>
//                     <button
//                       className="btn btn-sm btn-secondary mr-2"
//                       onClick={() => startEdit(item.date)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-error"
//                       onClick={() => deleteReceipt(item.date, item.id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
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


// import React, { useState } from 'react';
// import { DocumentPlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

// function AddReceipt() {
//   const [receipts, setReceipts] = useState([]);
//   const [receipt, setReceipt] = useState({ 
//     id: '', 
//     amount: '', 
//     date: '', 
//     description: '', 
//     groupName: '' 
//   });
//   const [editId, setEditId] = useState(null);
//   const [selectedReceipts, setSelectedReceipts] = useState([]);
//   const [splitModalOpen, setSplitModalOpen] = useState(false);
//   const [splitCount, setSplitCount] = useState(1);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setReceipt((prev) => ({ ...prev, [name]: value }));
//   };

//   const fetchGroupByName = async (groupName) => {
//     try {
//       const response = await fetch(`/api/groups/name/${groupName}`);
//       if (!response.ok) {
//         throw new Error('Group not found');
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching group ID:', error);
//       alert('Could not find group. Please check the group name.');
//       throw error;
//     }
//   };

//   const addOrUpdateReceipt = async () => {
//     if (receipt.amount && receipt.date && receipt.groupName) {
//       try {
//         const group = await fetchGroupByName(receipt.groupName);
//         const method = editId ? 'PUT' : 'POST';
//         const url = editId ? `/api/receipts/${receipt.date}` : '/api/receipts/create';

//         const receiptData = {
//           amount: parseFloat(receipt.amount),
//           date: receipt.date,
//           description: receipt.description,
//           group_id: group.group_id,
//           billers: JSON.parse(group.billers),
//         };

//         const response = await fetch(url, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(receiptData),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to save receipt');
//         }

//         const data = await response.json();

//         // Update the receipts state properly
//         if (editId) {
//           setReceipts(prev => prev.map(item => 
//             item.date === editId 
//               ? {
//                   ...item,
//                   amount: receiptData.amount,
//                   date: receiptData.date,
//                   description: receiptData.description,
//                   groupName: receipt.groupName,
//                   group_id: group.group_id,
//                   billers: receiptData.billers
//                 }
//               : item
//           ));
//         } else {
//           const newReceipt = {
//             id: data.date, // or use data.id if your API returns one
//             date: receiptData.date,
//             amount: receiptData.amount,
//             description: receiptData.description,
//             groupName: receipt.groupName,
//             group_id: group.group_id,
//             billers: receiptData.billers
//           };
//           setReceipts(prev => [...prev, newReceipt]);
//         }

//         // Reset the form
//         setEditId(null);
//         setReceipt({ id: '', amount: '', date: '', description: '', groupName: '' });
//       } catch (error) {
//         console.error('Error saving receipt:', error);
//         alert('Failed to save the receipt. Please try again.');
//       }
//     } else {
//       alert('Please fill in all fields, including the group name.');
//     }
//   };

//   const startEdit = (date) => {
//     const receiptToEdit = receipts.find((item) => item.date === date);
//     if (receiptToEdit) {
//       setReceipt({
//         id: receiptToEdit.date,
//         amount: String(receiptToEdit.amount), // Convert to string for input field
//         date: receiptToEdit.date,
//         description: receiptToEdit.description, // '',
//         groupName: receiptToEdit.groupName // '',
//       });
//       setEditId(date);
//     }
//   };
//   const deleteReceipt = async (date, id) => {
//     try {
//       const response = await fetch(`/api/receipts/${date}`, { method: 'DELETE' });
//       if (!response.ok) {
//         throw new Error('Failed to delete receipt');
//       }
//       setReceipts((prev) => prev.filter((item) => item.date !== date));
//       setSelectedReceipts(prev => prev.filter(receiptId => receiptId !== id));
//     } catch (error) {
//       console.error('Error deleting receipt:', error);
//       alert('Failed to delete the receipt.');
//     }
//   };

//   const toggleSelectReceipt = (id) => {
//     setSelectedReceipts(prev => 
//       prev.includes(id) ? prev.filter(receiptId => receiptId !== id) : [...prev, id]
//     );
//   };

//   const selectAllReceipts = () => {
//     setSelectedReceipts(prev => 
//       prev.length === receipts.length ? [] : receipts.map(r => r.id)
//     );
//   };

//   const calculateCombinedSplit = () => {
//     const selected = receipts.filter(r => selectedReceipts.includes(r.id));
//     const totalAmount = selected.reduce((sum, receipt) => sum + parseFloat(receipt.amount), 0);
//     const splitEvenly = splitCount > 0 ? (totalAmount / splitCount).toFixed(2) : 0;
//     return { totalAmount, splitEvenly };
//   };

//   return (
//     <div className="card bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl">
//       <div className="card-body">
//         <h2 className="card-title flex items-center text-blue-800">
//           <DocumentPlusIcon className="h-5 w-5 mr-2" />
//           {editId ? 'Edit Receipt' : 'Add Receipt'}
//         </h2>
//         <div className="form-control">
//           <label htmlFor="amount" className="label text-blue-700">Total Amount</label>
//           <input
//             type="number"
//             name="amount"
//             id="amount"
//             value={receipt.amount}
//             onChange={handleChange}
//             placeholder="e.g., 50.00"
//             className="input input-bordered mb-4 text-blue-900 bg-white"
//             required
//           />
          
//           <label htmlFor="date" className="label text-blue-700">Date</label>
//           <input
//             type="date"
//             name="date"
//             id="date"
//             value={receipt.date}
//             onChange={handleChange}
//             className="input input-bordered mb-4 text-blue-900 bg-white"
//             required
//           />
          
//           <label htmlFor="description" className="label text-blue-700">Description (Optional)</label>
//           <textarea
//             name="description"
//             id="description"
//             value={receipt.description}
//             onChange={handleChange}
//             placeholder="e.g., Dinner at restaurant"
//             className="textarea textarea-bordered mb-4 text-blue-900 bg-white"
//           />
          
//           <label htmlFor="groupName" className="label text-blue-700">Group Name</label>
//           <input
//             type="text"
//             name="groupName"
//             id="groupName"
//             value={receipt.groupName}
//             onChange={handleChange}
//             placeholder="Enter group name"
//             className="input input-bordered mb-4 text-blue-900 bg-white"
//             required
//           />
          
//           <button 
//             className="btn bg-blue-500 text-white hover:bg-blue-600" 
//             onClick={addOrUpdateReceipt}
//           >
//             <DocumentPlusIcon className="h-5 w-5 mr-2" />
//             {editId ? 'Update Receipt' : 'Add Receipt'}
//           </button>
//         </div>

//         {receipts.length > 0 && (
//           <div className="mt-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-bold text-blue-800">Current Receipts:</h3>
//               <button
//                 className="btn btn-outline bg-blue-100 hover:bg-blue-200 text-blue-800"
//                 onClick={selectAllReceipts}
//               >
//                 {selectedReceipts.length === receipts.length ? 'Deselect All' : 'Select All'}
//               </button>
//             </div>

//             <ul className="space-y-2">
//               {receipts.map((item) => (
//                 <li key={item.id} className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
//                   <div className="flex items-center space-x-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedReceipts.includes(item.id)}
//                       onChange={() => toggleSelectReceipt(item.id)}
//                       className="checkbox"
//                     />
//                     <div>
//                       <p className="font-semibold">
//                         ${parseFloat(item.amount).toFixed(2)} - {item.description || 'No description'}
//                       </p>
//                       <p className="text-sm text-gray-500">{item.date}</p>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       className="btn btn-sm"
//                       style={{ backgroundColor: '#A3E4A5', color: 'white' }}
//                       onClick={() => startEdit(item.date)}
//                     >
//                       <PencilSquareIcon className="h-4 w-4" />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-error"
//                       onClick={() => deleteReceipt(item.date, item.id)}
//                     >
//                       <TrashIcon className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>

//             <button
//               className="btn bg-blue-500 text-white hover:bg-blue-600 mt-4"
//               onClick={() => setSplitModalOpen(true)}
//               disabled={selectedReceipts.length === 0}
//             >
//               Split Selected Evenly
//             </button>
//           </div>
//         )}

//         {splitModalOpen && (
//           <div className="modal modal-open">
//             <div className="modal-box bg-blue-50">
//               <h3 className="font-bold text-lg text-blue-800">Split Selected Receipts Evenly</h3>
//               <div className="mt-4">
//                 <label htmlFor="splitCount" className="label text-blue-700">Number of People</label>
//                 <input
//                   type="number"
//                   id="splitCount"
//                   value={splitCount}
//                   onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
//                   className="input input-bordered mb-4 text-blue-900 bg-white"
//                   min="1"
//                   placeholder="e.g., 3"
//                 />
//                 <p>Total Amount: <span className="font-bold text-blue-800">
//                   ${calculateCombinedSplit().totalAmount.toFixed(2)}
//                 </span></p>
//                 <p>Split Amount per Person: <span className="font-bold text-blue-800">
//                   ${calculateCombinedSplit().splitEvenly}
//                 </span></p>
//               </div>
//               <div className="modal-action">
//                 <button
//                   className="btn bg-blue-500 text-white hover:bg-blue-600"
//                   onClick={() => setSplitModalOpen(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AddReceipt;

import React, { useState } from "react";
import { DocumentPlusIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

function AddReceipt() {
  const [receipts, setReceipts] = useState([]);
  const [receipt, setReceipt] = useState({
    id: "",
    amount: "",
    date: "",
    description: "",
    groupName: "",
  });
  const [editId, setEditId] = useState(null);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Improved fetchGroupByName() function with better debugging
  const fetchGroupByName = async (groupName) => {
    try {
      console.log("Fetching group by name:", groupName); // Debugging

      const response = await fetch(`/api/groups/name/${groupName}`);
      console.log("Response status:", response?.status); // Debugging

      if (!response || !response.ok) {
        throw new Error("Group not found");
      }

      const data = await response.json();
      console.log("Fetched group data:", data); // Debugging
      return data;
    } catch (error) {
      console.error("Error fetching group ID:", error);
      alert("Could not find group. Please check the group name.");
      throw error;
    }
  };

  const addOrUpdateReceipt = async () => {
    if (receipt.amount && receipt.date && receipt.groupName) {
      try {
        const group = await fetchGroupByName(receipt.groupName);
        const method = editId ? "PUT" : "POST";
        const url = editId ? `/api/receipts/${receipt.date}` : "/api/receipts/create";

        const receiptData = {
          amount: parseFloat(receipt.amount),
          date: receipt.date,
          description: receipt.description,
          group_id: group.group_id,
          billers: JSON.parse(group.billers),
        };

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(receiptData),
        });

        if (!response.ok) {
          throw new Error("Failed to save receipt");
        }

        const data = await response.json();

        setReceipts((prev) => {
          if (editId) {
            return prev.map((item) =>
              item.date === editId
                ? { ...item, ...receiptData }
                : item
            );
          } else {
            return [
              ...prev,
              {
                id: data.id || receipt.date,
                ...receiptData,
              },
            ];
          }
        });

        setEditId(null);
        setReceipt({ id: "", amount: "", date: "", description: "", groupName: "" });
      } catch (error) {
        console.error("Error saving receipt:", error);
        alert("Failed to save the receipt. Please try again.");
      }
    } else {
      alert("Please fill in all fields, including the group name.");
    }
  };

  return (
    <div className="card bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center text-blue-800">
          <DocumentPlusIcon className="h-5 w-5 mr-2" />
          {editId ? "Edit Receipt" : "Add Receipt"}
        </h2>
        <div className="form-control">
          <label htmlFor="amount" className="label text-blue-700">Total Amount</label>
          <input type="number" name="amount" id="amount" value={receipt.amount} onChange={handleChange} className="input input-bordered mb-4 text-blue-900 bg-white" required />
          
          <label htmlFor="date" className="label text-blue-700">Date</label>
          <input type="date" name="date" id="date" value={receipt.date} onChange={handleChange} className="input input-bordered mb-4 text-blue-900 bg-white" required />

          <label htmlFor="description" className="label text-blue-700">Description (Optional)</label>
          <textarea name="description" id="description" value={receipt.description} onChange={handleChange} className="textarea textarea-bordered mb-4 text-blue-900 bg-white" />

          <label htmlFor="groupName" className="label text-blue-700">Group Name</label>
          <input type="text" name="groupName" id="groupName" value={receipt.groupName} onChange={handleChange} className="input input-bordered mb-4 text-blue-900 bg-white" required />

          <button className="btn bg-blue-500 text-white hover:bg-blue-600" onClick={addOrUpdateReceipt}>
            <DocumentPlusIcon className="h-5 w-5 mr-2" />
            {editId ? "Update Receipt" : "Add Receipt"}
          </button>
        </div>

        {receipts.length > 0 && (
          <ul className="space-y-2">
            {receipts.map((item) => (
              <li key={item.id || item.date} className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                <div className="flex items-center space-x-4">
                  <p className="font-semibold">${parseFloat(item.amount).toFixed(2)} - {item.description || "No description"}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddReceipt;