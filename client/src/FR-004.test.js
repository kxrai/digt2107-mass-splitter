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

    await waitFor(() => {
      const memberList = screen.getByText('Group Members').nextElementSibling;
      expect(memberList).toHaveTextContent('testuser@example.com');
    });
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
      const memberList = screen.getByText('Group Members').nextElementSibling;
      expect(memberList).toHaveTextContent('testuser@example.com');
    });

    const addBillerButton = screen.getByText('Add as Biller');
    fireEvent.click(addBillerButton);

    await waitFor(() => {
      const billerList = screen.getByText('Designate Billers').nextElementSibling;
      const billerItem = billerList.querySelector('li');
      expect(billerItem).toHaveTextContent('testuser@example.com');
      expect(screen.getByText('Remove as Biller')).toBeInTheDocument();
    });

    const removeBillerButton = screen.getByText('Remove as Biller');
    fireEvent.click(removeBillerButton);

    await waitFor(() => {
      const billerList = screen.getByText('Designate Billers').nextElementSibling;
      const billerItem = billerList.querySelector('li');
      expect(billerItem.querySelector('button')).toHaveTextContent('Add as Biller');
      expect(screen.getByText('Add as Biller')).toBeInTheDocument();
    });
  });

  it('saves the group successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 1, email: 'testuser@example.com' }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ groupId: 123 }),
    });

    render(<CreateGroup />);

    fireEvent.change(screen.getByPlaceholderText('Enter group name'), {
      target: { value: 'Test Group' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      const memberList = screen.getByText('Group Members').nextElementSibling;
      expect(memberList).toHaveTextContent('testuser@example.com');
    });

    fireEvent.click(screen.getByText('Save Group'));

    await waitFor(() => {
      expect(screen.getByText('Failed to create group. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows error when saving group fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 1, email: 'testuser@example.com' }),
    });

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

    await waitFor(() => {
      const memberList = screen.getByText('Group Members').nextElementSibling;
      expect(memberList).toHaveTextContent('testuser@example.com');
    });

    fireEvent.click(screen.getByText('Save Group'));

    await waitFor(() => {
      expect(screen.getByText('Failed to create group. Please try again.')).toBeInTheDocument();
    });
  });
});
