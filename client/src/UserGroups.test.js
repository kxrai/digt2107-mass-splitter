import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserGroups from './components/UserGroups';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.setItem('googleToken', JSON.stringify({ email: 'test@example.com' }));
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('UserGroups Component', () => {
  test('displays loading state initially', () => {
    render(<UserGroups />);
    expect(screen.getByText('Loading groups...')).toBeInTheDocument();
  });
  // Tests if user is logged in
  test('displays error if no user is logged in', async () => {
    localStorage.removeItem('googleToken'); // Logout user
    render(<UserGroups />);
    await waitFor(() => expect(screen.getByText('No user logged in.')).toBeInTheDocument());
  });
  //Displays groups and members correctly
  test('displays fetched groups and members', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { group_id: '1', group_name: 'Family' },
        { group_id: '2', group_name: 'Friends' },
      ],
    }); // For groups request

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { username: 'Alice' },
        { username: 'Joe' },
      ],
    }); // For group members request

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { username: 'Bob' },
        { username: 'Eve' },
      ],
    }); // For group members request

    render(<UserGroups />);

    await waitFor(() => expect(screen.getByText('ID: 1 - Family')).toBeInTheDocument());
    expect(screen.getByText('ID: 2 - Friends')).toBeInTheDocument();
    expect(screen.getByText('Members: Alice, Joe')).toBeInTheDocument();
    expect(screen.getByText('Members: Bob, Eve')).toBeInTheDocument();
  });

  test('displays message when no groups are found', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] }); //User is not in any groups
    render(<UserGroups />);
    await waitFor(() => expect(screen.getByText('You are not in any groups.')).toBeInTheDocument());
  });

  test('handles group deletion successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ group_id: '1', group_name: 'Family' }],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { username: 'Alice' },
        { username: 'Joe' },
      ],
    });

    fetch.mockResolvedValueOnce({ ok: true }); // For delete request

    render(<UserGroups />);

    await waitFor(() => expect(screen.getByText('ID: 1 - Family')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button')); // Press the delete button
    await waitFor(() => expect(screen.getByText('⚠️ Confirm Deletion')).toBeInTheDocument()); // Confirmation modal

    fireEvent.click(screen.getByText('Yes, Delete'));

    await waitFor(() => expect(screen.queryByText('ID: 1 - Family')).not.toBeInTheDocument());
  });

  test('displays error message when deletion fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ group_id: '1', group_name: 'Family' }],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { username: 'Alice' },
        { username: 'Joe' },
      ],
    });

    fetch.mockResolvedValueOnce({ ok: false }); // Simulate delete failure

    render(<UserGroups />);

    await waitFor(() => expect(screen.getByText('ID: 1 - Family')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByText('⚠️ Confirm Deletion')).toBeInTheDocument()); //Confirmation modal

    fireEvent.click(screen.getByText('Yes, Delete'));

    await waitFor(() => expect(screen.getByText('Failed to delete group.')).toBeInTheDocument());
  });
});
