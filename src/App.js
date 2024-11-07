// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import BillEntry from './components/BillEntry';
import PartyMembers from './components/PartyMembers';
import BillSplitter from './components/BillSplitter';
import SplitResult from './components/SplitResult';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage';

function MainApp() {
  const [billItems, setBillItems] = useState([]);
  const [partyMembers, setPartyMembers] = useState([]);
  const [splitResult, setSplitResult] = useState(null);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">MASS Splitter</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BillEntry billItems={billItems} setBillItems={setBillItems} />
          <PartyMembers partyMembers={partyMembers} setPartyMembers={setPartyMembers} />
        </div>
        <BillSplitter
          billItems={billItems}
          partyMembers={partyMembers}
          setSplitResult={setSplitResult}
        />
        {splitResult && (
          <SplitResult partyMembers={partyMembers} splitResult={splitResult} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
