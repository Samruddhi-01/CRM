import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const MultiSelect = ({ 
  options = [], 
  value = [], 
  onChange, 
  placeholder = 'Select...',
  searchable = true,
  maxDisplay = 2
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // If less than 300px space below and more space above, open upward
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  const getDropdownStyle = () => {
    if (!isOpen || !triggerRef.current) return {};
    
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = Math.max(rect.width, 250);
    
    // Ensure dropdown doesn't go off-screen horizontally
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 20) {
      left = window.innerWidth - dropdownWidth - 20;
    }
    if (left < 20) {
      left = 20;
    }
    
    if (dropdownPosition === 'top') {
      return {
        left: `${left}px`,
        bottom: `${window.innerHeight - rect.top + 4}px`,
        width: `${dropdownWidth}px`,
      };
    }
    
    return {
      left: `${left}px`,
      top: `${rect.bottom + 4}px`,
      width: `${dropdownWidth}px`,
    };
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length <= maxDisplay) {
      return value
        .map(v => options.find(o => o.value === v)?.label)
        .filter(Boolean)
        .join(', ');
    }
    return `${value.length} selected`;
  };

  return (
    <div className={`multi-select ${isOpen ? 'open' : ''} ${dropdownPosition === 'top' ? 'dropdown-top' : ''}`} ref={dropdownRef}>
      <button
        type="button"
        className="multi-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
      >
        <span className={`multi-select-value ${value.length === 0 ? 'placeholder' : ''}`}>
          {getDisplayText()}
        </span>
        <ChevronDown className="multi-select-arrow" />
      </button>

      {isOpen && (
        <div 
          className={`multi-select-dropdown ${dropdownPosition === 'top' ? 'dropdown-top' : 'dropdown-bottom'}`}
          style={getDropdownStyle()}
        >
          {searchable && (
            <div className="multi-select-search">
              <div className="flex items-center gap-2 input p-2">
                <Search size={16} className="text-secondary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none border-0 p-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-secondary hover:text-primary"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="multi-select-options">
            {filteredOptions.length === 0 ? (
              <div className="text-center text-secondary py-4 text-sm">
                No options found
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`multi-select-option ${value.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => handleToggle(option.value)}
                >
                  <div className="multi-select-checkbox" />
                  <span>{option.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
