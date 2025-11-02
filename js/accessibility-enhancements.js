// Accessibility Enhancements
// WCAG 2.1 AA Compliance Features

// ========================================
// ARIA Labels and Semantic HTML
// ========================================
const AccessibilityManager = {
    init() {
        this.addARIALabels();
        this.enhanceKeyboardNavigation();
        this.addSkipLinks();
        this.improveFocusManagement();
        this.addScreenReaderAnnouncements();
        this.enhanceFormAccessibility();
    },
    
    addARIALabels() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            const text = btn.textContent.trim() || btn.getAttribute('title');
            if (text) {
                btn.setAttribute('aria-label', text);
            }
        });
        
        // Add roles to navigation
        document.querySelectorAll('.sidebar-menu').forEach(menu => {
            menu.setAttribute('role', 'navigation');
            menu.setAttribute('aria-label', 'Main navigation');
        });
        
        // Add landmarks
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.setAttribute('role', 'main');
            mainContent.setAttribute('aria-label', 'Main content');
        }
        
        const header = document.querySelector('.header');
        if (header) {
            header.setAttribute('role', 'banner');
        }
        
        // Add ARIA to stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.setAttribute('role', 'article');
            const label = card.querySelector('.stat-label')?.textContent;
            if (label) {
                card.setAttribute('aria-label', label);
            }
        });
        
        // Add ARIA to dashboard cards
        document.querySelectorAll('.dashboard-card').forEach(card => {
            card.setAttribute('role', 'region');
            const title = card.querySelector('.card-title')?.textContent;
            if (title) {
                card.setAttribute('aria-label', title);
            }
        });
    },
    
    enhanceKeyboardNavigation() {
        // Make all interactive elements keyboard accessible
        document.querySelectorAll('.stat-card, .dashboard-card').forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            // Add keyboard event listeners
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
        
        // Improve modal keyboard navigation
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const closeBtn = modal.querySelector('.close-btn');
                    if (closeBtn) closeBtn.click();
                }
                
                // Tab trap
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        });
        
        // Add visible focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 3px solid var(--primary);
                outline-offset: 2px;
                border-radius: 4px;
            }
            
            .stat-card:focus-visible,
            .dashboard-card:focus-visible {
                transform: translateY(-5px);
                box-shadow: 0 15px 30px rgba(74, 108, 247, 0.3);
            }
        `;
        document.head.appendChild(style);
    },
    
    addSkipLinks() {
        const isRTL = document.body.classList.contains('rtl');
        
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">
                ${isRTL ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content'}
            </a>
            <a href="#navigation" class="skip-link">
                ${isRTL ? 'الانتقال إلى القائمة' : 'Skip to navigation'}
            </a>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -100px;
                left: 0;
                z-index: 10000;
            }
            
            .skip-link {
                position: absolute;
                top: 0;
                left: -9999px;
                background: var(--primary);
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 0 0 8px 0;
                font-weight: 600;
            }
            
            .skip-link:focus {
                left: 0;
                top: 0;
                outline: 3px solid white;
            }
        `;
        document.head.appendChild(style);
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // Add IDs to targets
        const mainContent = document.querySelector('.main-content');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
        
        const navigation = document.querySelector('.sidebar-menu');
        if (navigation && !navigation.id) {
            navigation.id = 'navigation';
        }
    },
    
    improveFocusManagement() {
        // Save and restore focus when modals open/close
        let previousFocus = null;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList?.contains('modal') || node.classList?.contains('custom-modal')) {
                        previousFocus = document.activeElement;
                        
                        // Focus first interactive element in modal
                        setTimeout(() => {
                            const firstInput = node.querySelector('input, button, select, textarea');
                            if (firstInput) firstInput.focus();
                        }, 100);
                    }
                });
                
                mutation.removedNodes.forEach((node) => {
                    if (node.classList?.contains('modal') || node.classList?.contains('custom-modal')) {
                        if (previousFocus) {
                            previousFocus.focus();
                            previousFocus = null;
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    },
    
    addScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
        
        // Function to announce to screen readers
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
        
        // Announce page changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    const isRTL = document.body.classList.contains('rtl');
                    
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList?.contains('advanced-notification')) {
                            const message = node.textContent.trim();
                            window.announceToScreenReader(message);
                        }
                        
                        if (node.classList?.contains('modal-content')) {
                            const title = node.querySelector('.modal-title')?.textContent;
                            if (title) {
                                window.announceToScreenReader(
                                    `${isRTL ? 'نافذة جديدة:' : 'New dialog:'} ${title}`
                                );
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    },
    
    enhanceFormAccessibility() {
        // Associate labels with inputs
        document.querySelectorAll('input, select, textarea').forEach(input => {
            if (!input.id) {
                input.id = 'input-' + Math.random().toString(36).substr(2, 9);
            }
            
            // Find associated label
            const label = input.closest('.form-group')?.querySelector('label');
            if (label && !label.getAttribute('for')) {
                label.setAttribute('for', input.id);
            }
            
            // Add required indicator to screen readers
            if (input.required && !input.getAttribute('aria-required')) {
                input.setAttribute('aria-required', 'true');
            }
            
            // Add invalid state
            input.addEventListener('invalid', () => {
                input.setAttribute('aria-invalid', 'true');
            });
            
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.removeAttribute('aria-invalid');
                }
            });
        });
        
        // Add form error summary
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const invalidInputs = form.querySelectorAll(':invalid');
                
                if (invalidInputs.length > 0) {
                    e.preventDefault();
                    
                    const isRTL = document.body.classList.contains('rtl');
                    const errorSummary = document.createElement('div');
                    errorSummary.className = 'form-error-summary';
                    errorSummary.setAttribute('role', 'alert');
                    errorSummary.style.cssText = `
                        background: rgba(231, 76, 60, 0.1);
                        border: 2px solid #e74c3c;
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 20px;
                        color: #e74c3c;
                    `;
                    
                    errorSummary.innerHTML = `
                        <strong>${isRTL ? 'يرجى تصحيح الأخطاء التالية:' : 'Please correct the following errors:'}</strong>
                        <ul style="margin: 10px 0 0 20px;">
                            ${Array.from(invalidInputs).map(input => {
                                const label = form.querySelector(`label[for="${input.id}"]`)?.textContent || input.name;
                                return `<li>${label}: ${input.validationMessage}</li>`;
                            }).join('')}
                        </ul>
                    `;
                    
                    // Remove existing error summary
                    const existing = form.querySelector('.form-error-summary');
                    if (existing) existing.remove();
                    
                    form.insertBefore(errorSummary, form.firstChild);
                    errorSummary.focus();
                    
                    // Announce to screen reader
                    window.announceToScreenReader(
                        `${isRTL ? 'يوجد' : 'There are'} ${invalidInputs.length} ${isRTL ? 'أخطاء في النموذج' : 'errors in the form'}`
                    );
                }
            });
        });
    }
};

// ========================================
// Advanced Search with Filters
// ========================================
class AdvancedSearch {
    constructor(options = {}) {
        this.options = {
            placeholder: options.placeholder || 'Search...',
            filters: options.filters || [],
            onSearch: options.onSearch || this.defaultSearch,
            suggestions: options.suggestions || []
        };
        
        this.init();
    }
    
    init() {
        const isRTL = document.body.classList.contains('rtl');
        const searchContainer = document.createElement('div');
        searchContainer.className = 'advanced-search-container';
        searchContainer.style.cssText = `
            position: relative;
            max-width: 600px;
            margin: 20px auto;
        `;
        
        searchContainer.innerHTML = `
            <div style="position: relative;">
                <input 
                    type="text" 
                    class="advanced-search-input"
                    placeholder="${this.options.placeholder}"
                    autocomplete="off"
                    style="
                        width: 100%;
                        padding: 15px 50px 15px 20px;
                        border: 2px solid #e0e0e0;
                        border-radius: 12px;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    "
                />
                <button class="search-btn" style="
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: var(--primary);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    cursor: pointer;
                ">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            ${this.options.filters.length > 0 ? this.renderFilters() : ''}
            <div class="search-suggestions" style="
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                margin-top: 8px;
                max-height: 300px;
                overflow-y: auto;
                display: none;
                z-index: 1000;
            "></div>
        `;
        
        const header = document.querySelector('.header');
        if (header) {
            header.after(searchContainer);
        }
        
        this.attachEventListeners(searchContainer);
    }
    
    renderFilters() {
        const isRTL = document.body.classList.contains('rtl');
        
        return `
            <div class="search-filters" style="
                display: flex;
                gap: 10px;
                margin-top: 15px;
                flex-wrap: wrap;
            ">
                ${this.options.filters.map(filter => `
                    <label style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 15px;
                        background: rgba(74, 108, 247, 0.1);
                        border-radius: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <input type="checkbox" value="${filter.value}" />
                        <span>${filter.label}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }
    
    attachEventListeners(container) {
        const input = container.querySelector('.advanced-search-input');
        const searchBtn = container.querySelector('.search-btn');
        const suggestions = container.querySelector('.search-suggestions');
        
        // Search on button click
        searchBtn.addEventListener('click', () => {
            this.performSearch(input.value, container);
        });
        
        // Search on Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(input.value, container);
            }
        });
        
        // Show suggestions on input
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length >= 2) {
                const matches = this.options.suggestions.filter(s => 
                    s.toLowerCase().includes(query)
                );
                
                if (matches.length > 0) {
                    suggestions.innerHTML = matches.map(match => `
                        <div class="suggestion-item" style="
                            padding: 12px 20px;
                            cursor: pointer;
                            transition: background 0.2s ease;
                        ">
                            ${this.highlightMatch(match, query)}
                        </div>
                    `).join('');
                    
                    suggestions.style.display = 'block';
                    
                    // Click handler for suggestions
                    suggestions.querySelectorAll('.suggestion-item').forEach((item, index) => {
                        item.addEventListener('mouseenter', () => {
                            item.style.background = 'rgba(74, 108, 247, 0.1)';
                        });
                        item.addEventListener('mouseleave', () => {
                            item.style.background = 'transparent';
                        });
                        item.addEventListener('click', () => {
                            input.value = matches[index];
                            suggestions.style.display = 'none';
                            this.performSearch(matches[index], container);
                        });
                    });
                } else {
                    suggestions.style.display = 'none';
                }
            } else {
                suggestions.style.display = 'none';
            }
        });
        
        // Close suggestions on outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                suggestions.style.display = 'none';
            }
        });
    }
    
    highlightMatch(text, query) {
        const index = text.toLowerCase().indexOf(query);
        if (index === -1) return text;
        
        return text.substring(0, index) +
               '<strong style="color: var(--primary);">' +
               text.substring(index, index + query.length) +
               '</strong>' +
               text.substring(index + query.length);
    }
    
    performSearch(query, container) {
        const selectedFilters = Array.from(
            container.querySelectorAll('.search-filters input:checked')
        ).map(cb => cb.value);
        
        this.options.onSearch(query, selectedFilters);
        
        const isRTL = document.body.classList.contains('rtl');
        window.announceToScreenReader(
            `${isRTL ? 'تم البحث عن' : 'Searched for'}: ${query}`
        );
    }
    
    defaultSearch(query, filters) {
        console.log('Search:', query, 'Filters:', filters);
    }
}

// ========================================
// High Contrast Mode
// ========================================
const HighContrastMode = {
    enabled: false,
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('highContrast', this.enabled);
        this.apply();
    },
    
    apply() {
        if (this.enabled) {
            document.body.classList.add('high-contrast');
            const style = document.createElement('style');
            style.id = 'high-contrast-style';
            style.textContent = `
                .high-contrast {
                    filter: contrast(1.5);
                }
                .high-contrast a {
                    text-decoration: underline;
                }
                .high-contrast button,
                .high-contrast .card-btn {
                    border: 2px solid currentColor !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            document.body.classList.remove('high-contrast');
            const style = document.getElementById('high-contrast-style');
            if (style) style.remove();
        }
    },
    
    init() {
        if (localStorage.getItem('highContrast') === 'true') {
            this.enabled = true;
            this.apply();
        }
    }
};

// ========================================
// Initialize Accessibility Features
// ========================================
function initAccessibility() {
    AccessibilityManager.init();
    HighContrastMode.init();
    
    // Add accessibility toolbar
    addAccessibilityToolbar();
}

function addAccessibilityToolbar() {
    // Accessibility toolbar removed - features moved to settings page
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
    initAccessibility();
}

// Export for global use
window.AccessibilityManager = AccessibilityManager;
window.AdvancedSearch = AdvancedSearch;
window.HighContrastMode = HighContrastMode;
