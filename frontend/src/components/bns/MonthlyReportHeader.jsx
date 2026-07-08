import React, { useState } from 'react';

export const MonthlyReportHeader = ({ 
  onMonthChange, 
  onPrint, 
  onSubmit,
  summaryData = { totalRegistered: 15, normal: 2, malnourished: 8, obese: 2 } 
}) => {
  const [currentMonth, setCurrentMonth] = useState('2026-07');

  const handleMonthChange = (e) => {
    const val = e.target.value;
    setCurrentMonth(val);
    if (onMonthChange) onMonthChange(val);
  };

  return (
    <div>
      <div>
        <div>
          <h2>Monthly Barangay Report</h2>
          <p>Summary of nutritional cases for the selected month.</p>
        </div>

        <div>
          <label htmlFor="month-picker">Select Month</label>
          <input 
            id="month-picker"
            type="month" 
            value={currentMonth} 
            onChange={handleMonthChange} 
          />
          
          <button type="button" onClick={onPrint}>
            Print Report
          </button>
          
          <button type="button" onClick={onSubmit}>
            Submit to Admin
          </button>
        </div>
      </div>

      <div>
        <div>
          <div>
            <span>Total Registered</span>
            <span>{summaryData.totalRegistered}</span>
          </div>
        </div>

        <div>
          <div>
            <span>Normal (All Metrics)</span>
            <span>{summaryData.normal}</span>
          </div>
        </div>

        <div>
          <div>
            <span>Malnourished / Stunted</span>
            <span>{summaryData.malnourished}</span>
          </div>
        </div>

        <div>
          <div>
            <span>Obese</span>
            <span>{summaryData.obese}</span>
          </div>
        </div>
      </div>
    </div>
  );
};