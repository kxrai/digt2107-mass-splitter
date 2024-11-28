// Import necessary modules and components
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock loggedInUser if retrieved from localStorage
const mockUser = {
  id: 1,
  username: 'TestUser',
  email: 'testuser@example.com',
};

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key) => {
      if (key === 'googleToken') { // Ensure this key matches your component
        return JSON.stringify(mockUser);
      }
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Now import AddFriend
import AddFriend from './pages/AddFriend'; // Adjust the path as necessary

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('AddFriend Page - Comprehensive Load and Functionality Testing', () => {
  it('renders AddFriend page with all essential elements', () => {
    render(
      <Router>
        <AddFriend />
      </Router>
    );

    expect(screen.getByPlaceholderText('Search for friends by email...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Back to Homepage')).toBeInTheDocument();
  });

  it('handles multiple friend additions with detailed error tracking', async () => {
    // Simulated API responses
    const mockAddResponses = Array(5)
      .fill()
      .map(() => ({
        ok: true,
        json: async () => ({
          message: 'Friend added successfully',
          user_id: Math.floor(Math.random() * 1000),
        }),
      }));

    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({
            user_id: 5,
            username: 'LoadTestUser',
            email: 'loadtest@example.com',
          }),
        })
      )
      .mockImplementation(() => Promise.resolve(mockAddResponses.shift()));

    render(
      <Router>
        <AddFriend />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText('Search for friends by email...');
    const searchButton = screen.getByText('Search');

    // Simulate search action
    fireEvent.change(searchInput, { target: { value: 'loadtest@example.com' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('LoadTestUser')).toBeInTheDocument();
    });

    const addButton = await screen.findByRole('button', { name: /Add Friend/i });

    const clickAddFriendAndWaitForMessage = async (index) => {
      fireEvent.click(addButton);

      // Wait for success message
      await waitFor(() => {
        const successMessage = screen.getByText(/Friend added successfully/i);
        expect(successMessage).toBeInTheDocument();
      });

      // Log progress for clarity in debugging
      console.log(`Friend ${index + 1} added successfully`);
    };

    // Sequentially add friends
    for (let i = 0; i < 5; i++) {
      await clickAddFriendAndWaitForMessage(i);
    }
  });
});