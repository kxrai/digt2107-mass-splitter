// src/FR-005.test.js
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddReceipt from './components/AddReceipt'; 

describe("AddReceipt Component - Valid Inputs", () => {
  const mockSetReceipts = jest.fn();

  beforeEach(() => {
    // Render the AddReceipt component before each test
    render(<AddReceipt receipts={[]} setReceipts={mockSetReceipts} />);
    // Mock the alert function to prevent actual alerts from showing
    window.alert = jest.fn();
  });

  it("TC-005: Renders the AddReceipt component correctly", () => {
    // Check if all form fields and the save button are in the document
    expect(screen.getByPlaceholderText("e.g., 50.00")).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., Dinner at restaurant")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Receipt/i })).toBeInTheDocument();
  });

  it("TC-005: Allows user to enter valid data and submit the form", async () => {
    // Enter a valid amount
    fireEvent.change(screen.getByPlaceholderText("e.g., 50.00"), { target: { value: '50.00' } });
    // Enter a valid date
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2023-11-08' } });
    // Enter a description
    fireEvent.change(screen.getByPlaceholderText("e.g., Dinner at restaurant"), { target: { value: 'Dinner at restaurant' } });

    // Click the save button
    fireEvent.click(screen.getByRole('button', { name: /Save Receipt/i }));

    // Check if mockSetReceipts was called with the new receipt data
    await waitFor(() => {
      expect(mockSetReceipts).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          amount: 50.00,
          date: '2023-11-08',
          description: 'Dinner at restaurant',
        }),
      ]));
    });
  });

  it("TC-005: Shows alert when trying to submit without entering amount or date", () => {
    // Click the save button without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Save Receipt/i }));

    // Check if alert was called with the appropriate message
    expect(window.alert).toHaveBeenCalledWith('Please enter both amount and date for the receipt.');
  });
});
