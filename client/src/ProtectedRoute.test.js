import React from "react";
import { render } from '@testing-library/react';
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute'; // Adjust path as necessary
import { Navigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(() => <div data-testid="navigate">Redirecting to login</div>),
}));

describe('ProtectedRoute Component', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('renders protected content when user is logged in', () => {
    localStorage.setItem('loggedIn', 'true');

    const ProtectedContent = () => <div data-testid="protected-content">Protected Content</div>;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(getByTestId('protected-content')).toBeInTheDocument();
  });

  test('redirects to login when user is not logged in', () => {
    localStorage.removeItem('loggedIn');

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(getByTestId('navigate')).toBeInTheDocument();
  });
});
