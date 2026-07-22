import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeaderHealthReport from "../components/W2D2/HeaderHealthReport";

const mockBarangays = [
  { label: "All Barangays", value: "all" },
  { label: "Brgy. Caloocan", value: "Brgy. Caloocan" },
  { label: "Brgy. Lanatan", value: "Brgy. Lanatan" },
  { label: "Brgy. Dilao", value: "Brgy. Dilao" },
];

describe("HeaderHealthReport Tests", () => {
  it("should show the description text on the screen", () => {
    render(<HeaderHealthReport selectedBarangay="all" setSelectedBarangay={vi.fn()} barangays={mockBarangays} />);
    
    expect(screen.getByText(/Operation Timbang \(OPT\) Summary matrix/i)).toBeInTheDocument();
  });

  it("should open the print page when clicking the print button", () => {
    window.print = vi.fn();
    render(<HeaderHealthReport selectedBarangay="all" setSelectedBarangay={vi.fn()} barangays={mockBarangays} />);
    
    const printButton = screen.getByRole("button", { name: "Print Report" });
    fireEvent.click(printButton);
    
    expect(window.print).toHaveBeenCalled();
  });

  it("should run the function when we select a different barangay choice", () => {
    const changeFunction = vi.fn();
    render(<HeaderHealthReport selectedBarangay="all" setSelectedBarangay={changeFunction} barangays={mockBarangays} />);
    
    const dropdown = screen.getByDisplayValue("All Barangays");
    fireEvent.change(dropdown, { target: { value: "Brgy. Lanatan" } });
    
    expect(changeFunction).toHaveBeenCalledWith("Brgy. Lanatan");
  });
});