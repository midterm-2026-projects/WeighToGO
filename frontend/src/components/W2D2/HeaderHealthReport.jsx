export default function HeaderHealthReport({ selectedBarangay, setSelectedBarangay }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px", background: "#fff", marginBottom: "10px" }}>
      <h1>Consolidated Health Reports</h1>
      <p>Operation Timbang (OPT) Summary matrix. Filter by Barangay to view Purok breakdown.</p>
      
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <label htmlFor="barangay-select">Filter by:</label>
        <select 
          id="barangay-select"
          value={selectedBarangay} 
          onChange={(e) => setSelectedBarangay(e.target.value)}
        >
          <option value="All Barangays">All Barangays</option>
          <option value="Brgy. Caloocan">Brgy. Caloocan</option>
          <option value="Brgy. Lanatan">Brgy. Lanatan</option>
          <option value="Brgy. Dilao">Brgy. Dilao</option>
        </select>

        <button onClick={handlePrint} style={{ background: "#3b82f6", color: "white" }}>
          Print Report
        </button>
      </div>
    </div>
  );
}