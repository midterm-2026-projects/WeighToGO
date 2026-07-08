const mockChildMasterlist = [
  {
    id: 1,
    address: "Purok 2, Brgy. Navotas",
    barangay: "Brgy. Navotas",
    caregiver: "Maria Cruz",
    name: "Juan Dela Cruz",
    ip: "No",
    sex: "M",
    dob: "2026-02-12",
    dateMeasured: "2026-07-01",
    weight: 9.5,
    height: 76.2,
    ageMos: 10,
    wfa: "N",
    hfa: "N",
    wflh: "N"
  },
  {
    id: 2,
    address: "Purok 4, Brgy. Lanatan",
    barangay: "Brgy. Lanatan",
    caregiver: "Ana Lanatan",
    name: "Baby Lanatan",
    ip: "Yes",
    sex: "F",
    dob: "2025-03-05",
    dateMeasured: "2026-07-02",
    weight: 8.1,
    height: 81.0,
    ageMos: 20, 
    wfa: "W", 
    hfa: "ST",
    wflh: "W"
  },
  {
    id: 3,
    address: "Purok 1, Brgy. Navotas",
    barangay: "Brgy. Navotas",
    caregiver: "Trishia Reyes",
    name: "Kyle Reyes",
    ip: "No",
    sex: "M",
    dob: "2024-05-20",
    dateMeasured: "2026-07-01",
    weight: 18.2,
    height: 98.5,
    ageMos: 37, 
    wfa: "OB", 
    hfa: "N",
    wflh: "OB"
  }
];

export async function getFilteredChildren({ barangay, ageGroup, status }) {
  let records = [...mockChildMasterlist];

  if (barangay && barangay !== "All") {
    records = records.filter(child => child.barangay === barangay);
  }

  if (ageGroup && ageGroup !== "All") {
    if (ageGroup === "0-11 Months") {
      records = records.filter(child => child.ageMos >= 0 && child.ageMos <= 11);
    } else if (ageGroup === "12-23 Months") {
      records = records.filter(child => child.ageMos >= 12 && child.ageMos <= 23);
    } else if (ageGroup === "24-59 Months") {
      records = records.filter(child => child.ageMos >= 24 && child.ageMos <= 59);
    }
  }

  if (status && status !== "All") {
    if (status === "Normal") {
      records = records.filter(child => child.wfa === "N" && child.wflh === "N");
    } else if (status === "Malnourished") {
      records = records.filter(child => ["W", "ST"].includes(child.wfa) || ["W", "ST"].includes(child.wflh));
    } else if (status === "Obese") {
      records = records.filter(child => child.wfa === "OB" || child.wflh === "OB");
    }
  }

  return records;
}