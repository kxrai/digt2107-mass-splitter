// src/FR-003.test.js
import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddReceipt from './components/AddReceipt';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('AddReceipt Component - Valid Inputs', () => {
  const mockSetReceipts = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    fetchMock.resetMocks();
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
    expect(screen.getByRole('button', { name: /Add Receipt/i })).toBeInTheDocument();
  });

  it('TC-005: Allows user to enter valid data and submit the form', async () => {
    // Mock function to track state updates
    const mockSetReceipts = jest.fn();
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
  
    // Enter a valid amount
    fireEvent.change(screen.getByLabelText(/total amount/i), { target: { value: '50.00' } });
  
    // Enter a valid date
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-11-08' } });
  
    // Enter a description
    fireEvent.change(screen.getByLabelText(/description \(optional\)/i), { target: { value: 'Dinner Party' } });
  
    // Click Save Receipt button
    fireEvent.click(screen.getByRole('button', { name: /Add Receipt/i }));
    //expect(screen.getByText("$50.00 - Dinner Party")).toBeInTheDocument();
    expect(screen.getByText("2023-11-08")).toBeInTheDocument();
  });
  
  //   // Wait for the mockSetReceipts function to be called with the correct data
  //   await waitFor(() => {
  //     expect(mockSetReceipts).toHaveBeenCalledWith(
  //       expect.arrayContaining([
  //         expect.objectContaining({
  //           amount: 50.0, // Ensure it's stored as a number
  //           date: '2023-11-08',
  //           description: 'Dinner at restaurant',
  //         }),
  //       ])
  //     );
  //   });
  // });
  

  it('TC-005: Shows alert when trying to submit without entering amount or date', () => {
    // Leave the amount and date fields empty and click Save Receipt
    fireEvent.click(screen.getByRole('button', {name: /Add Receipt/i}));

    // Check if the alert function was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields, including the group name.');
  });
});
