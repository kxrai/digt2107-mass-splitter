import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../App.css';

function SplitBill() {
  const [receipts, setReceipts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [splitType, setSplitType] = useState('even');
  const [splitPercentages, setSplitPercentages] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  // ✅ Load stored receipts and group details
  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
    setReceipts(storedReceipts);

    const storedGroup = JSON.parse(localStorage.getItem('selectedGroup')) || null;
    setSelectedGroup(storedGroup);

    // Dummy group members
    const dummyMembers = ['testAlicia', 'testMahjabin', 'testSienna', 'testSteeve'];
    setGroupMembers(dummyMembers);

    // Initialize even split (100% divided among members)
    const evenSplit = 100 / dummyMembers.length;
    setSplitPercentages(new Array(dummyMembers.length).fill(evenSplit));
  }, []);

  // ✅ Compute total receipt amount
  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

  // ✅ Handle Split Type Change
  const handleSplitTypeChange = (event) => {
    setSplitType(event.target.value);
  };

  // ✅ Adjust Split Percentage While Keeping Total 100%
  const handleCustomSplitChange = (index, value) => {
    let newPercentages = [...splitPercentages];
    newPercentages[index] = parseFloat(value);

    // Ensure total is 100%
    const totalPercentage = newPercentages.reduce((sum, p) => sum + p, 0);
    if (totalPercentage !== 100) {
      const remaining = 100 - newPercentages[index];
      const otherMembers = groupMembers.length - 1;
      const adjustedValue = remaining / otherMembers;

      newPercentages = newPercentages.map((p, i) =>
        i === index ? p : adjustedValue
      );
    }
    
    setSplitPercentages(newPercentages);
  };

  return (
    <div className="min-h-screen bg-white p-6 grid-bg">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Split Bill</h1>

        {/* Display Receipts */}
        <div className="bg-gray-100 p-4 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3">Receipts</h2>
          {receipts.length === 0 ? (
            <p className="text-gray-500 text-center">No receipts available.</p>
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
          <h3 className="text-lg font-semibold mt-4">
            Total: ${totalAmount.toFixed(2)}
          </h3>
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
                  value={splitPercentages[index]}
                  onChange={(e) => handleCustomSplitChange(index, e.target.value)}
                  className="slider w-1/2"
                />
                <span className="font-bold">{splitPercentages[index].toFixed(2)}%</span>
                <span className="font-bold">${((totalAmount * splitPercentages[index]) / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Show Split Evenly Breakdown */}
        {splitType === 'even' && totalAmount > 0 && (
          <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-3">Split Evenly Breakdown</h2>
            {groupMembers.map((member, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <span>{member} owes:</span>
                <span className="font-bold">${(totalAmount / groupMembers.length).toFixed(2)}</span>
              </div>
            ))}
            <h3 className="mt-4 font-semibold text-center">
              📩 Everyone sends ${(totalAmount / groupMembers.length).toFixed(2)} to **dummyUser1**
            </h3>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}

export default SplitBill;
