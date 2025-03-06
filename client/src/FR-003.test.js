import { act } from "react"; // Correct `act` import
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddReceipt from "./components/AddReceipt";

// Mock the `fetch` API for all necessary endpoints
global.fetch = jest.fn((url) => {
  if (url.includes("/api/groups/name/")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ group_id: "mock-group-id", billers: "[]" }),
    });
  }
  if (url.includes("/api/receipts/create")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: "mock-receipt-id" }),
    });
  }
  return Promise.reject(new Error("Unexpected API call"));
});

describe("AddReceipt Component - Valid Inputs", () => {
  let mockSetReceipts;

  beforeEach(async () => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    mockSetReceipts = jest.fn();

    // Mock `fetch()` responses before rendering
    global.fetch.mockImplementation((url) => {
      if (url.includes("/api/groups/name/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ group_id: "mock-group-id", billers: "[]" }),
        });
      }
      if (url.includes("/api/receipts/create")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: "mock-receipt-id" }),
        });
      }
      return Promise.reject(new Error("Unexpected API call"));
    });

    // Ensure `render()` is correctly wrapped in `await act`
    await act(async () => {
      render(<AddReceipt receipts={[]} setReceipts={mockSetReceipts} />);
    });
  });

  it("TC-005: Renders the AddReceipt component correctly", () => {
    expect(screen.getByLabelText(/total amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add receipt/i })).toBeInTheDocument();
  });

  it("TC-005: Allows user to enter valid data and submit the form", async () => {
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/total amount/i), { target: { value: "50.00" } });
      fireEvent.change(screen.getByLabelText(/date/i), { target: { value: "2023-11-08" } });
      fireEvent.change(screen.getByLabelText(/description \(optional\)/i), { target: { value: "Dinner at restaurant" } });
      fireEvent.change(screen.getByLabelText(/group name/i), { target: { value: "Friends" } });
      fireEvent.click(screen.getByRole("button", { name: /add receipt/i }));
    });

    // Ensure `mockSetReceipts` is called after fetch is resolved
    await waitFor(() => {
      expect(mockSetReceipts).toHaveBeenCalledTimes(1);
    });
  });

  it("TC-005: Shows alert when trying to submit without entering amount or date", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /add receipt/i }));
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please fill in all fields, including the group name.");
    });
  });
});