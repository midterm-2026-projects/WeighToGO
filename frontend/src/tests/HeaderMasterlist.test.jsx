import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeaderMasterlist from "../components/W2D1/HeaderMasterlist";

describe("HeaderMasterlist State Controller Tests", () => {
  
  it("should show the page titles, the count of children, and run functions when filters change", () => {
    const setBrgy = vi.fn();
    const setAge = vi.fn();
    const setStatus = vi.fn();

    render(
      <HeaderMasterlist
        selectedBarangay="All Barangays"
        setSelectedBarangay={setBrgy}
        selectedAgeGroup="All Ages"
        setSelectedAgeGroup={setAge}
        selectedStatus="Overall Status"
        setSelectedStatus={setStatus}
        totalCount={600}
      />
    );

    fireEvent.change(screen.getByLabelText("Barangay"), { target: { value: "Brgy. Lanatan" } });
    fireEvent.change(screen.getByLabelText("Age Group"), { target: { value: "12-23 Months" } });
    fireEvent.change(screen.getByLabelText("Overall Status"), { target: { value: "Obese" } });

    expect(screen.getByText("Barangay Masterlist")).toBeInTheDocument();
    expect(screen.getByText("Detailed list of children, dimensions, and statuses.")).toBeInTheDocument();
    expect(screen.getByText("600")).toBeInTheDocument();
    expect(screen.getByText("Filtered child masterlist view")).toBeInTheDocument();
    expect(setBrgy).toHaveBeenCalledWith("Brgy. Lanatan");
    expect(setAge).toHaveBeenCalledWith("12-23 Months");
    expect(setStatus).toHaveBeenCalledWith("Obese");
  });

  it("should show the number 0 correctly when the selected barangay has no children", () => {
    const noRecordsCount = 0;
    render(
      <HeaderMasterlist
        selectedBarangay="Brgy. Lanatan"
        setSelectedBarangay={vi.fn()}
        selectedAgeGroup="All Ages"
        setSelectedAgeGroup={vi.fn()}
        selectedStatus="Overall Status"
        setSelectedStatus={vi.fn()}
        totalCount={noRecordsCount}
      />
    );

    const countElement = screen.getByText("0");

    expect(countElement).toBeInTheDocument();
    expect(countElement.className).toContain("text-blue-600");
  });

  it("should select the correct dropdown items when we pass chosen values into the component", () => {
    render(
      <HeaderMasterlist
        selectedBarangay="Brgy. Caloocan"
        setSelectedBarangay={vi.fn()}
        selectedAgeGroup="24-59 Months"
        setSelectedAgeGroup={vi.fn()}
        selectedStatus="Malnourished"
        setSelectedStatus={vi.fn()}
        totalCount={15}
      />
    );

    expect(screen.getByLabelText("Barangay").value).toBe("Brgy. Caloocan");
    expect(screen.getByLabelText("Age Group").value).toBe("24-59 Months");
    expect(screen.getByLabelText("Overall Status").value).toBe("Malnourished");
  });

  it("should have the exact number of list choices inside every dropdown box", () => {
    render(
      <HeaderMasterlist
        selectedBarangay="All Barangays"
        setSelectedBarangay={vi.fn()}
        selectedAgeGroup="All Ages"
        setSelectedAgeGroup={vi.fn()}
        selectedStatus="Overall Status"
        setSelectedStatus={vi.fn()}
        totalCount={600}
      />
    );

    const barangayOptions = screen.getByLabelText("Barangay").querySelectorAll("option");
    const ageOptions = screen.getByLabelText("Age Group").querySelectorAll("option");
    const statusOptions = screen.getByLabelText("Overall Status").querySelectorAll("option");

    expect(barangayOptions.length).toBe(16);
    expect(ageOptions.length).toBe(4);
    expect(statusOptions.length).toBe(4);
  });

  it("should work fine when the filters are empty", () => {
    render(
      <HeaderMasterlist
        selectedBarangay=""
        setSelectedBarangay={vi.fn()}
        selectedAgeGroup=""
        setSelectedAgeGroup={vi.fn()}
        selectedStatus=""
        setSelectedStatus={vi.fn()}
        totalCount={100}
      />
    );

    const mainHeader = screen.getByRole("heading", { level: 1 });

    expect(mainHeader).toHaveTextContent("Barangay Masterlist");
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should change the total count number to match the children in the picked barangay", () => {
    render(
      <HeaderMasterlist
        selectedBarangay="Brgy. Caloocan"
        setSelectedBarangay={vi.fn()}
        selectedAgeGroup="All Ages"
        setSelectedAgeGroup={vi.fn()}
        selectedStatus="Overall Status"
        setSelectedStatus={vi.fn()}
        totalCount={45}
      />
    );

    const totalCounter = screen.getByText("45");
    
    expect(totalCounter).toBeInTheDocument();
  });
});