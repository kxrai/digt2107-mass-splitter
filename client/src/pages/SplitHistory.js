import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function SplitHistory() {

  const [incomingData, setIncomingData] = useState([]);
  const [outgoingData, setOutgoingData] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      // Get current logged-in user's ID
      const loggedInUser = JSON.parse(localStorage.getItem('googleToken'));
      if (!loggedInUser) return;

      const user_id = loggedInUser.id;

      try {
        const response = await fetch(`http://localhost:3000/api/payments/user/${user_id}`);
        if (!response.ok) throw new Error('Failed to fetch payments');

        const data = await response.json();
        const incoming = [];
        const outgoing = [];

        for (const payment of data) {
          const detailsResponse = await fetch(`http://localhost:3000/api/receipts/${payment.receipt_id}`);
          if (!detailsResponse.ok) continue;

          const details = await detailsResponse.json();
          const date = new Date(details.receipt_date);
          const formattedDate = date.toLocaleDateString();
          const formattedPayment = {
            name: details.billers,
            date: formattedDate,
            amount: details.total_amount,
            description: details.description,
          };

          if (payment.method === 'incoming') {
            incoming.push(formattedPayment);
          } else if (payment.method === 'outcoming') {
            outgoing.push(formattedPayment);
          }
        }

        setIncomingData(incoming);
        setOutgoingData(outgoing);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback mock data
        setIncomingData([
          { name: 'Friend A', date: '2024-11-01', amount: 20, description: 'Lunch' },
          { name: 'Friend B', date: '2024-11-03', amount: 35, description: 'Movie tickets' },
        ]);
        setOutgoingData([
          { name: 'Friend C', date: '2024-11-02', amount: 15, description: 'Coffee' },
          { name: 'Friend D', date: '2024-11-04', amount: 40, description: 'Dinner' },
        ]);
      }
    };

    fetchPayments();
  }, []); // Runs only once when component mounts

  // State to track the active tab
  const [activeTab, setActiveTab] = useState('incoming');

  // Function to render transaction cards
  const renderTransactions = (data) => {
    return data.map((transaction, index) => (
      <div
        key={index}
        className="p-4 bg-white rounded-lg shadow-md border border-blue-100 hover:shadow-lg"
      >
        <p className="font-semibold text-blue-900">{transaction.name}</p>
        <p className="text-sm text-gray-500">{transaction.date} - {transaction.description}</p>
        <p className="font-bold text-blue-600">{transaction.amount}</p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-4">Payment History</h2>

      {/* Centered Tabs */}
      <div className="tabs tabs-boxed justify-center bg-blue-100 rounded-lg p-2 mb-4">
        <a
          className={`tab ${activeTab === 'incoming' ? 'tab-active text-blue-600' : 'text-blue-900'}`}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming
        </a>
        <a
          className={`tab ${activeTab === 'outgoing' ? 'tab-active text-blue-600' : 'text-blue-900'}`}
          onClick={() => setActiveTab('outgoing')}
        >
          Outgoing
        </a>
      </div>

      {/* Content for the selected tab */}
      <div className="space-y-4">
        {activeTab === 'incoming' && renderTransactions(incomingData)}
        {activeTab === 'outgoing' && renderTransactions(outgoingData)}
      </div>

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
}

export default SplitHistory;