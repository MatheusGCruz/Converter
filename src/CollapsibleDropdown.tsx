import React, { useState, useRef, useEffect } from 'react';
import './CollapsibleDropdown.css';

export interface UnitGroup {
  label: string;
  units: { value: string; label: string }[];
}

interface CollapsibleDropdownProps {
  groups: UnitGroup[];
  selectedGroup: string;
  selectedUnit: string;
  expandedGroup: string;
  onGroupSelect: (groupLabel: string) => void;
  onUnitSelect: (groupLabel: string, unitValue: string) => void;
  onToggleGroup: (groupLabel: string) => void;
}

const CollapsibleDropdown: React.FC<CollapsibleDropdownProps> = ({
  groups,
  selectedGroup,
  selectedUnit,
  expandedGroup,
  onGroupSelect,
  onUnitSelect,
  onToggleGroup,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedGroupData = groups.find((g) => g.label === selectedGroup);
  const selectedUnitLabel = selectedGroupData?.units.find(
    (u) => u.value === selectedUnit
  )?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGroupClick = (groupLabel: string) => {
    onToggleGroup(groupLabel);
  };

  const handleUnitClick = (groupLabel: string, unitValue: string) => {
    onGroupSelect(groupLabel);
    onUnitSelect(groupLabel, unitValue);
    setIsOpen(false);
  };

  return (
    <div className="collapsible-dropdown" ref={dropdownRef}>
      <button
        className="collapsible-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="trigger-text">
          {selectedUnitLabel || 'Select...'}
        </span>
        <span className={`trigger-arrow ${isOpen ? 'open' : ''}`}>&#9662;</span>
      </button>

      {isOpen && (
        <div className="collapsible-dropdown-menu">
          {groups.map((group) => (
            <div key={group.label} className="dropdown-group">
              <button
                className={`group-header ${expandedGroup === group.label ? 'expanded' : ''}`}
                onClick={() => handleGroupClick(group.label)}
              >
                <span className={`group-arrow ${expandedGroup === group.label ? 'rotated' : ''}`}>
                  &#9656;
                </span>
                {group.label}
              </button>

              {expandedGroup === group.label && (
                <div className="group-items">
                  {group.units.map((unit) => (
                    <button
                      key={unit.value}
                      className={`group-item ${selectedUnit === unit.value && selectedGroup === group.label ? 'selected' : ''}`}
                      onClick={() => handleUnitClick(group.label, unit.value)}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleDropdown;
