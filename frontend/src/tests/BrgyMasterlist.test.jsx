import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BrgyMasterlist from "../components/W2D1/BrgyMasterlist";

describe("BrgyMasterlist", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the masterlist layout with tracking stats and dropdown options properly", () => {
    render(<BrgyMasterlist />);

    expect(screen.getByText("Barangay Masterlist")).toBeInTheDocument();
    expect(screen.getByText("Total Registered")).toBeInTheDocument();

    expect(screen.getByText("RAMOS, DIEGO")).toBeInTheDocument();
    expect(screen.getByText("OCAMPO, TERESA")).toBeInTheDocument();
  });

  it("filters rows dynamically based on chosen Barangay filter option selections", () => {
    render(<BrgyMasterlist />);
    const barangaySelect = screen.getByLabelText("Barangay");

    fireEvent.change(barangaySelect, { target: { value: "Brgy. Lanatan" } });

    expect(screen.getByText("MERCADO, LUIS")).toBeInTheDocument();
    expect(screen.queryByText("RAMOS, DIEGO")).not.toBeInTheDocument();
  });

  it("filters rows dynamically via selective target child age-group segments", () => {
    render(<BrgyMasterlist />);
    const ageSelect = screen.getByLabelText("Age Group");

    fireEvent.change(ageSelect, { target: { value: "0-11 Months" } });

    expect(screen.getByText("OCAMPO, TERESA")).toBeInTheDocument();
    expect(screen.queryByText("RAMOS, DIEGO")).not.toBeInTheDocument();
  });

  it("filters items correctly matching health status category parameters", () => {
    render(<BrgyMasterlist />);
    const statusSelect = screen.getByLabelText("Overall Status");

    fireEvent.change(statusSelect, { target: { value: "Obese" } });

    expect(screen.getByText("BAUTISTA, CARLOS")).toBeInTheDocument();
    expect(screen.queryByText("RAMOS, DIEGO")).not.toBeInTheDocument();
  });

  it("renders a popup confirmation modal showcasing precise nutritional metrics on clicking Profile", () => {
    render(<BrgyMasterlist />);
    
    const profileButtons = screen.getAllByRole("button", { name: "Profile" });
    fireEvent.click(profileButtons[0]);

    const targetModal = screen.getByTestId("profile-modal");
    expect(targetModal).toBeInTheDocument();
    expect(screen.getByText("Current Nutritional Breakdown")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Close Modal" });
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("profile-modal")).not.toBeInTheDocument();
  });
});