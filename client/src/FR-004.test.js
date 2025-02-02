import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import CreateGroup from '../src/pages/CreateGroup';
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

  it('adds a valid member email', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 1, email: 'testuser@example.com' }),
    });

    render(<CreateGroup />);

    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(screen.findAllByText('testuser@example.com')).toBeInTheDocument();
  });

  it('shows error for invalid email', () => {
    render(<CreateGroup />);

    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: 'invalidemail' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('removes a member', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 1, email: 'testuser@example.com' }),
    });

    render(<CreateGroup />);

    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Remove'));

    expect(screen.queryByText('testuser@example.com')).not.toBeInTheDocument();
  });

  it('designates and removes a biller', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 1, email: 'testuser@example.com' }),
    });

    render(<CreateGroup />);

    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add as Biller'));
    expect(screen.getByText('Remove as Biller')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Remove as Biller'));
    expect(screen.queryByText('Add as Biller')).not.toBeInTheDocument();
  });

  it('saves the group successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ groupId: 123 }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
    });

    render(<CreateGroup />);

    fireEvent.change(screen.getByPlaceholderText('Enter group name'), {
      target: { value: 'Test Group' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Save Group'));
    expect(screen.findByText('Group created successfully!')).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('Add'));

    fireEvent.click(screen.getByText('Save Group'));

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });
});
