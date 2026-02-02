import { useEffect, useState, useRef } from 'react';
import './BottomSheet.css';

const BottomSheet = ({ isOpen, onClose, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [offsetY, setOffsetY] = useState(0); // How far we dragged down
  const [isDragging, setIsDragging] = useState(false);
  
  const startY = useRef(0); // Where the touch started

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setOffsetY(0);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // 1. TOUCH START: Record where we touched
  const handleTouchStart = (e) => {
    // Only allow drag if we're at the top of the content (to avoid conflicting with internal scroll)
    if (e.currentTarget.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  // 2. TOUCH MOVE: Follow the finger
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    // Only move if dragging DOWN (positive value)
    if (diff > 0) {
      e.preventDefault(); // Stop browser scrolling
      setOffsetY(diff);
    }
  };

  // 3. TOUCH END: Decide to Close or Snap Back
  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Threshold: If dragged down more than 100px, close it.
    if (offsetY > 100) {
      triggerClose();
    } else {
      // Otherwise, snap back to 0
      setOffsetY(0);
    }
  };

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // Tell parent to unmount
      setIsClosing(false);
      setOffsetY(0);
    }, 300); // Wait for animation
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`sheet-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={triggerClose}
    >
      <div 
        className={`sheet-content ${isClosing ? 'closing' : ''} ${!isDragging ? 'snapping' : ''}`}
        onClick={(e) => e.stopPropagation()}
        
        // --- DRAG EVENT LISTENERS ---
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        
        // --- DYNAMIC POSITION ---
        // If closing, ignore this style (CSS class takes over).
        // If dragging, follow the finger (offsetY).
        style={!isClosing ? { transform: `translateY(${offsetY}px)` } : {}}
      >
        <div className="sheet-handle-bar">
            <div className="sheet-handle"></div>
        </div>
        
        {children}
        
      </div>
    </div>
  );
};

export default BottomSheet;