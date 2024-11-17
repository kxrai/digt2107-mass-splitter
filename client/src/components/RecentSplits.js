// src/components/RecentSplits.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RecentSplits.css';

function RecentSplits({ splits }) {
  return (
    <div className="recent-splits-container">
      <div className="recent-splits-wrapper">
        <div className="recent-splits-header">
          <p className="recent-splits-title">Recent Splits</p>
          <Link to="/split-history" className="recent-splits-link">
            see all
          </Link>
        </div>
        <div className="mt-2 space-y-2">
          {splits.map((split, index) => (
            <div key={index} className="split-card">
              <div className="flex items-center">
                <div className="split-icon">
                  <span className="material-icons">restaurant</span>
                </div>
                <div>
                  <p className="split-details">{split.name}</p>
                  <p className="split-subtext">
                    {split.date} <br />
                    {split.group || 'No group'}
                  </p>
                </div>
              </div>
              <p className="split-amount">${split.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentSplits;
