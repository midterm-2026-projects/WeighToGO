import React, { useState } from 'react';

export const ManageProfileModal = ({ isOpen, onClose, childRecord }) => {
  const [activeTab, setActiveTab] = useState('personal');

  if (!isOpen || !childRecord) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <button type="button" aria-label="Close" className="close-x-btn" onClick={onClose}>&times;</button>
          <h1>{childRecord.name}</h1>
          <p>{childRecord.purok} | Age: {childRecord.age} mos | {childRecord.gender}</p>
        </div>
        
        <nav className="modal-tabs">
          <button type="button" onClick={() => setActiveTab('personal')}>Personal Info</button>
          <button type="button" onClick={() => setActiveTab('assessment')}>Monthly Assessment</button>
          <button type="button" onClick={() => setActiveTab('history')}>Checkup History</button>
        </nav>

        <div className="modal-body">
          {activeTab === 'personal' && (
            <div className="tab-personal-info">
              <div>
                <p><strong>Child's Name</strong></p>
                <p>{childRecord.name}</p>
              </div>
              <div>
                <p><strong>Gender</strong></p>
                <p>{childRecord.gender}</p>
              </div>
              <div>
                <p><strong>Birthdate</strong></p>
                <p>{childRecord.birthdate || '2026-01-01'}</p>
              </div>
              <div>
                <p><strong>Parents</strong></p>
                <p>{childRecord.parent}</p>
              </div>
              <div>
                <p><strong>Purok</strong></p>
                <p>{childRecord.purok}</p>
              </div>
              <button type="button">Edit Profile</button>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="tab-monthly-assessment">
              <p><strong>Assessment Completed!</strong></p>
              <div>
                <p><strong>Weight:</strong> 4.7 kg | <strong>Height:</strong> 57.0 cm</p>
                <hr />
                <p><strong>WFA:</strong> N</p>
                <p><strong>HFA:</strong> N</p>
                <p><strong>WFL/H:</strong> N</p>
              </div>
              <p><small>Next checkup is available next month.</small></p>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-checkup-history">
              <h3>Past Monthly Reports</h3>
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Weight/Height</th>
                    <th>WFA</th>
                    <th>HFA</th>
                    <th>WFL/H</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2026-07</td>
                    <td>4.7kg / 57.0cm</td>
                    <td>N</td>
                    <td>N</td>
                    <td>N</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};