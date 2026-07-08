import React from 'react';

export const MonthlyReportTable = () => {
  const mockReportData = [
    {
      id: 1,
      caregiver: "ANGELIQUE",
      childName: "GOMEZ, JAMES ANDREI",
      ipGroup: "NO",
      sex: "M",
      dob: "Jan-07-2026",
      dateMeasured: "Jul-15-2026",
      weight: "4.7",
      height: "57.0",
      age: 6,
      wfa: "N",
      hfa: "N",
      wflh: "N"
    },
    {
      id: 2,
      caregiver: "RICHARD",
      childName: "CASTROMERO, RAYVIN",
      ipGroup: "NO",
      sex: "M",
      dob: "Jul-07-2025",
      dateMeasured: "Jul-15-2026",
      weight: "5.9",
      height: "66.0",
      age: 12,
      wfa: "N",
      hfa: "N",
      wflh: "N"
    },
    {
      id: 3,
      caregiver: "LEAHROSE",
      childName: "MACALALAD, DYLAN CHARLES",
      ipGroup: "NO",
      sex: "M",
      dob: "Jan-07-2025",
      dateMeasured: "Jul-15-2026",
      weight: "10.6",
      height: "75.0",
      age: 18,
      wfa: "OW",
      hfa: "N",
      wflh: "OB"
    },
    {
      id: 4,
      caregiver: "JENNELYN",
      childName: "PEREZ, ETHAN JAKE",
      ipGroup: "NO",
      sex: "M",
      dob: "Jul-07-2024",
      dateMeasured: "Jul-15-2026",
      weight: "8.3",
      height: "84.0",
      age: 24,
      wfa: "N",
      hfa: "N",
      wflh: "SW"
    }
  ];

  return (
    <div className="report-table-container">
      <h3>Masterlist Report Data</h3>
      <div className="table-scroll-wrapper">
        <table className="monthly-report-grid-table">
          <thead>
            <tr>
              <th>Caregiver</th>
              <th>Name of Child</th>
              <th>IP Group</th>
              <th>Sex</th>
              <th>Date of Birth</th>
              <th>Date Measured</th>
              <th>Weight (kg)</th>
              <th>Height (cm)</th>
              <th>Age (mos)</th>
              <th>Weight for Age (WFA)</th>
              <th>Height for Age (HFA)</th>
              <th>Weight for Lt/Ht (WFL/H)</th>
            </tr>
          </thead>
          <tbody>
            {mockReportData.map((row) => (
              <tr key={row.id}>
                <td>{row.caregiver}</td>
                <td className="child-name-bold">{row.childName}</td>
                <td>{row.ipGroup}</td>
                <td>{row.sex}</td>
                <td>{row.dob}</td>
                <td>{row.dateMeasured}</td>
                <td className="metric-numeric-bold">{row.weight}</td>
                <td className="metric-numeric-bold">{row.height}</td>
                <td>{row.age}</td>
                <td>
                  <span className={`badge badge-${row.wfa.toLowerCase()}`}>
                    {row.wfa}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${row.hfa.toLowerCase()}`}>
                    {row.hfa}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${row.wflh.toLowerCase()}`}>
                    {row.wflh}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};