// CandidateForm.js - Professional Form with Redux Integration

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/pages/candidate-form.css';
import { createCandidate, updateCandidate, fetchCandidateById, selectCurrentCandidate, selectCandidatesLoading, clearCurrentCandidate } from '../redux/slices/candidatesSlice';
import { CANDIDATE_STATUS } from '../utils/constants';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import apiService from '../services/api';

// Predefined degrees list for validation
const PREDEFINED_DEGREES = [
  'BCA', 'MCA', 'BE', 'BTech', 'MTech', 'BSc', 'MSc', 'Diploma', '12th', '10th'
];

// Helper function to check if degree is custom
const isCustomDegree = (degree) => {
  return degree && degree.trim() !== '' && !PREDEFINED_DEGREES.includes(degree);
};

const CandidateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const currentCandidate = useSelector(selectCurrentCandidate);
  const loading = useSelector(selectCandidatesLoading);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    company: '',
    profile: '',
    degree: '',
    passingYear: '',
    experience: '',
    experienceLevel: '',
    currentPackage: '',
    expectedCTC: '',
    gap: '',
    status: CANDIDATE_STATUS.PENDING,
    skills: '',
    notes: '',
    employmentHistory: '',
    education: '',
    noticePeriod: '',
  });
  
  const [isFresher, setIsFresher] = useState(false);
  const [hasEmploymentHistory, setHasEmploymentHistory] = useState(''); // 'yes' or 'no' for both fresher and experienced
  const [employmentEntries, setEmploymentEntries] = useState([{
    company: '',
    designation: '',
    startYear: '',
    endYear: '',
    duration: '',
    isCurrent: false
  }]);
  const [educationEntries, setEducationEntries] = useState([{
    degree: '',
    customDegree: '',
    specialization: '',
    institution: '',
    passingYear: '',
    percentage: ''
  }]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [duplicateCheck, setDuplicateCheck] = useState({ email: null, phone: null });
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  // Validation patterns
  const VALIDATION_RULES = {
    phone: {
      pattern: /^[6-9]\d{9}$/,
      message: 'Phone must be 10 digits starting with 6-9',
      maxLength: 10
    },
    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      message: 'Please enter a valid email address'
    },
    name: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'Name must be 2-50 characters, letters only'
    },
    year: {
      pattern: /^(19|20)\d{2}$/,
      message: 'Enter a valid year (1900-2099)'
    },
    ctc: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: 'Enter valid amount (e.g., 5.5 or 6)'
    },
    experience: {
      pattern: /^\d+(-\d+)?(\+)?$/,
      message: 'Enter valid experience (e.g., 2-4 or 5+)'
    }
  };
  
  const EXPERIENCE_LEVELS = [
    { value: 'Fresher (0-1 year)', label: 'Fresher (0-1 year)', icon: '🌱', years: '0-1' },
    { value: 'Entry Level (1-2 years)', label: 'Entry Level (1-2 years)', icon: '📝', years: '1-2' },
    { value: 'Junior (2-4 years)', label: 'Junior (2-4 years)', icon: '🎯', years: '2-4' },
    { value: 'Mid-Level (4-6 years)', label: 'Mid-Level (4-6 years)', icon: '💼', years: '4-6' },
    { value: 'Senior (6-10 years)', label: 'Senior (6-10 years)', icon: '🏆', years: '6-10' },
    { value: 'Lead (10+ years)', label: 'Lead (10+ years)', icon: '⭐', years: '10+' },
    { value: 'Expert (15+ years)', label: 'Expert (15+ years)', icon: '👑', years: '15+' }
  ];

  // Real-time duplicate validation
  const checkDuplicate = async (field, value) => {
    if (!value || value.length < 3) {
      setDuplicateCheck(prev => ({ ...prev, [field]: null }));
      return;
    }

    setCheckingDuplicate(true);
    try {
      const response = await apiService.get(`/api/candidates/check-duplicate?${field}=${encodeURIComponent(value)}`);
      setDuplicateCheck(prev => ({ ...prev, [field]: response.data.exists }));
      
      if (response.data.exists) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: `This ${field} is already registered in the system`
        }));
        toast.error(`${field === 'email' ? 'Email' : 'Phone number'} already exists!`, {
          duration: 3000,
          position: 'top-center'
        });
      } else {
        setFieldErrors(prev => {
          const { [field]: removed, ...rest } = prev;
          return rest;
        });
      }
    } catch (error) {
      console.error('Duplicate check failed:', error);
    } finally {
      setCheckingDuplicate(false);
    }
  };

  // Validation Functions
  const validateField = (name, value) => {
    // Convert to string and handle null/undefined
    const stringValue = value != null ? String(value) : '';
    
    // Don't show error for empty fields during typing
    if (!stringValue || stringValue.trim() === '') {
      return null;
    }

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!VALIDATION_RULES.name.pattern.test(stringValue.trim())) {
          return VALIDATION_RULES.name.message;
        }
        break;

      case 'email':
        if (!VALIDATION_RULES.email.pattern.test(stringValue.trim())) {
          return VALIDATION_RULES.email.message;
        }
        break;

      case 'phone':
        // Remove any non-digit characters
        const cleanPhone = stringValue.replace(/\D/g, '');
        if (cleanPhone.length > 0 && cleanPhone.length !== 10) {
          return 'Phone must be exactly 10 digits';
        }
        if (cleanPhone.length === 10 && !VALIDATION_RULES.phone.pattern.test(cleanPhone)) {
          return VALIDATION_RULES.phone.message;
        }
        break;

      case 'passingYear':
        if (!VALIDATION_RULES.year.pattern.test(stringValue)) {
          return VALIDATION_RULES.year.message;
        }
        const year = parseInt(stringValue);
        const currentYear = new Date().getFullYear();
        if (year > currentYear) {
          return `Year cannot be in the future`;
        }
        if (year < 1950) {
          return `Year must be after 1950`;
        }
        break;

      case 'currentPackage':
      case 'expectedCTC':
        if (!VALIDATION_RULES.ctc.pattern.test(stringValue)) {
          return VALIDATION_RULES.ctc.message;
        }
        const amount = parseFloat(stringValue);
        if (amount > 999) {
          return 'Amount seems too high (max 999 LPA)';
        }
        break;

      default:
        return null;
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};

    // Helper function to safely get string value
    const getStringValue = (value) => value != null ? String(value).trim() : '';

    // Required fields validation
    const firstName = getStringValue(formData.firstName);
    if (!firstName) {
      errors.firstName = 'First name is required';
    } else if (!VALIDATION_RULES.name.pattern.test(firstName)) {
      errors.firstName = VALIDATION_RULES.name.message;
    }

    const lastName = getStringValue(formData.lastName);
    if (!lastName) {
      errors.lastName = 'Last name is required';
    } else if (!VALIDATION_RULES.name.pattern.test(lastName)) {
      errors.lastName = VALIDATION_RULES.name.message;
    }

    const email = getStringValue(formData.email);
    if (!email) {
      errors.email = 'Email is required';
    } else if (!VALIDATION_RULES.email.pattern.test(email)) {
      errors.email = VALIDATION_RULES.email.message;
    }

    const phone = getStringValue(formData.phone);
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        errors.phone = 'Phone must be exactly 10 digits';
      } else if (!VALIDATION_RULES.phone.pattern.test(cleanPhone)) {
        errors.phone = VALIDATION_RULES.phone.message;
      }
    }

    // Conditional validation
    if (isFresher && !formData.expectedCTC) {
      errors.expectedCTC = 'Expected CTC is required for freshers';
    }

    if (formData.passingYear) {
      const yearError = validateField('passingYear', formData.passingYear);
      if (yearError) errors.passingYear = yearError;
    }

    if (formData.currentPackage) {
      const ctcError = validateField('currentPackage', formData.currentPackage);
      if (ctcError) errors.currentPackage = ctcError;
    }

    if (formData.expectedCTC) {
      const ctcError = validateField('expectedCTC', formData.expectedCTC);
      if (ctcError) errors.expectedCTC = ctcError;
    }

    // Validate exact experience matches selected level range
    if (!isFresher && formData.experience && formData.experienceLevel) {
      const experienceValue = parseFloat(formData.experience);
      if (!isNaN(experienceValue)) {
        const selectedLevel = EXPERIENCE_LEVELS.find(level => level.value === formData.experienceLevel);
        if (selectedLevel) {
          const years = selectedLevel.years;
          let minExp = 0, maxExp = 100;
          
          if (years.includes('-')) {
            [minExp, maxExp] = years.split('-').map(y => parseInt(y));
          } else if (years.includes('+')) {
            minExp = parseInt(years);
            maxExp = 100;
          } else {
            const parsed = parseInt(years);
            minExp = parsed;
            maxExp = parsed + 1;
          }
          
          if (experienceValue < minExp || experienceValue >= maxExp) {
            errors.experience = `Experience must be between ${minExp} and ${maxExp - 0.1} for ${selectedLevel.label}`;
          }
        }
      }
    }

    return errors;
  };
  
  useEffect(() => {
    if (id) {
      dispatch(fetchCandidateById(id));
    }
    
    return () => {
      dispatch(clearCurrentCandidate());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (currentCandidate && id) {
      console.log('Loading candidate for edit:', currentCandidate);
      
      const expLevel = currentCandidate.experienceLevel || currentCandidate.experience || '';
      const isFresherCandidate = expLevel.toLowerCase().includes('fresher') || expLevel.includes('0-1');
      
      setFormData({
        firstName: currentCandidate.firstName || '',
        lastName: currentCandidate.lastName || '',
        email: currentCandidate.email || '',
        phone: currentCandidate.phone || '',
        location: currentCandidate.location || '',
        company: currentCandidate.company || '',
        profile: currentCandidate.profile || '',
        degree: currentCandidate.degree || '',
        passingYear: currentCandidate.passingYear || '',
        education: currentCandidate.education || '',
        experience: currentCandidate.experience || '',
        experienceLevel: currentCandidate.experienceLevel || expLevel,
        currentPackage: currentCandidate.currentPackage || '',
        expectedCTC: currentCandidate.expectedCTC || '',
        gap: currentCandidate.gap || '',
        status: currentCandidate.status || CANDIDATE_STATUS.PENDING,
        skills: currentCandidate.skills || '',
        notes: currentCandidate.notes || '',
        employmentHistory: currentCandidate.employmentHistory || '',
        noticePeriod: currentCandidate.noticePeriod || '',
      });
      setIsFresher(isFresherCandidate);

      // Clear any existing errors when loading candidate for edit
      setFieldErrors({});

      // Parse employment history if exists
      if (currentCandidate.employmentHistory) {
        try {
          console.log('Employment history from DB:', currentCandidate.employmentHistory);
          
          // Check if it's yes/no format or full employment history
          if (currentCandidate.employmentHistory === 'yes' || currentCandidate.employmentHistory === 'no') {
            setHasEmploymentHistory(currentCandidate.employmentHistory);
            console.log('Employment history set to:', currentCandidate.employmentHistory);
          } else {
            const parsedHistory = JSON.parse(currentCandidate.employmentHistory);
            console.log('Parsed employment history:', parsedHistory);
            
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
              setHasEmploymentHistory('yes');
              setEmploymentEntries(parsedHistory);
              console.log('Employment entries set:', parsedHistory);
            }
          }
        } catch (error) {
          console.error('Failed to parse employment history:', error);
        }
      }
      
      // Parse education entries if they exist
      if (currentCandidate.education) {
        try {
          const parsedEducation = JSON.parse(currentCandidate.education);
          console.log('Parsed education from DB:', parsedEducation);
          
          if (Array.isArray(parsedEducation) && parsedEducation.length > 0) {
            // Process each education entry to handle custom degrees
            const processedEducation = parsedEducation.map(entry => {
              const degreeValue = entry.degree || '';
              
              // Check if degree is custom (not in predefined list)
              if (isCustomDegree(degreeValue)) {
                console.log(`Custom degree detected: "${degreeValue}" - setting to Other`);
                return {
                  ...entry,
                  degree: 'Other',
                  customDegree: degreeValue,
                  specialization: entry.specialization || '',
                  institution: entry.institution || '',
                  passingYear: entry.passingYear || '',
                  percentage: entry.percentage || ''
                };
              } else {
                return {
                  ...entry,
                  customDegree: entry.customDegree || '',
                  specialization: entry.specialization || '',
                  institution: entry.institution || '',
                  passingYear: entry.passingYear || '',
                  percentage: entry.percentage || ''
                };
              }
            });
            console.log('Processed education entries:', processedEducation);
            setEducationEntries(processedEducation);
          }
        } catch (e) {
          // If not JSON, might be old single degree format
          if (currentCandidate.degree) {
            const degreeValue = currentCandidate.degree;
            if (isCustomDegree(degreeValue)) {
              setEducationEntries([{
                degree: 'Other',
                customDegree: degreeValue,
                specialization: '',
                institution: '',
                passingYear: currentCandidate.passingYear || '',
                percentage: ''
              }]);
            } else {
              setEducationEntries([{
                degree: degreeValue,
                customDegree: '',
                specialization: '',
                institution: '',
                passingYear: currentCandidate.passingYear || '',
                percentage: ''
              }]);
            }
          }
        }
      } else if (currentCandidate.degree) {
        // Handle old format with single degree
        const degreeValue = currentCandidate.degree;
        if (isCustomDegree(degreeValue)) {
          setEducationEntries([{
            degree: 'Other',
            customDegree: degreeValue,
            specialization: '',
            institution: '',
            passingYear: currentCandidate.passingYear || '',
            percentage: ''
          }]);
        } else {
          setEducationEntries([{
            degree: degreeValue,
            customDegree: '',
            specialization: '',
            institution: '',
            passingYear: currentCandidate.passingYear || '',
            percentage: ''
          }]);
        }
      }
    }
  }, [currentCandidate, id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Special handling for phone number - restrict to 10 digits only
    if (name === 'phone') {
      const cleanPhone = value.replace(/\D/g, ''); // Remove all non-digits
      if (cleanPhone.length > 10) {
        return; // Don't allow more than 10 digits
      }
      
      
      // Real-time validation
      const error = validateField(name, cleanPhone);
      if (error) {
        setFieldErrors(prev => ({ ...prev, [name]: error }));
      }
      
      setFormData(prev => ({ ...prev, [name]: cleanPhone }));
      
      // Check for duplicate phone when 10 digits are entered
      if (cleanPhone.length === 10) {
        checkDuplicate('phone', cleanPhone);
      }
      return;
    }

    // Check for duplicate email when valid format is entered
    if (name === 'email') {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Real-time validation
      const error = validateField(name, value);
      if (error) {
        setFieldErrors(prev => ({ ...prev, [name]: error }));
      }
      
      // Check for duplicate email when valid format is entered
      if (VALIDATION_RULES.email.pattern.test(value)) {
        checkDuplicate('email', value);
      }
      return;
    }

    // Real-time validation for other fields on blur
    const error = validateField(name, value);
    if (error && value.trim() !== '') {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
    
    // Check if experience level changed to fresher
    if (name === 'experienceLevel') {
      const isFresherSelected = value.toLowerCase().includes('fresher') || value.includes('0-1');
      setIsFresher(isFresherSelected);
      
      // Auto-fill experience years based on level
      const selectedLevel = EXPERIENCE_LEVELS.find(level => level.value === value);
      const years = selectedLevel ? selectedLevel.years : '';
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        experience: years,
        // Clear company and current package for freshers
        company: isFresherSelected ? '' : prev.company,
        currentPackage: isFresherSelected ? '' : prev.currentPackage
      }));
    } else if (name === 'experience') {
      // Validate exact experience against selected experience level
      const experienceValue = parseFloat(value);
      if (!isNaN(experienceValue) && formData.experienceLevel) {
        const selectedLevel = EXPERIENCE_LEVELS.find(level => level.value === formData.experienceLevel);
        if (selectedLevel) {
          const years = selectedLevel.years;
          let minExp = 0, maxExp = 100;
          
          // Parse experience range
          if (years.includes('-')) {
            [minExp, maxExp] = years.split('-').map(y => parseInt(y));
          } else if (years.includes('+')) {
            minExp = parseInt(years);
            maxExp = 100;
          } else {
            // For single values like "0-1"
            const parsed = parseInt(years);
            minExp = parsed;
            maxExp = parsed + 1;
          }
          
          // Validate exact experience is within range
          if (experienceValue < minExp || experienceValue >= maxExp) {
            setFieldErrors(prev => ({
              ...prev,
              experience: `Experience must be between ${minExp} and ${maxExp - 0.1} for ${selectedLevel.label}`
            }));
          } else {
            // Clear error if valid
            setFieldErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.experience;
              return newErrors;
            });
          }
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Employment History Handlers
  const addEmploymentEntry = () => {
    setEmploymentEntries([...employmentEntries, {
      company: '',
      designation: '',
      startYear: '',
      endYear: '',
      duration: '',
      isCurrent: false
    }]);
  };
  
  // Education Handlers
  const addEducationEntry = () => {
    setEducationEntries([...educationEntries, {
      degree: '',
      customDegree: '',
      specialization: '',
      institution: '',
      passingYear: '',
      percentage: ''
    }]);
  };

  const removeEmploymentEntry = (index) => {
    const updated = employmentEntries.filter((_, i) => i !== index);
    setEmploymentEntries(updated.length > 0 ? updated : [{
      company: '',
      designation: '',
      startYear: '',
      endYear: '',
      duration: '',
      isCurrent: false
    }]);
  };
  
  const removeEducationEntry = (index) => {
    const updated = educationEntries.filter((_, i) => i !== index);
    setEducationEntries(updated.length > 0 ? updated : [{
      degree: '',
      customDegree: '',
      specialization: '',
      institution: '',
      passingYear: '',
      percentage: ''
    }]);
  };

  const updateEmploymentEntry = (index, field, value) => {
    const updated = [...employmentEntries];
    updated[index][field] = value;

    // Calculate duration when years change
    if ((field === 'startYear' || field === 'endYear' || field === 'isCurrent') && updated[index].startYear) {
      const start = parseInt(updated[index].startYear);
      const end = updated[index].isCurrent ? new Date().getFullYear() : parseInt(updated[index].endYear);
      if (start && end && end >= start) {
        updated[index].duration = `${end - start} years`;
      } else {
        updated[index].duration = '';
      }
    }

    setEmploymentEntries(updated);
  };
  
  const updateEducationEntry = (index, field, value) => {
    const updated = [...educationEntries];
    updated[index][field] = value;
    
    // Clear custom degree when switching away from "Other"
    if (field === 'degree' && value !== 'Other') {
      updated[index].customDegree = '';
    }
    
    setEducationEntries(updated);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      
      // Show error toast with field names
      const errorFields = Object.keys(errors).map(field => {
        const fieldNames = {
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          phone: 'Phone Number',
          expectedCTC: 'Expected CTC',
          passingYear: 'Passing Year',
          currentPackage: 'Current Package'
        };
        return fieldNames[field] || field;
      }).join(', ');
      
      toast.error(`Please fix errors in: ${errorFields}`, {
        duration: 5000,
        position: 'top-center',
      });
      
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => element.focus(), 300);
      }
      
      return;
    }
    
    try {
      // Serialize employment history
      let employmentHistoryValue = '';
      
      if (hasEmploymentHistory === 'yes') {
        // If user selected 'yes', save the employment entries as JSON
        employmentHistoryValue = employmentEntries.some(e => e.company || e.designation)
          ? JSON.stringify(employmentEntries.filter(e => e.company || e.designation))
          : 'yes'; // Save 'yes' if no entries filled but user selected yes
      } else if (hasEmploymentHistory === 'no') {
        // If user selected 'no', save 'no'
        employmentHistoryValue = 'no';
      }
      
      // Serialize education entries - use custom degree if "Other" is selected
      const filteredEducation = educationEntries
        .filter(e => e.degree || e.institution)
        .map(entry => ({
          ...entry,
          degree: entry.degree === 'Other' && entry.customDegree ? entry.customDegree : entry.degree
        }));
      const educationValue = filteredEducation.length > 0
        ? JSON.stringify(filteredEducation)
        : '';
      
      const submissionData = {
        ...formData,
        employmentHistory: employmentHistoryValue,
        education: educationValue,
        experienceLevel: formData.experienceLevel,
        noticePeriod: formData.noticePeriod || '',
        // Keep backward compatibility with old single degree format
        degree: educationEntries[0]?.degree || '',
        passingYear: educationEntries[0]?.passingYear || ''
      };

      console.log('Submitting candidate data:', {
        education: educationValue,
        educationEntries: educationEntries,
        experienceLevel: formData.experienceLevel,
        noticePeriod: formData.noticePeriod
      });

      if (id) {
        await dispatch(updateCandidate({ id, data: submissionData })).unwrap();
        toast.success('Candidate updated successfully!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        await dispatch(createCandidate(submissionData)).unwrap();
        toast.success('Candidate created successfully!', {
          duration: 3000,
          position: 'top-center',
        });
        // Navigate to history only after creating new candidate
        navigate('/history');
      }
    } catch (error) {
      console.error('Failed to save candidate:', error);
      
      // Parse error details
      const errorMessage = error.message || 'Failed to save candidate!';
      const errorData = error.data || error;
      
      // Check for specific validation errors
      let specificError = null;
      const newFieldErrors = {};
      
      if (errorMessage.toLowerCase().includes('duplicate') || 
          errorMessage.toLowerCase().includes('already exists')) {
        
        if (errorMessage.toLowerCase().includes('email')) {
          specificError = {
            title: id ? 'Duplicate Email Address' : 'Email Already Registered',
            message: id 
              ? `Email "${formData.email}" is already used by another candidate.`
              : `Email "${formData.email}" is already registered in the system.`,
            field: 'email',
            icon: '📧',
            color: '#EF4444',
            action: id ? 'update' : 'create'
          };
          newFieldErrors.email = 'This email is already in use';
        } else if (errorMessage.toLowerCase().includes('phone')) {
          specificError = {
            title: id ? 'Duplicate Phone Number' : 'Phone Already Registered',
            message: id
              ? `Phone number "${formData.phone}" is already used by another candidate.`
              : `Phone number "${formData.phone}" is already registered in the system.`,
            field: 'phone',
            icon: '📱',
            color: '#F59E0B',
            action: id ? 'update' : 'create'
          };
          newFieldErrors.phone = 'This phone number is already in use';
        }
      } else if (errorMessage.toLowerCase().includes('validation') || 
                 errorMessage.toLowerCase().includes('invalid')) {
        // Handle validation errors
        if (errorMessage.toLowerCase().includes('email')) {
          specificError = {
            title: 'Invalid Email Format',
            message: 'Please enter a valid email address.',
            field: 'email',
            icon: '⚠️',
            color: '#F59E0B'
          };
          newFieldErrors.email = 'Invalid email format';
        } else if (errorMessage.toLowerCase().includes('phone')) {
          specificError = {
            title: 'Invalid Phone Number',
            message: 'Please enter a valid phone number.',
            field: 'phone',
            icon: '⚠️',
            color: '#F59E0B'
          };
          newFieldErrors.phone = 'Invalid phone number';
        }
      }
      
      setFieldErrors(newFieldErrors);
      
      if (specificError) {
        setErrorDetails(specificError);
        setShowErrorModal(true);
        
        // Also show toast for quick feedback
        toast.error(specificError.message, {
          duration: 5000,
          position: 'top-center',
        });
        
        // Scroll to error field
        setTimeout(() => {
          const errorField = document.querySelector(`[name="${specificError.field}"]`);
          if (errorField) {
            errorField.focus();
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      } else {
        // Generic error
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };
  
  if (loading && id) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
          <div className="candidate-form-loading">
            <LoadingSpinner />
            <span className="candidate-form-loading-text">Loading candidate...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="app-root">
      <Toaster />
      <Sidebar />
      
      <div className="main-wrapper">
        <main className="content">
          <div className="candidate-form-container">
            <div className="candidate-form-card">
              {/* Header */}
              <div className="candidate-form-header">
                <div className="form-mode-indicator">
                  <span className={`mode-badge ${id ? 'mode-edit' : 'mode-create'}`}>
                    {id ? '✏️ Edit Mode' : '➕ Create Mode'}
                  </span>
                </div>
                <h1 className="candidate-form-title">
                  {id ? 'Edit Candidate Profile' : 'Add New Candidate'}
                </h1>
                <p className="candidate-form-subtitle">
                  {id ? 'Update candidate information and details' : 'Enter candidate details to create a new profile'}
                </p>
              </div>
              
              {/* Form Body */}
              <div className="candidate-form-body">
                <form onSubmit={handleSubmit}>
                  {/* Validation Summary */}
                  {Object.keys(fieldErrors).length > 0 && (
                    <div className="validation-summary-banner">
                      <div className="validation-summary-header">
                        <span className="validation-icon">⚠️</span>
                        <span className="validation-title">Please fix {Object.keys(fieldErrors).length} validation error{Object.keys(fieldErrors).length > 1 ? 's' : ''}</span>
                      </div>
                      <ul className="validation-summary-list">
                        {Object.entries(fieldErrors).map(([field, error]) => {
                          const fieldNames = {
                            firstName: 'First Name',
                            lastName: 'Last Name',
                            email: 'Email',
                            phone: 'Phone Number',
                            expectedCTC: 'Expected CTC',
                            passingYear: 'Passing Year',
                            currentPackage: 'Current Package',
                            experience: 'Exact Experience'
                          };
                          return (
                            <li key={field} onClick={() => {
                              const element = document.querySelector(`[name="${field}"]`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                setTimeout(() => element.focus(), 300);
                              }
                            }}>
                              <strong>{fieldNames[field] || field}:</strong> {error}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Contact Information Section */}
                  <div className="candidate-form-section">
                    <h2 className="candidate-form-section-title">Contact Information</h2>
                    
                    <div className="candidate-form-grid">
                      <div className="candidate-form-group half-width">
                        <label className="candidate-form-label">
                          Phone Number <span className="required">*</span>
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10 digit number"
                          className={`candidate-form-input ${
                            fieldErrors.phone ? 'input-error' : 
                            duplicateCheck.phone === true ? 'input-duplicate' :
                            formData.phone.length === 10 && !fieldErrors.phone ? 'input-success' : ''
                          }`}
                          maxLength="10"
                          required
                        />
                        {fieldErrors.phone ? (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {fieldErrors.phone}
                          </span>
                        ) : duplicateCheck.phone === true ? (
                          <span className="field-error-message">
                            <span className="error-icon">🚫</span>
                            Phone number already exists
                          </span>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="candidate-form-helper">
                              {checkingDuplicate.phone ? 'Checking...' : 'Must start with 6-9'}
                            </span>
                            <span className={`field-char-counter ${formData.phone.length > 0 && formData.phone.length < 10 ? 'warning' : ''}`}>
                              {formData.phone.length}/10
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="candidate-form-group half-width">
                        <label className="candidate-form-label">
                          Email <span className="required">*</span>
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className={`candidate-form-input ${
                            fieldErrors.email ? 'input-error' : 
                            duplicateCheck.email === true ? 'input-duplicate' : ''
                          }`}
                          required
                        />
                        {fieldErrors.email ? (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {fieldErrors.email}
                          </span>
                        ) : duplicateCheck.email === true ? (
                          <span className="field-error-message">
                            <span className="error-icon">🚫</span>
                            Email already exists
                          </span>
                        ) : checkingDuplicate.email ? (
                          <span className="field-info-message">
                            <span className="info-icon">🔍</span>
                            Checking email...
                          </span>
                        ) : null}
                      </div>
                      
                      <div className="candidate-form-group half-width">
                        <label className="candidate-form-label">Location</label>
                        <input 
                          type="text" 
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, State"
                          className="candidate-form-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Basic Information Section */}
                  <div className="candidate-form-section">
                    <h2 className="candidate-form-section-title">Basic Information</h2>
                    
                    <div className="candidate-form-grid">
                      <div className="candidate-form-group">
                        <label className="candidate-form-label">
                          Experience Level <span className="required">*</span>
                        </label>
                        <select 
                          name="experienceLevel" 
                          value={formData.experienceLevel} 
                          onChange={handleChange}
                          className="candidate-form-select"
                          required
                        >
                          <option value="">Select Experience Level</option>
                          {EXPERIENCE_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.icon} {level.label}
                            </option>
                          ))}
                        </select>
                        <span className="candidate-form-helper">
                          {isFresher ? '🌟 Perfect for recent graduates!' : 'Select range, then enter exact experience below'}
                        </span>
                      </div>
                      
                      {!isFresher && (
                        <div className="candidate-form-group">
                          <label className="candidate-form-label">
                            Exact Experience (in years)
                          </label>
                          <input 
                            type="number" 
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="e.g., 1.4 (1 year 4 months)"
                            step="0.1"
                            min="0"
                            max="50"
                            className={`candidate-form-input ${fieldErrors.experience ? 'error' : ''}`}
                          />
                          {fieldErrors.experience ? (
                            <span className="error-message">{fieldErrors.experience}</span>
                          ) : (
                            <span className="candidate-form-helper">
                              💡 Enter exact years (e.g., 1.4 = 1 year 4 months, 3.5 = 3 years 6 months)
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="candidate-form-group">
                        <label className="candidate-form-label">
                          Status <span className="required">*</span>
                        </label>
                        <select 
                          name="status" 
                          value={formData.status} 
                          onChange={handleChange}
                          className="candidate-form-select candidate-status-select"
                          required
                        >
                          {Object.entries(CANDIDATE_STATUS).map(([key, value]) => (
                            <option key={value} value={value}>
                              {value.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {!isFresher && (
                        <div className="candidate-form-group">
                          <label className="candidate-form-label">Current Company</label>
                          <input 
                            type="text" 
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            className="candidate-form-input"
                          />
                        </div>
                      )}
                      
                      <div className="candidate-form-group">
                        <label className="candidate-form-label">
                          First Name <span className="required">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          className={`candidate-form-input ${fieldErrors.firstName ? 'input-error' : ''}`}
                          maxLength="50"
                          required
                        />
                        {fieldErrors.firstName && (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {fieldErrors.firstName}
                          </span>
                        )}
                      </div>
                      
                      <div className="candidate-form-group">
                        <label className="candidate-form-label">
                          Last Name <span className="required">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          className={`candidate-form-input ${fieldErrors.lastName ? 'input-error' : ''}`}
                          maxLength="50"
                          required
                        />
                        {fieldErrors.lastName && (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {fieldErrors.lastName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Professional Details Section */}
                  <div className="candidate-form-section">
                    <h2 className="candidate-form-section-title">
                      Professional Details
                      {isFresher && <span className="section-badge fresher-badge">🌱 Fresher Profile</span>}
                    </h2>
                    
                    <div className="candidate-form-grid">
                      <div className="candidate-form-group">
                        <label className="candidate-form-label">
                          {isFresher ? 'Desired Profile' : 'Current Profile'}
                        </label>
                        <input 
                          type="text" 
                          name="profile"
                          value={formData.profile}
                          onChange={handleChange}
                          placeholder={isFresher ? "e.g., Software Developer" : "e.g., Full Stack Developer"}
                          className="candidate-form-input"
                        />
                      </div>
                      

                      
                      {!isFresher && (
                        <>
                          <div className="candidate-form-group">
                            <label className="candidate-form-label">Current Package (LPA)</label>
                            <input 
                              type="text" 
                              name="currentPackage"
                              value={formData.currentPackage}
                              onChange={handleChange}
                              placeholder="e.g., 5.0"
                              className={`candidate-form-input ${fieldErrors.currentPackage ? 'input-error' : ''}`}
                              maxLength="6"
                            />
                            {fieldErrors.currentPackage && (
                              <span className="field-error-message">
                                <span className="error-icon">⚠️</span>
                                {fieldErrors.currentPackage}
                              </span>
                            )}
                          </div>
                          
                          <div className="candidate-form-group">
                            <label className="candidate-form-label">Notice Period</label>
                            <select 
                              name="noticePeriod"
                              value={formData.noticePeriod}
                              onChange={handleChange}
                              className="candidate-form-select"
                            >
                              <option value="">Select Notice Period</option>
                              <option value="Immediate">Immediate</option>
                              <option value="15 Days">15 Days</option>
                              <option value="1 Month">1 Month</option>
                              <option value="2 Months">2 Months</option>
                              <option value="3 Months">3 Months</option>
                              <option value="Serving Notice">Serving Notice</option>
                            </select>
                            <span className="candidate-form-helper">Current notice period commitment</span>
                          </div>
                        </>
                      )}
                      
                      <div className="candidate-form-group">
                        <label className="candidate-form-label">
                          Expected CTC (LPA) {isFresher && <span className="required">*</span>}
                        </label>
                        <input 
                          type="text" 
                          name="expectedCTC"
                          value={formData.expectedCTC}
                          onChange={handleChange}
                          placeholder={isFresher ? "e.g., 3.5" : "e.g., 8.0"}
                          className={`candidate-form-input ${fieldErrors.expectedCTC ? 'input-error' : ''}`}
                          maxLength="6"
                          required={isFresher}
                        />
                        {fieldErrors.expectedCTC && (
                          <span className="field-error-message">
                            <span className="error-icon">⚠️</span>
                            {fieldErrors.expectedCTC}
                          </span>
                        )}
                        {isFresher && !fieldErrors.expectedCTC && <span className="candidate-form-helper">Expected starting salary</span>}
                      </div>
                    </div>
                  </div>

                  {/* Employment History Section */}
                  <div className="candidate-form-section">
                    <h2 className="candidate-form-section-title">
                      {isFresher ? 'Previous Employment / PF History' : 'Employment History'}
                    </h2>
                    
                    <div className="candidate-form-group">
                      <label className="candidate-form-label">
                        {isFresher ? 'Do you have any previous employment or PF history?' : 'Do you have employment history to add?'}
                      </label>
                      <div className="pf-history-radio-group">
                        <label className="pf-history-radio-option">
                          <input
                            type="radio"
                            name="employmentHistory"
                            value="yes"
                            checked={hasEmploymentHistory === 'yes'}
                            onChange={(e) => setHasEmploymentHistory(e.target.value)}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="pf-history-radio-option">
                          <input
                            type="radio"
                            name="employmentHistory"
                            value="no"
                            checked={hasEmploymentHistory === 'no'}
                            onChange={(e) => setHasEmploymentHistory(e.target.value)}
                          />
                          <span>No</span>
                        </label>
                      </div>
                      <span className="candidate-form-helper">
                        {isFresher 
                          ? 'Include any internships, freelance work, or PF (Provident Fund) history' 
                          : 'Add details of your previous work experience'}
                      </span>
                    </div>

                    {/* Show Employment Entry Form if Yes is selected */}
                    {hasEmploymentHistory === 'yes' && (
                      <div className="employment-history-container">
                      
                      {employmentEntries.map((entry, index) => (
                        <div key={index} className="employment-entry-card">
                          <div className="employment-entry-header">
                            <span className="employment-entry-number">Employment {index + 1}</span>
                            {employmentEntries.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEmploymentEntry(index)}
                                className="employment-remove-btn"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="candidate-form-grid">
                            <div className="candidate-form-group">
                              <label className="candidate-form-label">Company Name</label>
                              <input
                                type="text"
                                value={entry.company}
                                onChange={(e) => updateEmploymentEntry(index, 'company', e.target.value)}
                                placeholder="e.g., TCS, Infosys"
                                className="candidate-form-input"
                              />
                            </div>

                            <div className="candidate-form-group">
                              <label className="candidate-form-label">Designation</label>
                              <input
                                type="text"
                                value={entry.designation}
                                onChange={(e) => updateEmploymentEntry(index, 'designation', e.target.value)}
                                placeholder="e.g., Software Engineer"
                                className="candidate-form-input"
                              />
                            </div>

                            <div className="candidate-form-group">
                              <label className="candidate-form-label">Start Year</label>
                              <input
                                type="number"
                                value={entry.startYear}
                                onChange={(e) => updateEmploymentEntry(index, 'startYear', e.target.value)}
                                placeholder="e.g., 2020"
                                min="1970"
                                max={new Date().getFullYear()}
                                className="candidate-form-input"
                              />
                            </div>

                            <div className="candidate-form-group">
                              <label className="candidate-form-label">End Year</label>
                              <input
                                type="number"
                                value={entry.endYear}
                                onChange={(e) => updateEmploymentEntry(index, 'endYear', e.target.value)}
                                placeholder="e.g., 2023"
                                min="1970"
                                max={new Date().getFullYear()}
                                disabled={entry.isCurrent}
                                className="candidate-form-input"
                              />
                            </div>

                            <div className="candidate-form-group">
                              <label className="candidate-form-label">Duration</label>
                              <input
                                type="text"
                                value={entry.duration}
                                readOnly
                                placeholder="Auto-calculated"
                                className="candidate-form-input"
                              />
                            </div>

                            <div className="candidate-form-group employment-current-wrapper">
                              <label className="employment-current-checkbox">
                                <input
                                  type="checkbox"
                                  checked={entry.isCurrent}
                                  onChange={(e) => updateEmploymentEntry(index, 'isCurrent', e.target.checked)}
                                />
                                <span>Current Job</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addEmploymentEntry}
                        className="employment-add-btn"
                      >
                        + Add Another Employment
                      </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Education Section */}
                  <div className="candidate-form-section">
                    <h2 className="candidate-form-section-title">
                      Education Details
                      <span className="section-subtitle">Add your educational qualifications</span>
                    </h2>
                    
                    {educationEntries.map((entry, index) => (
                      <div key={index} className="employment-entry">
                        <div className="employment-entry-header">
                          <h3 className="employment-entry-title">
                            📚 Education {index + 1}
                          </h3>
                          {educationEntries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducationEntry(index)}
                              className="employment-remove-btn"
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="candidate-form-grid">
                          <div className="candidate-form-group">
                            <label className="candidate-form-label">Degree/Qualification</label>
                            <select 
                              value={entry.degree}
                              onChange={(e) => updateEducationEntry(index, 'degree', e.target.value)}
                              className="candidate-form-select"
                            >
                              <option value="">Select Degree</option>
                              <option value="BCA">BCA</option>
                              <option value="MCA">MCA</option>
                              <option value="BE">BE</option>
                              <option value="BTech">BTech</option>
                              <option value="MTech">MTech</option>
                              <option value="BSc">BSc</option>
                              <option value="MSc">MSc</option>
                              <option value="Diploma">Diploma</option>
                              <option value="12th">12th</option>
                              <option value="10th">10th</option>
                              <option value="Other">Other (Specify)</option>
                            </select>
                          </div>
                          
                          {/* Custom Degree Input - Shows when "Other" is selected */}
                          {entry.degree === 'Other' && (
                            <div className="candidate-form-group">
                              <label className="candidate-form-label">
                                Specify Degree <span className="required">*</span>
                              </label>
                              <input 
                                type="text"
                                value={entry.customDegree}
                                onChange={(e) => updateEducationEntry(index, 'customDegree', e.target.value)}
                                placeholder="e.g., MBA, BBA, BA, etc."
                                className="candidate-form-input"
                                required
                              />
                              <span className="candidate-form-helper">
                                💡 Enter your degree name (e.g., MBA, BBA, LLB, MBBS)
                              </span>
                            </div>
                          )}
                          
                          <div className="candidate-form-group">
                            <label className="candidate-form-label">Specialization/Stream</label>
                            <input 
                              type="text"
                              value={entry.specialization}
                              onChange={(e) => updateEducationEntry(index, 'specialization', e.target.value)}
                              placeholder="e.g., Computer Science"
                              className="candidate-form-input"
                            />
                          </div>
                          
                          <div className="candidate-form-group">
                            <label className="candidate-form-label">Institution/University</label>
                            <input 
                              type="text"
                              value={entry.institution}
                              onChange={(e) => updateEducationEntry(index, 'institution', e.target.value)}
                              placeholder="College/University name"
                              className="candidate-form-input"
                            />
                          </div>
                          
                          <div className="candidate-form-group">
                            <label className="candidate-form-label">Passing Year</label>
                            <input 
                              type="number"
                              value={entry.passingYear}
                              onChange={(e) => updateEducationEntry(index, 'passingYear', e.target.value)}
                              placeholder="YYYY"
                              min="1950"
                              max={new Date().getFullYear()}
                              className="candidate-form-input"
                            />
                          </div>
                          
                          <div className="candidate-form-group">
                            <label className="candidate-form-label">Percentage/CGPA</label>
                            <input 
                              type="text"
                              value={entry.percentage}
                              onChange={(e) => updateEducationEntry(index, 'percentage', e.target.value)}
                              placeholder="e.g., 85% or 8.5 CGPA"
                              className="candidate-form-input"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addEducationEntry}
                      className="employment-add-btn"
                    >
                      + Add Another Education
                    </button>
                    
                    <div className="candidate-form-group">
                      <label className="candidate-form-label">Education Gap</label>
                      <select 
                        name="gap" 
                        value={formData.gap} 
                        onChange={handleChange}
                        className="candidate-form-select"
                      >
                        <option value="">Select Gap</option>
                        <option value="No Gap">No Gap</option>
                        <option value="0-1 Years">0-1 Years</option>
                        <option value="1-2 Years">1-2 Years</option>
                        <option value="2+ Years">2+ Years</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Skills & Notes Section */}
                  <div className="candidate-form-section">
                    <h2 className="candidate-form-section-title">Skills & Additional Information</h2>
                    
                    <div className="candidate-form-grid">
                      <div className="candidate-form-group full-width">
                        <label className="candidate-form-label">Skills</label>
                        <input 
                          type="text" 
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          placeholder="e.g., Java, Spring Boot, React, MySQL"
                          className="candidate-form-input"
                        />
                      </div>
                      
                      <div className="candidate-form-group full-width">
                        <label className="candidate-form-label">Notes</label>
                        <textarea 
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Additional notes or comments..."
                          className="candidate-form-textarea"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="candidate-form-actions">
                    <button 
                      type="button" 
                      className="btn-base btn-neutral btn-lg"
                      onClick={() => navigate('/history')}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className={`btn-base btn-primary btn-lg ${id ? 'btn-update' : 'btn-create'}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="btn-spinner"></span>
                          {id ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          {id ? '✓ Update Candidate' : '+ Create Candidate'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Error Modal */}
      {showErrorModal && errorDetails && (
        <div className="error-modal-overlay" onClick={() => setShowErrorModal(false)}>
          <div className="error-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="error-modal-header" style={{ background: `linear-gradient(135deg, ${errorDetails.color} 0%, ${errorDetails.color}dd 100%)` }}>
              <span className="error-modal-icon">{errorDetails.icon}</span>
              <h3 className="error-modal-title">{errorDetails.title}</h3>
              <button 
                type="button"
                className="error-modal-close"
                onClick={() => setShowErrorModal(false)}
              >
                ×
              </button>
            </div>
            <div className="error-modal-body">
              <p className="error-modal-message">{errorDetails.message}</p>
              <div className="error-modal-suggestions">
                <p className="error-suggestion-title">Suggestions:</p>
                <ul className="error-suggestions-list">
                  {errorDetails.field === 'email' && errorDetails.action === 'create' && (
                    <>
                      <li>Search for existing candidate with this email</li>
                      <li>Verify the email address is correct</li>
                      <li>Use candidate search before creating new entries</li>
                    </>
                  )}
                  {errorDetails.field === 'email' && errorDetails.action === 'update' && (
                    <>
                      <li>Another candidate is using this email address</li>
                      <li>Check if this is the correct email for this candidate</li>
                      <li>Use a different email or update the other candidate</li>
                    </>
                  )}
                  {errorDetails.field === 'phone' && errorDetails.action === 'create' && (
                    <>
                      <li>Search for existing candidate with this phone number</li>
                      <li>Verify the phone number is correct (10 digits)</li>
                      <li>Use candidate search before creating new entries</li>
                    </>
                  )}
                  {errorDetails.field === 'phone' && errorDetails.action === 'update' && (
                    <>
                      <li>Another candidate is using this phone number</li>
                      <li>Check if this is the correct phone for this candidate</li>
                      <li>Use a different phone or update the other candidate</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className="error-modal-footer">
              <button 
                type="button"
                className="error-modal-btn error-btn-secondary"
                onClick={() => setShowErrorModal(false)}
              >
                Close
              </button>
              <button 
                type="button"
                className="error-modal-btn error-btn-primary"
                onClick={() => {
                  setShowErrorModal(false);
                  const field = document.querySelector(`[name="${errorDetails.field}"]`);
                  if (field) field.focus();
                }}
              >
                Fix {errorDetails.field === 'email' ? 'Email' : 'Phone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateForm;
