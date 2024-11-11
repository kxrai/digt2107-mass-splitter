// src/SplitHistory.js
import React from 'react';
import Navbar from '../components/Navbar';

function SplitHistory() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">Split History</h2>
      {/* Replace with actual data */}
      <div className="space-y-4">
        <div className="p-4 bg-white rounded shadow-md">
          <p className="font-semibold">Cafe Coffee Day</p>
          <p className="text-sm text-gray-500">2024-11-01 - Friends</p>
          <p className="font-bold text-blue-600">$26.00</p>
        </div>
        <div className="p-4 bg-white rounded shadow-md">
          <p className="font-semibold">Pizza Night</p>
          <p className="text-sm text-gray-500">2024-11-03 - Family</p>
          <p className="font-bold text-blue-600">$45.50</p>
        </div>
        <div className="p-4 bg-white rounded shadow-md">
          <p className="font-semibold">Grocery Run</p>
          <p className="text-sm text-gray-500">2024-11-05 - Roommates</p>
          <p className="font-bold text-blue-600">$60.00</p>
        </div>
      </div>
      <Navbar />
    </div>
  );
}

export default SplitHistory;
