import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function SplitHistory() {
  // Mock data for incoming and outgoing transactions
  const incomingData = [
    { name: 'Friend A', date: '2024-11-01', amount: 20, description: 'Lunch' },
    { name: 'Friend B', date: '2024-11-03', amount: 35, description: 'Movie tickets' },
  ];

  const outgoingData = [
    { name: 'Friend C', date: '2024-11-02', amount: 15, description: 'Coffee' },
    { name: 'Friend D', date: '2024-11-04', amount: 40, description: 'Dinner' },
  ];

  // State to track the active tab
  const [activeTab, setActiveTab] = useState('incoming');

  // Function to render transaction cards
  const renderTransactions = (data) => {
    return data.map((transaction, index) => (
      <div key={index} className="p-4 bg-white rounded shadow-md">
        <p className="font-semibold">{transaction.name}</p>
        <p className="text-sm text-gray-500">{transaction.date} - {transaction.description}</p>
        <p className="font-bold text-blue-600">${transaction.amount.toFixed(2)}</p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>

      {/* Tabs for Incoming and Outgoing */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 rounded ${
            activeTab === 'incoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Incoming
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 py-2 rounded ${
            activeTab === 'outgoing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Outgoing
        </button>
      </div>

      {/* Content for the selected tab */}
      <div className="space-y-4">
        {activeTab === 'incoming' && renderTransactions(incomingData)}
        {activeTab === 'outgoing' && renderTransactions(outgoingData)}
      </div>

      <Navbar />
    </div>
  );
}

export default SplitHistory;
