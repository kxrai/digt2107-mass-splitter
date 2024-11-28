import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AddFriend from '../src/pages/AddFriend';

global.fetch = jest.fn(); // Mock fetch globally
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

//Functional Requirement: FR-005
//Test Case: Tests AddFriend page functionality
describe('AddFriend Page', () => {
  
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('googleToken', JSON.stringify({ id: 1, name: 'Test User' }));
    useNavigate.mockReturnValue(mockNavigate);
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

  it('should add a friend and update the state', async () => {
    const mockResponseAdd = { ok: true };
    const mockResponseSearch = {
      ok: true,
      json: jest.fn().mockResolvedValue({ user_id: 3, username: 'New Friend' }),
    };

    fetch.mockResolvedValueOnce(mockResponseSearch).mockResolvedValueOnce(mockResponseAdd);

    render(
      <Router>
        <AddFriend />
      </Router>
    );

    const input = screen.getByPlaceholderText('Search for friends by email...');
    const searchButton = screen.getByText('Search');

    // Simulate searching for a friend
    fireEvent.change(input, { target: { value: 'newfriend@example.com' } });
    fireEvent.click(searchButton);

    expect(screen.getByText('New Friend')).toBeInTheDocument();

    const addButton = screen.getByText('Add Friend');
    fireEvent.click(addButton);

    expect(fetch).toHaveBeenCalledWith(
      '/api/friends',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, friend_id: 3 }),
      }
    );

    expect(screen.getByText('New Friend added as a friend!')).toBeInTheDocument();
  });
});