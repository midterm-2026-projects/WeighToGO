import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MasterlistHeader } from '../components/bns/MasterlistHeader';
import { MasterlistTable } from '../components/bns/MasterlistTable';
import { RegisterChildModal } from '../components/bns/RegisterChildModal';
import { ManageProfileModal } from '../components/bns/ManageProfileModal';

const ROWS_PER_PAGE = 10;

export default function MasterlistPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [filterPurok, setFilterPurok] = useState('');
  const [filterCheckupStatus, setFilterCheckupStatus] = useState('all');
  const [totalCount, setTotalCount] = useState(0);

  const fetchChildren = async (params) => {
    setLoading(true);
    try {
      const res = await api.children.list(params);
      setChildren(res.data || []);
    } catch (err) {
      console.error('Failed to fetch children:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalCount = async () => {
    try {
      const res = await api.children.list();
      setTotalCount((res.data || []).length);
    } catch (err) {
      console.error('Failed to fetch total count:', err);
    }
  };

  useEffect(() => { fetchTotalCount(); }, []);

  useEffect(() => {
    setPage(0);
    const params = {};
    if (searchName) params.name = searchName;
    if (filterPurok) params.purok = filterPurok;
    if (filterCheckupStatus !== 'all') params.checkupStatus = filterCheckupStatus;
    fetchChildren(Object.keys(params).length > 0 ? params : undefined);
  }, [searchName, filterPurok, filterCheckupStatus]);

  const handleSearch = (name) => {
    setSearchName(name);
  };

  const handlePurokChange = (purok) => {
    setFilterPurok(purok);
  };

  const handleCheckupStatusChange = (status) => {
    setFilterCheckupStatus(status);
  };

  const handleSaveNewChild = async (childData) => {
    await api.children.create(childData);
    fetchChildren();
    fetchTotalCount();
  };

  const handleOpenManage = (child) => {
    setSelectedChild(child);
    setIsManageOpen(true);
  };

  const handleAssessmentSubmit = async (childId, assessmentData) => {
    try {
      console.log('DEBUG: MasterlistPage submitting assessment for', childId, assessmentData);
      const res = await api.children.assess(childId, assessmentData);
      console.log('DEBUG: MasterlistPage assess response', res);
      setIsManageOpen(false);
      setSelectedChild(null);
      fetchChildren();
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      alert(err.message || 'Failed to submit assessment. The child may have already been assessed this month.');
    }
  };

  const totalPages = Math.ceil(children.length / ROWS_PER_PAGE);
  const paged = children.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <MasterlistHeader
        onSearch={handleSearch}
        onPurokChange={handlePurokChange}
        onCheckupStatusChange={handleCheckupStatusChange}
        onAddNewChild={() => setIsRegisterOpen(true)}
        barangayName={user?.assignedBarangay}
      />

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500 mb-4 shrink-0">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Total Registered</span>
          <div className="text-3xl font-extrabold text-emerald-600">{totalCount}</div>
          <span className="text-xs text-gray-500 block">{user?.assignedBarangay || 'Your barangay'}</span>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <>
          <div className="flex-1 min-h-0 flex flex-col">
            <MasterlistTable records={paged} onManageChild={handleOpenManage} />
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl shrink-0 mt-2">
              <span className="text-xs text-gray-500">
                Showing {page * ROWS_PER_PAGE + 1}–{Math.min((page + 1) * ROWS_PER_PAGE, children.length)} of {children.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <RegisterChildModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSave={handleSaveNewChild}
        barangayName={user?.assignedBarangay}
      />
      <ManageProfileModal
        isOpen={isManageOpen}
        onClose={() => { setIsManageOpen(false); setSelectedChild(null); }}
        childRecord={selectedChild}
        onAssessmentSubmit={handleAssessmentSubmit}
      />
    </div>
  );
}
