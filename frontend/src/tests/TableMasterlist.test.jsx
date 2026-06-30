import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TableMasterlist from "../components/W2D1/TableMasterlist";

const RUNTIME_RECORDS = [
  { id: 1, address: "Brgy. Caloocan, PUROK 1", caregiver: "MERCADO, MATEO", name: "RAMOS, DIEGO", ip: "NO", sex: "M", dob: "Jun-16-2024", dateMeasured: "Jun-28-2026", weight: 9.5, height: 79.6, ageMos: 24, wfa: "N", hfa: "N", wflh: "N" }
];

describe("TableMasterlist Presentation Tests", () => {
  it("renders mock data elements into row elements safely", () => {
    render(<TableMasterlist records={RUNTIME_RECORDS} />);
    expect(screen.getByText("RAMOS, DIEGO")).toBeInTheDocument();
    expect(screen.getByText("MERCADO, MATEO")).toBeInTheDocument();
  });

  it("handles displaying empty arrays with explicit zero-state feedback strings", () => {
    render(<TableMasterlist records={[]} />);
    expect(screen.getByText("No matching child profile records discovered.")).toBeInTheDocument();
  });

  it("toggles the detail dashboard modal visibility tracking user action selection clicks", () => {
    render(<TableMasterlist records={RUNTIME_RECORDS} />);
    
    fireEvent.click(screen.getByRole("button", { name: "Profile" }));
    expect(screen.getByTestId("profile-modal")).toBeInTheDocument();
    expect(screen.getByText("Current Nutritional Breakdown")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close Modal" }));
    expect(screen.queryByTestId("profile-modal")).not.toBeInTheDocument();
  });
});