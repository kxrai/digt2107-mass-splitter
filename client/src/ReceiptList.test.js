import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ReceiptList from './components/ReceiptList';
import '@testing-library/jest-dom';

const mockReceipts = [
  { id: '1', amount: '20', date: '2024-03-01', description: 'Groceries' },
  { id: '2', amount: '45.50', date: '2024-03-05', description: 'Gas' },
];

describe('ReceiptList Component', () => {
  let setReceiptsMock;

  beforeEach(() => {
    setReceiptsMock = jest.fn();
    render(<ReceiptList receipts={mockReceipts} setReceipts={setReceiptsMock} />);
  });

  test('renders receipt list correctly', () => {
    expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/Gas/i)).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
    expect(screen.getByText('$45.50')).toBeInTheDocument();
  });

  test('opens edit modal with pre-filled data', () => {
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-03-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Groceries')).toBeInTheDocument();
  });

  test('updates receipt data on save', async() => {
    fireEvent.click(screen.getAllByRole('button')[0]);

    fireEvent.change(screen.getByLabelText('Total Amount'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-03-02' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Supermarket' } });

    fireEvent.click(screen.getByText(/Save Changes/i));
    expect(setReceiptsMock).toHaveBeenCalled();
    


    // await waitFor(() => (expect(setReceiptsMock).toHaveBeenCalledWith([
    //   { id: '1', amount: '25', date: '2024-03-02', description: 'Supermarket' },
    //   { id: '2', amount: '45.50', date: '2024-03-05', description: 'Gas' },
    // ])));
  });

  test('cancels edit without saving changes', () => {
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.change(screen.getByLabelText('Total Amount'), { target: { value: '100' } });

    fireEvent.click(screen.getByText('Cancel'));

    expect(setReceiptsMock).not.toHaveBeenCalled();
  });
});