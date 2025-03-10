import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SplitBill from './pages/SplitBill';
import '@testing-library/jest-dom';

describe('SplitBill Component', () => {
  test('renders the Split Bill page title', () => {
    render(
      <MemoryRouter>
        <SplitBill />
      </MemoryRouter>
    );

    expect(screen.getByText('Split Bill')).toBeInTheDocument();
  });

  test('displays "No receipts available" when there are no receipts', () => {
    render(
      <MemoryRouter>
        <SplitBill />
      </MemoryRouter>
    );

    expect(screen.getByText('No receipts available.')).toBeInTheDocument();
  });

  test('renders split type selection options', () => {
    render(
      <MemoryRouter>
        <SplitBill />
      </MemoryRouter>
    );

    expect(screen.getByText('Choose Split Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Split Evenly')).toBeInTheDocument();
    expect(screen.getByLabelText('Custom Split')).toBeInTheDocument();
  });

  test('switches to custom split when selected', () => {
    render(
      <MemoryRouter>
        <SplitBill />
      </MemoryRouter>
    );

    const customSplitRadio = screen.getByRole('radio', { name: /custom/i });
    fireEvent.click(customSplitRadio);

    expect(customSplitRadio).toBeChecked();
  });

  test('shows confirmation modal when confirming split', () => {
    render(
      <MemoryRouter>
        <SplitBill />
      </MemoryRouter>
    );

    const confirmButton = screen.getByText('Submit Bill');
    fireEvent.click(confirmButton);

    expect(screen.getByText('🔒 Final Confirmation')).toBeInTheDocument();
  });

  test('opens cancel modal when clicking cancel', () => {
    render(
      <MemoryRouter>
        <SplitBill />
      </MemoryRouter>
    );

    const cancelButton = screen.getByText('Cancel Bill');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Your receipts will be deleted permanently and your bill will not be saved. Are you sure?')).toBeInTheDocument();
  });
});
