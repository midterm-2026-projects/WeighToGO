export default function TableHealthReport() {
  const rows = [
    { name: "Brgy. Caloocan", total: 40, n_wfa: 31, uw: 3, suw: 0, ow: 6, n_hfa: 37, st: 3, sst: 0, t: 0, n_wfl: 32, mw: 2, sw: 0, ow_wfl: 0, ob: 6 },
    { name: "Brgy. Lanatan", total: 40, n_wfa: 34, uw: 2, suw: 0, ow: 4, n_hfa: 38, st: 2, sst: 0, t: 0, n_wfl: 34, mw: 2, sw: 0, ow_wfl: 0, ob: 4 }
  ];

  return (
    <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
      <thead>
        <tr>
          <th rowSpan="2">Location / Area</th>
          <th rowSpan="2">Total Weighed</th>
          <th colSpan="4" style={{ background: "orange" }}>Weight for Age (WFA)</th>
          <th colSpan="4" style={{ background: "green", color: "white" }}>Height for Age (HFA)</th>
          <th colSpan="5" style={{ background: "purple", color: "white" }}>Weight for L/H (WFL/H)</th>
        </tr>
        <tr>
          <th>N</th><th>UW</th><th>SUW</th><th>OW</th>
          <th>N</th><th>ST</th><th>SST</th><th>T</th>
          <th>N</th><th>MW</th><th>SW</th><th>OW</th><th>OB</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td>{row.name}</td>
            <td><strong>{row.total}</strong></td>
            <td>{row.n_wfa}</td><td>{row.uw}</td><td>{row.suw}</td><td>{row.ow}</td>
            <td>{row.n_hfa}</td><td>{row.st}</td><td>{row.sst}</td><td>{row.t}</td>
            <td>{row.n_wfl}</td><td>{row.mw}</td><td>{row.sw}</td><td>{row.ow_wfl}</td><td>{row.ob}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}