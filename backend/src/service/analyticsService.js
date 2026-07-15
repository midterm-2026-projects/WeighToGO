import childModel from "../models/child.model.js";

async function getReports() {
  const children = await childModel.getAllChildrenRecords();

  const reportMatrix = {};

  children.forEach((child) => {
    const brgy = child.barangay;
    if (!brgy) return; 

    if (!reportMatrix[brgy]) {
      reportMatrix[brgy] = {
        barangay: brgy,
        totalRegistered: 0,
        normal: 0,
        underweight: 0,
        stunted: 0,
        wasted: 0,
        obese: 0,
      };
    }

    reportMatrix[brgy].totalRegistered += 1;

    if (child.wfaStatus === "Normal") {
      reportMatrix[brgy].normal += 1;
    } else if (child.wfaStatus === "Underweight" || child.wfaStatus === "Severe Underweight") {
      reportMatrix[brgy].underweight += 1;
    } else if (child.wfaStatus === "Overweight") {
      reportMatrix[brgy].obese += 1;
    }

    if (child.hfaStatus === "Stunted" || child.hfaStatus === "Severe Stunted") {
      reportMatrix[brgy].stunted += 1;
    }

    if (child.wfhlStatus === "Wasted") {
      reportMatrix[brgy].wasted += 1;
    } else if (child.wfhlStatus === "Overweight" && child.wfaStatus !== "Overweight") {
      reportMatrix[brgy].obese += 1;
    }
  });

  return Object.values(reportMatrix);
}
export default getReports;