import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../App.css';

function SplitBill() {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [splitType, setSplitType] = useState('even');
  const [splitPercentages, setSplitPercentages] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [billers, setBiller] = useState([]);

  // Load stored receipts and group details from localStorage
  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
    setReceipts(storedReceipts);

    const storedGroup = localStorage.getItem('selectedGroup') || null;
    setSelectedGroup(storedGroup);
    console.log(selectedGroup);
  }, []);
  useEffect(() => {
    if (!selectedGroup) return; // Prevent fetch if selectedGroup is null

    const fetchGroupDetails = async () => {
      const response = await fetch(`http://localhost:3000/api/groups/members/${selectedGroup}`, { method: 'GET', headers: {
        'Cache-Control': 'no-cache',  // Disable cache
        'Pragma': 'no-cache',        // Disable cache for older HTTP versions
    } });
      
      if (response.ok) {
        const members = await response.json();
        setGroupMembers(members);
        // Initialize even split (100% divided among members)
        const evenSplit = 100 / groupMembers.length;
        setSplitPercentages(new Array(groupMembers.length).fill(evenSplit));
      }

      //Get the group's biller(s)
      const billerResponse = await fetch(`http://localhost:3000/api/groups/${selectedGroup}`, { method: 'GET', headers: {
        'Cache-Control': 'no-cache',  // Disable cache
        'Pragma': 'no-cache',        // Disable cache for older HTTP versions
    } });
    
      if (billerResponse.ok) {
        const groupDetails = await billerResponse.json();
        setBiller(groupDetails.billers);
      }
    };

    fetchGroupDetails();
  }, [selectedGroup]);

  // Compute total receipt amount
  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

  // Handle Split Type Change
  const handleSplitTypeChange = (event) => {
    setSplitType(event.target.value);
  };

  // Adjust Split Percentage While Keeping Total 100%
  const handleCustomSplitChange = (index, value) => {
    let newPercentages = [...splitPercentages];
    newPercentages[index] = parseFloat(value);
  
    // Ensure no negative or NaN values
    if (isNaN(newPercentages[index]) || newPercentages[index] < 0) {
      newPercentages[index] = 0;
    }
    // Calculate the remaining percentage to distribute
    const totalPercentage = newPercentages.reduce((sum, p) => sum + p, 0);
    let excess = totalPercentage - 100;
  
    if (excess !== 0) {
      // Get indices of other members
      let otherIndices = newPercentages
        .map((p, i) => (i !== index ? i : null))
        .filter(i => i !== null);
      let totalOther = otherIndices.reduce((sum, i) => sum + newPercentages[i], 0);
  
      if (totalOther > 0) {
        // Scale down/up other values proportionally
        otherIndices.forEach(i => {
          newPercentages[i] -= (newPercentages[i] / totalOther) * excess;
        });
      }
    }
    // Ensure no floating-point issues
    newPercentages = newPercentages.map(p => Math.max(0, parseFloat(p.toFixed(2))));
    setSplitPercentages(newPercentages);
  };

  // Handle Back Button & Preserve Data
  const handleBack = () => {
    navigate('/create-bill'); // Navigates back to CreateBill page
  };

  return (
    <div className="min-h-screen bg-white p-6 grid-bg">
      <div className="container mx-auto">
        
        {/* Title & Back Button Aligned (Commented Out) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Split Bill</h1>
          {/* <button 
            className="btn btn-outline btn-primary text-lg px-6"
            onClick={handleBack}
          >
            ← Back to Edit
          </button> */}
        </div>

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
                <span>{member.username}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitPercentages[index]}
                  onChange={(e) => handleCustomSplitChange(index, e.target.value)}
                  className="slider w-1/2"
                />
                <span className="font-bold">{(splitPercentages[index] || 0).toFixed(2)}%</span>
                <span className="font-bold">${(((totalAmount * splitPercentages[index]) / 100) || 0).toFixed(2)}</span>
              </div>
            ))}
            <h3 className="mt-4 font-semibold text-center">
              📩 Designated Billers are: {billers}
            </h3>
          </div>
        )}

        {/* Show Split Evenly Breakdown */}
        {splitType === 'even' && totalAmount > 0 && (
          <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-3">Split Evenly Breakdown</h2>
            {groupMembers.map((member, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <span>{member.username} owes:</span>
                <span className="font-bold">${(totalAmount / groupMembers.length).toFixed(2)}</span>
              </div>
            ))}
            <h3 className="mt-4 font-semibold text-center">
              📩 Everyone sends ${(totalAmount / groupMembers.length).toFixed(2)} to {billers}
            </h3>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}

export default SplitBill;
