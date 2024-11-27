// // src/components/BillEntry.js
// import React, { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { PlusIcon } from '@heroicons/react/24/outline'; // Updated import path

// function BillEntry({ billItems, setBillItems }) {
//   const [item, setItem] = useState({ name: '', cost: '' });

//   const handleChange = (e) => {
//     setItem({ ...item, [e.target.name]: e.target.value });
//   };

//   const addBillItem = () => {
//     if (item.name && item.cost) {
//       setBillItems([
//         ...billItems,
//         { id: uuidv4(), name: item.name, cost: parseFloat(item.cost) },
//       ]);
//       setItem({ name: '', cost: '' });
//     }
//   };

//   return (
//     <div className="card bg-base-100 shadow-xl">
//       <div className="card-body">
//         <h2 className="card-title">Enter Bill Items</h2>
//         <div className="form-control">
//           <label className="label">Item Name</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="e.g., Burger"
//             value={item.name}
//             onChange={handleChange}
//             className="input input-bordered mb-4"
//           />
//           <label className="label">Item Cost ($)</label>
//           <input
//             type="number"
//             name="cost"
//             placeholder="e.g., 12.99"
//             value={item.cost}
//             onChange={handleChange}
//             className="input input-bordered mb-4"
//           />
//           <button className="btn btn-primary" onClick={addBillItem}>
//             <PlusIcon className="h-5 w-5 mr-2" />
//             Add Item
//           </button>
//         </div>
//         {billItems.length > 0 && (
//           <div className="mt-4">
//             <h3 className="font-bold">Current Bill Items:</h3>
//             <ul className="list-disc list-inside">
//               {billItems.map((billItem) => (
//                 <li key={billItem.id}>
//                   {billItem.name}: ${billItem.cost.toFixed(2)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default BillEntry;

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline'; // Updated imports

function BillEntry({ billItems, setBillItems }) {
  const [item, setItem] = useState({ title: '', name: '', cost: '' });
  const [editItem, setEditItem] = useState(null); // Track the item being edited

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditItem({ ...editItem, [e.target.name]: e.target.value });
  };

  const addBillItem = () => {
    if (item.title && item.name && item.cost) {
      setBillItems([
        ...billItems,
        { id: uuidv4(), title: item.title, name: item.name, cost: parseFloat(item.cost) },
      ]);
      setItem({ title: '', name: '', cost: '' });
    }
  };

  const updateBillItem = (id) => {
    setBillItems(
      billItems.map((billItem) =>
        billItem.id === id ? { ...billItem, ...editItem } : billItem
      )
    );
    setEditItem(null); // Exit edit mode
  };

  const deleteBillItem = (id) => {
    setBillItems(billItems.filter((billItem) => billItem.id !== id));
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Enter Bill Items</h2>
        <div className="form-control">
          {/* Title Field */}
          <label className="label">Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Dinner with Friends"
            value={item.title}
            onChange={handleChange}
            className="input input-bordered mb-4"
          />
          {/* Item Name Field */}
          <label className="label">Item Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Burger"
            value={item.name}
            onChange={handleChange}
            className="input input-bordered mb-4"
          />
          {/* Item Cost Field */}
          <label className="label">Item Cost ($)</label>
          <input
            type="number"
            name="cost"
            placeholder="e.g., 12.99"
            value={item.cost}
            onChange={handleChange}
            className="input input-bordered mb-4"
          />
          {/* Add Button */}
          <button className="btn btn-primary" onClick={addBillItem}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>
        {billItems.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Current Bill Items:</h3>
            <ul className="space-y-4">
              {billItems.map((billItem) => (
                <li key={billItem.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  {editItem && editItem.id === billItem.id ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        name="title"
                        placeholder="Edit title"
                        value={editItem.title}
                        onChange={handleEditChange}
                        className="input input-bordered w-full"
                      />
                      <input
                        type="text"
                        name="name"
                        placeholder="Edit name"
                        value={editItem.name}
                        onChange={handleEditChange}
                        className="input input-bordered w-full"
                      />
                      <input
                        type="number"
                        name="cost"
                        placeholder="Edit cost"
                        value={editItem.cost}
                        onChange={handleEditChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">{billItem.title}</p>
                      <p>{billItem.name}: ${billItem.cost.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    {editItem && editItem.id === billItem.id ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateBillItem(billItem.id)}
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => setEditItem(billItem)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => deleteBillItem(billItem.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
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

export default BillEntry;
