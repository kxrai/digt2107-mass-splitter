// src/components/RecentSplits.js
import React from 'react';

function RecentSplits({ splits }) {
  return (
    <div className="mt-6 px-4">
      <div className="flex justify-between items-center">
      </div>
      <div className="mt-2 space-y-2">
        {splits.map((split, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 shadow-md"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white mr-4">
                <span className="material-icons">restaurant</span>
              </div>
              <div>
                <p className="font-semibold">{split.name}</p>
                <p className="text-sm text-gray-500">
                  {split.date} <br />
                  {split.group || 'No group'}
                </p>
              </div>
            </div>
            <p className="font-bold text-blue-600">${split.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSplits;
