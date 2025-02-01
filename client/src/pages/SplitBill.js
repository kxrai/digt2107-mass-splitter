// src/App.js
import React, { useState } from 'react';
import BillEntry from '../components/BillEntry';
import PartyMembers from '../components/PartyMembers';
import BillSplitter from '../components/BillSplitter';
import SplitResult from '../components/SplitResult';
import AddReceipt from '../components/AddReceipt';
import SubmitBill from '../components/SubmitBill';
import Navbar from '../components/Navbar';

function App() {
  const [splitResult, setSplitResult] = useState(null);
  const [receipts, setReceipts] = useState([]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">MASS Splitter</h1>
        
        {/* Add Receipt Section */}
        <div className="mb-8">
          <AddReceipt receipts={receipts} setReceipts={setReceipts} />
        </div>

        {/* Submit Bill Section - Appears AFTER receipts are added */}
        <div className="mb-8">
          <SubmitBill receipts={receipts} />
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}

export default App;
