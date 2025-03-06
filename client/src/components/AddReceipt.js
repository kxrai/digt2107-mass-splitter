import React, { useState } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

function AddReceipt({ receipts, setReceipts }) {
  const [receipt, setReceipt] = useState({
    id: "",
    amount: "",
    date: "",
    description: "",
    groupName: "",
  });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const fetchGroupByName = async (groupName) => {
    try {
      console.log("Fetching group by name:", groupName);
      const response = await fetch(`/api/groups/name/${groupName}`);
      console.log("Response status:", response?.status);

      if (!response || !response.ok) {
        throw new Error("Group not found");
      }

      const data = await response.json();
      console.log("Fetched group data:", data);
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

        if (editId) {
          setReceipts((prev) =>
            prev.map((item) =>
              item.date === editId
                ? { ...item, ...receiptData }
                : item
            )
          );
        } else {
          setReceipts((prev) => [
            ...prev,
            {
              id: data.id || receipt.date,
              ...receiptData,
            },
          ]);
        }

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