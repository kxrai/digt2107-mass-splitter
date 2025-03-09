// src/pages/Homepage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const defaultGroupImages = [
  "https://source.unsplash.com/48x48/?group,people",
  "https://source.unsplash.com/48x48/?friends",
  "https://source.unsplash.com/48x48/?team"
];

function Homepage() {
  const [groups, setGroups] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("googleToken"));
    if (userInfo) {
      setIsLoggedIn(true);
      fetchGroups(userInfo.email);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchGroups = async (email) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      } else {
        console.error("Failed to fetch groups");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  return (
    <div className="grid-bg min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* Introduction Card */}
      <div className="w-full max-w-3xl mt-6 px-4">
        <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
            Welcome to MASS Splitter! 💸
          </h2>
          <p className="text-blue-800 text-md text-center mb-4">
            The easiest way to <strong>split bills</strong> and <strong>settle payments</strong> with friends, roommates, or colleagues.
          </p>
          <ul className="list-disc list-inside text-blue-700 text-sm space-y-2">
            <li>✔️ <strong>Create groups & add members</strong></li>
            <li>✔️ <strong>Track who owes what with receipts</strong></li>
            <li>✔️ <strong>Split expenses evenly or customize payments</strong></li>
            <li>✔️ <strong>Keep a history of all transactions</strong></li>
          </ul>
          <p className="text-center mt-4 font-semibold text-blue-800">
            Get started now and <strong>make splitting easy!</strong> 🎉
          </p>
        </div>
      </div>
  
      {/* Groups Section */}
      <div className="w-full max-w-3xl mt-6 px-4">
        <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-2">
            {/* Groups Title - Now Navy Blue */}
            <h2 className="text-2xl font-bold text-blue-900">Groups</h2>

            {/* "See All" Link for Logged-in Users */}
            {isLoggedIn && (
              <Link to="/groups" className="text-blue-500 underline text-sm hover:text-blue-700" aria-label="See all groups">
                See All
              </Link>
            )}
          </div>

          {/* Group Avatars */}
          <div className="flex mt-2 space-x-4">
            {isLoggedIn && groups.length > 0 ? (
              groups.slice(0, 3).map((group, index) => (
                <div key={group.group_id} className="relative">
                  <img
                    src={group.profileImage || defaultGroupImages[index % defaultGroupImages.length]} 
                    alt={group.group_name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-md"
                  />
                </div>
              ))
            ) : (
              [...Array(3)].map((_, index) => (
                <div key={index} className="relative">
                  <img
                    src={defaultGroupImages[index % defaultGroupImages.length]} 
                    alt="Mock Group"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-md"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Group Button (only for logged-in users) */}
      {isLoggedIn && (
        <Link
          to="/create-group"
          className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-blue-500 mt-4"
          aria-label="Create Group"
          data-testid="create-group-button"
        >
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
      )}

      {/* Bottom Navigation */}
      <Navbar /> 
    </div> // ✅ This is the correct closing tag for the main div
  );
}

export default Homepage;
