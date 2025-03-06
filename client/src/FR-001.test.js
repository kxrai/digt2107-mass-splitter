import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { handleLoginFailure } from '../src/pages/LoginPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { MainApp } from './App';
import LoginPage from '../src/pages/LoginPage';

// Mock modules
jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));
jest.mock('@react-oauth/google', () => ({
  googleLogout: jest.fn(),
  GoogleLogin: ({ onSuccess }) => (
    <button
      onClick={() => onSuccess({ credential: 'mock-credential' })}
      aria-label="Sign in with Google"
    >
      Sign in with Google
    </button>
  ),
  GoogleOAuthProvider: ({ children }) => <>{children}</>
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
global.fetch = jest.fn();

describe("Login page functionalities", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    jwtDecode.mockReturnValue({ name: "testUser", email: 'testuser@example.com' });
  });

  it("checks if LoginPage is successfully rendered", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    
    expect(screen.getByText(/Login\/Sign-up with Google/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
  });

  it("calls handleLoginFailure on login failure", () => {
    console.error = jest.fn();
    const error = new Error("Login failed");
    handleLoginFailure(error);
    expect(console.error).toHaveBeenCalledWith("Login Failed:", error);
  });

  it("handles successful login", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user_id: 1, username: 'Test User', email: 'testuser@example.com' })
    });

    render(
      <Router>
        <LoginPage />
      </Router>
    );

    const loginButton = screen.getByRole('button', { name: /Sign in with Google/i });
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('loggedIn', 'true');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it("calls handleLogout when Logout button is clicked", async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'loggedIn') return 'true';
      return null;
    });

    render(
      <Router>
        <MainApp />
      </Router>
    );

    const logoutButton = screen.getByText(/logout/i);
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(googleLogout).toHaveBeenCalled();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('loggedIn');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('googleToken');
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});

