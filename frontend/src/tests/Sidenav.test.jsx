import { expect, it, describe } from "vitest";
import { Sidenav } from "../components/W1D1/Sidenav.jsx";

describe("Weigh To Go Portal - Sidenav Navigation Logic Validation", () => {

  it("should navigate successfully when the Masterlist menu option is clicked", () => {
    const clickedMenu = "Masterlist";

    const result = Sidenav.handleSidenavNavigation(clickedMenu);

    expect(result.status).toEqual("Navigation Approved");
    expect(result.destination).toEqual("Masterlist");
    expect(result.ariaCurrent).toEqual("page");
  });

  it("should navigate successfully when the Health Reports menu option is clicked", () => {
    const clickedMenu = "Health Reports";

    const result = Sidenav.handleSidenavNavigation(clickedMenu);

    expect(result.status).toEqual("Navigation Approved");
    expect(result.destination).toEqual("Health Reports");
    expect(result.ariaCurrent).toEqual("page");
  });

  it("should throw an error and block paths not allowed by instructor criteria", () => {
    const illegalMenu = "Health Trends";
    let capturedError;

    try {
      Sidenav.handleSidenavNavigation(illegalMenu);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Access Denied: Health Trends is not a valid route");
  });

  it("should throw an error if an empty navigation action is dispatched", () => {
    const blankMenu = "";
    let capturedError;

    try {
      Sidenav.handleSidenavNavigation(blankMenu);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError.message).toBe("Navigation Error: No menu target specified");
  });

  it("should return success state when confirming the logout action", () => {
    const executionConfirmation = true;

    const result = Sidenav.handleSidenavLogout(executionConfirmation);

    expect(result).toEqual("User Logged Out Successfully");
  });
});