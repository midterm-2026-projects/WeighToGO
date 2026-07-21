import childModel from "../models/child.model.js";
import { getSession } from "./authService.js";

export default async function getReports(token) {
  const session = getSession(token);
  if (!session) throw new Error("Unauthorized: Invalid or missing session token");

  const { role, assignedBarangay } = session;
  const children = await childModel.getAllChildrenRecords();
  const reportMatrix = {};

  children.forEach(child => {
    const brgy = child.barangay;
    if (!brgy) return;

    if (role === "Barangay Nutrition Scholar" && brgy !== assignedBarangay) return;

    if (!reportMatrix[brgy]) {
      reportMatrix[brgy] = {
        barangay: brgy,
        totalRegistered: 0,
        normal: 0,
        underweight: 0,
        stunted: 0,
        wasted: 0,
        obese: 0
      };
    }

    reportMatrix[brgy].totalRegistered += 1;

    if (child.wfa_status === "Normal") reportMatrix[brgy].normal += 1;
    else if (child.wfa_status === "Underweight" || child.wfa_status === "Severe Underweight") reportMatrix[brgy].underweight += 1;
    else if (child.wfa_status === "Overweight") reportMatrix[brgy].obese += 1;

    if (child.hfa_status === "Stunted" || child.hfa_status === "Severe Stunted") reportMatrix[brgy].stunted += 1;

    if (child.wfhl_status === "Wasted") reportMatrix[brgy].wasted += 1;
    else if (child.wfhl_status === "Overweight" && child.wfa_status !== "Overweight") reportMatrix[brgy].obese += 1;
  });

  return Object.values(reportMatrix);
}
