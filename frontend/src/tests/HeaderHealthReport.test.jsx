import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeaderHealthReport from "../components/W2D2/HeaderHealthReport";

describe("HeaderHealthReport Tests", () => {
  it("should show the description text on the screen", () => {
    render(<HeaderHealthReport selectedBarangay="All Barangays" setSelectedBarangay={vi.fn()} />);
    
    expect(screen.getByText(/Operation Timbang \(OPT\) Summary matrix/i)).toBeInTheDocument();
  });

  it("should open the print page when clicking the print button", () => {
    window.print = vi.fn();
    render(<HeaderHealthReport selectedBarangay="All Barangays" setSelectedBarangay={vi.fn()} />);
    
    const printButton = screen.getByRole("button", { name: "Print Report" });
    fireEvent.click(printButton);
    
    expect(window.print).toHaveBeenCalled();
  });

  it("should run the function when we select a different barangay choice", () => {
    const changeFunction = vi.fn();
    render(<HeaderHealthReport selectedBarangay="All Barangays" setSelectedBarangay={changeFunction} />);
    
    const dropdown = screen.getByDisplayValue("All Barangays");
    fireEvent.change(dropdown, { target: { value: "Brgy. Lanatan" } });
    
    expect(changeFunction).toHaveBeenCalledWith("Brgy. Lanatan");
  });
});