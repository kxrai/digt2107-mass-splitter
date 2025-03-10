import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateBill from './pages/CreateBill';

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock AddReceipt Component
jest.mock('./components/AddReceipt', () => ({
  __esModule: true,
  default: ({ setReceipts }) => (
    <button onClick={() => setReceipts([{ id: 1, name: 'Test Receipt' }])}>Add Receipt</button>
  ),
}));

// Mock ReceiptList Component
jest.mock('./components/ReceiptList', () => ({
  __esModule: true,
  default: ({ receipts }) => (
    <div>{receipts.map((r) => <p key={r.id}>{r.name}</p>)}</div>
  ),
}));

describe('CreateBill Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedUsedNavigate.mockReset();
  });

  it('renders the component with initial UI', () => {
    render(
      <Router>
        <CreateBill />
      </Router>
    );

    expect(screen.getByText('MASS Splitter')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeDisabled();
  });

  it('enables the confirm button after adding a receipt', async () => {
    render(
      <Router>
        <CreateBill />
      </Router>
    );

    fireEvent.click(screen.getByText('Add Receipt'));
    await waitFor(() => expect(screen.getByText('Confirm')).not.toBeDisabled());
    expect(screen.getByText('Test Receipt')).toBeInTheDocument();
  });

  it('opens cancel confirmation modal when cancel button is clicked', () => {
    render(
      <Router>
        <CreateBill />
      </Router>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Your receipts will be deleted and not saved. Are you sure?')).toBeInTheDocument();
  });

  it('clears receipts and resets group after confirming cancel', () => {
    render(
      <Router>
        <CreateBill />
      </Router>
    );

    fireEvent.click(screen.getByText('Add Receipt'));
    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.click(screen.getByText('Yes, Cancel'));

    expect(screen.queryByText('Test Receipt')).not.toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeDisabled();
  });

  it('opens final confirmation modal when confirm button is clicked', () => {
    render(
      <Router>
        <CreateBill />
      </Router>
    );

    fireEvent.click(screen.getByText('Add Receipt'));
    fireEvent.click(screen.getByText('Confirm'));

    expect(screen.getByText('Once you confirm, you cannot go back to edit receipts. Are you sure?')).toBeInTheDocument();
  });

  it('saves receipts to localStorage and navigates on confirmation', async () => {
    render(
      <Router>
        <CreateBill />
      </Router>
    );

    fireEvent.click(screen.getByText('Add Receipt'));
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('Yes, Proceed'));

    await waitFor(() => {
      expect(localStorage.getItem('receipts')).toEqual(JSON.stringify([{ id: 1, name: 'Test Receipt' }]));
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/split-bill');
    });
  });
});