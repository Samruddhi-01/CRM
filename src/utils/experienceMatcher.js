/**
 * Experience Matching Utility
 * Provides intelligent experience filtering and similarity matching
 */

/**
 * Convert years and months to decimal years
 * @param {number} years - Number of years
 * @param {number} months - Number of months (0-11)
 * @returns {number} Decimal representation of experience
 */
export const yearsMonthsToDecimal = (years, months) => {
  return years + (months / 12);
};

/**
 * Convert decimal years to years and months object
 * @param {number} decimalYears - Decimal years
 * @returns {object} { years, months }
 */
export const decimalToYearsMonths = (decimalYears) => {
  const years = Math.floor(decimalYears);
  const months = Math.round((decimalYears - years) * 12);
  return { years, months: Math.min(months, 11) };
};

/**
 * Format experience for display
 * @param {number} years - Number of years
 * @param {number} months - Number of months
 * @returns {string} Formatted experience string
 */
export const formatExperience = (years, months) => {
  if (years === 0 && months === 0) return '0 years';
  if (years > 0 && months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  if (years === 0 && months > 0) return `${months} month${months !== 1 ? 's' : ''}`;
  return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
};

/**
 * Calculate experience similarity score between two candidates
 * @param {number} exp1 - First experience in decimal years
 * @param {number} exp2 - Second experience in decimal years
 * @returns {number} Similarity score (0-1, where 1 is exact match)
 */
export const calculateExperienceSimilarity = (exp1, exp2) => {
  const difference = Math.abs(exp1 - exp2);
  const maxExperience = Math.max(exp1, exp2, 1); // Avoid division by zero
  
  // Similarity decreases with difference, but never goes below 0
  const similarity = Math.max(0, 1 - (difference / maxExperience));
  
  // Apply weighting for more nuanced matching
  if (difference <= 0.5) {
    // Very close match (within 6 months)
    return similarity;
  } else if (difference <= 1) {
    // Close match (within 1 year)
    return similarity * 0.9;
  } else if (difference <= 2) {
    // Similar experience (within 2 years)
    return similarity * 0.7;
  } else if (difference <= 3) {
    // Somewhat similar (within 3 years)
    return similarity * 0.5;
  } else {
    // Not very similar
    return similarity * 0.3;
  }
};

/**
 * Get experience category based on years of experience
 * @param {number} experience - Experience in decimal years
 * @returns {string} Experience category
 */
export const getExperienceCategory = (experience) => {
  if (experience < 1) return 'Fresher';
  if (experience < 2) return 'Entry Level';
  if (experience < 4) return 'Junior';
  if (experience < 6) return 'Mid-Level';
  if (experience < 10) return 'Senior';
  if (experience < 15) return 'Lead';
  return 'Expert';
};

/**
 * Check if two experiences are in the same category
 * @param {number} exp1 - First experience in decimal years
 * @param {number} exp2 - Second experience in decimal years
 * @returns {boolean} True if same category
 */
export const isSameExperienceCategory = (exp1, exp2) => {
  return getExperienceCategory(exp1) === getExperienceCategory(exp2);
};

/**
 * Build experience search filters for backend API
 * @param {object} experienceRange - { minExperience: {years, months}, maxExperience: {years, months} }
 * @param {boolean} includeSimilar - Whether to include similar experience candidates
 * @returns {object} Filter object for API
 */
export const buildExperienceFilters = (experienceRange, includeSimilar = false) => {
  const minDecimal = yearsMonthsToDecimal(
    experienceRange.minExperience.years,
    experienceRange.minExperience.months
  );
  const maxDecimal = yearsMonthsToDecimal(
    experienceRange.maxExperience.years,
    experienceRange.maxExperience.months
  );

  const filters = {
    minExperience: minDecimal.toFixed(2),
    maxExperience: maxDecimal.toFixed(2)
  };

  if (includeSimilar) {
    // Expand range to include similar experiences
    const expandedMin = Math.max(0, minDecimal - 1); // Expand by 1 year below
    const expandedMax = maxDecimal + 2; // Expand by 2 years above
    
    filters.minExperienceExpanded = expandedMin.toFixed(2);
    filters.maxExperienceExpanded = expandedMax.toFixed(2);
    filters.includeSimilarExperience = true;
  }

  return filters;
};

/**
 * Parse experience filter from backend response
 * @param {object} filters - Backend filter object
 * @returns {object} Parsed experience range
 */
export const parseExperienceFilter = (filters) => {
  let minExp = 0;
  let maxExp = 30;

  if (filters.minExperience) {
    minExp = parseFloat(filters.minExperience) || 0;
  }
  if (filters.maxExperience) {
    maxExp = parseFloat(filters.maxExperience) || 30;
  }

  return {
    minExperience: decimalToYearsMonths(minExp),
    maxExperience: decimalToYearsMonths(maxExp)
  };
};

/**
 * Get experience range presets
 * @returns {array} Array of preset options
 */
export const getExperiencePresets = () => [
  {
    name: 'Fresher (0-1 yr)',
    min: { years: 0, months: 0 },
    max: { years: 1, months: 0 },
    category: 'Fresher'
  },
  {
    name: 'Entry Level (1-2 yrs)',
    min: { years: 1, months: 0 },
    max: { years: 2, months: 0 },
    category: 'Entry Level'
  },
  {
    name: 'Junior (2-4 yrs)',
    min: { years: 2, months: 0 },
    max: { years: 4, months: 0 },
    category: 'Junior'
  },
  {
    name: 'Mid-Level (4-6 yrs)',
    min: { years: 4, months: 0 },
    max: { years: 6, months: 0 },
    category: 'Mid-Level'
  },
  {
    name: 'Senior (6-10 yrs)',
    min: { years: 6, months: 0 },
    max: { years: 10, months: 0 },
    category: 'Senior'
  },
  {
    name: 'Lead (10+ yrs)',
    min: { years: 10, months: 0 },
    max: { years: 30, months: 0 },
    category: 'Lead'
  }
];

/**
 * Validate experience range
 * @param {object} minExp - Minimum experience {years, months}
 * @param {object} maxExp - Maximum experience {years, months}
 * @returns {boolean} True if valid range
 */
export const validateExperienceRange = (minExp, maxExp) => {
  const minDecimal = yearsMonthsToDecimal(minExp.years, minExp.months);
  const maxDecimal = yearsMonthsToDecimal(maxExp.years, maxExp.months);
  
  return minDecimal <= maxDecimal && minDecimal >= 0 && maxDecimal >= 0;
};
