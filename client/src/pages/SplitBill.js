import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';
import '../App.css';

function SplitBill() {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [splitType, setSplitType] = useState('even');
  const [splitPercentages, setSplitPercentages] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [billers, setBiller] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load stored receipts and group details from localStorage
  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
    setReceipts(storedReceipts);

    const storedGroup = localStorage.getItem('selectedGroup') || null;
    setSelectedGroup(storedGroup);
    console.log(selectedGroup);
  }, []);

  //Fetch Group details (memebers, billers)
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
        const evenSplit = 100 / members.length;
        setSplitPercentages(new Array(members.length).fill(evenSplit));
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

  // Handle Cancel Confirmation Modal
  const handleCancel = () => {
    setShowCancelModal(true); // Open modal
  };

  // Confirm Cancel - Clears Receipts & Resets Group
  const confirmCancel = () => {
    localStorage.removeItem('receipts');
    localStorage.removeItem('selectedGroup');
    navigate('/create-bill'); // Redirect to add receipt process
  };

  // Handle Confirm Click - Open Confirmation Modal Before Proceeding
  const handleConfirmClick = () => {
    if (splitPercentages.reduce((sum, p) => sum + p, 0) !== 100 && splitType == 'custom') return;
    setShowConfirmModal(true); // Show confirm modal before proceeding
  };

  // Confirm & Proceed to Save Bill
  const confirmProceed = async () => {
    // Step 1: Save all the receipts in the database
    try {
      const receiptPromises = receipts.map((receipt) =>
        fetch(`http://localhost:3000/api/receipts/create`, {method: "POST", headers: { "Content-Type": "application/json", },
          body: JSON.stringify({
            amount: receipt.amount,
            date: receipt.date,
            description: receipt.description,
            group_id: selectedGroup,
            billers: JSON.parse(billers),
          }),
        })
      );
      // Execute all API calls concurrently
      const receiptResponses = await Promise.all(receiptPromises); 
      const receiptData = await Promise.all(receiptResponses.map((res) => res.json()));
      const receiptIds = receiptData.map((receipt) => receipt.receiptId); // Extract the receipt ids

      // Step 2: Create Payments for Each Group Member and Receipt
      const paymentPromises = [];
      console.log("Total Amount:", totalAmount);
      console.log("Split Percentages:", splitPercentages);
      receiptIds.forEach((receiptId) => {
        groupMembers.forEach((member, index) => {
          const amountOwed = ((splitPercentages[index] / 100) * totalAmount); // Get the amount owed by this member
          const method = billers.includes(member.email) ? 'incoming' : 'outgoing'; // Check if they are a biller
  
          const paymentPromise = fetch(`http://localhost:3000/api/payments/create`, {method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              receipt_id: receiptId,
              user_id: member.user_id,
              amount: amountOwed,
              type: method,
            }),
          });
          paymentPromises.push(paymentPromise);
        });
      });
      // Execute all payment requests concurrently
      const paymentResponses = await Promise.all(paymentPromises);
      const paymentData = await Promise.all(paymentResponses.map((res) => res.json()));
      console.log("Payments created:", paymentData);
    } catch (error) {
      console.error("Error submitting receipts and payments:", error);
    }
    
    localStorage.removeItem('receipts');
    localStorage.removeItem('selectedGroup');
    setShowConfirmModal(false);
    navigate('/split-history'); // Redirect to split bill process
  };

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
  
    // Ensure total is 100% without modifying locked values
    let lockedSum = 0;
    let unlockedIndexes = [];
  
    // Identify locked and unlocked sliders
    newPercentages.forEach((p, i) => {
      if (i === index || p > 0) {
        lockedSum += p;
      } else {
        unlockedIndexes.push(i);
      }
    });
  
    let remainingPercentage = 100 - lockedSum;
    if (remainingPercentage < 0) {
      // Normalize: If locked values exceed 100%, scale down
      let scalingFactor = 100 / lockedSum;
      newPercentages = newPercentages.map((p, i) =>
        i === index || p > 0 ? p * scalingFactor : 0
      );
    } else {
      // Distribute remaining percentage to unlocked members
      let distributeValue = unlockedIndexes.length > 0 ? remainingPercentage / unlockedIndexes.length : 0;
      newPercentages = newPercentages.map((p, i) =>
        i === index || p > 0 ? p : distributeValue
      );
    }
  
    setSplitPercentages(newPercentages);
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

        {/* Action Buttons - Cancel & Submit */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="btn btn-error text-white px-6" onClick={handleCancel}>Cancel Bill</button>
          <button
            className={`btn px-6 ${
              splitPercentages.reduce((sum, p) => sum + p, 0) !== 100 && splitType == 'custom' ? 'btn-disabled opacity-50 cursor-not-allowed' : 'btn-success text-white'
            }`}
            onClick={handleConfirmClick}
            disabled={splitPercentages.reduce((sum, p) => sum + p, 0) !== 100 === 0 && splitType == 'custom'} // Disable if not 100% custom split
          >Submit Bill</button>
        </div>

        <ConfirmationModal
        isOpen={showCancelModal}
        title="⚠️ Warning"
        message="Your receipts will be deleted permanently and your bill will not be saved. Are you sure?"
        onConfirm={() => setShowCancelModal(false)}
        onCancel={confirmCancel}
        cancelText="Yes, Cancel"
        successText="No, Go Back"
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="🔒 Final Confirmation"
        message="Once you confirm, your bill will be submitted and all group members will be notified. Are you sure?"
        onConfirm={confirmProceed}
        onCancel={() => setShowConfirmModal(false)}
        cancelText="No, Go Back"
        successText="Yes, Proceed"
      />

        {/* Empty div to push content and prevent Navbar overlap */}
        <div className="h-32"></div>
      </div>
      <Navbar />
    </div>
  );
}

export default SplitBill;
