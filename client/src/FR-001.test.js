import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { handleLoginSuccess, checkUser, handleLoginFailure } from '../src/pages/LoginPage';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { MainApp } from './App';
import { jwtDecode } from 'jwt-decode';

// Mock dependencies
jest.mock('jwt-decode', () => ({jwtDecode: jest.fn()}));
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('@react-oauth/google', () => ({googleLogout: jest.fn(),}))
global.fetch = jest.fn();

//Test case: Checks whether user can login with valid credentials
describe('handleLoginSuccess', () => {
  const mockNavigate = jest.fn();
  const mockLocation = { state: { from: '/home' } };

  beforeEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
  });

  it('should decode the token, check the user, store login status, and navigate', async () => {
    //Mock tokens, jwtdecode and fetch api call
      const mockCredentialResponse = { credential: 'mocked_jwt' };
      const mockToken = {email: 'testuser@example.com'};
      jwtDecode.mockReturnValue(mockToken);
      
      jest.spyOn(global, 'fetch')
          .mockResolvedValueOnce({
              ok: true,
              json: jest.fn().mockResolvedValue({ user_id: 1, username: 'Test User', email: 'testuser@example.com' }),
          });
      //Call the handleLoginSuccess function
      await handleLoginSuccess(mockCredentialResponse, mockNavigate, mockLocation);
      //Check that the token was decoded
      expect(jwtDecode).toHaveBeenCalledWith(mockCredentialResponse.credential);
      //Check that a GET request was made
      expect(fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/users/email/${mockToken.email}`,
          { method: 'GET' }
      );
      //Check that the user state is logged in
      expect(localStorage.getItem('loggedIn')).toBe('true');
      //Check that you're navigated to home page
      expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});

//Test case: Creates a new user if it doesn't exit and checks if a user exists
describe('checkUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('should return true if the user exists', async () => {
      //Mock token and fetch api call
        const mockToken = { email: 'testuser@example.com' };

        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ user_id: 1, username: 'Test User', email: 'testuser@example.com' }),
        });
        //Call the checkUser function
        const result = await checkUser(mockToken);
        //Check that a GET request was made
        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:3000/api/users/email/${mockToken.email}`,
            { method: 'GET' }
        );
        //Check user token was stored
        expect(localStorage.getItem('googleToken')).toContain('testuser@example.com');
        expect(result).toBe(true);
    });

    it('should create a new user if the user does not exist', async () => {
        const mockToken = { email: 'newuser@example.com', name: 'New User' };

        jest.spyOn(global, 'fetch')
            .mockResolvedValueOnce({ ok: false, json: jest.fn().mockResolvedValue({}) }) // User not found
            .mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({ userId: 2 }),
            });

        const result = await checkUser(mockToken);
        // Creates a POST request to create a new user
        expect(fetch).toHaveBeenNthCalledWith(
            1,
            `http://localhost:3000/api/users/email/${mockToken.email}`,
            { method: 'GET' }
        );
        expect(fetch).toHaveBeenNthCalledWith(
            2,
            '/api/users/create',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: mockToken.name,
                    email: mockToken.email,
                    phone_number: '',
                    password: '',
                }),
            }
        );
        // User token stored (logged in)
        expect(localStorage.getItem('googleToken')).toContain('newuser@example.com');
        expect(result).toBe(true);
    });

    it('should return false if an error occurs during API calls', async () => {
        const mockToken = { email: 'erroruser@example.com' };

        jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Server is down'));

        const result = await checkUser(mockToken);
        // Make GET request
        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:3000/api/users/email/${mockToken.email}`,
            { method: 'GET' }
        );
        // GET request fails
        expect(result).toBe(false);
    });
});
//Test case: Handles a failed login 
describe('handleLoginFailure', () => {
  it("calls handleLoginFailure on login failure", () => {
    console.error = jest.fn();

    const error = new Error("Login failed");
    //Calls handleLoginFailure function
    handleLoginFailure(error);

    expect(console.error).toHaveBeenCalledWith("Login Failed:", error); // Checks if error is logged to console
  });
});

//Test case: Handles Logout
describe('Handle Logout function', () => {
  const mockNavigate = jest.fn()
  beforeEach (() => {
    jest.clearAllMocks();
    localStorage.clear();
    Storage.prototype.removeItem = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });
  

  it("calls handleLogout when Logout button is clicked", () => {
    //Logs in user
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('googleToken', 'testUser@example.com');
    //Presses logout button
    render(<MainApp />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    //Checks user is logged out
    expect(googleLogout).toHaveBeenCalled(); // Assert googleLogout was called
    expect(localStorage.removeItem).toHaveBeenCalledWith('loggedIn'); // Assert localStorage items were removed
    expect(localStorage.removeItem).toHaveBeenCalledWith('googleToken');
    expect(mockNavigate).toHaveBeenCalledWith("/login"); //Checks if redirects to login page
  });
})

 