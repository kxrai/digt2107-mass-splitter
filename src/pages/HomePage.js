// src/pages/Homepage.js
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Most Recent Split */}
      <div className="w-full max-w-3xl mt-6 px-4">
        <div className="recent-history-card bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-lg shadow-md p-4">
          <p className="text-lg font-semibold text-blue-700">Most Recent Split</p>
        </div>
      </div>

      {/* Friends Section */}
      <div className="w-full max-w-3xl mt-6 px-4">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">Friends</p>
          <Link to="/friends" className="text-blue-500 underline text-sm">
            see all
          </Link>
        </div>
        <div className="flex mt-2 space-x-4">
          {[...Array(4)].map((_, index) => (
            <img
              key={index}
              src="https://via.placeholder.com/48"
              alt="Friend"
              className="w-12 h-12 rounded-full object-cover"
            />
          ))}
          {/* Add Friend Button */}
          <Link
            to="/add-friend"
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-blue-500"
          >
            {/* SVG Icon for Add Friend */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Groups Section */}
      <div className="w-full max-w-3xl mt-6 px-4">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">Groups</p>
          <Link to="/groups" className="text-blue-500 underline text-sm">
            see all
          </Link>
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
          {/* Create Group Button */}
          <Link
            to="/create-group"
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-blue-500"
          >
            {/* SVG Icon for Create Group */}

            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke-width="1.5" 
              stroke="currentColor" 
              class="size-6">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Recent Splits Section */}
      <RecentSplits splits={recentSplitsData} />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2">
        {/* Home Icon */}
        <Link to="/" className="text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12L11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </Link>

        {/* Add Friend Icon */}
        <Link to="/friends" className="text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
        </Link>

        {/* Create Group Icon */}
        <Link to="/scan-receipt" className="text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </Link>

        {/* Receipt Icon */}
        <Link to="/split-history" className="text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
        </Link>

        {/* Account Icon */}
        <Link to="/account" className="text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
