// src/FR-005.test.js
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddReceipt from './components/AddReceipt';

describe('AddReceipt Component - Valid Inputs', () => {
  const mockSetReceipts = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Render the AddReceipt component with an empty receipts array and the mock setReceipts function
    render(<AddReceipt receipts={[]} setReceipts={mockSetReceipts} />);

    // Mock the alert function to prevent actual alerts from showing during the tests
    window.alert = jest.fn();
  });

  it('TC-005: Renders the AddReceipt component correctly', () => {
    // Check if all form fields and the Save Receipt button are present in the document
    expect(screen.getByLabelText(/total amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save receipt/i })).toBeInTheDocument();
  });

  it('TC-005: Allows user to enter valid data and submit the form', async () => {
    // Enter a valid amount
    fireEvent.change(screen.getByLabelText(/total amount/i), { target: { value: '50.00' } });

    // Enter a valid date
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-11-08' } });

    // Enter a description
    fireEvent.change(screen.getByLabelText(/description \(optional\)/i), { target: { value: 'Dinner at restaurant' } });

    // Click Save Receipt button
    fireEvent.click(screen.getByRole('button', { name: /save receipt/i }));

    // Wait for the mockSetReceipts function to be called with the correct data
    await waitFor(() => {
      expect(mockSetReceipts).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 50.00,
            date: '2023-11-08',
            description: 'Dinner at restaurant',
          }),
        ])
      );
    });
  });

  it('TC-005: Shows alert when trying to submit without entering amount or date', () => {
    // Leave the amount and date fields empty and click Save Receipt
    fireEvent.click(screen.getByRole('button', { name: /save receipt/i }));

    // Check if the alert function was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Please enter both amount and date for the receipt.');
  });
});
