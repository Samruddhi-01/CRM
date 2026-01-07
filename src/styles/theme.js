// Theme Configuration - Dark Blue & Red Brand Colors
export const theme = {
  colors: {
    // Primary Colors (from screenshot)
    primaryBlue: '#0B2F6B',
    accentRed: '#D20B2B',
    secondaryBlue: '#1F8BFF',
    
    // Neutral Backgrounds
    neutralBg: '#F6F8FA',
    neutralBgAlt: '#F2F5F9',
    cardBg: '#FFFFFF',
    
    // Status Colors
    status: {
      interested: '#0B2F6B',
      notInterested: '#6B7280',
      pending: '#F59E0B',
      tellLater: '#0d2b66',
      contacted: '#8B5CF6',
      offered: '#10B981',
      hired: '#059669',
    },
    
    // UI States
    success: '#10B981',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#1F8BFF',
    
    // Text Colors
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textLight: '#FFFFFF',
    
    // Border & Divider
    border: '#E0E6ED',
    divider: '#F0F2F5',
    
    // Shadows
    shadow: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
      md: '0 4px 12px rgba(0, 0, 0, 0.08)',
      lg: '0 10px 40px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 60px rgba(0, 0, 0, 0.15)',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: {
      xs: '12px',
      sm: '13px',
      md: '14px',
      base: '15px',
      lg: '16px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

export default theme;
