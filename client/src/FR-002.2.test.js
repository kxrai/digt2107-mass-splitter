// 002.2.test.js
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

describe("HomePage Button Interactions and Responsiveness Tests", () => {
  // Test Case: Verify Add Friend Button in Friends Section
  it("should navigate to add friend page when Add Friend button is clicked", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const addFriendButton = screen.getByTestId('add-friend-button'); // Using test ID selector
    fireEvent.click(addFriendButton);
    expect(addFriendButton).toHaveAttribute('href', '/add-friend');
  });

  // Test Case: Verify Create Group Button in Groups Section
  it("should navigate to create group page when Create Group button is clicked", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const createGroupButton = screen.getByTestId('create-group-button'); // Using test ID selector
    fireEvent.click(createGroupButton);
    expect(createGroupButton).toHaveAttribute('href', '/create-group');
  });

  // Test Case: Responsive Layout Verification for HomePage
  it("should adjust layout correctly on different screen sizes", () => {
    global.innerWidth = 500; // Mock a mobile screen width
    global.dispatchEvent(new Event('resize'));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Verify sections are displayed on mobile screen width
    expect(screen.getByText("Most Recent Split")).toBeInTheDocument();
    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(screen.getByText("Groups")).toBeInTheDocument();
    expect(screen.getByText("Recent Splits")).toBeInTheDocument();
  });
});
