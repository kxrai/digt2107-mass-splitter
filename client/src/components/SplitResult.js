// src/components/SplitResult.js
import React from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'; // Updated import path

function SplitResult({ partyMembers, splitResult }) {
  return (
    <div className="card bg-base-100 shadow-xl my-8">
      <div className="card-body">
        <h2 className="card-title flex items-center">
          <CurrencyDollarIcon className="h-6 w-6 mr-2" />
          Split Result
        </h2>
        <ul className="list-disc list-inside">
          {splitResult.map((result) => {
            const member = partyMembers.find(
              (member) => member.id === result.memberId
            );
            return (
              <li key={result.memberId}>
                {member.name} owes ${result.amountOwed.toFixed(2)}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default SplitResult;
