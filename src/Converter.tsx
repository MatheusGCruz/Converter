import React, { useState } from 'react';
import CollapsibleDropdown, { UnitGroup } from './CollapsibleDropdown';
import Distance from './Distance';
import Temperature from './Temperature';
import Volume from './Volume';
import Area from './Area';
import './Converter.css';

const UNIT_GROUPS: UnitGroup[] = [
  {
    label: 'Distance',
    units: [
      { value: 'meters', label: 'Meters' },
      { value: 'kilometers', label: 'Kilometers' },
      { value: 'centimeters', label: 'Centimeters' },
      { value: 'inches', label: 'Inches' },
      { value: 'feet', label: 'Feet' },
      { value: 'miles', label: 'Miles' },
    ],
  },
  {
    label: 'Temperature',
    units: [
      { value: 'celsius', label: 'Celsius' },
      { value: 'fahrenheit', label: 'Fahrenheit' },
      { value: 'kelvin', label: 'Kelvin' },
      { value: 'rankine', label: 'Rankine' },
    ],
  },
  {
    label: 'Volume',
    units: [
      { value: 'liters', label: 'Liters' },
      { value: 'milliliters', label: 'Milliliters' },
      { value: 'cubic_meters', label: 'm³' },
      { value: 'cubic_centimeters', label: 'cm³' },
      { value: 'cubic_decimeters', label: 'dm³' },
      { value: 'gallons', label: 'Gallons' },
      { value: 'cups', label: 'Cups' },
      { value: 'fluid_ounces', label: 'Fluid Ounces' },
      { value: 'tablespoons', label: 'Tablespoons' },
      { value: 'teaspoons', label: 'Teaspoons' },
    ],
  },
  {
    label: 'Area',
    units: [
      { value: 'square_meters', label: 'm²' },
      { value: 'square_kilometers', label: 'km²' },
      { value: 'square_centimeters', label: 'cm²' },
      { value: 'square_feet', label: 'ft²' },
      { value: 'square_inches', label: 'in²' },
      { value: 'square_miles', label: 'mi²' },
      { value: 'hectares', label: 'Hectares' },
      { value: 'acres', label: 'Acres' },
    ],
  },
];

function convertLines(
  input: string,
  fromUnit: string,
  toUnit: string,
  group: string
): string {
  const lines = input.split('\n');
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed === '') return '';
      const num = parseFloat(trimmed);
      if (isNaN(num)) return trimmed;
      try {
        switch (group) {
          case 'Distance':
            return String(Distance.convert(num, fromUnit, toUnit));
          case 'Temperature':
            return String(Temperature.convert(num, fromUnit, toUnit));
          case 'Volume':
            return String(Volume.convert(num, fromUnit, toUnit));
          case 'Area':
            return String(Area.convert(num, fromUnit, toUnit));
          default:
            return trimmed;
        }
      } catch {
        return trimmed;
      }
    })
    .join('\n');
}

const Converter: React.FC = () => {
  const [leftGroup, setLeftGroup] = useState('Distance');
  const [leftUnit, setLeftUnit] = useState('meters');
  const [rightUnit, setRightUnit] = useState('kilometers');
  const [expandedGroup, setExpandedGroup] = useState('Distance');
  const [leftValue, setLeftValue] = useState('');
  const [rightValue, setRightValue] = useState('');

  const rightGroupData = UNIT_GROUPS.find((g) => g.label === leftGroup);
  const rightGroups = rightGroupData ? [rightGroupData] : [];

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
  };

  const handleLeftGroupSelect = (groupLabel: string) => {
    setLeftGroup(groupLabel);
    const group = UNIT_GROUPS.find((g) => g.label === groupLabel);
    if (group && group.units.length > 0) {
      setLeftUnit(group.units[0].value);
      setRightUnit(group.units.length > 1 ? group.units[1].value : group.units[0].value);
    }
  };

  const handleLeftUnitSelect = (groupLabel: string, unitValue: string) => {
    setLeftGroup(groupLabel);
    setLeftUnit(unitValue);
  };

  const handleRightUnitSelect = (_groupLabel: string, unitValue: string) => {
    setRightUnit(unitValue);
  };

  const handleToggleGroup = (groupLabel: string) => {
    setExpandedGroup(expandedGroup === groupLabel ? '' : groupLabel);
  };

  const handleConvertLeftToRight = () => {
    const result = convertLines(leftValue, leftUnit, rightUnit, leftGroup);
    setRightValue(result);
  };

  const handleConvertRightToLeft = () => {
    const result = convertLines(rightValue, rightUnit, leftUnit, leftGroup);
    setLeftValue(result);
  };

  return (
    <div className="converter-page" style={backgroundStyle}>
      <div className="converter-container">
        <div className="converter-column converter-column-left">
          <CollapsibleDropdown
            groups={UNIT_GROUPS}
            selectedGroup={leftGroup}
            selectedUnit={leftUnit}
            expandedGroup={expandedGroup}
            onGroupSelect={handleLeftGroupSelect}
            onUnitSelect={handleLeftUnitSelect}
            onToggleGroup={handleToggleGroup}
          />
          <textarea
            className="converter-textarea"
            value={leftValue}
            onChange={(e) => setLeftValue(e.target.value)}
            placeholder="Enter value..."
          />
          <div className="converter-options">
            <span className="options-label options-label-left">Options</span>
            <button
              className="arrow-button arrow-button-right"
              title="Send to right"
              onClick={handleConvertLeftToRight}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="converter-column converter-column-right">
          <CollapsibleDropdown
            groups={rightGroups}
            selectedGroup={leftGroup}
            selectedUnit={rightUnit}
            expandedGroup={expandedGroup}
            onGroupSelect={() => {}}
            onUnitSelect={handleRightUnitSelect}
            onToggleGroup={handleToggleGroup}
          />
          <textarea
            className="converter-textarea"
            value={rightValue}
            onChange={(e) => setRightValue(e.target.value)}
            placeholder="Enter value..."
          />
          <div className="converter-options">
            <button
              className="arrow-button arrow-button-left"
              title="Send to left"
              onClick={handleConvertRightToLeft}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="options-label options-label-right">Options</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
