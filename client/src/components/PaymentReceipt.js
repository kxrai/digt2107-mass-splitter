import React from "react";
// Creates a Payment receipt to download
const PaymentReceipt = ({ receipt }) => {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, rgb(191, 219, 254), rgb(216, 180, 254), rgb(255, 218, 185))", 
        color: "rgb(45, 55, 72)", // text-gray-800
        padding: "20px",
        borderRadius: "10px",
        color: "black",
        width: "300px",
      }}
    > {/* Payment transaction information */}
      <h2 style={{ textAlign: "center" }}>Payment Receipt</h2>
      <div style={{marginTop: '1rem',}}>
        <p><strong>Receipt ID:</strong> {receipt.receipt_id}</p>
        <p><strong>Group ID:</strong> {receipt.group_id}</p>
        <p><strong>Description:</strong> {receipt.description}</p>
        <p><strong>Date of Payment:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
        <p><strong>Debt:</strong> ${receipt.amount ? Number(receipt.amount).toFixed(2) : "0.00"}</p>
        <p><strong>Paid:</strong> ${receipt.paid ? Number(receipt.paid).toFixed(2) : "0.00"}</p>
        <p><strong>Payment Method:</strong> {receipt.method}</p>
        <p style={{ color: "rgb(22, 163, 74)", fontWeight: "bold", textAlign: "center" }}> {/* text-green-600 */}
          Payment Successful!
        </p>
      </div>
    </div>
  );
};


export default PaymentReceipt;
