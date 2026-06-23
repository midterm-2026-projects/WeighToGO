import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoginPage from "../components/W1D1/Login";

describe("Login", () => {
  const adminRole = "Administrator (Admin)";
  const bnsRole = "Barangay Nutrition Scholar";
  const validAdminEmail = "user@health.gov.ph";
  const validAdminPassword = "Balayan2026!";

  it("renders login form correctly", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Role")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates input values correctly", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: validAdminEmail } });
    fireEvent.change(passwordInput, { target: { value: validAdminPassword } });

    expect(emailInput.value).toBe(validAdminEmail);
    expect(passwordInput.value).toBe(validAdminPassword);
  });

  it("changes role selection", () => {
    render(<LoginPage />);
    const roleSelect = screen.getByLabelText("Role");

    fireEvent.change(roleSelect, { target: { value: adminRole } });
    expect(roleSelect.value).toBe(adminRole);

    fireEvent.change(roleSelect, { target: { value: bnsRole } });
    expect(roleSelect.value).toBe(bnsRole);
  });

  it("shows error when fields are empty", () => {
    render(<LoginPage />);
    
    // Attempt login without selecting or typing anything
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // First assertion caught on empty dropdown role
    expect(screen.getByText("Invalid dropdown selection")).toBeInTheDocument();
  });

  it("shows error if email format is invalid", () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: adminRole } });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: "userhealth.gov.ph" } });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: validAdminPassword } });
    
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  it("shows error if password length is under 8 characters", () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: adminRole } });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: validAdminEmail } });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: "short" } });
    
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Weak password configuration")).toBeInTheDocument();
  });

  it("shows warning error when email is provided but password is empty", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Role"), { target: { value: adminRole } });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: validAdminEmail } });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Weak password configuration")).toBeInTheDocument();
  });

  it("shows warning error when password is provided but email is empty", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Role"), { target: { value: adminRole } });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: "" } }); 
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: validAdminPassword } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  it("shows warning message for incorrect credentials", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Role"), { target: { value: adminRole } });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: validAdminEmail } });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: "WrongPassword123!" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Incorrect email or password")).toBeInTheDocument();
  });

  it("shows success message when Administrator credentials are valid", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Role"), { target: { value: adminRole } });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: validAdminEmail } });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: validAdminPassword } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Login Successful")).toBeInTheDocument();
  });

  it("shows success message when Barangay Nutrition Scholar credentials are valid", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Role"), { target: { value: bnsRole } });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: "bns@health.gov.ph" } });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: "BNSBalayan2026!" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Login Successful")).toBeInTheDocument();
  });
});