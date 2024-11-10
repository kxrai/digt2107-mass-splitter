// src/__tests__/FR006.test.js
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import CreateGroup from './pages/CreateGroup'; 

// Mock `useNavigate` explicitly
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));

describe("CreateGroup Component", () => {
  const mockNavigate = jest.fn();
  const mockAddMember = jest.fn();
  const mockCreateGroup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("creates a new group", async () => {
    const memberEmail = 'testuser@example.com';
    const groupName = 'Test Group';

    // Mock addMember function to simulate adding a member
    mockAddMember.mockResolvedValue({ email: memberEmail });

    render(
      <CreateGroup addMember={mockAddMember} createGroup={mockCreateGroup} />
    );

    // Enter group name
    fireEvent.change(screen.getByLabelText('Group Name'), { target: { value: groupName } });

    // Enter member email
    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: memberEmail },
    });

    // Click Add button
    fireEvent.click(screen.getByText('Add'));

    // Wait for the member to be added to the UI
    await waitFor(() => expect(screen.getByText(memberEmail)).toBeInTheDocument());

    // Click Save Group
    fireEvent.click(screen.getByText('Save Group'));

    // Assert mock functions were called with correct data
    await waitFor(() => {
      expect(mockCreateGroup).toHaveBeenCalledWith({ name: groupName, members: [{ email: memberEmail }] });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it("edits the group by deleting a user", async () => {
    const memberEmail = 'testuser@example.com';

    // Mock addMember function to simulate adding a member
    mockAddMember.mockResolvedValue({ email: memberEmail });

    render(
      <CreateGroup addMember={mockAddMember} createGroup={mockCreateGroup} />
    );

    // Enter member email
    fireEvent.change(screen.getByPlaceholderText('Enter email to add'), {
      target: { value: memberEmail },
    });

    // Click Add button
    fireEvent.click(screen.getByText('Add'));

    // Wait for the member to be added to the UI
    await waitFor(() => expect(screen.getByText(memberEmail)).toBeInTheDocument());

    // Click Remove button next to the member's name
    fireEvent.click(screen.getByText('Remove'));

    // Assert the member is removed from the UI
    await waitFor(() => {
      expect(screen.queryByText(memberEmail)).not.toBeInTheDocument();
    });

    // Assert the "No members added yet." message is displayed
    expect(screen.getByText('No members added yet.')).toBeInTheDocument();
  });
});