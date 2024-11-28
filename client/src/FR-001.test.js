import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import {handleLoginFailure} from '../src/pages/LoginPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { MainApp } from './App';
import LoginPage from '../src/pages/LoginPage';

// Mock `jwtDecode` and `useNavigate` and 'GoogleLogin' explicitly
jest.mock('jwt-decode', () => ({jwtDecode: jest.fn()}));
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('@react-oauth/google', () => ({googleLogout: jest.fn(),}))
global.fetch = jest.fn();


describe("Login page functionalities", () => {
  // Mock `useNavigate` to avoid navigation errors in tests
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    jwtDecode.mockReturnValue({ user: "testUser", email: 'testuser@example.com' });
    Storage.prototype.removeItem = jest.fn();
  });
  //Test case: Handles a successful login
  it("checks if LoginPage is successfully rendered", () => {
    render(
    <Router>
      <LoginPage />
    </Router>
    );
  
    // Check for the title
    expect(screen.getByText('/Login\/Sign-up with Google/i')).toBeInTheDocument();
    // Check for the Google login button
    expect(screen.getByRole('button', { name: '/Sign in with Google/i' })).toBeInTheDocument();ge
  });
  //Test case: Handles a failed login 
  it("calls handleLoginFailure on login failure", () => {
    console.error = jest.fn();

    const error = new Error("Login failed");
    handleLoginFailure(error);

    expect(console.error).toHaveBeenCalledWith("Login Failed:", error); // Checks if error is logged to console
  });

  it("handles successful login", () => {
    const mockNavigate = jest.fn();
    const mockLocation = { state: { from: '/protected' } };

    // Mock fetch responses
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ user_id: 1, username: 'Test User', email: 'testuser@example.com' }),
      });

    render(
      <GoogleOAuthProvider clientId="584206264281-4udrb623en2sg85nq3b58eevjm8elf0r.apps.googleusercontent.com">
        <Router>
          <LoginPage />
        </Router>
      </GoogleOAuthProvider>
    );

    // Simulate Google login button success
    const loginButton = screen.getByRole('button', { name: /Sign in with Google/i });
    userEvent.click(loginButton);

    // Check if localStorage is updated
    expect(localStorage.getItem('loggedIn')).toBe('true');
    expect(localStorage.getItem('googleToken')).toContain('testuser@example.com');

    // Check if user is navigated to the correct page
    expect(mockNavigate).toHaveBeenCalledWith('/home');

  });

  it("calls handleLogout when Logout button is clicked", () => {
    localStorage.setItem('loggedIn',true);
    localStorage.setItem('googleToken','testUser@example.com');
    render(<MainApp />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(googleLogout).toHaveBeenCalled(); // Assert googleLogout was called
    expect(localStorage.removeItem).toHaveBeenCalledWith('loggedIn'); // Assert localStorage items were removed
    expect(localStorage.removeItem).toHaveBeenCalledWith('googleToken');
    expect(mockNavigate).toHaveBeenCalledWith("/login"); //Checks if redirects to login page
  });

});

