// src/pages/Homepage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import groupPlaceholder from "../assets/group_placeholder.jpg";

function Homepage() {
  const [groups, setGroups] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get the logged in user's email
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("googleToken"));
    if (userInfo) {
      setIsLoggedIn(true);
      fetchGroups(userInfo.email);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Get all the groups the user is in
  const fetchGroups = async (email) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/email/${email}`);
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

  // Generate background color for letter avatar
  const getRandomColor = (groupName) => {
    const colors = ["#F87171", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA", "#F472B6"];
    const index = groupName.charCodeAt(0) % colors.length;
    return colors[index];
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
            {/* Groups Title */}
            <h2 className="text-2xl font-bold text-blue-900">Groups</h2>

            {/* "See All" Link for group page */}
            {isLoggedIn && (
              <Link to="/groups" className="text-blue-500 underline text-sm hover:text-blue-700" aria-label="See all groups">
                See All
              </Link>
            )}
          </div>

          {/* Group Avatars - "Create Group" always appears first */}
          <div className="flex flex-wrap mt-2 gap-4 items-center">
            {/* Create Group Button - Always First */}
            <Link
              to="/create-group"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-800 shadow-md"
              aria-label="Create Group"
              data-testid="create-group-button"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                className="w-6 h-6 stroke-slate-800"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Z"
                />
              </svg>
            </Link>

            {/* If logged in, display groups, else show mock placeholders */}
            {isLoggedIn && groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.group_id} className="relative text-center">
                  <p className="text-sm font-semibold">{group.group_name}</p>
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold border border-gray-300 shadow-md"
                    style={{ backgroundColor: getRandomColor(group.group_name) }}
                  >
                    {group.group_name.charAt(0).toUpperCase()}
                  </div>
                </div>
              ))
            ) : (
              // Show mock images when user is NOT logged in
              [...Array(3)].map((_, index) => (
                <div key={index} className="relative text-center">
                  <img
                    src={groupPlaceholder}
                    alt="Mock Group"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-md"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navbar /> 
    </div>
  );
}

export default Homepage;
