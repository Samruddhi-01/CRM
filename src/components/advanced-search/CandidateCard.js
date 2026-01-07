import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Clock, 
  Building,
  Phone,
  Mail,
  Download,
  Eye,
  CheckCircle
} from 'lucide-react';

const CandidateCard = ({ candidate, onViewProfile, onDownloadResume }) => {
  const {
    id,
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    profile = '',
    company = '',
    experience = 0,
    experienceLevel = '',
    currentPackage = 0,
    expectedCTC = 0,
    location = '',
    noticePeriod = '',
    primarySkills = '',
    secondarySkills = '',
    skills = '',
    education = '',
    degree = '',
    specialization = '',
    passingYear = null,
    educationGap = '',
    status = '',
    isVerified = false,
    updatedAt = null,
    resumeUrl = ''
  } = candidate;

  const fullName = `${firstName} ${lastName}`.trim();
  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Parse skills from multiple possible fields
  const allSkills = [];
  
  if (primarySkills) {
    allSkills.push(...primarySkills.split(',').map(s => s.trim()).filter(Boolean));
  } else if (skills) {
    allSkills.push(...skills.split(',').map(s => s.trim()).filter(Boolean));
  }
  
  // Parse secondary skills if available
  const secondarySkillsList = secondarySkills 
    ? secondarySkills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const displaySkills = allSkills.slice(0, 5);
  const remainingSkills = allSkills.length - displaySkills.length;

  const getNoticePeriodClass = () => {
    if (noticePeriod === 'Immediate' || noticePeriod === '0-15 Days') return 'notice-period-badge';
    if (noticePeriod === '15-30 Days' || noticePeriod === '30-60 Days') return 'notice-period-badge medium';
    return 'notice-period-badge long';
  };

  const getStatusClass = () => {
    const statusMap = {
      'New': 'new',
      'Screening': 'screening',
      'Shortlisted': 'shortlisted',
      'Rejected': 'rejected',
      'Offered': 'offered'
    };
    return statusMap[status] || 'new';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // Reset time to start of day for accurate day calculation
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const diffTime = nowOnly - dateOnly;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? '1 month ago' : `${months} months ago`;
      }
      const years = Math.floor(diffDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div className="candidate-card">
      {/* Header Section */}
      <div className="candidate-card-header">
        <div className="candidate-avatar">
          <div className="candidate-avatar-placeholder">
            {initials || '??'}
          </div>
        </div>

        <div className="candidate-main-info">
          <div className="candidate-name-row">
            <h3 className="candidate-name">{fullName || 'Unknown'}</h3>
            {isVerified && (
              <div className="verified-badge" title="Verified Profile">
                <CheckCircle size={12} />
              </div>
            )}
          </div>

          {profile && (
            <div className="candidate-title">{profile}</div>
          )}

          <div className="candidate-skills">
            {displaySkills.map((skill, index) => (
              <span key={index} className={`skill-chip ${index < 3 ? 'primary' : ''}`}>
                {skill}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="skill-chip skill-chip-more">
                +{remainingSkills} more
              </span>
            )}
          </div>
        </div>

        {status && (
          <div className={`status-badge ${getStatusClass()}`}>
            {status}
          </div>
        )}
      </div>

      {/* Body Section */}
      <div className="candidate-card-body">
        <div className="candidate-info-item">
          <div className="candidate-info-label">Experience</div>
          <div className="candidate-info-value">
            <Briefcase className="candidate-info-icon" />
            {experience} {experience === 1 ? 'Year' : 'Years'}
            {experienceLevel && (
              <span className="experience-level-badge" title={experienceLevel}>
                {experienceLevel.includes('Fresher') ? '🌱' : 
                 experienceLevel.includes('Entry') ? '📝' :
                 experienceLevel.includes('Junior') ? '🎯' :
                 experienceLevel.includes('Mid') ? '💼' :
                 experienceLevel.includes('Senior') ? '🏆' :
                 experienceLevel.includes('Lead') ? '⭐' :
                 experienceLevel.includes('Expert') ? '👑' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="candidate-info-item">
          <div className="candidate-info-label">Location</div>
          <div className="candidate-info-value">
            <MapPin className="candidate-info-icon" />
            {location || 'Not specified'}
          </div>
        </div>

        <div className="candidate-info-item">
          <div className="candidate-info-label">Current CTC</div>
          <div className="candidate-info-value">
            <IndianRupee className="candidate-info-icon" />
            {currentPackage ? `₹${currentPackage} LPA` : 'Not disclosed'}
          </div>
        </div>

        <div className="candidate-info-item">
          <div className="candidate-info-label">Expected CTC</div>
          <div className="candidate-info-value info-highlight">
            <IndianRupee className="candidate-info-icon" />
            {expectedCTC ? `₹${expectedCTC} LPA` : 'Not disclosed'}
          </div>
        </div>

        {noticePeriod && (
          <div className="candidate-info-item">
            <div className="candidate-info-label">Notice Period</div>
            <div className="candidate-info-value">
              <Clock className="candidate-info-icon" />
              {noticePeriod}
            </div>
          </div>
        )}

        {company && (
          <div className="candidate-info-item">
            <div className="candidate-info-label">Current Company</div>
            <div className="candidate-info-value">
              <Building className="candidate-info-icon" />
              {company}
            </div>
          </div>
        )}

        {(degree || specialization) && (
          <div className="candidate-info-item">
            <div className="candidate-info-label">Education</div>
            <div className="candidate-info-value">
              {degree && <span className="education-badge">{degree}</span>}
              {specialization && <span className="specialization-text">{specialization}</span>}
              {passingYear && <span className="passing-year-text">'{String(passingYear).slice(-2)}</span>}
            </div>
          </div>
        )}

        {secondarySkillsList.length > 0 && (
          <div className="candidate-info-item">
            <div className="candidate-info-label">Secondary Skills</div>
            <div className="candidate-info-value">
              <div className="secondary-skills-list">
                {secondarySkillsList.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="secondary-skill-chip">{skill}</span>
                ))}
                {secondarySkillsList.length > 3 && (
                  <span className="skill-chip-more">+{secondarySkillsList.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="candidate-card-footer">
        <div className="candidate-meta">
          {updatedAt && (
            <div className="candidate-meta-item">
              Updated {formatDate(updatedAt)}
            </div>
          )}
          {email && (
            <div className="candidate-meta-item">
              <Mail size={12} />
              {email}
            </div>
          )}
          {phone && (
            <div className="candidate-meta-item">
              <Phone size={12} />
              {phone}
            </div>
          )}
        </div>

        <div className="candidate-actions">
          <button
            className="card-action-btn primary"
            onClick={() => onViewProfile(candidate)}
          >
            <Eye className="card-action-icon" />
            View Profile
          </button>
          <button
            className="card-action-btn"
            onClick={() => onDownloadResume(candidate)}
          >
            <Download className="card-action-icon" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
