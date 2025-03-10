import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SplitHistory from './pages/SplitHistory';
import '@testing-library/jest-dom';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // Mock empty data
  })
);

describe('SplitHistory Page', () => {
  beforeEach(() => {
    localStorage.setItem('googleToken', JSON.stringify({ id: '123' }));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders the Payment History heading', async () => {
    render(
        <MemoryRouter>
          <SplitHistory />
        </MemoryRouter>
      );
    expect(screen.getByText(/Payment History/i)).toBeInTheDocument();
  });

  test('shows loading text initially', async () => {
    render(
        <MemoryRouter>
          <SplitHistory />
        </MemoryRouter>
      );
    expect(screen.getByText(/Loading transactions.../i)).toBeInTheDocument();
  });

  test('fetches and displays payment data', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              receipt_id: 'r1',
              payment_id: 'p1',
              group_id: 'g1',
              billers: 'John Doe',
              receipt_date: '2024-03-09T00:00:00Z',
              description: '',
              type: 'incoming',
              debt: 50,
              paid: false,
              method: 'Cash',
            },
          ]),
      })
    );

    render(
        <MemoryRouter>
          <SplitHistory />
        </MemoryRouter>
      );

    await waitFor(() => {
      expect(screen.getByText(/No Description/i)).toBeInTheDocument();
      expect(screen.getByText(/\$50.00/i)).toBeInTheDocument();
    });
  });

  test('handles API fetch error', async () => {
    // Mock the fetch to reject with an error
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch payments')));

    // Mock console.error to prevent real errors from being logged
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    render(
        <MemoryRouter>
          <SplitHistory />
        </MemoryRouter>
      );

    await waitFor(() => {
        expect(consoleErrorMock).toHaveBeenCalledWith("Error fetching payments:", expect.any(Error));
    });
    // Cleanup after the test
    consoleErrorMock.mockRestore();
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

  test('clicking "Download Details" shows the confirmation modal', async () => {
    global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                receipt_id: 'r1',
                payment_id: 'p1',
                group_id: 'g1',
                billers: 'John Doe',
                receipt_date: '2024-03-09T00:00:00Z',
                description: '',
                type: 'incoming',
                debt: 0,
                paid: true,
                method: 'Cash',
              },
            ]),
        })
      );
  
    render(
      <MemoryRouter>
        <SplitHistory />
      </MemoryRouter>
    );
  
    // Wait for the transactions to be loaded
    await waitFor(() => {
      expect(screen.getByText(/No Description/i)).toBeInTheDocument();
    });
  
    // Click on the "Download Details" button
    const downloadButton = screen.getByText(/Download Details/i);
    downloadButton.click();
  
    // Check if the Confirmation Modal for downloading appears
    await waitFor(() => {
      expect(screen.getByText(/✅ Payment Receipt/i)).toBeInTheDocument();
    });
  });
  
});