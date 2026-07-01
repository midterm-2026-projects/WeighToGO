import React, { useState } from 'react';

export const RegisterChildModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    birthdate: '',
    parentGuardian: '',
    purok: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); 
    onClose();        
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register New Child</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="birthdate">Birthdate:</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="parentGuardian">Parents / Guardian:</label>
            <input
              type="text"
              id="parentGuardian"
              name="parentGuardian"
              value={formData.parentGuardian}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="modal-purok">Purok:</label>
            <select id="modal-purok" name="purok" value={formData.purok} onChange={handleChange} required>
              <option value="">Select Purok</option>
              <option value="Purok 1">Purok 1</option>
              <option value="Purok 2">Purok 2</option>
              <option value="Purok 3">Purok 3</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};