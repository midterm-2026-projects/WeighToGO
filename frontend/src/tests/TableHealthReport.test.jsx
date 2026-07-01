import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TableHealthReport from "../components/W2D2/TableHealthReport";

describe("TableHealthReport Tests", () => {
  it("should display the group categories headers in the table", () => {
    render(<TableHealthReport />);
    
    expect(screen.getByText("Weight for Age (WFA)")).toBeInTheDocument();
    expect(screen.getByText("Height for Age (HFA)")).toBeInTheDocument();
    expect(screen.getByText("Weight for L/H (WFL/H)")).toBeInTheDocument();
  });

  it("should show short letters like SUW and OB in the column cells", () => {
    render(<TableHealthReport />);
    
    expect(screen.getByText("SUW")).toBeInTheDocument();
    expect(screen.getByText("SST")).toBeInTheDocument();
    expect(screen.getByText("OB")).toBeInTheDocument();
  });

  it("should list the rows for the barangays with their data values", () => {
    render(<TableHealthReport />);
    
    expect(screen.getByText("Brgy. Caloocan")).toBeInTheDocument();
    expect(screen.getByText("Brgy. Lanatan")).toBeInTheDocument();
    
    const totalCountCells = screen.getAllByText("40");
    expect(totalCountCells.length).toBeGreaterThan(0);
  });
});