import React from 'react';

export const Dropdown = ({ label, options, selectedValue, onChange }) => {
  return (
    <div className="flex items-center space-x-3">
      {label && <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">{label}</label>}
      <select
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className="block w-48 pl-3 pr-8 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm bg-white text-gray-700 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};