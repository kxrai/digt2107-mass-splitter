// src/App.js
import React, { useState } from 'react';
import BillEntry from '../components/BillEntry';
import PartyMembers from '../components/PartyMembers';
import BillSplitter from '../components/BillSplitter';
import SplitResult from '../components/SplitResult';
import AddReceipt from '../components/AddReceipt'; // Import only
import Navbar from '../components/Navbar';

function App() {
  const [splitResult, setSplitResult] = useState(null);
  const [receipts, setReceipts] = useState([]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">MASS Splitter</h1>
        <div className="mb-8">
          <AddReceipt receipts={receipts} setReceipts={setReceipts} />
        </div>
      </div>
      <Navbar />
    </div>
    
  );

}

export default App;
