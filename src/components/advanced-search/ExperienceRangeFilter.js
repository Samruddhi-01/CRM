import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const ExperienceRangeFilter = ({ value, onChange }) => {
  // Default values if not provided
  const defaultMinExperience = { years: 0, months: 0 };
  
  const [minExp, setMinExp] = useState(value?.minExperience || defaultMinExperience);

  // Update state when props change
  useEffect(() => {
    if (value?.minExperience) {
      setMinExp(value.minExperience);
    }
  }, [value]);

  const handleMinYearsChange = (years) => {
    const newMinExp = { ...minExp, years: parseInt(years) || 0 };
    setMinExp(newMinExp);
    onChange({
      minExperience: newMinExp
    });
  };

  const handleMinMonthsChange = (months) => {
    const newMinExp = { ...minExp, months: parseInt(months) || 0 };
    setMinExp(newMinExp);
    onChange({
      minExperience: newMinExp
    });
  };

  const getDisplayText = (exp) => {
    if (exp.years === 0 && exp.months === 0) return '0 years';
    if (exp.years > 0 && exp.months === 0) return `${exp.years} year${exp.years !== 1 ? 's' : ''}`;
    if (exp.years === 0 && exp.months > 0) return `${exp.months} month${exp.months !== 1 ? 's' : ''}`;
    return `${exp.years} year${exp.years !== 1 ? 's' : ''} ${exp.months} month${exp.months !== 1 ? 's' : ''}`;
  };

  const yearsOptions = Array.from({ length: 31 }, (_, i) => i);
  const monthsOptions = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="experience-range-filter">
      <div className="experience-range-header">
        <div className="experience-range-title">
          <Calendar size={16} className="mr-2" />
          Minimum Experience
        </div>
        <div className="experience-range-subtitle">
          Specify minimum experience in years and months
        </div>
      </div>

      <div className="experience-range-inputs">
        {/* Minimum Experience Only */}
        <div className="experience-input-group">
          <label className="experience-input-label">
            <Clock size={14} className="mr-1" />
            Minimum Experience
          </label>
          <div className="experience-input-row">
            <div className="experience-input-wrapper">
              <select
                className="experience-select"
                value={minExp.years}
                onChange={(e) => handleMinYearsChange(e.target.value)}
              >
                {yearsOptions.map(year => (
                  <option key={year} value={year}>
                    {year} {year === 1 ? 'year' : 'years'}
                  </option>
                ))}
              </select>
            </div>
            <div className="experience-input-wrapper">
              <select
                className="experience-select"
                value={minExp.months}
                onChange={(e) => handleMinMonthsChange(e.target.value)}
              >
                {monthsOptions.map(month => (
                  <option key={month} value={month}>
                    {month} {month === 1 ? 'month' : 'months'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="experience-display">
            {getDisplayText(minExp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceRangeFilter;
