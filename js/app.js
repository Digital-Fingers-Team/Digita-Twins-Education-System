// DT Edu - Enhanced Interactive Features
// Shared utility functions for all dashboards

// Enhanced Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            `;
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        const id = Date.now();
        
        const colors = {
            success: { bg: '#00b894', icon: 'check-circle' },
            error: { bg: '#e74c3c', icon: 'exclamation-circle' },
            warning: { bg: '#f39c12', icon: 'exclamation-triangle' },
            info: { bg: '#4a6cf7', icon: 'info-circle' }
        };

        const config = colors[type] || colors.info;

        notification.style.cssText = `
            background: ${config.bg};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.3s ease-out;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        notification.innerHTML = `
            <i class="fas fa-${config.icon}" style="font-size: 20px;"></i>
            <span style="flex: 1;">${message}</span>
            <i class="fas fa-times" style="opacity: 0.7; cursor: pointer;"></i>
        `;

        notification.onclick = () => this.remove(notification);

        this.container.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }

        return notification;
    }

    remove(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Loading Overlay
class LoadingOverlay {
    constructor() {
        this.overlay = null;
    }

    show(message = 'Loading...') {
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 99999;
        `;

        this.overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="
                    border: 5px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top: 5px solid white;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p style="font-size: 18px; font-weight: 600;">${message}</p>
            </div>
        `;

        document.body.appendChild(this.overlay);
    }

    hide() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                if (this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
            }, 300);
        }
    }
}

// Interactive Data Animations
class DataAnimator {
    static animateValue(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    static highlightElement(element, color = '#00b894') {
        const originalBg = element.style.background;
        element.style.transition = 'all 0.3s ease';
        element.style.background = color;
        element.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            element.style.background = originalBg;
            element.style.transform = 'scale(1)';
        }, 500);
    }
}

// Modal Manager
class ModalManager {
    static show(title, content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.style.cssText = `
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            padding: 20px;
            animation: fadeIn 0.3s ease-out;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: ${options.width || '600px'};
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s ease-out;
        `;

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 15px;">
                <h2 style="color: #4a6cf7; margin: 0;">${title}</h2>
                <button class="modal-close" style="
                    background: transparent;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    transition: color 0.3s;
                ">&times;</button>
            </div>
            <div class="modal-body">${content}</div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close handlers
        const closeBtn = modalContent.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close(modal);
        });

        return modal;
    }

    static close(modal) {
        modal.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Form Validator
class FormValidator {
    static validate(form) {
        const errors = [];
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                errors.push(`${input.name || 'Field'} is required`);
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#00b894';
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static clearErrors(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.borderColor = '#e0e0e0';
        });
    }
}

// Chart Helper
class ChartHelper {
    static createBarChart(ctx, labels, data, options = {}) {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: options.label || 'Data',
                    data: data,
                    backgroundColor: options.colors || [
                        'rgba(74, 108, 247, 0.8)',
                        'rgba(0, 184, 148, 0.8)',
                        'rgba(243, 156, 18, 0.8)',
                        'rgba(108, 92, 231, 0.8)',
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(52, 152, 219, 0.8)'
                    ],
                    borderRadius: 8,
                    hoverBackgroundColor: options.hoverColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: options.showLegend || false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: options.maxValue || undefined
                    }
                }
            }
        });
    }

    static createLineChart(ctx, labels, datasets, options = {}) {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: options.showLegend !== false,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Search and Filter
class SearchFilter {
    static filterTable(searchInput, table) {
        const filter = searchInput.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    }

    static filterCards(searchInput, cardsContainer) {
        const filter = searchInput.value.toLowerCase();
        const cards = cardsContainer.querySelectorAll('.dashboard-card, .stat-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(filter) ? '' : 'none';
        });
    }
}

// User Session Manager
class SessionManager {
    static getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    static updateUserInfo(elementId) {
        const user = this.getCurrentUser();
        if (user) {
            const element = document.getElementById(elementId);
            if (element) {
                const isRTL = document.body.classList.contains('rtl');
                element.textContent = isRTL ? user.name : (user.nameEn || user.name);
            }
        }
    }

    static requireAuth() {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    static logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Export Enhancement Animations
const enhanceAnimations = () => {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .animate-pulse {
            animation: pulse 2s infinite;
        }
        
        .animate-shake {
            animation: shake 0.5s;
        }
        
        /* Smooth transitions for all interactive elements */
        .stat-card, .dashboard-card, .card-btn, .submit-btn {
            transition: all 0.3s ease;
        }
        
        /* Hover effects */
        .stat-card:hover, .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        /* Button effects */
        .card-btn:active, .submit-btn:active {
            transform: scale(0.95);
        }
        
        /* Loading skeleton */
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAnimations);
} else {
    enhanceAnimations();
}

// Global instances
window.notify = new NotificationSystem();
window.loading = new LoadingOverlay();
window.DataAnimator = DataAnimator;
window.ModalManager = ModalManager;
window.FormValidator = FormValidator;
window.ChartHelper = ChartHelper;
window.SearchFilter = SearchFilter;
window.SessionManager = SessionManager;
