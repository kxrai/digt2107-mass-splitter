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
    expect(screen.getByText("Most Recent Split")).toBeInTheDocument();
    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(screen.getByText("Groups")).toBeInTheDocument();
    expect(screen.getByText("Recent Splits")).toBeInTheDocument();
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
    expect(screen.getByRole('link', { name: "Add Friend" })).toHaveAttribute('href', '/add-friend');
    expect(screen.getByRole('link', { name: "Add Receipt" })).toHaveAttribute('href', '/split-bill');
    expect(screen.getByRole('link', { name: "Split History" })).toHaveAttribute('href', '/split-history');
    expect(screen.getByRole('link', { name: "Account" })).toHaveAttribute('href', '/account');
  });
});
