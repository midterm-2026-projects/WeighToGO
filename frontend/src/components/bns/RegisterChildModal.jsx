import { useState } from 'react';

export function RegisterChildModal({ isOpen, onClose, onSave, barangayName }) {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthdate: '',
    parent_name: '',
    purok: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const computeAgeMonths = (birthdate) => {
    if (!birthdate) return 0;
    const birth = new Date(birthdate);
    const now = new Date();
    let months = (now.getFullYear() - birth.getFullYear()) * 12;
    months += now.getMonth() - birth.getMonth();
    if (now.getDate() < birth.getDate()) months--;
    return Math.max(0, months);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const age_months = computeAgeMonths(formData.birthdate);
    try {
      await onSave({
        name: formData.name,
        barangay: barangayName || '',
        purok: formData.purok,
        parent_name: formData.parent_name,
        age_months,
        gender: formData.gender,
        birthdate: formData.birthdate,
      });
      setFormData({ name: '', gender: '', birthdate: '', parent_name: '', purok: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register child');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Register New Child</h2>
            <p className="text-xs text-gray-500 mt-0.5">{barangayName || 'Your barangay'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-gray-50/50">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-100">{error}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Child's full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Birthdate</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Parent / Guardian</label>
            <input
              type="text"
              name="parent_name"
              value={formData.parent_name}
              onChange={handleChange}
              required
              placeholder="Parent or guardian name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Purok</label>
            <select
              name="purok"
              value={formData.purok}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="">Select Purok</option>
              <option value="Purok 1">Purok 1</option>
              <option value="Purok 2">Purok 2</option>
              <option value="Purok 3">Purok 3</option>
              <option value="Purok 4">Purok 4</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
