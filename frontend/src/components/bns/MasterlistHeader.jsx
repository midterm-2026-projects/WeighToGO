import React from 'react';

export const MasterlistHeader = ({ onSearch, onPurokChange, onStatusChange, onAddNewChild }) => {
  const handleSearchSubmit = (e) => e.preventDefault();

  return (
    <header>
      <div>
        <form role="search" onSubmit={handleSearchSubmit}>
          <label htmlFor="search-child">Search Child</label>
          <input 
            id="search-child"
            type="search" 
            placeholder="Search child name..." 
            onChange={(e) => onSearch(e.target.value)}
          />
        </form>
        
        <div>
          <label htmlFor="purok-filter">Purok</label>
          <select id="purok-filter" onChange={(e) => onPurokChange(e.target.value)}>
            <option value="">All Purok</option>
            <option value="purok1">Purok 1</option>
            <option value="purok2">Purok 2</option>
            <option value="purok3">Purok 3</option>
          </select>
        </div>

        <div>
          <label htmlFor="status-filter">Checkup Status</label>
          <select id="status-filter" onChange={(e) => onStatusChange(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>
      <button type="button" onClick={onAddNewChild}>+ Add New Child</button>
    </header>
  );
};