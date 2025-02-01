import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SplitHistory from "./pages/SplitHistory";

// Mock Navbar component to prevent unnecessary rendering issues
jest.mock("./components/Navbar", () => () => <div data-testid="navbar">Navbar</div>);

describe("SplitHistory Component", () => {
  beforeEach(() => {
    // Mock localStorage to simulate logged-in user
    global.localStorage.setItem(
      "googleToken",
      JSON.stringify({ id: "test-user-id" })
    );

    // Mock fetch API response for payments
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes("/api/payments/user/")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { receipt_id: 1, method: "incoming" },
              { receipt_id: 2, method: "outcoming" },
            ]),
        });
      }
      if (url.includes("/api/receipts/1")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              billers: "Friend A",
              receipt_date: "2024-11-01T12:00:00Z",
              total_amount: 20,
              description: "Lunch",
            }),
        });
      }
      if (url.includes("/api/receipts/2")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              billers: "Friend B",
              receipt_date: "2024-11-02T12:00:00Z",
              total_amount: 30,
              description: "Dinner",
            }),
        });
      }
      return Promise.reject(new Error("API Not Found"));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.localStorage.clear();
  });

  test("renders Payment History title", async () => {
    render(<SplitHistory />);
    expect(screen.getByText("Payment History")).toBeInTheDocument();
  });

  test("fetches and displays incoming and outgoing transactions", async () => {
    render(<SplitHistory />);

    // Wait for transactions to load
    await waitFor(() => {
      expect(screen.getByText("Friend A")).toBeInTheDocument();
      expect(screen.getByText("11/1/2024 - Lunch")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
    });

    // Switch to outgoing tab
    fireEvent.click(screen.getByText("Outgoing"));

    // Check if outgoing transactions appear
    await waitFor(() => {
      expect(screen.getByText("Friend B")).toBeInTheDocument();
      expect(screen.getByText("11/2/2024 - Dinner")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });

  test("switches between Incoming and Outgoing tabs", async () => {
    render(<SplitHistory />);

    // Initially, Incoming tab should be active
    expect(screen.getByText("Incoming")).toHaveClass("tab-active");

    // Click on Outgoing tab
    fireEvent.click(screen.getByText("Outgoing"));

    // Verify tab change
    expect(screen.getByText("Outgoing")).toHaveClass("tab-active");
    expect(screen.getByText("Incoming")).not.toHaveClass("tab-active");
  });

  test("displays fallback mock data on API failure", async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Network error")));

    render(<SplitHistory />);

    await waitFor(() => {
      expect(screen.getByText("Friend A")).toBeInTheDocument();
      expect(screen.getByText("2024-11-01 - Lunch")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Outgoing"));

    await waitFor(() => {
      expect(screen.getByText("Friend C")).toBeInTheDocument();
      expect(screen.getByText("2024-11-02 - Coffee")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
    });
  });

  test("renders Navbar component", () => {
    render(<SplitHistory />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });
});
