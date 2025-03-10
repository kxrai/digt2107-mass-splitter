// 002.1.test.js
import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';

describe("HomePage Layout and Key Sections Tests", () => {
  // Test Case: Render HomePage Layout
  it("should render the HomePage layout with all key sections", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Check for the presence of key sections
    expect(screen.getByText("Welcome to MASS Splitter! 💸")).toBeInTheDocument();
    expect(screen.getByText("Create groups & add members")).toBeInTheDocument();
    expect(screen.getByText("Track who owes what with receipts")).toBeInTheDocument();
    expect(screen.getByText("Split expenses evenly or customize payments")).toBeInTheDocument();
    expect(screen.getByText("Keep a history of all transactions")).toBeInTheDocument();
  });

  // Test Case: Confirm Navigation Links in Bottom Navigation Bar
  it("should navigate correctly via navbar links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check if each navbar link has the correct href
    expect(screen.getByRole('link', { name: "Home" })).toHaveAttribute('href', '/home');
    expect(screen.getByRole('link', { name: "Groups" })).toHaveAttribute('href', '/groups');
    expect(screen.getByRole('link', { name: "Add Receipt" })).toHaveAttribute('href', '/create-bill');
    expect(screen.getByRole('link', { name: "Split History" })).toHaveAttribute('href', '/split-history');
    expect(screen.getByRole('link', { name: "Account" })).toHaveAttribute('href', '/account');
  });
});
