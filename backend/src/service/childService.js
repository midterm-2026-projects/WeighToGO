import { getFilteredChildren } from "../models/childModel.js";

const BARANGAY_OPTIONS = [
  "Brgy. Caloocan", "Brgy. Lanatan", "Brgy. Uno", "Brgy. Ermita", 
  "Brgy. Gumamela", "Brgy. Navotas", "Brgy. Palikpikan", "Brgy. Sampaga", 
  "Brgy. Santol", "Brgy. Dilao", "Brgy. Dalig", "Brgy. Langgangan", 
  "Brgy. Canda", "Brgy. Pooc", "Brgy. Tanggoy"
];
const AGE_OPTIONS = ["0-11 Months", "12-23 Months", "24-59 Months"];
const STATUS_OPTIONS = ["Normal", "Malnourished", "Obese"];

export async function filterChildMasterlist(barangay, ageGroup, status) {
  
  if (barangay && barangay !== "All" && !BARANGAY_OPTIONS.includes(barangay)) {
    throw new Error("Invalid Barangay selection");
  }

  if (ageGroup && ageGroup !== "All" && !AGE_OPTIONS.includes(ageGroup)) {
    throw new Error("Invalid Nutritional Age Group selection");
  }

  if (status && status !== "All" && !STATUS_OPTIONS.includes(status)) {
    throw new Error("Invalid Nutritional Status selection");
  }

  return await getFilteredChildren({ barangay, ageGroup, status });
}