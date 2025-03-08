// src/pages/Homepage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Homepage Component
 * 
 * This component serves as the main landing page for users, displaying:
 * - Most recent split
 * - Friends section
 * - Groups section
 * - Recent splits list
 * - Bottom navigation for easy access to other parts of the application
 */
function Homepage() {

  return (
    <div className="grid-bg min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* Most Recent Split Card */}
      <div className="w-full max-w-3xl mt-6 px-4">
        <div className="recent-history-card bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-lg shadow-md p-4">
          <p className="text-lg font-semibold text-blue-700">Most Recent Split</p>
        </div>
      </div>

      {/* Groups Section */}
      <div className="w-full max-w-3xl mt-6 px-4">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">Groups</p>
          {/* Link to view all groups */}
          <Link to="/groups" className="text-blue-500 underline text-sm" aria-label="See all groups">
            see all
          </Link>
        </div>
        <div className="flex mt-2 space-x-4">
          {/* Displaying group icons */}
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white"
            >
              <span className="material-icons">group</span>
            </div>
          ))}
          {/* Create Group Button - navigates to create-group page */}
          <Link
            to="/create-group"
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-blue-500"
            aria-label="Create Group"
            data-testid="create-group-button"  // For test targeting
          >
            {/* Icon for Create Group */}
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
                d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}

export default Homepage;
