// SplitHistory.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SplitHistory from './pages/SplitHistory';
import '@testing-library/jest-dom';

// --- Mocks --- //

// Mock localStorage to return a logged in user.
const fakeUser = { id: 'user1', email: 'test@example.com' };
Storage.prototype.getItem = jest.fn(() => JSON.stringify(fakeUser));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // Mock empty data
  })
);

// Sample payment data (two transactions)
const paymentData = [
  {
    type: 'incoming',
    receipt_id: 'r1',
    payment_id: 'p1',
    debt: 0, // This will render Download Details
    paid: false,
  },
  {
    type: 'incoming',
    receipt_id: 'r2',
    payment_id: 'p2',
    debt: 100, // This will render Mark as Paid
    paid: false,
  },
];

// Sample receipt details for each payment
const receiptDetails = {
  r1: {
    receipt_id: 'r1',
    receipt_date: "2021-01-01T00:00:00.000Z",
    group_id: 'g1',
    billers: 'Biller One',
    description: 'Test Receipt 1',
  },
  r2: {
    receipt_id: 'r2',
    receipt_date: "2021-01-02T00:00:00.000Z",
    group_id: 'g2',
    billers: 'Biller Two',
    description: 'Test Receipt 2',
  },
};

// To prevent real window reloads during tests.
delete window.location;
window.location = { reload: jest.fn() };

describe('SplitHistory Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    // First call: fetching payments for user
    .mockResolvedValueOnce({
      ok: true,
      json: async () => paymentData,
    })
    // Second call: fetching receipt details for payment r1
    .mockResolvedValueOnce({
      ok: true,
      json: async () => receiptDetails.r1,
    })
    // Third call: fetching receipt details for payment r2
    .mockResolvedValueOnce({
      ok: true,
      json: async () => receiptDetails.r2,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('renders the Payment History page', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
    });
    render(
        <MemoryRouter>
          <SplitHistory />
        </MemoryRouter>
      );
    await waitFor (() => {expect(screen.getByText(/Test Receipt 1/i)).toBeInTheDocument;})
    expect(screen.getByText(/Payment History/i)).toBeInTheDocument();
    expect(screen.getByText(/Receipt ID: r1/i)).toBeInTheDocument();
    expect(screen.getByText(/Receipt ID: r2/i)).toBeInTheDocument();
  });

  test('shows loading text initially', async () => {
    render(
        <MemoryRouter>
          <SplitHistory />
        </MemoryRouter>
      );
    expect(screen.getByText(/Loading transactions.../i)).toBeInTheDocument();
  });

  test('switches between Incoming and Outgoing tabs', async () => {
    render(
        <MemoryRouter>
          <SplitHistory />
        </MemoryRouter>
      );

    const outgoingTab = screen.getByText(/Outgoing/i);
    expect(outgoingTab).toBeInTheDocument();

    outgoingTab.click();
    await waitFor(() => {
        expect(outgoingTab.classList.contains('tab-active')).toBe(true);
      });
  });

  test('should delete a transaction when the delete button is clicked', async () => {
    render(
      <MemoryRouter>
        <SplitHistory />
      </MemoryRouter>
    );
    await waitFor (() => {expect(screen.getByText(/Test Receipt 1/i)).toBeInTheDocument;})
    fireEvent.click(screen.getAllByRole('button')[1]);
    fireEvent.click(screen.getByText('Yes, Delete'));
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/payments/p1', {method: 'DELETE'});
    });
  });

  describe('handleDownload function', () => {
    it('should download receipt details when the Download Receipt is confirmed', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
      });
      // Mock URL.createObjectURL to return a dummy URL
      global.URL.createObjectURL = jest.fn(() => 'blob:dummy');

      // Store the original document.createElement function
      const originalCreateElement = document.createElement;

      // Mock only anchor elements and preserve all others
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'a') {
          const anchor = originalCreateElement.call(document, tagName);
          anchor.click = jest.fn(); // Mock click function
          return anchor;
        }
        return originalCreateElement.call(document, tagName);
      });

      // Render the component inside MemoryRouter for routing support
      render(
        <MemoryRouter>
          <SplitHistory />
        </MemoryRouter>
      );

      await waitFor (() => {
        expect(screen.getByText('Test Receipt 1')).toBeInTheDocument;
      })
      // Simulate clicking the "Download Details" button
      fireEvent.click(screen.getByText('Download Details'));
      expect(screen.getByText('✅ Payment Receipt'));
      fireEvent.click(screen.getByText('Download Receipt'));
      // Ensure createObjectURL was called
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      document.createElement.mockRestore();
    });
  });

  describe('handleSubmitPayment function', () => {
    it('should submit payment and reload the page when payment is confirmed', async () => {

      fetch.mockResolvedValueOnce({
        ok: true,
      });

      render(
      <MemoryRouter>
        <SplitHistory />
      </MemoryRouter>
      );
      // Wait for transactions to load.
      await waitFor(() => expect(screen.getByText(/Test Receipt 1/i)).toBeInTheDocument());
      const markAsPaidBtn = screen.getByRole('button', { name: /mark as paid/i });
      fireEvent.click(markAsPaidBtn);

      // Input payment date and payment method
      const dateInput = screen.getByLabelText(/Date Paid/i);
      const methodSelect = screen.getByRole('combobox');
      fireEvent.change(dateInput, { target: { value: '2021-02-02' } });
      fireEvent.change(methodSelect, { target: { value: 'Credit Card' } });
      const submitBtn = screen.getByRole('button', { name: /Confirm Payment Received/i });
      fireEvent.click(submitBtn);

      // Verify that a PUT request was made to the correct URL with the correct payload.
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/payments/p2', {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 100,
            method: 'Credit Card',
            date: '2021-02-02',
          }),
        });
      });

      // Verify that window.location.reload was called.
      expect(window.location.reload).toHaveBeenCalledWith(false);
    });

    it('should alert when payment submission fails', async () => {
      // For failure scenario, simulate a non-ok response.
      fetch.mockResolvedValueOnce({
        ok: false,
      });
      window.alert = jest.fn();

      render(
      <MemoryRouter>
        <SplitHistory />
      </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByText(/Test Receipt 2/i)).toBeInTheDocument());

      // Click Mark as Paid for the transaction with nonzero debt.
      const markAsPaidBtn = screen.getByRole('button', { name: /Mark as Paid/i });
      fireEvent.click(markAsPaidBtn);

      // Fill the form inputs.
      const dateInput = screen.getByLabelText(/Date Paid/i);
      const methodSelect = screen.getByRole('combobox');
      fireEvent.change(dateInput, { target: { value: '2021-03-03' } });
      fireEvent.change(methodSelect, { target: { value: 'PayPal' } });

      const submitBtn = screen.getByRole('button', { name: /Confirm Payment Received/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Payment failed. Please try again.");
      });
    });
  });
});
