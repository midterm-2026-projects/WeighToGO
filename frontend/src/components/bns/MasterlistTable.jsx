import React from 'react';

export const MasterlistTable = ({ records, onManageChild }) => {
  return (
    <div className="masterlist-table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name of Child</th>
            <th>Parent / Guardian</th>
            <th>Gender</th>
            <th>Age (mos)</th>
            <th>Purok / Sitio</th>
            <th>Checkup Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((child) => (
            <tr key={child.id}>
              <td>{child.name}</td>
              <td>{child.parent}</td>
              <td>{child.gender}</td>
              <td>{child.age}</td>
              <td>{child.purok}</td>
              <td>{child.status}</td>
              <td>
                <button type="button" onClick={() => onManageChild(child)}>
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};