import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SplitBill from './pages/SplitBill';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

// Mock useNavigate from react-router-dom
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('SplitBill Page', () => {
  // Mock localStorage data
  const localStorageReceipts = [
    { amount: 100, date: '2023-11-08', description: 'Dinner' }
  ];
  const localStorageSelectedGroup = '1';
  
  // Mock data for group members (from first fetch)
  const mockGroupMembers = [
    { username: 'Alice', user_id: 1, email: 'alice@example.com' },
    { username: 'Joe', user_id: 2, email: 'joe@example.com' },
  ];
  
  // And group details containing billers (from second fetch)
  const mockGroupDetails = {
    billers: ['Alice']
  };

  beforeEach(() => {
    localStorage.setItem('receipts', JSON.stringify(localStorageReceipts));
    localStorage.setItem('selectedGroup', localStorageSelectedGroup);

    // First fetch: group members; second fetch: group details (billers)
    fetchMock.mockResponses(
      [JSON.stringify(mockGroupMembers), { status: 200 }],
      [JSON.stringify(mockGroupDetails), { status: 200 }]
    );
  });

  afterEach(() => {
    fetchMock.resetMocks();
    mockedUsedNavigate.mockReset();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <Router>
        <SplitBill />
      </Router>
    );
  };

  it('SplitBiil page is rendered correctly', async () => {
    renderComponent();

    // Expect receipt to be rendered
    await waitFor(() => {
      expect(screen.getByText('Split Bill')).toBeInTheDocument();
      expect(screen.getByText('Dinner')).toBeInTheDocument();
      expect(screen.getByText('Total: $100.00')).toBeInTheDocument();
      expect(screen.getByText('Cancel Bill')).toBeInTheDocument();
      expect(screen.getByText('Submit Bill')).toBeInTheDocument();
    });
  });

  it('fetches group members and calculates split even amounts correctly', async () => {
    renderComponent();

    // Wait for fetches to complete and state to update
    await waitFor(() => {
      // Group members should be rendered in the even split breakdown (e.g., "alice owes:")
      expect(screen.getByText(/Alice owes:/i)).toBeInTheDocument();
      expect(screen.getByText(/Joe owes:/i)).toBeInTheDocument();
      expect(screen.getByText('📩 Everyone sends $50.00 to Alice')).toBeInTheDocument();
    });
  });

  it('allows adjusting custom split percentages and updates UI', async () => {
    renderComponent();

    // Change split type to custom to reveal slider controls
    const customRadio = screen.getByDisplayValue('custom');
    fireEvent.click(customRadio);

    await waitFor(() => {
      // Expect slider controls to appear (they display each group member's username)
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Joe')).toBeInTheDocument();
    });

    // Get the slider for first member and change its value (simulate handleCustomSplitChange)
    const sliderInputs = screen.getAllByRole('slider');
    expect(sliderInputs.length).toBeGreaterThan(0);

    // Simulate changing first slider from even split
    fireEvent.change(sliderInputs[0], { target: { value: '70' } });

    // After change, the displayed percentage for first member should be updated
    await waitFor(() => {
      expect(screen.getByText(/58.33%/)).toBeInTheDocument();
    });
  });

  it('handles cancel flow correctly', async () => {
    renderComponent();

    // Click the "Cancel Bill" button to open cancel confirmation modal
    const cancelButton = screen.getByRole('button', { name: /Cancel Bill/i });
    fireEvent.click(cancelButton);
    expect(screen.getByText(/⚠️ Warning/i)).toBeInTheDocument();

    const yesCancelButton = screen.getByText('Yes, Cancel');
    fireEvent.click(yesCancelButton);

    // Confirm that localStorage items are removed and navigate is called with '/create-bill'
    await waitFor(() => {
      expect(localStorage.getItem('receipts')).toBeNull();
      expect(localStorage.getItem('selectedGroup')).toBeNull();
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/create-bill');
    });
  });

  it('handles confirm flow and API calls on bill submission', async () => {
    renderComponent();

    // Wait for fetches to resolve so state is populated
    await waitFor(() => {
      expect(screen.getByText(/Alice owes:/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /Submit Bill/i });
    fireEvent.click(submitButton);

    // Confirmation modal should now be visible
    expect(screen.getByText(/🔒 Final Confirmation/i)).toBeInTheDocument();

     // 1. The receipt creation POST request returns a receiptId.
    fetchMock.mockResponseOnce(JSON.stringify({ receiptId: 123 }), { status: 200 });
    // 2. Payment creation POST requests for each group member and receipt.
    fetchMock.mockResponses(
      [JSON.stringify({ paymentId: 1 }), { status: 200 }],
      [JSON.stringify({ paymentId: 2 }), { status: 200 }]
    );
    // Simulate clicking "Yes, Proceed" in the modal
    const yesProceedButton = screen.getByText('Yes, Proceed');
    fireEvent.click(yesProceedButton);

    await waitFor(() => {
      // localStorage should be cleared
      expect(localStorage.getItem('receipts')).toBeNull();
      expect(localStorage.getItem('selectedGroup')).toBeNull();
      // And the user should be navigated to '/split-history'
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/split-history');
    });
  });
})