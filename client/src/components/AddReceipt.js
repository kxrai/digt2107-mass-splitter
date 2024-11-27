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

// src/components/AddReceipt.js
import React, { useState } from 'react';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';

function AddReceipt({ receipts, setReceipts }) {
  const [receipt, setReceipt] = useState({ title: '', amount: '', date: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const addReceipt = async () => {
    if (receipt.title && receipt.amount && receipt.date) {
      try {
        const response = await fetch('http://localhost:3000/api/receipts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: receipt.title,
            total_amount: parseFloat(receipt.amount),
            receipt_date: receipt.date,
            group_id: 1, // Example placeholder
            billers: 'John', // Example placeholder
          }),
        });
  
        if (!response.ok) {
          const error = await response.json();
          console.error('Error:', error);
          alert(`Failed to save receipt: ${error.message || 'Unknown error'}`);
          return;
        }
  
        const data = await response.json();
        setReceipts([
          ...receipts,
          {
            id: uuidv4(),
            title: receipt.title,
            amount: parseFloat(receipt.amount),
            date: receipt.date,
            description: receipt.description,
          },
        ]);
        setReceipt({ title: '', amount: '', date: '', description: '' });
      } catch (error) {
        console.error('Failed to connect to the server:', error);
        alert('Failed to connect to the server. Please check your connection.');
      }
    } else {
      alert('Please fill out the title, amount, and date fields.');
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
          {/* Title Field */}
          <label htmlFor="title" className="label">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="e.g., Dinner with Friends"
            value={receipt.title}
            onChange={handleChange}
            className="input input-bordered mb-4"
            required
          />
          {/* Total Amount Field */}
          <label htmlFor="amount" className="label">Total Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="e.g., 50.00"
            value={receipt.amount}
            onChange={handleChange}
            className="input input-bordered mb-4"
            required
          />
          {/* Date Field */}
          <label htmlFor="date" className="label">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={receipt.date}
            onChange={handleChange}
            className="input input-bordered mb-4"
            required
          />
          {/* Description Field */}
          <label htmlFor="description" className="label">Description (Optional)</label>
          <textarea
            name="description"
            id="description"
            placeholder="e.g., Dinner at restaurant"
            value={receipt.description}
            onChange={handleChange}
            className="textarea textarea-bordered mb-4"
          />
          {/* Save Button */}
          <button className="btn btn-primary" onClick={addReceipt}>
            <DocumentPlusIcon className="h-5 w-5 mr-2" />
            Save Receipt
          </button>
        </div>
        {/* Display Current Receipts */}
        {receipts.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Current Receipts:</h3>
            <ul className="list-disc list-inside">
              {receipts.map((receiptItem) => (
                <li key={receiptItem.id}>
                  <p className="font-semibold">{receiptItem.title}</p>
                  <p>${receiptItem.amount.toFixed(2)} on {receiptItem.date}</p>
                  <p>{receiptItem.description}</p>
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
