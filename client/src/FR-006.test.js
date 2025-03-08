import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SplitHistory from '../src/pages/SplitHistory'; // Adjust path if needed

// Functional Requirement: FR-006
// Test Suite: Tests SplitHistory page functionality
describe('SplitHistory Component', () => {
  it('renders the Payment History page with the correct tabs and default (Incoming) transactions', () => {
    render(
      <Router>
        <SplitHistory />
      </Router>
    );

    // Check for the page title
    expect(screen.getByText(/Payment History/i)).toBeInTheDocument();

    // Check for the "Incoming" and "Outgoing" tabs
    expect(screen.getByText(/Incoming/i)).toBeInTheDocument();
    expect(screen.getByText(/Outgoing/i)).toBeInTheDocument();

    // "Incoming" tab is active by default, verify the incoming transaction items
    expect(screen.getByText(/Friend A/i)).toBeInTheDocument();
    // Using partial or regex match to handle any extra spaces/newlines.
    expect(screen.getByText(/Lunch/i)).toBeInTheDocument();
    expect(screen.getByText(/\$20\.00/i)).toBeInTheDocument();

    expect(screen.getByText(/Friend B/i)).toBeInTheDocument();
    expect(screen.getByText(/Movie tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/\$35\.00/i)).toBeInTheDocument();
  });

  it('switches to the Outgoing tab and displays outgoing transactions', () => {
    render(
      <Router>
        <SplitHistory />
      </Router>
    );

    // Switch to "Outgoing" tab
    fireEvent.click(screen.getByText(/Outgoing/i));

    // Verify the outgoing transaction items
    expect(screen.getByText(/Friend C/i)).toBeInTheDocument();
    expect(screen.getByText(/Coffee/i)).toBeInTheDocument();
    expect(screen.getByText(/\$15\.00/i)).toBeInTheDocument();

    expect(screen.getByText(/Friend D/i)).toBeInTheDocument();
    expect(screen.getByText(/Dinner/i)).toBeInTheDocument();
    expect(screen.getByText(/\$40\.00/i)).toBeInTheDocument();
  });

  it('renders the bottom Navbar', () => {
    render(
      <Router>
        <SplitHistory />
      </Router>
    );

    // Since the link is icon-only with an aria-label, we use getByLabelText
    expect(screen.getByLabelText(/Home/i)).toBeInTheDocument();
    
    // You could also test the other icons if desired:
    // expect(screen.getByLabelText(/Logout/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Add Friend/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Add Receipt/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Split History/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Account/i)).toBeInTheDocument();
  });
});