import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddFriend from '../src/pages/AddFriend';

global.fetch = jest.fn(); // Mock fetch globally

//Functional Requirement: FR-005
//Test Case: Tests AddFriend page functionality
describe('AddFriend Page', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders AddFriend page with a search bar and button', () => {
    render(
      <Router>
        <AddFriend />
      </Router>
    );

    expect(screen.getByPlaceholderText('Search for friends by email...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Back to Homepage')).toBeInTheDocument();
  });

  it('searches for friends and displays results', async () => {
    // Mock API response for search
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 5, username: 'Mahjabin' }),
    });

    render(
      <Router>
        <AddFriend />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText('Search for friends by email...');
    const searchButton = screen.getByText('Search');

    // Simulate user input
    fireEvent.change(searchInput, { target: { value: 'jabineus25@gmail.com' } });
    fireEvent.click(searchButton);

    // Assert search result appears
    const result = await screen.findByText('Mahjabin');
    expect(result).toBeInTheDocument();
  });

  it('handles search errors and displays message', async () => {
    // Mock API error response for search
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'User not found' }),
    });

    render(
      <Router>
        <AddFriend />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText('Search for friends by email...');
    const searchButton = screen.getByText('Search');

    // Simulate user input
    fireEvent.change(searchInput, { target: { value: 'notfound@example.com' } });
    fireEvent.click(searchButton);

    // Assert error message is displayed
    const errorMessage = await screen.findByText('User not found');
    expect(errorMessage).toBeInTheDocument();
  });

  it('adds a friend and shows success message', async () => {
    // Mock API response for search
    fetch.mockResolvedValueOnce({
        ok: true,
      });

      render(
          <Router>
              <AddFriend />
          </Router>
      );

      // Simulate adding friend
      const buttons = screen.getAllByText('Add Friend');
      fireEvent.click(buttons[0]);

      // Wait for either success or error message to appear
      //const message = await screen.findByText('Steeve added as a friend!', {}, { timeout: 2000 });
      const errorMessage = await screen.findByText('Added');
      //const isMessagePresent = message ? message : errorMessage;
      expect(errorMessage).toBeInTheDocument();

    });
});
