/**
 * ============================================================================
 * UNIFIED UI - ACCESSIBILITY ENHANCEMENTS
 * ============================================================================
 * 
 * Non-invasive JavaScript enhancements for improved accessibility
 * and progressive enhancement of the unified UI system.
 * 
 * Features:
 * - Keyboard navigation for pagination
 * - ARIA attributes for screen readers
 * - Table responsive toggle for mobile
 * - Truncated cell tooltips
 * - Focus management
 * 
 * Usage:
 * Import this file in your main app entry point or specific pages
 * that need accessibility enhancements.
 */

(function() {
  'use strict';

  // ============================================================================
  // PAGINATION KEYBOARD NAVIGATION
  // ============================================================================

  /**
   * Enhance pagination buttons with keyboard navigation and ARIA attributes
   */
  function enhancePagination() {
    const paginationContainers = document.querySelectorAll('.pagination-controls, .table-pagination, .unified-pagination');
    
    paginationContainers.forEach(container => {
      const buttons = container.querySelectorAll('.pagination-btn');
      
      buttons.forEach((button, index) => {
        // Add ARIA current to active page
        if (button.classList.contains('active')) {
          button.setAttribute('aria-current', 'page');
          button.setAttribute('aria-label', `Current page, page ${button.textContent.trim()}`);
        } else if (!button.disabled) {
          const pageNum = button.textContent.trim();
          if (!isNaN(pageNum)) {
            button.setAttribute('aria-label', `Go to page ${pageNum}`);
          }
        }
        
        // Add keyboard navigation
        button.addEventListener('keydown', (e) => {
          let targetButton = null;
          
          switch(e.key) {
            case 'ArrowLeft':
              // Move to previous button
              targetButton = buttons[Math.max(0, index - 1)];
              break;
            case 'ArrowRight':
              // Move to next button
              targetButton = buttons[Math.min(buttons.length - 1, index + 1)];
              break;
            case 'Home':
              // Move to first button
              targetButton = buttons[0];
              e.preventDefault();
              break;
            case 'End':
              // Move to last button
              targetButton = buttons[buttons.length - 1];
              e.preventDefault();
              break;
          }
          
          if (targetButton && !targetButton.disabled) {
            targetButton.focus();
          }
        });
      });
    });
  }

  // ============================================================================
  // TABLE RESPONSIVE TOGGLE (Mobile Card View)
  // ============================================================================

  /**
   * Add responsive table toggle for mobile devices
   * Allows switching between table and card view on small screens
   */
  function addTableResponsiveToggle() {
    const tables = document.querySelectorAll('.data-table, .unified-table, .candidate-table, .openings-table');
    
    tables.forEach(table => {
      const tableCard = table.closest('.table-card');
      if (!tableCard) return;
      
      // Check if already has toggle
      if (tableCard.querySelector('.table-view-toggle')) return;
      
      // Only add on mobile/tablet
      if (window.innerWidth > 767) return;
      
      // Create toggle button
      const toggleContainer = document.createElement('div');
      toggleContainer.className = 'table-view-toggle';
      toggleContainer.setAttribute('role', 'group');
      toggleContainer.setAttribute('aria-label', 'Table view options');
      
      const tableViewBtn = document.createElement('button');
      tableViewBtn.className = 'view-toggle-btn active';
      tableViewBtn.textContent = 'Table';
      tableViewBtn.setAttribute('aria-pressed', 'true');
      
      const cardViewBtn = document.createElement('button');
      cardViewBtn.className = 'view-toggle-btn';
      cardViewBtn.textContent = 'Cards';
      cardViewBtn.setAttribute('aria-pressed', 'false');
      
      toggleContainer.appendChild(tableViewBtn);
      toggleContainer.appendChild(cardViewBtn);
      
      // Insert before table
      const tableWrapper = table.closest('.table-wrapper');
      if (tableWrapper) {
        tableWrapper.parentNode.insertBefore(toggleContainer, tableWrapper);
      }
      
      // Toggle functionality
      tableViewBtn.addEventListener('click', () => {
        tableCard.classList.remove('table-responsive-stack');
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        tableViewBtn.setAttribute('aria-pressed', 'true');
        cardViewBtn.setAttribute('aria-pressed', 'false');
      });
      
      cardViewBtn.addEventListener('click', () => {
        tableCard.classList.add('table-responsive-stack');
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        cardViewBtn.setAttribute('aria-pressed', 'true');
        tableViewBtn.setAttribute('aria-pressed', 'false');
      });
    });
  }

  // ============================================================================
  // TRUNCATED CELL TOOLTIPS
  // ============================================================================

  /**
   * Add tooltips to table cells that are truncated with text-overflow: ellipsis
   */
  function addTruncatedTooltips() {
    const cells = document.querySelectorAll('td, th');
    
    cells.forEach(cell => {
      // Check if text is truncated
      if (cell.offsetWidth < cell.scrollWidth) {
        const text = cell.textContent.trim();
        if (text && !cell.hasAttribute('title')) {
          cell.setAttribute('title', text);
        }
      }
    });
  }

  // ============================================================================
  // FOCUS MANAGEMENT
  // ============================================================================

  /**
   * Ensure focus is visible with proper outlines
   */
  function enhanceFocusManagement() {
    // Add focus-visible polyfill behavior
    let isMouseClick = false;
    
    document.addEventListener('mousedown', () => {
      isMouseClick = true;
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        isMouseClick = false;
      }
    });
    
    const focusableElements = document.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        if (!isMouseClick) {
          element.classList.add('keyboard-focus');
        }
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('keyboard-focus');
      });
    });
  }

  // ============================================================================
  // SEARCH INPUT ENHANCEMENT
  // ============================================================================

  /**
   * Add clear button to search inputs
   */
  function enhanceSearchInputs() {
    const searchWrappers = document.querySelectorAll('.search-input-wrapper, .search-box-unified');
    
    searchWrappers.forEach(wrapper => {
      const input = wrapper.querySelector('input[type="text"]');
      if (!input) return;
      
      // Check if already has clear button
      if (wrapper.querySelector('.search-clear-btn')) return;
      
      const clearBtn = document.createElement('button');
      clearBtn.className = 'search-clear-btn';
      clearBtn.innerHTML = '&times;';
      clearBtn.setAttribute('aria-label', 'Clear search');
      clearBtn.setAttribute('type', 'button');
      clearBtn.style.display = input.value ? 'block' : 'none';
      
      wrapper.appendChild(clearBtn);
      
      // Show/hide clear button based on input value
      input.addEventListener('input', () => {
        clearBtn.style.display = input.value ? 'block' : 'none';
      });
      
      // Clear input on button click
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        input.focus();
        // Trigger input event for any listeners
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
  }

  // ============================================================================
  // SIDEBAR KEYBOARD NAVIGATION
  // ============================================================================

  /**
   * Enhance sidebar navigation with keyboard shortcuts
   */
  function enhanceSidebarNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    
    navItems.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        let targetItem = null;
        
        switch(e.key) {
          case 'ArrowUp':
            targetItem = navItems[Math.max(0, index - 1)];
            e.preventDefault();
            break;
          case 'ArrowDown':
            targetItem = navItems[Math.min(navItems.length - 1, index + 1)];
            e.preventDefault();
            break;
          case 'Home':
            targetItem = navItems[0];
            e.preventDefault();
            break;
          case 'End':
            targetItem = navItems[navItems.length - 1];
            e.preventDefault();
            break;
        }
        
        if (targetItem) {
          targetItem.focus();
        }
      });
    });
  }

  // ============================================================================
  // TABLE SORTING ENHANCEMENT
  // ============================================================================

  /**
   * Add ARIA attributes for sortable table columns
   */
  function enhanceTableSorting() {
    const sortableHeaders = document.querySelectorAll('th.sortable');
    
    sortableHeaders.forEach(header => {
      // Add ARIA role and attributes
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      
      // Determine current sort state
      let sortState = 'none';
      if (header.classList.contains('asc')) {
        sortState = 'ascending';
      } else if (header.classList.contains('desc')) {
        sortState = 'descending';
      }
      
      header.setAttribute('aria-sort', sortState);
      
      // Add keyboard support
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  // ============================================================================
  // MODAL ACCESSIBILITY
  // ============================================================================

  /**
   * Trap focus within modals and restore focus on close
   */
  function enhanceModalAccessibility() {
    const modals = document.querySelectorAll('.modal, .openings-modal, .candidate-modal');
    
    modals.forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // Trap focus within modal
      modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
      
      // Close on Escape
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const closeBtn = modal.querySelector('.modal-close, .openings-modal-close');
          if (closeBtn) {
            closeBtn.click();
          }
        }
      });
      
      // Focus first element when modal opens
      const observer = new MutationObserver(() => {
        if (modal.style.display !== 'none' && !modal.classList.contains('hidden')) {
          firstElement.focus();
        }
      });
      
      observer.observe(modal, { attributes: true, attributeFilter: ['style', 'class'] });
    });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize all accessibility enhancements
   */
  function init() {
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runEnhancements);
    } else {
      runEnhancements();
    }
    
    // Re-run on dynamic content changes (for SPAs)
    const observer = new MutationObserver((mutations) => {
      // Debounce to avoid excessive re-runs
      clearTimeout(observer.timeout);
      observer.timeout = setTimeout(runEnhancements, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Run all enhancement functions
   */
  function runEnhancements() {
    try {
      enhancePagination();
      enhanceFocusManagement();
      enhanceSearchInputs();
      enhanceSidebarNavigation();
      enhanceTableSorting();
      enhanceModalAccessibility();
      addTruncatedTooltips();
      
      // Only add table toggle on mobile
      if (window.innerWidth <= 767) {
        addTableResponsiveToggle();
      }
    } catch (error) {
      console.warn('Unified UI enhancements error:', error);
    }
  }

  // ============================================================================
  // EXPORT & AUTO-INIT
  // ============================================================================

  // Auto-initialize
  init();

  // Export for manual initialization if needed
  if (typeof window !== 'undefined') {
    window.UnifiedUI = {
      init,
      enhancePagination,
      enhanceFocusManagement,
      enhanceSearchInputs,
      enhanceSidebarNavigation,
      enhanceTableSorting,
      enhanceModalAccessibility,
      addTruncatedTooltips,
      addTableResponsiveToggle
    };
  }

})();
