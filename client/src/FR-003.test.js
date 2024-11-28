import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddReceipt from './components/AddReceipt';
import { act } from 'react';

// Mock Fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('fetch-group-id')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 'mock-group-id' }),
    });
  }
  if (url.includes('save-receipt')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  }
  return Promise.reject(new Error('Mock API Error'));
});

describe('AddReceipt Component - Valid Inputs', () => {
  const mockSetReceipts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn(); // Mock alert
    act(() => {
      render(
        <AddReceipt
          receipts={[]}
          setReceipts={mockSetReceipts}
          participants={['John', 'Jane', 'Doe']}
        />
      );
    });
  });

  it('TC-005: Renders the AddReceipt component correctly', () => {
    expect(screen.getByLabelText(/total amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add receipt/i })).toBeInTheDocument();
  });

  it('TC-005: Allows user to enter valid data and submit the form', async () => {
    fireEvent.change(screen.getByLabelText(/total amount/i), { target: { value: '120.00' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-11-08' } });
    fireEvent.change(screen.getByLabelText(/description \(optional\)/i), { target: { value: 'Grocery shopping' } });
    fireEvent.change(screen.getByLabelText(/group name/i), { target: { value: 'Household' } });

    fireEvent.click(screen.getByRole('button', { name: /add receipt/i }));

    await waitFor(() => {
      expect(mockSetReceipts).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 120.0,
            date: '2023-11-08',
            description: 'Grocery shopping',
            group: 'Household',
            splits: [],
          }),
        ])
      );
    });
  });

  it('TC-005: Shows alert when trying to submit without entering amount or date', () => {
    fireEvent.click(screen.getByRole('button', { name: /add receipt/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields, including the group name.');
  });

  it('TC-006: Adds bill and splits the amount correctly among participants', async () => {
    fireEvent.change(screen.getByLabelText(/total amount/i), { target: { value: '90.00' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-11-08' } });
    fireEvent.change(screen.getByLabelText(/description \(optional\)/i), { target: { value: 'Team lunch' } });
    fireEvent.change(screen.getByLabelText(/group name/i), { target: { value: 'Work Friends' } });

    fireEvent.click(screen.getByRole('button', { name: /add receipt/i }));

    await waitFor(() => {
      expect(mockSetReceipts).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 90.0,
            date: '2023-11-08',
            description: 'Team lunch',
            group: 'Work Friends',
            splits: [
              { name: 'John', share: 30.0 },
              { name: 'Jane', share: 30.0 },
              { name: 'Doe', share: 30.0 },
            ],
          }),
        ])
      );
    });
  });
});