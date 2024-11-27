// // src/components/BillSplitter.js
// import React from 'react';
// import { CalculatorIcon } from '@heroicons/react/24/outline'; // Updated import path

// function BillSplitter({ billItems, partyMembers, setSplitResult }) {
//   const splitBillEvenly = () => {
//     if (billItems.length === 0 || partyMembers.length === 0) {
//       alert('Please add bill items and party members.');
//       return;
//     }

//     const totalCost = billItems.reduce((total, item) => total + item.cost, 0);
//     const splitAmount = totalCost / partyMembers.length;

//     const result = partyMembers.map((member) => ({
//       memberId: member.id,
//       amountOwed: splitAmount,
//     }));

//     setSplitResult(result);
//   };

//   return (
//     <div className="text-center my-8">
//       <button className="btn btn-accent btn-lg" onClick={splitBillEvenly}>
//         <CalculatorIcon className="h-6 w-6 mr-2" />
//         Split Evenly
//       </button>
//       {/* Future feature: Add customized split options here */}
//     </div>
//   );
// }

// export default BillSplitter;


import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AddReceipt from '../components/AddReceipt';

function App() {
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
