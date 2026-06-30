import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeaderMasterlist from "../components/W2D1/HeaderMasterlist";

describe("HeaderMasterlist State Controller Tests", () => {
  it("displays titles, dynamic registered counts, and interactive filter inputs", () => {
    const setBrgy = vi.fn();
    const setAge = vi.fn();
    const setStatus = vi.fn();

    render(
      <HeaderMasterlist
        selectedBarangay="All"
        setSelectedBarangay={setBrgy}
        selectedAgeGroup="All"
        setSelectedAgeGroup={setAge}
        selectedStatus="All"
        setSelectedStatus={setStatus}
        totalCount={600}
      />
    );

    expect(screen.getByText("Barangay Masterlist")).toBeInTheDocument();
    expect(screen.getByText("600")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Barangay"), { target: { value: "Brgy. Lanatan" } });
    expect(setBrgy).toHaveBeenCalledWith("Brgy. Lanatan");

    fireEvent.change(screen.getByLabelText("Age Group"), { target: { value: "12-23 Months" } });
    expect(setAge).toHaveBeenCalledWith("12-23 Months");

    fireEvent.change(screen.getByLabelText("Overall Status"), { target: { value: "Obese" } });
    expect(setStatus).toHaveBeenCalledWith("Obese");
  });
});