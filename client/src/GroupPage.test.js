// src/GroupsPage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GroupPage from './pages/GroupPage';

// Mock child components if desired
jest.mock('./components/UserGroups', () => () => (
  <div data-testid="user-groups-mock">UserGroups Mock</div>
));

jest.mock('./components/Navbar', () => () => (
  <div data-testid="navbar-mock">Navbar Mock</div>
));

describe('GroupsPage', () => {
  it('renders GroupsPage correctly', () => {
    render(<GroupPage />);

    expect(
      screen.getByRole('heading', { name: /Manage Your Groups/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('user-groups-mock')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
  });
});