import React, { useState } from 'react';
import './TruncatedText.css';

/**
 * TruncatedText Component
 * Handles long text fields by showing preview with "View more" option
 * 
 * @param {string} text - Full text content
 * @param {number} maxChars - Maximum characters to show (default: 80)
 * @param {string} as - HTML element type: 'span' | 'div' (default: 'span')
 * @param {function} onViewMore - Optional callback when "View more" is clicked
 */
const TruncatedText = ({ 
  text, 
  maxChars = 80, 
  as = 'span',
  onViewMore = null 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return <span className="truncated-text-empty">—</span>;
  }

  const textStr = String(text);
  const needsTruncation = textStr.length > maxChars;
  
  if (!needsTruncation) {
    return as === 'div' ? (
      <div className="truncated-text-full">{textStr}</div>
    ) : (
      <span className="truncated-text-full">{textStr}</span>
    );
  }

  // If expanded in inline mode, show full text
  if (isExpanded && !onViewMore) {
    const Component = as;
    return (
      <Component className="truncated-text-expanded">
        {textStr}
        {' '}
        <button
          className="truncated-text-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
        >
          Show less
        </button>
      </Component>
    );
  }

  // Truncated view
  const truncatedText = textStr.slice(0, maxChars).trim() + '...';
  const Component = as;

  const handleViewMore = (e) => {
    e.stopPropagation();
    if (onViewMore) {
      onViewMore(); // Open drawer or modal
    } else {
      setIsExpanded(true); // Inline expansion
    }
  };

  return (
    <Component 
      className="truncated-text-container"
      title={textStr} // Full text on hover
    >
      <span className="truncated-text-preview">{truncatedText}</span>
      {' '}
      <button
        className="truncated-text-toggle"
        onClick={handleViewMore}
      >
        View more
      </button>
    </Component>
  );
};

export default TruncatedText;
