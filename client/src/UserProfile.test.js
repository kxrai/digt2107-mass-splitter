import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from './pages/UserProfile'; // Adjust path as necessary

jest.mock('./components/Navbar', () => () => <div data-testid="navbar">Mock Navbar</div>);

describe('UserProfile Component', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('renders user information when logged in', () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      picture: 'https://via.placeholder.com/150',
    };

    localStorage.setItem('googleToken', JSON.stringify(mockUser));

    render(<UserProfile />);

    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.picture);
  });

});
