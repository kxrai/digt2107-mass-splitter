import React from "react";
import HomePage from './pages/HomePage';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from './components/Navbar';
import '@testing-library/jest-dom';

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "googleToken") {
      return JSON.stringify({ email: "test@example.com" });
    }
    return null;
  });
  Storage.prototype.setItem = jest.fn();
});

describe("HomePage", () => {
  test("renders introduction section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Welcome to MASS Splitter! 💸")).toBeInTheDocument();
    expect(screen.getByText("Create groups & add members")).toBeInTheDocument();
    expect(screen.getByText("Track who owes what with receipts")).toBeInTheDocument();
    expect(screen.getByText("Split expenses evenly or customize payments")).toBeInTheDocument();
    expect(screen.getByText("Keep a history of all transactions")).toBeInTheDocument();
  });

  test("shows groups section title", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Groups")).toBeInTheDocument();
  });

  test("shows 'See All' link if logged in", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("See All")).toBeInTheDocument();
    });
  });

  test("displays mock group placeholders if not logged in", () => {
    Storage.prototype.getItem.mockReturnValue(null); // Simulate not logged in

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getAllByAltText("Mock Group").length).toBe(3); // 3 placeholders
  });

  test("should navigate correctly via navbar links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check if each navbar link has the correct href
    expect(screen.getByRole('link', { name: "Home" })).toHaveAttribute('href', '/home');
    expect(screen.getByRole('link', { name: "Groups" })).toHaveAttribute('href', '/groups');
    expect(screen.getByRole('link', { name: "Add Receipt" })).toHaveAttribute('href', '/create-bill');
    expect(screen.getByRole('link', { name: "Split History" })).toHaveAttribute('href', '/split-history');
    expect(screen.getByRole('link', { name: "Account" })).toHaveAttribute('href', '/account');
  });

  test("shows create group button if logged in", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId("create-group-button")).toBeInTheDocument();
  });

  test("clicking create group button navigates to create group page", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const createGroupButton = screen.getByTestId('create-group-button'); // Using test ID selector
    fireEvent.click(createGroupButton);
    expect(createGroupButton).toHaveAttribute('href', '/create-group');
  });
});
