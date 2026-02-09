import { useState } from 'react';
import { MagnifyingGlass, CaretRight, GlobeHemisphereWest } from 'phosphor-react';
import { globalBanks } from '../../../../Data/GlobalBanks';
import '../Transfer.css'; 

const BankSelectionStep = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Filter Logic that preserves Headers only if they have children
  const filteredList = globalBanks.filter(item => {
      // Always keep headers during initial pass
      if (item.isHeader) return true; 
      // Filter banks by name OR region
      const match = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    item.region.toLowerCase().includes(searchTerm.toLowerCase());
      return match;
  }).filter((item, index, array) => {
      // Cleanup Phase: Remove headers that have no banks below them
      if (item.isHeader) {
          const nextItem = array[index + 1];
          // If next item doesn't exist OR is also a header, remove this header
          return nextItem && !nextItem.isHeader;
      }
      return true;
  });

  return (
    <div className="step-content animate-slide-up">
      
      {/* Search Bar */}
      <div className="bank-search-bar">
         <MagnifyingGlass size={20} color="#6B7280"/>
         <input 
            type="text" 
            placeholder="Search bank, country or currency" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
         />
      </div>

      {/* Popular / Quick Select (Only show if not searching) */}
      {!searchTerm && (
        <div style={{marginBottom:'20px'}}>
            <span className="section-label-tiny">POPULAR</span>
            <div className="popular-banks-row">
                <div className="pop-bank" onClick={() => onSelect(globalBanks.find(b => b.id === 'chase_us'))}>
                    <div className="pop-logo" style={{background:'#117ACA'}}>C</div>
                    <span>Chase</span>
                </div>
                <div className="pop-bank" onClick={() => onSelect(globalBanks.find(b => b.id === 'revolut_eu'))}>
                    <div className="pop-logo" style={{background:'#000'}}>R</div>
                    <span>Revolut</span>
                </div>
                <div className="pop-bank" onClick={() => onSelect(globalBanks.find(b => b.id === 'hsbc_uk'))}>
                    <div className="pop-logo" style={{background:'#DB0011'}}>H</div>
                    <span>HSBC</span>
                </div>
                 <div className="pop-bank" onClick={() => onSelect(globalBanks.find(b => b.id === 'wise_eu'))}>
                    <div className="pop-logo" style={{background:'#9FE870'}}>W</div>
                    <span>Wise</span>
                </div>
            </div>
        </div>
      )}

      {/* Main Bank List */}
      <div className="bank-list-wrapper">
          {filteredList.map((item, index) => (
              item.isHeader ? (
                  <div key={`head-${index}`} className="bank-list-header">
                      {item.title}
                  </div>
              ) : (
                  <button 
                    key={item.id} 
                    className="bank-list-item" 
                    onClick={() => onSelect(item)}
                  >
                      {/* Logo Circle */}
                      <div className="bank-logo" style={{ backgroundColor: item.logoColor }}>
                          {item.logoInitial}
                      </div>
                      
                      {/* Text Details */}
                      <div className="bank-info-col">
                          <span className="bank-name">{item.name}</span>
                          <span className="bank-meta">{item.currency} • {item.region}</span>
                      </div>

                      {/* Country Flag */}
                      <span className="bank-flag">{item.flag}</span>

                      <CaretRight size={16} color="#D1D5DB" />
                  </button>
              )
          ))}

          {filteredList.length === 0 && (
              <div className="empty-state">
                  <GlobeHemisphereWest size={32} color="#D1D5DB" weight="duotone"/>
                  <p>No banks found matching "{searchTerm}"</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default BankSelectionStep;