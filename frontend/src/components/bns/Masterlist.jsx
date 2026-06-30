import React, { useState } from 'react';
import { MasterlistHeader } from './MasterlistHeader';
import { RegisterChildModal } from './RegisterChildModal';

export const Masterlist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (name) => {
    console.log("Searching for:", name);
  };

  const handlePurokChange = (purok) => {
    console.log("Selected Purok:", purok);
  };

  const handleStatusChange = (status) => {
    console.log("Selected Status:", status);
  };

  const handleSaveNewChild = (childData) => {
    console.log("Saving new child frontend data:", childData);
  };

  return (
    <div className="masterlist-container">
      <MasterlistHeader 
        onSearch={handleSearch}
        onPurokChange={handlePurokChange}
        onStatusChange={handleStatusChange}
        onAddNewChild={() => setIsModalOpen(true)} 
      />

      <main style={{ padding: '20px' }}>
        <p>The main table displaying the children's masterlist will render here.</p>
      </main>

      <RegisterChildModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewChild}
      />
    </div>
  );
};