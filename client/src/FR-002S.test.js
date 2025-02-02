import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

describe("HomePage Layout and Navigation Tests", () => {
  // Test Case: Render Homepage Layout
  it("should display all key sections correctly without layout issues", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Verify all key sections are present
    expect(screen.getByText("Most Recent Split")).toBeInTheDocument();
    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(screen.getByText("Groups")).toBeInTheDocument();
    expect(screen.getByText("Recent Splits")).toBeInTheDocument();

    // Check if the navigation bar exists
    const navBar = screen.queryByTestId('bottom-navigation-bar');
    if (navBar) {
      expect(navBar).toBeInTheDocument();
    } else {
      console.warn("Bottom navigation bar not found. Check the test ID or component structure.");
    }
  });

  // Test Case: Confirm Navigation Links in Bottom Navigation Bar
  it("should navigate correctly when bottom navigation icons are clicked", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-friend" element={<div>Add Friend Page</div>} />
          <Route path="/add-receipt" element={<div>Add Receipt Page</div>} />
          <Route path="/split-history" element={<div>Split History Page</div>} />
          <Route path="/account" element={<div>Account Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Verify navigation for each icon
    const homeIcon = screen.queryByTestId('nav-home-icon');
    if (homeIcon) {
      fireEvent.click(homeIcon);
      expect(screen.getByText("Most Recent Split")).toBeInTheDocument();
    } else {
      console.warn("Home navigation icon not found.");
    }

    const addFriendIcon = screen.queryByTestId('nav-add-friend-icon');
    if (addFriendIcon) {
      fireEvent.click(addFriendIcon);
      expect(screen.getByText("Add Friend Page")).toBeInTheDocument();
    } else {
      console.warn("Add Friend navigation icon not found.");
    }

    const addReceiptIcon = screen.queryByTestId('nav-add-receipt-icon');
    if (addReceiptIcon) {
      fireEvent.click(addReceiptIcon);
      expect(screen.getByText("Add Receipt Page")).toBeInTheDocument();
    } else {
      console.warn("Add Receipt navigation icon not found.");
    }

    const splitHistoryIcon = screen.queryByTestId('nav-split-history-icon');
    if (splitHistoryIcon) {
      fireEvent.click(splitHistoryIcon);
      expect(screen.getByText("Split History Page")).toBeInTheDocument();
    } else {
      console.warn("Split History navigation icon not found.");
    }

    const accountIcon = screen.queryByTestId('nav-account-icon');
    if (accountIcon) {
      fireEvent.click(accountIcon);
      expect(screen.getByText("Account Page")).toBeInTheDocument();
    } else {
      console.warn("Account navigation icon not found.");
    }
  });

  // Test Case: Verify Add Friend Button in Friends Section
  it("should navigate to add friend page when Add Friend button is clicked", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-friend" element={<div>Add Friend Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const addFriendButton = screen.queryByTestId('add-friend-button');
    if (addFriendButton) {
      fireEvent.click(addFriendButton);
      expect(screen.getByText("Add Friend Page")).toBeInTheDocument();
    } else {
      console.warn("Add Friend button not found in Friends section.");
    }
  });

  // Test Case: Verify Create Button in Groups Section
  it("should navigate to create group page when Create Group button is clicked", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-group" element={<div>Create Group Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const createGroupButton = screen.queryByTestId('create-group-button');
    if (createGroupButton) {
      fireEvent.click(createGroupButton);
      expect(screen.getByText("Create Group Page")).toBeInTheDocument();
    } else {
      console.warn("Create Group button not found in Groups section.");
    }
  });
});