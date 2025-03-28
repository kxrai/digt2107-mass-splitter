import React, { useState, useEffect, act } from 'react';
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
  const [activeTab, setActiveTab] = useState('incoming');

  // Retrieve user's payment history
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Get current logged-in user's ID
        const loggedInUser = JSON.parse(localStorage.getItem('googleToken'));
        if (!loggedInUser) {
          console.error("User ID is missing.");
          return;
        }
        const user_id = loggedInUser.id;

        // Fetch payment transactions data from API
        const response = await fetch(`http://localhost:3000/api/payments/user/${user_id}`);
        if (!response.ok) throw new Error('Failed to fetch payments');
  
        const data = await response.json();
  
        const incoming = [];
        const outgoing = [];

        // Fetch receipt data from API
        for (const payment of data) {
          const detailsResponse = await fetch(`http://localhost:3000/api/receipts/${payment.receipt_id}`);
          if (!detailsResponse.ok) continue;
          const details = await detailsResponse.json();
  
          const formattedDate = new Date(details.receipt_date).toLocaleDateString();
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
          } else {
            outgoing.push(formattedPayment);
          }
        }
        // Set data for each tab
        setIncomingData(incoming);
        setOutgoingData(outgoing);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchPayments();
  }, []);
  

  // Downloads receipt to user's computer
  const handleDownload = () => {
    const receiptHTML = document.getElementById("receipt-content").innerHTML;
    const blob = new Blob([receiptHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${confirmation.receipt_id}.html`;
    link.click();
  };

  // Deletes payment transaction
  const handleDeleteTransaction = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/payments/${confirmDelete}`, { method: 'DELETE' });
      if (response.ok) window.location.reload(false);
    } catch {
      alert('Failed to delete transaction');
    }
  };

  // Function to render transaction cards
  const renderTransactions = (data) => {
    return data.map((transaction, index) => (
      <div key={index} className="p-6 bg-white rounded-lg shadow-md border border-blue-100 hover:shadow-lg">
        <div className='flex justify-between items-center'> 
        <div className="flex-1">
          <p className="font-semibold text-blue-900">{transaction.description || 'No Description'}</p>
          <p className="text-sm text-gray-500">{transaction.date} - Biller(s): {transaction.name}, Group ID: {transaction.group_id}</p>
          <p className="text-sm text-gray-500">Receipt ID: {transaction.receipt_id}</p>
          <p className="font-bold text-blue-600">{transaction.amount > 0 ? `$${Number(transaction.amount).toFixed(2)}` : "✅ Paid"}</p>
        </div>
        <div className="flex items-center gap-2">
          {transaction.amount > 0 ? (
            <button className="btn btn-success text-white px-3" onClick={() => setShowForm(transaction.receipt_id)}>
              Mark as Paid
            </button>
          ) : (
            <>
              <button className="font-semibold text-blue-900 hover:text-blue-500" onClick={() => setConfirmation(transaction)}>
                Download Details
              </button>
              &nbsp;&nbsp;&nbsp;
              <button data-testid="delete-button" className="btn btn-sm bg-red-500 text-white hover:bg-red-600" onClick={() => setConfirmDelete(transaction.payment_id)}>
                <TrashIcon className="h-4 w-4" />
              </button>     
            </>    
          )}
        </div>
        </div>

        {/* Form for Marking as Paid */}
        {showForm === transaction.receipt_id && (
          <div className='flex items-center justify-between'>
            <label for="date" className='font-semibold'>Date Paid: </label>
            <input id="date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />

            <label className='font-semibold'>Payment Method: </label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="">Select Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">E-Transfer / Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
            <button className='btn btn-success text-white px-3 mx-1' onClick={() => handleSubmitPayment(transaction)}>
              {activeTab === 'incoming' ? 'Confirm Payment Received' : 'Submit Payment'}
            </button>
          </div>
        )}
      </div>
    ));
  };

  // Mark transaction as paid
  const handleSubmitPayment = async (transaction) => {
    try {
      // Update the payment transaction 
      const response = await fetch(`http://localhost:3000/api/payments/${transaction.payment_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: transaction.amount, method: paymentMethod, date: paymentDate }),
      });
      // Send email to notify payment action
      if (response.ok) {
        fetch("http://localhost:5000/send-email", {method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              email: (JSON.parse(localStorage.getItem('googleToken'))).email,
              subject: activeTab == 'incoming' ? 'New Payment Confirmed' : 'New Payment Submitted',
              html: `<h2>New Payment Update</h2>
                  <h3>A payment has been ${activeTab == 'incoming' ? 'confirmed for you' : 'submitted to you'}:</h3>
                  <p><strong>Receipt ID:</strong> ${transaction.receipt_id}</p>
                  <p><strong>Date Paid:</strong> ${paymentDate}</p>
                  <p><strong>Total Amount Owed:</strong> $${transaction.amount}</p>
                  <p><strong>Description:</strong> ${transaction.description}</p>
                  <p>Log in to view more details in your Payment History.</p>`
          }),
        });
        window.location.reload(false);
        setShowForm(null);
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
        <h2 className="text-2xl font-bold text-blue-900 text-center mb-4">Payment History</h2>

        {/* Tabs */}
        <div className="tabs tabs-boxed justify-center bg-blue-100 rounded-lg p-2 mb-4">
          <a className={`tab ${activeTab === 'incoming' ? 'tab-active text-blue-600' : 'text-blue-900'}`} onClick={() => setActiveTab('incoming')}>
            Incoming
          </a>
          <a className={`tab ${activeTab === 'outgoing' ? 'tab-active text-blue-600' : 'text-blue-900'}`} onClick={() => setActiveTab('outgoing')}>
            Outgoing
          </a>
        </div>

        {/* Transaction data */}
        <div className="space-y-4">
          {loading && <p className="text-gray-500">Loading transactions...</p>}
          {activeTab === 'incoming' && renderTransactions(incomingData)}
          {activeTab === 'outgoing' && renderTransactions(outgoingData)}
        </div>
        
        {/* Payment Receipt */}
        {confirmation && (
        <div id="receipt-content" style={{position: 'absolute', left: '-9999px', top: '-9999px'}}>
          <PaymentReceipt receipt={confirmation} />
        </div>
        )}

        {/* Pop up for downloading receipt */}
        <ConfirmationModal
          isOpen={confirmation}
          title="✅ Payment Receipt"
          message="This transaction will be deleted from Payment History automatically after a month. You may delete it prior to that. It is recommended to download your Payment Receipt as proof of payment."
          onConfirm={handleDownload}
          onCancel={() => setConfirmation(false)}
          cancelText="Close"
          successText="Download Receipt"
        />

        {/* Pop up for deleteing transaction */}
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
    </div>
  );
}

export default SplitHistory;
