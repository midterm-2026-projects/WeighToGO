import { useState, useEffect } from 'react';
import { api } from '../../services/api';

function StatusBadge({ status }) {
  const styles = {
    Normal: "bg-green-100 text-green-700 border-green-200",
    Underweight: "bg-amber-100 text-amber-700 border-amber-200",
    Overweight: "bg-amber-100 text-amber-700 border-amber-200",
    Obese: "bg-amber-100 text-amber-700 border-amber-200",
    Stunted: "bg-red-100 text-red-700 border-red-200",
    Wasted: "bg-red-100 text-red-700 border-red-200",
    'Severe Underweight': "bg-red-100 text-red-700 border-red-200",
    'Severe Stunted': "bg-red-100 text-red-700 border-red-200",
    'Severely Wasted': "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-bold border rounded-full ${styles[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {status}
    </span>
  );
}

const WHO_MEDIAN_WEIGHT_BOYS = {
  0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5, 6: 7.9, 7: 8.3, 8: 8.6, 9: 9.0,
  10: 9.2, 11: 9.4, 12: 9.6, 14: 10.1, 16: 10.5, 18: 10.9, 20: 11.5, 22: 12.0, 24: 12.2,
  30: 13.3, 36: 14.3, 42: 15.3, 48: 16.3, 54: 17.3, 60: 18.3
};

const WHO_MEDIAN_WEIGHT_GIRLS = {
  0: 3.2, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3, 7: 7.6, 8: 8.0, 9: 8.2,
  10: 8.5, 11: 8.7, 12: 8.9, 14: 9.4, 16: 9.8, 18: 10.2, 20: 10.8, 22: 11.3, 24: 11.5,
  30: 12.5, 36: 13.4, 42: 14.2, 48: 15.0, 54: 15.8, 60: 16.8
};

const WHO_MEDIAN_HEIGHT_BOYS = {
  0: 49.9, 1: 53.8, 2: 57.6, 3: 61.4, 4: 63.9, 5: 65.9, 6: 67.6, 7: 69.2, 8: 70.6, 9: 72.0,
  10: 73.3, 11: 74.5, 12: 75.7, 14: 78.0, 16: 80.2, 18: 82.3, 20: 84.3, 22: 86.1, 24: 87.8,
  30: 92.5, 36: 96.1, 42: 99.8, 48: 103.3, 54: 106.6, 60: 110.0
};

const WHO_MEDIAN_HEIGHT_GIRLS = {
  0: 49.1, 1: 52.7, 2: 56.3, 3: 59.5, 4: 61.8, 5: 63.8, 6: 65.7, 7: 67.3, 8: 68.7, 9: 70.1,
  10: 71.5, 11: 72.8, 12: 74.0, 14: 76.4, 16: 78.7, 18: 80.9, 20: 83.0, 22: 85.0, 24: 86.8,
  30: 91.2, 36: 95.1, 42: 98.7, 48: 102.2, 54: 105.4, 60: 108.7
};

function getMedian(array, ageMonths) {
  const keys = Object.keys(array).map(Number).sort((a, b) => a - b);
  if (ageMonths <= keys[0]) return array[keys[0]];
  if (ageMonths >= keys[keys.length - 1]) return array[keys[keys.length - 1]];
  for (let i = 0; i < keys.length - 1; i++) {
    if (ageMonths >= keys[i] && ageMonths <= keys[i + 1]) {
      const ratio = (ageMonths - keys[i]) / (keys[i + 1] - keys[i]);
      return array[keys[i]] + ratio * (array[keys[i + 1]] - array[keys[i]]);
    }
  }
  return array[keys[keys.length - 1]];
}

function computeWFA(ageMonths, weight, gender) {
  const medianTable = gender === 'Female' ? WHO_MEDIAN_WEIGHT_GIRLS : WHO_MEDIAN_WEIGHT_BOYS;
  const median = getMedian(medianTable, ageMonths);
  const pct = (weight / median) * 100;
  if (pct < 60) return 'Severe Underweight';
  if (pct < 80) return 'Underweight';
  if (pct <= 120) return 'Normal';
  if (pct <= 140) return 'Overweight';
  return 'Obese';
}

function computeHFA(ageMonths, height, gender) {
  const medianTable = gender === 'Female' ? WHO_MEDIAN_HEIGHT_GIRLS : WHO_MEDIAN_HEIGHT_BOYS;
  const median = getMedian(medianTable, ageMonths);
  const pct = (height / median) * 100;
  if (pct < 85) return 'Severe Stunted';
  if (pct < 90) return 'Stunted';
  return 'Normal';
}

function computeWFHL(height, weight, gender) {
  const heightCm = Math.round(height);
  const medianTable = gender === 'Female' ? WHO_MEDIAN_WEIGHT_GIRLS : WHO_MEDIAN_WEIGHT_BOYS;
  const heightKey = Object.keys(medianTable).map(Number).reduce((prev, curr) =>
    Math.abs(curr - heightCm) < Math.abs(prev - heightCm) ? curr : prev
  );
  const median = medianTable[heightKey];
  const pct = (weight / median) * 100;
  if (pct < 70) return 'Severely Wasted';
  if (pct < 80) return 'Wasted';
  if (pct <= 120) return 'Normal';
  if (pct <= 140) return 'Overweight';
  return 'Obese';
}

function computeClassification(wfa, hfa, wfhl) {
  if (wfa === 'Obese' || wfhl === 'Obese') return 'obese';
  if (hfa === 'Stunted' || hfa === 'Severe Stunted' || wfa === 'Severe Underweight' || wfhl === 'Severely Wasted' || wfhl === 'Wasted' || wfa === 'Underweight') return 'stunted';
  return 'normal';
}

function formatBirthdate(date) {
  if (!date) return '';
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

export function ManageProfileModal({ isOpen, onClose, childRecord, onAssessmentSubmit }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [computed, setComputed] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [alreadyAssessed, setAlreadyAssessed] = useState(false);

  useEffect(() => {
    if (isOpen && childRecord) {
      setActiveTab('personal');
      setWeight('');
      setHeight('');
      setComputed(null);
      setHistory([]);
      setAlreadyAssessed(childRecord.checkup_status === 'Checked Up');
    }
  }, [isOpen, childRecord]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.children.history(childRecord.id);
      setHistory(res.data || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history' && childRecord) {
      fetchHistory();
    }
  }, [activeTab, childRecord]);

  const handleCompute = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || !childRecord) return;

    const wfa = computeWFA(childRecord.age_months, w, childRecord.gender);
    const hfa = computeHFA(childRecord.age_months, h, childRecord.gender);
    const wfhl = computeWFHL(h, w, childRecord.gender);
    const classification = computeClassification(wfa, hfa, wfhl);

    setComputed({ wfa, hfa, wfhl, classification, weight: w, height: h });
  };

  const handleSubmitAssessment = async () => {
    if (!computed || !childRecord) return;
    setSubmitting(true);
    const now = new Date();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    await onAssessmentSubmit(childRecord.id, {
      weight: computed.weight,
      height: computed.height,
      wfa_status: computed.wfa,
      hfa_status: computed.hfa,
      wfhl_status: computed.wfhl,
      classification: computed.classification,
      month: monthNames[now.getMonth()],
      year: now.getFullYear()
    });
    setSubmitting(false);
  };

  if (!isOpen || !childRecord) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start gap-4 shrink-0">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-emerald-900 uppercase truncate">{childRecord.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{childRecord.purok} | Age: {childRecord.age_months} mos | {childRecord.gender}</p>
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

        <div className="flex border-b border-gray-200 shrink-0">
          {[
            { key: 'personal', label: 'Personal Info' },
            { key: 'assessment', label: 'Monthly Assessment' },
            { key: 'history', label: 'Checkup History' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab.key
                  ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {activeTab === 'personal' && (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Parent / Caregiver</span>
                <span className="text-sm font-semibold text-gray-700 uppercase">{childRecord.parent_name}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500">Gender</span>
                  <p className="font-medium text-gray-800">{childRecord.gender}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Age</span>
                  <p className="font-medium text-gray-800">{childRecord.age_months} months</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Birthdate</span>
                  <p className="font-medium text-gray-800">{formatBirthdate(childRecord.birthdate)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Purok</span>
                  <p className="font-medium text-gray-800">{childRecord.purok}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Weight</span>
                  <p className="font-medium text-gray-800">{childRecord.weight ? `${childRecord.weight} kg` : '—'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Height</span>
                  <p className="font-medium text-gray-800">{childRecord.height ? `${childRecord.height} cm` : '—'}</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-2.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-100 pb-1.5">
                  Current Nutritional Status
                </span>
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>WFA:</strong> {childRecord.wfa_status}</span>
                  <StatusBadge status={childRecord.wfa_status} />
                </div>
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>HFA:</strong> {childRecord.hfa_status}</span>
                  <StatusBadge status={childRecord.hfa_status} />
                </div>
                <div className="text-sm text-gray-700 flex items-center justify-between">
                  <span><strong>WFH/L:</strong> {childRecord.wfhl_status}</span>
                  <StatusBadge status={childRecord.wfhl_status} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'assessment' && (
            <>
              {alreadyAssessed ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs text-center space-y-3">
                  <div className="p-3 bg-green-50 text-green-600 rounded-full inline-block">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">Already Assessed This Month</h3>
                  <p className="text-xs text-gray-500">
                    This child has already been assessed for the current month. A child can only be assessed once per month.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">New Monthly Assessment</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={weight}
                          onChange={(e) => { setWeight(e.target.value); setComputed(null); }}
                          placeholder="e.g. 8.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={height}
                          onChange={(e) => { setHeight(e.target.value); setComputed(null); }}
                          placeholder="e.g. 72.0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCompute}
                      disabled={!weight || !height}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Compute Nutritional Status
                    </button>
                  </div>

                  {computed && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-100 pb-1.5">
                        Computed Results
                      </span>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                        <strong>Weight:</strong> {computed.weight} kg | <strong>Height:</strong> {computed.height} cm
                      </div>
                      <div className="text-sm text-gray-700 flex items-center justify-between">
                        <span><strong>WFA:</strong> {computed.wfa}</span>
                        <StatusBadge status={computed.wfa} />
                      </div>
                      <div className="text-sm text-gray-700 flex items-center justify-between">
                        <span><strong>HFA:</strong> {computed.hfa}</span>
                        <StatusBadge status={computed.hfa} />
                      </div>
                      <div className="text-sm text-gray-700 flex items-center justify-between">
                        <span><strong>WFH/L:</strong> {computed.wfhl}</span>
                        <StatusBadge status={computed.wfhl} />
                      </div>
                      <button
                        onClick={handleSubmitAssessment}
                        disabled={submitting}
                        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40"
                      >
                        {submitting ? 'Submitting...' : 'Submit Assessment'}
                      </button>
                    </div>
                  )}

                  {!computed && (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Enter weight and height above, then click Compute to see nutritional status.
                    </p>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
              {historyLoading ? (
                <p className="text-center text-gray-500 py-8">Loading history...</p>
              ) : history.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                  <table className="w-full text-xs divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Month</th>
                        <th className="px-3 py-2.5 text-center font-semibold text-gray-600">Wt</th>
                        <th className="px-3 py-2.5 text-center font-semibold text-gray-600">Ht</th>
                        <th className="px-3 py-2.5 text-center font-semibold text-gray-600">WFA</th>
                        <th className="px-3 py-2.5 text-center font-semibold text-gray-600">HFA</th>
                        <th className="px-3 py-2.5 text-center font-semibold text-gray-600">WFH/L</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {history.slice(0, 5).map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{record.month} {record.year}</td>
                          <td className="px-3 py-2 text-center">{record.weight}</td>
                          <td className="px-3 py-2 text-center">{record.height}</td>
                          <td className="px-3 py-2 text-center"><StatusBadge status={record.wfa_status} /></td>
                          <td className="px-3 py-2 text-center"><StatusBadge status={record.hfa_status} /></td>
                          <td className="px-3 py-2 text-center"><StatusBadge status={record.wfhl_status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No assessment history yet. Complete a monthly assessment to see records here.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
