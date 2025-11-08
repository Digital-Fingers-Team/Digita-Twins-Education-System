// the following is the completed code for DTES/js/dashboard-enhancements.js:
// Dashboard Interactive Enhancements
// Real-time updates, notifications, and interactive features

// Real-time Clock
function initRealTimeClock() {
    const clockElements = document.querySelectorAll('.real-time-clock');
    if (clockElements.length === 0) {
        // Create clock if not exists
        const header = document.querySelector('.header');
        if (header) {
            const clockDiv = document.createElement('div');
            clockDiv.className = 'real-time-clock';
            clockDiv.style.cssText = `
                font-size: 14px;
                color: var(--text-light);
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            header.querySelector('.header-actions')?.prepend(clockDiv);
            updateClock(clockDiv);
        }
    } else {
        clockElements.forEach(updateClock);
    }
    
    function updateClock(element) {
        setInterval(() => {
            const now = new Date();
            const isRTL = document.body.classList.contains('rtl');
            const timeString = now.toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            element.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>${dateString} - ${timeString}</span>
            `;
        }, 1000);
    }
}

// Quick Stats Animation on Load
function animateStatsOnLoad() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((stat, index) => {
        const finalValue = parseInt(stat.textContent) || 0;
        stat.textContent = '0';
        
        setTimeout(() => {
            let current = 0;
            const increment = finalValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalValue) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 20);
        }, index * 100);
    });
}

// Interactive Search Bar
function initSearchBar() {
    const dashboardGrid = document.querySelector('.dashboard-grid');
    const statsCards = document.querySelector('.stats-cards');
    
    if (!dashboardGrid && !statsCards) return;
    
    // Check if search bar already exists
    if (document.getElementById('dashboard-search')) return;
    
    const header = document.querySelector('.header');
    if (!header) return;
    
    const searchDiv = document.createElement('div');
    searchDiv.style.cssText = `
        flex: 1;
        max-width: 400px;
        margin: 0 20px;
    `;
    
    const isRTL = document.body.classList.contains('rtl');
    
    searchDiv.innerHTML = `
        <div style="position: relative;">
            <input 
                type="text" 
                id="dashboard-search" 
                placeholder="${isRTL ? 'ابحث في لوحة التحكم...' : 'Search dashboard...'}"
                style="
                    width: 100%;
                    padding: 10px 15px 10px 40px;
                    border: 2px solid #e0e0e0;
                    border-radius: 25px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    background: white;
                "
            />
            <i class="fas fa-search" style="
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-light);
            "></i>
        </div>
    `;
    
    const headerActions = header.querySelector('.header-actions');
    if (headerActions && headerActions.previousElementSibling) {
        header.insertBefore(searchDiv, headerActions);
    }
    
    const searchInput = document.getElementById('dashboard-search');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        // Search in dashboard cards
        document.querySelectorAll('.dashboard-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });
        
        // Search in stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });
    });
    
    // Focus effect
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary)';
        this.style.boxShadow = '0 0 0 3px rgba(74, 108, 247, 0.2)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = '#e0e0e0';
        this.style.boxShadow = 'none';
    });
}

// Progress Bars for Stats
function enhanceStatsWithProgress() {
    document.querySelectorAll('.stat-card').forEach(card => {
        const value = card.querySelector('.stat-value');
        if (!value) return;
        
        const numValue = parseInt(value.textContent);
        if (isNaN(numValue) || numValue > 100) return;
        
        // Check if progress bar already exists
        if (card.querySelector('.progress-bar')) return;
        
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 100%;
            height: 4px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 2px;
            margin-top: 10px;
            overflow: hidden;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            height: 100%;
            width: 0;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            border-radius: 2px;
            transition: width 1s ease-out;
        `;
        
        progressContainer.appendChild(progressBar);
        card.querySelector('.stat-info').appendChild(progressContainer);
        
        setTimeout(() => {
            progressBar.style.width = numValue + '%';
        }, 100);
    });
}

// Quick Actions Menu
function initQuickActions() {
    const isRTL = document.body.classList.contains('rtl');
    
    // Check if already exists
    if (document.getElementById('quick-actions-btn')) return;
    
    const quickActionsBtn = document.createElement('button');
    quickActionsBtn.id = 'quick-actions-btn';
    quickActionsBtn.innerHTML = `<i class="fas fa-plus"></i>`;
    quickActionsBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        ${isRTL ? 'left' : 'right'}: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(74, 108, 247, 0.4);
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    quickActionsBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(90deg)';
        this.style.boxShadow = '0 6px 20px rgba(74, 108, 247, 0.6)';
    });
    
    quickActionsBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.boxShadow = '0 4px 15px rgba(74, 108, 247, 0.4)';
    });
    
    quickActionsBtn.addEventListener('click', showQuickActionsMenu);
    
    document.body.appendChild(quickActionsBtn);
}

function showQuickActionsMenu() {
    const isRTL = document.body.classList.contains('rtl');
    const currentUser = SessionManager.getCurrentUser();
    
    let actions = [];
    
    if (currentUser) {
        switch(currentUser.type) {
            case 'student':
                actions = [
                    { icon: 'book', text: isRTL ? 'عرض الواجبات' : 'View Homework', action: () => window.location.href = 'student-courses.html' },
                    { icon: 'calendar', text: isRTL ? 'الجدول الدراسي' : 'Schedule', action: () => window.location.href = 'student-schedule.html' },
                    { icon: 'chalkboard-teacher', text: isRTL ? 'الفصل الافتراضي' : 'Virtual Classroom', action: () => window.location.href = 'classroom.html' },
                    { icon: 'comments', text: isRTL ? 'الرسائل' : 'Messages', action: () => window.location.href = 'student-messages.html' }
                ];
                break;
            case 'teacher':
                actions = [
                    { icon: 'users', text: isRTL ? 'إدارة الطلاب' : 'Manage Students', action: () => alert('Feature coming soon!') },
                    { icon: 'clipboard-list', text: isRTL ? 'إنشاء واجب' : 'Create Assignment', action: () => alert('Feature coming soon!') },
                    { icon: 'chalkboard-teacher', text: isRTL ? 'الفصل الافتراضي' : 'Virtual Classroom', action: () => window.location.href = 'classroom.html' },
                    { icon: 'chart-bar', text: isRTL ? 'التقارير' : 'Reports', action: () => window.location.href = 'teacher-progress.html' }
                ];
                break;
            case 'parent':
                actions = [
                    { icon: 'child', text: isRTL ? 'بيانات الأبناء' : 'Children Data', action: () => window.location.href = 'parent-children.html' },
                    { icon: 'chart-line', text: isRTL ? 'الدرجات' : 'Grades', action: () => window.location.href = 'parent-grades.html' },
                    { icon: 'calendar-check', text: isRTL ? 'الحضور' : 'Attendance', action: () => window.location.href = 'parent-attendance.html' },
                    { icon: 'money-bill', text: isRTL ? 'المدفوعات' : 'Payments', action: () => window.location.href = 'parent-payments.html' }
                ];
                break;
            case 'admin':
                actions = [
                    { icon: 'users-cog', text: isRTL ? 'إدارة المستخدمين' : 'Manage Users', action: () => window.location.href = 'admin-users.html' },
                    { icon: 'chart-bar', text: isRTL ? 'التقارير' : 'Reports', action: () => window.location.href = 'admin-reports.html' },
                    { icon: 'calendar-alt', text: isRTL ? 'الجدول المدرسي' : 'School Schedule', action: () => window.location.href = 'admin-schedule.html' },
                    { icon: 'cogs', text: isRTL ? 'الإعدادات' : 'Settings', action: () => window.location.href = 'admin-settings.html' }
                ];
                break;
        }
    }
    
    const menuHtml = actions.map((action, index) => `
        <div class="quick-action-item" data-index="${index}" style="
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 1px solid #eee;
        ">
            <i class="fas fa-${action.icon}" style="font-size: 18px; color: var(--primary); width: 24px;"></i>
            <span style="flex: 1;">${action.text}</span>
        </div>
    `).join('');
    
    const modal = ModalManager.show(
        isRTL ? 'الإجراءات السريعة' : 'Quick Actions',
        menuHtml,
        { width: '400px' }
    );
    
    // Add click handlers
    modal.querySelectorAll('.quick-action-item').forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(74, 108, 247, 0.1)';
            this.style.transform = 'translateX(' + (isRTL ? '5px' : '-5px') + ')';
        });
        item.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.transform = 'translateX(0)';
        });
        item.addEventListener('click', () => {
            actions[index].action();
            ModalManager.close(modal);
        });
    });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('dashboard-search');
            if (searchInput) searchInput.focus();
        }
        
        // Ctrl/Cmd + Q for quick actions
        if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
            e.preventDefault();
            showQuickActionsMenu();
        }
        
        // Esc to close modals
        if (e.key === 'Escape') {
            const modal = document.querySelector('.custom-modal');
            if (modal) ModalManager.close(modal);
        }
    });
}

// Auto-save form data
function initAutoSave() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formId = form.id || 'form-' + Math.random().toString(36).substr(2, 9);
        form.id = formId;
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Load saved data
            const savedValue = localStorage.getItem(`autosave_${formId}_${input.name}`);
            if (savedValue && !input.value) {
                input.value = savedValue;
            }
            
            // Save on change
            input.addEventListener('change', () => {
                localStorage.setItem(`autosave_${formId}_${input.name}`, input.value);
            });
        });
        
        // Clear on submit
        form.addEventListener('submit', () => {
            inputs.forEach(input => {
                localStorage.removeItem(`autosave_${formId}_${input.name}`);
            });
        });
    });
}

// Offline Detection
function initOfflineDetection() {
    window.addEventListener('offline', () => {
        notify.show(
            document.body.classList.contains('rtl') 
                ? 'لا يوجد اتصال بالإنترنت' 
                : 'No internet connection',
            'warning',
            0
        );
    });
    
    window.addEventListener('online', () => {
        notify.show(
            document.body.classList.contains('rtl') 
                ? 'تم استعادة الاتصال بالإنترنت' 
                : 'Internet connection restored',
            'success'
        );
    });
}

// Periodic Data Refresh (simulated)
function initPeriodicRefresh() {
    // Simulate refreshing data every 30 seconds
    setInterval(() => {
        const statCards = document.querySelectorAll('.stat-value');
        statCards.forEach(card => {
            const currentValue = parseInt(card.textContent) || 0;
            // Simulate small random changes
            const change = Math.floor(Math.random() * 3) - 1;
            const newValue = Math.max(0, Math.min(100, currentValue + change));
            if (newValue !== currentValue) {
                DataAnimator.highlightElement(card);
                setTimeout(() => {
                    card.textContent = newValue + (card.textContent.includes('%') ? '%' : '');
                }, 300);
            }
        });
    }, 30000);
}

// Initialize all enhancements
function initAllEnhancements() {
    // Check if user is authenticated
    if (!SessionManager.requireAuth()) return;
    
    // Update user info
    SessionManager.updateUserInfo('user-name');
    
    // Initialize features
    setTimeout(() => {
        initRealTimeClock();
        animateStatsOnLoad();
        initSearchBar();
        enhanceStatsWithProgress();
        initQuickActions();
        initKeyboardShortcuts();
        initAutoSave();
        initOfflineDetection();
        initPeriodicRefresh();
    }, 100);
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllEnhancements);
} else {
    initAllEnhancements();
}

// Export for external use
window.DashboardEnhancements = {
    initRealTimeClock,
    animateStatsOnLoad,
    initSearchBar,
    enhanceStatsWithProgress,
    initQuickActions,
    showQuickActionsMenu
};
