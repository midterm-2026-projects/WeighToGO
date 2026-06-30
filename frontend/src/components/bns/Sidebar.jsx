import React from 'react';

export const Sidebar = ({ activePath, onNavigate, onLogout }) => {
  return (
    <nav aria-label="Main Navigation">
      <h2>BNS Portal</h2>
      <ul>
        <li>
          <button 
            type="button"
            onClick={() => onNavigate('/kids-masterlist')}
            aria-current={activePath === '/kids-masterlist' ? 'page' : undefined}
          >
            Kids Masterlist
          </button>
        </li>
        <li>
          <button 
            type="button"
            onClick={() => onNavigate('/monthly-report')}
            aria-current={activePath === '/monthly-report' ? 'page' : undefined}
          >
            Monthly Report
          </button>
        </li>
      </ul>
      <div>
        <button type="button" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};