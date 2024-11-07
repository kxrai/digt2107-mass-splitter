// src/Homepage.js
import React from 'react';
import { Link } from 'react-router-dom';
import RecentSplits from '../components/RecentSplits';

function Homepage() {
  const recentSplitsData = [
    { name: 'Cafe Coffee Day', date: '2024-11-01', group: 'Friends', amount: 26.0 },
    { name: 'Pizza Night', date: '2024-11-03', group: 'Family', amount: 45.5 },
    { name: 'Grocery Run', date: '2024-11-05', group: 'Roommates', amount: 60.0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Most Recent Split */}
      <div className="flex justify-center mt-6">
        <div className="w-11/12 h-20 rounded-lg bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center shadow-md">
          <p className="text-lg font-semibold text-blue-700">Most Recent Split</p>
        </div>
      </div>

      {/* Friends Section */}
      <div className="mt-6 px-4">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">Friends</p>
          <p className="text-sm text-gray-500">see all</p>
        </div>
        <div className="flex mt-2 space-x-4">
          {[...Array(5)].map((_, index) => (
            <img
              key={index}
              src="https://via.placeholder.com/48"
              alt="Friend"
              className="w-12 h-12 rounded-full object-cover"
            />
          ))}
        </div>
      </div>

      {/* Groups Section */}
      <div className="mt-6 px-4">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">Groups</p>
          <p className="text-sm text-gray-500">see all</p>
        </div>
        <div className="flex mt-2 space-x-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white"
            >
              <span className="material-icons">group</span>
            </div>
          ))}
          <div className="w-12 h-12 rounded-full bg-white border border-gray-400 flex items-center justify-center text-black">
            <span className="material-icons">add</span>
          </div>
        </div>
      </div>

      {/* Recent Splits Section */}
      <div className="mt-6 px-4">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">Recent Splits</p>
          {/* Link to SplitHistory page */}
          <Link to="/split-history" className="text-sm text-blue-500 underline">
            see all
          </Link>
        </div>
        <RecentSplits splits={recentSplitsData} />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2">
        <button className="text-gray-700">
          <span className="material-icons">home</span>
        </button>
        <button className="text-gray-700">
          <span className="material-icons">person</span>
        </button>
        <button className="text-gray-700">
          <span className="material-icons">add_circle</span>
        </button>
        <button className="text-gray-700">
          <span className="material-icons">receipt</span>
        </button>
        <button className="text-gray-700">
          <span className="material-icons">account_circle</span>
        </button>
      </div>
    </div>
  );
}

export default Homepage;
