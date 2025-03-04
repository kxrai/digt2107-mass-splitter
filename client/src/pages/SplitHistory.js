import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';

function SplitHistory() {

  const [incomingData, setIncomingData] = useState([]);
  const [outgoingData, setOutgoingData] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [confirmation, setConfirmation] = useState(null);

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
            receipt_id: details.receipt_id,
            payment_id: payment.payment_id,
            name: details.billers,
            date: formattedDate,
            amount: payment.debt,
            description: details.description,
          };
          console.log(formattedPayment);

          if (payment.method === 'incoming') {
            incoming.push(formattedPayment);
          } else if (payment.method === 'outgoing') {
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
        <p className="font-semibold text-blue-900">{transaction.description || 'No Description'}</p>
        <p className="text-sm text-gray-500">{transaction.date} - Billers: {transaction.name}</p>
        <p className="font-bold text-blue-600">${transaction.amount}</p>
        <button className="btn btn-success text-white px-3" onClick={() =>  setShowForm(transaction.receipt_id)}>Pay</button>

        {showForm === transaction.receipt_id && (
            <div className='flex items-center justify-between'>
              <label className='font-semibold'>Date Paid:  </label>
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />

              <label className='font-semibold'>Payment Method:  </label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">E-Transfer / Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
              
              <button className='btn btn-success text-white px-3 mx-1' onClick={() => handleSubmitPayment(transaction)}>
              Submit Payment</button>
            </div>
          )}
          <ConfirmationModal
            isOpen={confirmation}
            title="✅ Payment Receipt"
            message='It is recommended to dowwnload your Payment Receipt as proof of payment'
            onConfirm={handleDownloadReceipt}
            onCancel={() => setConfirmation(false)}
            cancelText="Close"
            successText="Download Receipt"
          />
      </div>
    ));
  };

  const handleSubmitPayment = async (transaction) => {
    // const paymentDetails = { 
    //   amount: paymentDate,
    //   method: paymentMethod,
    // };

    try {
    //   const response = await fetch(`http://localhost:3000/api/payments/${transactionpayment_id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(paymentDetails),
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
        setConfirmation(transaction);
        setShowForm(null); // Close form after successful payment
      // } else {
        // alert("Payment failed. Please try again.");
      // }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `Receipt ID: ${confirmation.receipt_id}\nReceipt Description: ${confirmation.description}\nDue: $${confirmation.amount}\nPaid: $${confirmation.amount}\nDate Paid: ${paymentDate}\nPayment Method: ${paymentMethod}\nStatus: Payment Successful!`;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Receipt_${confirmation.receipt_id}.txt`;
    link.click();
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