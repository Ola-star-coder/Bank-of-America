import { createContext, useContext, useState } from 'react';
import TransferSheet from '../components/Sheets/TransferSheet'; // Import your sheet

const TransferModalContext = createContext();

export const useTransferModal = () => useContext(TransferModalContext);

export const TransferModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openTransfer = () => setIsOpen(true);
  const closeTransfer = () => setIsOpen(false);

  return (
    <TransferModalContext.Provider value={{ openTransfer, closeTransfer }}>
      {children}
      
      {/* The Sheet lives here permanently, waiting to be opened */}
      <TransferSheet isOpen={isOpen} onClose={closeTransfer} />
      
    </TransferModalContext.Provider>
  );
};