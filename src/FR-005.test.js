// src/FR-005.test.js
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AddReceipt from './components/AddReceipt';

describe('AddReceipt Component - Valid Inputs', () => {
  const mockSetReceipts = jest.fn();

  beforeEach(() => {
    render(<AddReceipt receipts={[]} setReceipts={mockSetReceipts} />);
  });

  it('TC-005: Renders the AddReceipt component correctly', () => {
    // Check if all form fields and the button are in the document
    expect(screen.getByLabelText(/Total Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description \(Optional\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Receipt/i })).toBeInTheDocument();
  });

  it('TC-005: Allows user to enter valid data and submit the form', () => {
    // Enter a valid amount
    fireEvent.change(screen.getByLabelText(/Total Amount/i), { target: { value: '50.00' } });

    // Enter a valid date
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2023-11-08' } });

    // Enter an optional description
    fireEvent.change(screen.getByLabelText(/Description \(Optional\)/i), {
      target: { value: 'Dinner at restaurant' },
    });

    // Click the Save Receipt button
    fireEvent.click(screen.getByRole('button', { name: /Save Receipt/i }));

    // Check that the mock function was called, indicating the receipt was added
    expect(mockSetReceipts).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          amount: 50.0,
          date: '2023-11-08',
          description: 'Dinner at restaurant',
        }),
      ])
    );
  });

  it('TC-005: Shows alert when trying to submit without entering amount or date', () => {
    // Click the Save Receipt button without entering data
    window.alert = jest.fn(); // Mock alert

    fireEvent.click(screen.getByRole('button', { name: /Save Receipt/i }));

    // Check if alert was called due to missing required fields
    expect(window.alert).toHaveBeenCalledWith('Please enter both amount and date for the receipt.');
  });
});
