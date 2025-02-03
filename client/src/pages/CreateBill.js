import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddReceipt from '../components/AddReceipt';
import ReceiptList from '../components/ReceiptList';
import Navbar from '../components/Navbar';

function CreateBill() {
  const [receipts, setReceipts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
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

  // Handle Confirm - Redirects to Split Bill Page
  const handleConfirm = () => {
    if (receipts.length === 0) return; // Prevent confirm if no receipts
    navigate('/split-bill'); // Redirect to the split bill process
  };

  return (
    <div className="relative min-h-screen bg-white grid-bg">
      <div className="container mx-auto p-4">
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
            onClick={handleConfirm}
            disabled={receipts.length === 0} // Disable if no receipts
          >
            Confirm
          </button>
        </div>

        {/* DaisyUI Modal for Cancel Confirmation */}
        {showCancelModal && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">⚠️ Warning</h3>
              <p className="py-4">Your receipts will be deleted and not saved. Are you sure?</p>
              <div className="modal-action">
                <button className="btn btn-error" onClick={confirmCancel}>
                  Yes, Cancel
                </button>
                <button className="btn btn-primary" onClick={() => setShowCancelModal(false)}>
                  No, Go Back
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>

      <Navbar />
    </div>
  );
}

export default CreateBill;
