import React, { useState, useEffect, useRef } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';
import PaymentReceipt from '../components/PaymentReceipt';


function SplitHistory() {

  const [incomingData, setIncomingData] = useState([]);
  const [outgoingData, setOutgoingData] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // State to track the active tab

  useEffect(() => {
    const fetchPayments = async () => {
      // Get current logged-in user's ID
      const loggedInUser = JSON.parse(localStorage.getItem('googleToken'));
      if (!loggedInUser) {
        console.error("No logged-in user found.");
        return;
      }
  
      const user_id = loggedInUser.id;
  
      try {
        const response = await fetch(`http://localhost:3000/api/payments/user/${user_id}`);
        const text = await response.text(); // ✅ Get raw response
        console.log("Raw API Response:", text); // 🔍 Debugging output
  
        try {
          const data = JSON.parse(text); // ✅ Try parsing JSON
          console.log("Parsed JSON Response:", data);
  
          if (!Array.isArray(data)) {
            console.error("Expected an array but got:", typeof data);
            return;
          }
  
          const incoming = [];
          const outgoing = [];
  
          for (const payment of data) {
            const detailsResponse = await fetch(`http://localhost:3000/api/receipts/${payment.receipt_id}`);
            const detailsText = await detailsResponse.text(); // Get raw response
            console.log(`Receipt details for ID ${payment.receipt_id}:`, detailsText);
  
            try {
              const details = JSON.parse(detailsText);
              const date = new Date(details.receipt_date);
              const formattedDate = date.toLocaleDateString();
              const formattedPayment = {
                receipt_id: details.receipt_id,
                payment_id: payment.payment_id,
                group_id: details.group_id,
                name: details.billers,
                date: formattedDate,
                amount: payment.debt,
                paid: payment.paid,
                description: details.description,
                method: payment.method
              };
  
              if (payment.type === 'incoming') {
                incoming.push(formattedPayment);
              } else if (payment.type === 'outgoing') {
                outgoing.push(formattedPayment);
              }
            } catch (error) {
              console.error("Failed to parse receipt details:", detailsText);
            }
          }
  
          setIncomingData(incoming);
          setOutgoingData(outgoing);
        } catch (jsonError) {
          console.error("Error parsing JSON response:", text);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPayments();
  }, []);
  

  const handleDownload = () => {
    const receiptHTML = document.getElementById("receipt-content").innerHTML;
    const blob = new Blob([receiptHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${confirmation.receipt_id}.html`;
    link.click();
  }

  const handleDeleteTransaction = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/payments/${confirmDelete}`, { method: 'DELETE' });
      if (response.ok) {window.location.reload(false);}
    } catch {alert('Failed to delete transaction');}
  }

  // Function to render transaction cards
  const renderTransactions = (data) => {
    return data.map((transaction, index) => (
      <div
        key={index} className="p-4 bg-white rounded-lg shadow-md border border-blue-100 hover:shadow-lg"
      >
        <p className="font-semibold text-blue-900">{transaction.description || 'No Description'}</p>
        <p className="text-sm text-gray-500">{transaction.date} - Biller(s): {transaction.name}, Group ID: {transaction.group_id}</p>
        <p className="text-sm text-gray-500">Receipt ID: {transaction.receipt_id}</p>
        <p className="font-bold text-blue-600">{transaction.amount > 0 ? '$' + Number(transaction.amount).toFixed(2) : "✅ Paid"}</p>

        {transaction.amount > 0 ?
        <button className="btn btn-success text-white px-3" onClick={() =>  setShowForm(transaction.receipt_id)}>Mark as Paid</button>
        : <div><button className='font-semibold text-blue-900 hover:text-blue-500' onClick={() => setConfirmation(transaction)}>Download Details</button>
         &nbsp;&nbsp;&nbsp;<button className="btn btn-sm bg-red-500 text-white hover:bg-red-600" onClick={() => setConfirmDelete(transaction.payment_id)}>
         <TrashIcon className="h-4 w-4" /></button></div>
        }

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
            message="This transaction will be deleted from Payment History automatically after a month. You may delete it prior to that. It is recommended to download your Payment Receipt as proof of payment."
            onConfirm={handleDownload}
            onCancel={() => setConfirmation(false)}
            cancelText="Close"
            successText="Download Receipt"
          />
          <ConfirmationModal
            isOpen={confirmDelete}
            title="⚠️ Confirm Deletion"
            message="Are you sure you want to delete this transaction? This action cannot be undone."
            onConfirm={handleDeleteTransaction}
            onCancel={() => setConfirmDelete(null)}
            cancelText="No, Cancel"
            successText="Yes, Delete"
          />
      </div>
    ));
  };

  const handleSubmitPayment = async (transaction) => {
    try {
      const response = await fetch(`http://localhost:3000/api/payments/${transaction.payment_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: transaction.amount, method: paymentMethod, date: paymentDate}),
      });
      if (response.ok) {
        window.location.reload(false);
        setShowForm(null); // Close form after successful payment
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="grid-bg min-h-screen bg-blue-50 p-4">
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
          {loading && <p className="text-gray-500">Loading transactions...</p>}
          {activeTab === 'incoming' && renderTransactions(incomingData)}
          {activeTab === 'outgoing' && renderTransactions(outgoingData)}
        </div>
        {console.log(paymentDate, paymentMethod)}
        {confirmation &&(
        <div id="receipt-content" style={{position: 'absolute', left: '-9999px', top: '-9999px'}}>
          <PaymentReceipt receipt={confirmation} date={paymentDate} method={paymentMethod} />
        </div>
        )}
      </div>
    </div >
  );
}

export default SplitHistory;