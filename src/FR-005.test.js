import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AddReceipt from './components/AddReceipt';
import React from 'react';

// Mock function to simulate updating receipts
const mockSetReceipts = jest.fn();

describe('AddReceipt Component - Valid Inputs', () => {
    beforeEach(() => {
        // Render the AddReceipt component before each test
        render(<AddReceipt receipts={[]} setReceipts={mockSetReceipts} />);
        // Mock the alert function to prevent actual alerts from showing
        window.alert = jest.fn();
    });

    it('TC-005: Renders the AddReceipt component correctly', () => {
        // Check if all form fields and the save button are in the document
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
        // Enter a description
        fireEvent.change(screen.getByLabelText(/Description \(Optional\)/i), { target: { value: 'Dinner at restaurant' } });

        // Click the save button
        fireEvent.click(screen.getByRole('button', { name: /Save Receipt/i }));

        // Check if mockSetReceipts was called with the expected receipt data
        expect(mockSetReceipts).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                amount: 50.00,
                date: '2023-11-08',
                description: 'Dinner at restaurant'
            })
        ]));
    });

    it('TC-005: Shows alert when trying to submit without entering amount or date', () => {
        // Click the save button without entering amount or date
        fireEvent.click(screen.getByRole('button', { name: /Save Receipt/i }));

        // Check if alert was triggered with the correct message
        expect(window.alert).toHaveBeenCalledWith('Please enter both amount and date for the receipt.');
    });
});
