import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CreateGroup from './pages/CreateGroup';

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ user_id: 1, email: 'test@example.com', username: 'Test User' }),
  })
);

describe('CreateGroup Component', () => {
  beforeEach(() => {
    fetch.mockClear(); // Reset fetch mock before each test
  });

  test('renders CreateGroup component', () => {
    render(
      <MemoryRouter>
        <CreateGroup />
      </MemoryRouter>
    );

    expect(screen.getByText(/Create Group/i)).toBeInTheDocument();
  });

  test('allows entering a group name', () => {
    render(
      <MemoryRouter>
        <CreateGroup />
      </MemoryRouter>
    );

    const groupNameInput = screen.getByPlaceholderText('Enter group name');
    fireEvent.change(groupNameInput, { target: { value: 'Trip Buddies' } });

    expect(groupNameInput.value).toBe('Trip Buddies');
  });

  test('adds a valid member', async () => {
    render(
      <MemoryRouter>
        <CreateGroup />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter email to add');
    const addButton = screen.getByText('Add');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  test('displays error for invalid email', async () => {
    render(
      <MemoryRouter>
        <CreateGroup />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter email to add');
    const addButton = screen.getByText('Add');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('prevents adding duplicate members', async () => {
    render(
      <MemoryRouter>
        <CreateGroup />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter email to add');
    const addButton = screen.getByText('Add');

    // Add a member twice
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(addButton);
    await waitFor(() => screen.getByText('Test User'));

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('Member already added')).toBeInTheDocument();
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
      const memberList = screen.getByText('Group Members').nextElementSibling;
      expect(memberList).toHaveTextContent('testuser@example.com');
    });

    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);

    await waitFor(() => {
      const memberList = screen.getByText('Group Members').nextElementSibling;
      expect(memberList).not.toHaveTextContent('testuser@example.com');
    });
  });

  test('adds and removes a biller', async () => {
    render(
      <MemoryRouter>
        <CreateGroup />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter email to add');
    const addButton = screen.getByText('Add');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(addButton);
    await waitFor(() => screen.getByText('Test User'));

    // Add as a biller
    const addBillerButton = screen.getByText('Add as Biller');
    fireEvent.click(addBillerButton);
    await waitFor(() => screen.getByText('Remove as Biller'));

    // Remove as a biller
    const removeBillerButton = screen.getByText('Remove as Biller');
    fireEvent.click(removeBillerButton);
    await waitFor(() => screen.getByText('Add as Biller'));
  });

  test('shows error when trying to save without group name or members', async () => {
    render(
      <MemoryRouter>
        <CreateGroup />
      </MemoryRouter>
    );

    const saveButton = screen.getByText('Save Group');
    fireEvent.click(saveButton);

    expect(await screen.findByText('Please enter a group name and add at least one member')).toBeInTheDocument();
  });
});
