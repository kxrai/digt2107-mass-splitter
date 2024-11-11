import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AddReceipt from './components/AddReceipt';

// Mock function to simulate updating receipts
const mockSetReceipts = jest.fn();

describe('AddReceipt Component - Valid Inputs', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock data
  });

  it('TC-005: Adds a receipt with valid inputs', () => {
    // Render the AddReceipt component
    render(<AddReceipt receipts={[]} setReceipts={mockSetReceipts} />);

    // Enter a valid amount
    fireEvent.change(screen.getByLabelText(/total amount/i), { target: { value: '50.00' } });
    
    // Enter a valid date
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-11-08' } });

    // Enter a description (optional)
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Dinner with friends' } });

    // Submit the form
    fireEvent.click(screen.getByText(/save receipt/i));

    // Verify that mockSetReceipts was called with the correct data
    expect(mockSetReceipts).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        amount: 50.00,
        date: '2023-11-08',
        description: 'Dinner with friends'
      })
    ]));

    // Check that the input fields are reset after submission
    expect(screen.getByLabelText(/total amount/i).value).toBe('');
    expect(screen.getByLabelText(/date/i).value).toBe('');
    expect(screen.getByLabelText(/description/i).value).toBe('');
  });
});
