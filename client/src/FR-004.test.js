import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import CreateGroup from './pages/CreateGroup';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn();

describe('CreateGroup Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    cleanup();
  });

  it('renders the component correctly', () => {
    render(<CreateGroup />);
    expect(screen.getByText('Create Group')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter group name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email to add')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByText('Save Group')).toBeInTheDocument();
  });


  it('shows error for invalid email', () => {
    render(<CreateGroup />);

    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: 'invalidemail' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });



  it('shows error when saving group fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<CreateGroup />);

    fireEvent.change(screen.getByPlaceholderText('Enter group name'), {
      target: { value: 'Test Group' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    fireEvent.click(screen.getByText('Save Group'));

    await waitFor(() => {
      expect(screen.getByText('Please enter a group name and add at least one member')).toBeInTheDocument();
    });
  });
});
