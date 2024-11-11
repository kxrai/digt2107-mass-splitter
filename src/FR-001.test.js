import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import {handleLoginFailure, handleLoginSuccess } from './pages/LoginPage';
import { MainApp } from './App';

// Mock `jwtDecode` and `useNavigate` and 'GoogleLogin' explicitly
jest.mock('jwt-decode', () => ({jwtDecode: jest.fn()}));
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('@react-oauth/google', () => ({googleLogout: jest.fn(),}))

describe("GoogleLogin Button Functions and Logout", () => {
  // Mock `useNavigate` to avoid navigation errors in tests
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    jwtDecode.mockReturnValue({ user: "testUser" });
    Storage.prototype.removeItem = jest.fn();
  });

  it("calls handleLoginSuccess on successful login", () => {
    const credentialResponse = { credential: "fake.jwt.token" };

    handleLoginSuccess(credentialResponse, mockNavigate);

    expect(jwtDecode).toHaveBeenCalledWith("fake.jwt.token");
    expect(localStorage.getItem('loggedIn')).toBe("true");
    console.log(localStorage.getItem('googleToken'));
    expect(JSON.parse(localStorage.getItem('googleToken'))).toEqual({ user: "testUser" });
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it("calls handleLoginFailure on login failure", () => {
    console.error = jest.fn();

    const error = new Error("Login failed");
    handleLoginFailure(error);

    expect(console.error).toHaveBeenCalledWith("Login Failed:", error);
  });

  it("calls handleLogout when Logout button is clicked", () => {
    render(<MainApp />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Assert googleLogout was called
    expect(googleLogout).toHaveBeenCalled();

    // Assert localStorage items were removed
    expect(localStorage.removeItem).toHaveBeenCalledWith('loggedIn');
    expect(localStorage.removeItem).toHaveBeenCalledWith('googleToken');

    // Assert navigation to "/login" occurred
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

});

