import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../App.css';

function SplitBill() {
  const location = useLocation();
  const { receipts, selectedGroup } = location.state || { receipts: [], selectedGroup: null };
  const [splitType, setSplitType] = useState('even');
  const [splitAmounts, setSplitAmounts] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    if (!selectedGroup) return;

    // Fetch group members from backend (dummy data for now)
    const dummyMembers = ['testAlicia', 'testMahjabin', 'testSienna', 'testSteeve'];
    setGroupMembers(dummyMembers);
    
    // Default split (evenly)
    const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const evenSplit = total / dummyMembers.length;
    setSplitAmounts(new Array(dummyMembers.length).fill(evenSplit));
  }, [selectedGroup, receipts]);

  const handleSplitTypeChange = (event) => {
    setSplitType(event.target.value);
  };

  const handleCustomSplitChange = (index, value) => {
    const newSplitAmounts = [...splitAmounts];
    newSplitAmounts[index] = parseFloat(value);
    setSplitAmounts(newSplitAmounts);
  };

  return (
    <div className="min-h-screen bg-white p-6 grid-bg">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Split Bill</h1>

        {/* Display Receipts */}
        <div className="bg-gray-100 p-4 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3">Receipts</h2>
          {receipts.length === 0 ? (
            <p className="text-gray-500">No receipts available.</p>
          ) : (
            <ul>
              {receipts.map((receipt, index) => (
                <li key={index} className="flex justify-between py-2 border-b">
                  <span>{receipt.description || 'No description'}</span>
                  <span className="font-bold">${receipt.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <h3 className="text-lg font-semibold mt-4">Total: ${receipts.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}</h3>
        </div>

        {/* Split Options */}
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-3">Choose Split Type</h2>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input type="radio" value="even" checked={splitType === 'even'} onChange={handleSplitTypeChange} />
              <span>Split Evenly</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" value="custom" checked={splitType === 'custom'} onChange={handleSplitTypeChange} />
              <span>Custom Split</span>
            </label>
          </div>
        </div>

        {/* Custom Split Controls */}
        {splitType === 'custom' && (
          <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-3">Adjust Custom Split</h2>
            {groupMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span>{member}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitAmounts[index]}
                  onChange={(e) => handleCustomSplitChange(index, e.target.value)}
                  className="slider w-1/2"
                />
                <span className="font-bold">${splitAmounts[index].toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}

export default SplitBill;
