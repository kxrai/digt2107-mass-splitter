// src/App.js
import React, { useState } from 'react';
import AddReceipt from '../components/AddReceipt';
import Navbar from '../components/Navbar';
import ReceiptList from '../components/ReceiptList'; 

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

        {/* Display Added Receipts Below */}
        <div className="mb-8">
          <ReceiptList receipts={receipts} setReceipts={setReceipts} />
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}

export default App;
