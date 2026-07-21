import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MasterlistHeader } from '../components/bns/MasterlistHeader';
import { MasterlistTable } from '../components/bns/MasterlistTable';
import { RegisterChildModal } from '../components/bns/RegisterChildModal';
import { ManageProfileModal } from '../components/bns/ManageProfileModal';

export default function MasterlistPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

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

  useEffect(() => { fetchChildren(); }, []);

  const handleSearch = (name) => {
    if (name) fetchChildren({ name });
    else fetchChildren();
  };

  const handleSaveNewChild = async (childData) => {
    try {
      await api.children.create(childData);
      setIsRegisterOpen(false);
      fetchChildren();
    } catch (err) {
      console.error('Failed to register child:', err);
    }
  };

  const handleOpenManage = (child) => {
    setSelectedChild(child);
    setIsManageOpen(true);
  };

  return (
    <div className="p-6">
      <MasterlistHeader
        onSearch={handleSearch}
        onPurokChange={(p) => fetchChildren(p ? { purok: p } : {})}
        onStatusChange={(s) => fetchChildren(s ? { status: s } : {})}
        onAddNewChild={() => setIsRegisterOpen(true)}
      />
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <MasterlistTable records={children} onManageChild={handleOpenManage} />
      )}
      <RegisterChildModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSave={handleSaveNewChild}
      />
      <ManageProfileModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        childRecord={selectedChild}
      />
    </div>
  );
}
