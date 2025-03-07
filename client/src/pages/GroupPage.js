import React from 'react';
import UserGroups from '../components/UserGroups';
import Navbar from '../components/Navbar';

function GroupsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Page Content */}
      <div className="container mx-auto p-4 pb-16"> {/* Added padding-bottom to avoid overlap */}
        <h1 className="text-3xl font-bold text-center mb-6">Manage Your Groups</h1>
        <UserGroups />
      </div>

      {/* Navbar - Fixed at the Bottom & Unaffected by Page CSS */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
    </div>
  );
}

export default GroupsPage;
