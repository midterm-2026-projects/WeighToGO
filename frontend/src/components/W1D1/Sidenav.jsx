import { useState } from 'react';

export function Sidenav() { return null; }
Sidenav.handleSidenavNavigation = function(targetTab) {
  const permittedTabs = ["Masterlist", "Health Reports"];
  if (!targetTab) throw new Error("Navigation Error: No menu target specified");
  if (!permittedTabs.includes(targetTab)) throw new Error(`Access Denied: ${targetTab} is not a valid route`);
  return { status: "Navigation Approved", destination: targetTab, ariaCurrent: "page" };
};

Sidenav.handleSidenavLogout = function(isConfirmed) {
  return isConfirmed ? "User Logged Out Successfully" : "Logout Canceled";
};

export default function SidenavTestDashboard() {
  const [navMessage, setNavMessage] = useState('');
  const [isNavSuccess, setIsNavSuccess] = useState(false);

  const [logoutMessage, setLogoutMessage] = useState('');

  const triggerNavigation = (tabValue) => {
    try {
      const result = Sidenav.handleSidenavNavigation(tabValue);
      setNavMessage(`Success: ${result.status} to ${result.destination}`);
      setIsNavSuccess(true);
    } catch (error) {
      setNavMessage(error.message);
      setIsNavSuccess(false);
    }
  };

  const triggerLogout = (confirmed) => {
    const result = Sidenav.handleSidenavLogout(confirmed);
    setLogoutMessage(result);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Sidenav Interaction Module</h2>
      <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h3>Navigation Menu Options</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => triggerNavigation("Masterlist")} style={{ padding: '8px 12px', cursor: 'pointer' }}>
            Go to Masterlist
          </button>
          <button onClick={() => triggerNavigation("Health Reports")} style={{ padding: '8px 12px', cursor: 'pointer' }}>
            Go to Health Reports
          </button>
          <button onClick={() => triggerNavigation("Invalid Route")} style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
            Trigger Invalid Route
          </button>
        </div>
        {navMessage && (
          <div style={{ 
            padding: '10px', 
            borderRadius: '4px',
            background: isNavSuccess ? '#d4edda' : '#f8d7da', 
            color: isNavSuccess ? '#155724' : '#721c24' 
          }}>
            {navMessage}
          </div>
        )}
      </div>
      <div>
        <h3>Logout Action</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => triggerLogout(true)} style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            Confirm Logout
          </button>
          <button onClick={() => triggerLogout(false)} style={{ padding: '8px 12px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
            Cancel Logout
          </button>
        </div>
        {logoutMessage && (
          <div style={{ padding: '10px', background: '#e2e3e5', color: '#383d41', borderRadius: '4px' }}>
            {logoutMessage}
          </div>
        )}
      </div>
    </div>
  );
}