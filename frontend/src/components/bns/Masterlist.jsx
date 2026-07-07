import React, { useState } from 'react';
import { MasterlistHeader } from './MasterlistHeader';
import { RegisterChildModal } from './RegisterChildModal';
import { MasterlistTable } from './MasterlistTable';       
import { ManageProfileModal } from './ManageProfileModal'; 

const MOCK_CHILDREN = [
  { id: 1, name: 'GOMEZ, JAMES ANDREI', parent: 'BAUTISTA, ANGELIQUE', gender: 'Male', age: 6, purok: 'PUROK 1', status: 'Checked', birthdate: '2026-01-01' },
  { id: 2, name: 'CASTROMERO, RAYVIN', parent: 'CASTROMERO, RICHARD', gender: 'Male', age: 12, purok: 'PUROK 1', status: 'Checked', birthdate: '2025-07-01' },
];

export const Masterlist = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  const handleSearch = (name) => console.log("Searching for:", name);
  const handlePurokChange = (purok) => console.log("Selected Purok:", purok);
  const handleStatusChange = (status) => console.log("Selected Status:", status);
  const handleSaveNewChild = (childData) => console.log("Saving new child:", childData);

  const handleOpenManage = (child) => {
    setSelectedChild(child);
    setIsManageOpen(true);
  };

  return (
    <div className="masterlist-container">
      <MasterlistHeader 
        onSearch={handleSearch}
        onPurokChange={handlePurokChange}
        onStatusChange={handleStatusChange}
        onAddNewChild={() => setIsRegisterOpen(true)} 
      />

      <main style={{ padding: '20px' }}>
        <MasterlistTable 
          records={MOCK_CHILDREN} 
          onManageChild={handleOpenManage} 
        />
      </main>

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
};