import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddReceipt from '../components/AddReceipt';
import ReceiptList from '../components/ReceiptList';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';

function CreateBill() {
  const [receipts, setReceipts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const navigate = useNavigate();

  // Handle Cancel Confirmation Modal
  const handleCancel = () => {
    setShowCancelModal(true); // Open modal
  };

  // Confirm Cancel - Clears Receipts & Resets Group
  const confirmCancel = () => {
    setReceipts([]); // Clear receipts
    setSelectedGroup(null); // Reset group selection
    setShowCancelModal(false); // Close modal
  };

  // Handle Confirm Click - Open Confirmation Modal Before Proceeding
  const handleConfirmClick = () => {
    if (receipts.length === 0) return;
    setShowConfirmModal(true); // Show confirm modal before proceeding
  };

  // Confirm & Proceed to Split Bill
  const confirmProceed = () => {
    localStorage.setItem('receipts', JSON.stringify(receipts)); // Save receipts
    setShowConfirmModal(false);
    navigate('/split-bill'); // Redirect to split bill process
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white grid-bg">
      <div className="container mx-auto p-4 flex-grow"> {/* Ensures content expands */}
        <h1 className="text-4xl font-bold text-center mb-8">MASS Splitter</h1>

        {/* Add Receipt Component */}
        <div className="mb-8">
          <AddReceipt
            receipts={receipts}
            setReceipts={setReceipts}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
          />
        </div>

        {/* Display Added Receipts Below */}
        <div className="mb-8">
          <ReceiptList receipts={receipts} setReceipts={setReceipts} />
        </div>

        {/* Action Buttons - Cancel & Confirm */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="btn btn-error text-white px-6" onClick={handleCancel}>
            Cancel
          </button>

          <button
            className={`btn px-6 ${
              receipts.length === 0 ? 'btn-disabled opacity-50 cursor-not-allowed' : 'btn-success text-white'
            }`}
            onClick={handleConfirmClick}
            disabled={receipts.length === 0} // Disable if no receipts
          >
            Confirm
          </button>
        </div>

        {/* Empty div to push content and prevent Navbar overlap */}
        <div className="h-32"></div>
      </div>

      {/* Pop up for deleting receipts */}
      <ConfirmationModal
        isOpen={showCancelModal}
        title="⚠️ Warning"
        message="Your receipts will be deleted and not saved. Are you sure?"
        onConfirm={() => setShowCancelModal(false)}
        onCancel={confirmCancel}
        cancelText="Yes, Cancel"
        successText="No, Go Back"
      />
      
      {/* Pop up for confirming receipts before splitting bill */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="🔒 Final Confirmation"
        message="Once you confirm, you cannot go back to edit receipts. Are you sure?"
        onConfirm={confirmProceed}
        onCancel={() => setShowConfirmModal(false)}
        cancelText="No, Go Back"
        successText="Yes, Proceed"
      />

      {/* Navbar stays fixed below */}
      <Navbar />
    </div>
  );
}

export default CreateBill;
