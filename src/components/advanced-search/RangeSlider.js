import React, { useState, useEffect } from 'react';

const RangeSlider = ({
  min = 0,
  max = 100,
  value = [0, 100],
  onChange,
  label = '',
  unit = '',
  step = 1
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), localValue[1]);
    const newValue = [newMin, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), localValue[0]);
    const newValue = [localValue[0], newMax];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="range-slider-group">
      {label && <div className="filter-label">{label}</div>}
      
      <div className="range-slider-inputs">
        <input
          type="number"
          className="input text-center"
          value={localValue[0]}
          onChange={handleMinChange}
          min={min}
          max={max}
          step={step}
        />
        <span className="range-slider-separator">to</span>
        <input
          type="number"
          className="input text-center"
          value={localValue[1]}
          onChange={handleMaxChange}
          min={min}
          max={max}
          step={step}
        />
      </div>

      <div className="range-slider">
        <div
          className="range-slider-track"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`
          }}
        />
        <input
          type="range"
          className="absolute w-full opacity-0 cursor-pointer"
          value={localValue[0]}
          onChange={handleMinChange}
          min={min}
          max={max}
          step={step}
          style={{ pointerEvents: 'all' }}
        />
        <input
          type="range"
          className="absolute w-full opacity-0 cursor-pointer"
          value={localValue[1]}
          onChange={handleMaxChange}
          min={min}
          max={max}
          step={step}
          style={{ pointerEvents: 'all' }}
        />
        <div
          className="range-slider-thumb"
          style={{ left: `${minPercent}%` }}
        />
        <div
          className="range-slider-thumb"
          style={{ left: `${maxPercent}%` }}
        />
      </div>

      {unit && (
        <div className="text-xs text-secondary text-center mt-2">
          {unit === 'LPA' ? `₹${localValue[0]} - ₹${localValue[1]} Lakhs` : `${localValue[0]} - ${localValue[1]} ${unit}`}
        </div>
      )}
    </div>
  );
};

export default RangeSlider;
