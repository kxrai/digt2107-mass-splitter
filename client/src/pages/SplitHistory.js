import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';
import PaymentReceipt from '../components/PaymentReceipt';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function SplitHistory() {

  const [incomingData, setIncomingData] = useState([]);
  const [outgoingData, setOutgoingData] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [activeTab, setActiveTab] = useState('incoming'); // State to track the active tab

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
      }
    };
    fetchPayments();
  }, []); // Runs only once when component mounts

  useEffect(() => {
    if (confirmation) {
      console.log('confirmation is true');
    }
    if (paymentDate) {
      console.log(paymentDate);
    }
    if (paymentMethod) {
      console.log(paymentMethod);
    }
  }, [confirmation, paymentDate, paymentMethod]);

  const handleDownload = () => {
    const receiptHTML = document.getElementById("receipt-content").innerHTML;
    const blob = new Blob([receiptHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${confirmation.receipt_id}.html`;
    link.click();
  }


  // Function to render transaction cards
  const renderTransactions = (data) => {
    return data.map((transaction, index) => (
      <div
        key={index}
        className="p-4 bg-white rounded-lg shadow-md border border-blue-100 hover:shadow-lg"
      >
        <p className="font-semibold text-blue-900">{transaction.description || 'No Description'}</p>
        <p className="text-sm text-gray-500">{transaction.date} - Billers: {transaction.name}</p>
        <p className="font-bold text-blue-600">${transaction.amount ? Number(transaction.amount).toFixed(2) : "0.00"}</p>
        <button className="btn btn-success text-white px-3" onClick={() =>  setShowForm(transaction.receipt_id)}>Mark as Paid</button>

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
              {activeTab == 'incoming'? 'Confirm Payment Received' : 'Submit Payment'}</button>
            </div>
          )}
          <ConfirmationModal
            isOpen={confirmation}
            title="✅ Payment Receipt"
            message="This transaction will be removed from your Payment History permanently. It is recommended to download your Payment Receipt as proof of payment."
            onConfirm={handleDownload}
            onCancel={() => setConfirmation(false)}
            cancelText="Close"
            successText="Download Receipt"
          />
      </div>
    ));
  };

  const handleSubmitPayment = async (transaction) => {
    try {
      // const response = await fetch(`http://localhost:3000/api/payments/${transaction.payment_id}`, {
      //   method: "DELETE",
      //   headers: { "Content-Type": "application/json" },
      // });
      // if (response.ok) {
      setConfirmation(transaction);
      setShowForm(null); // Close form after successful payment
      // } else {
      //   alert("Payment failed. Please try again.");
      // }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
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

      {confirmation && paymentDate && paymentMethod && (
      <div id="receipt-content" style={{position: 'absolute', left: '-9999px', top: '-9999px'}}>
        <PaymentReceipt receipt={confirmation} date={paymentDate} method={paymentMethod} />
      </div>
      )}

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
}

export default SplitHistory;