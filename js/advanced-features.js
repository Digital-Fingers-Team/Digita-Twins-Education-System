// Advanced Dashboard Features
// Enhanced functionality for improved user experience

// ========================================
// Advanced Notification System
// ========================================
const AdvancedNotify = {
    container: null,
    queue: [],
    maxVisible: 3,
    
    init() {
        if (!this.container) {
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
                max-width: 400px;
            `;
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 3000, options = {}) {
        this.init();
        
        const isRTL = document.body.classList.contains('rtl');
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const colors = {
            success: '#00b894',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#4a6cf7'
        };
        
        const notification = document.createElement('div');
        notification.className = 'advanced-notification';
        notification.style.cssText = `
            background: white;
            border-left: 4px solid ${colors[type]};
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.3s ease-out;
            cursor: pointer;
            transition: all 0.3s ease;
            max-width: 100%;
        `;
        
        if (document.body.classList.contains('dark-mode')) {
            notification.style.background = '#1a1a2e';
            notification.style.color = '#e6e6e6';
        }
        
        notification.innerHTML = `
            <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 20px;"></i>
            <div style="flex: 1;">
                ${options.title ? `<div style="font-weight: 600; margin-bottom: 4px;">${options.title}</div>` : ''}
                <div style="font-size: 14px;">${message}</div>
            </div>
            ${options.action ? `<button onclick="${options.action}" style="
                background: ${colors[type]};
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">${options.actionText || 'Action'}</button>` : ''}
            <i class="fas fa-times" style="color: #999; cursor: pointer; font-size: 14px;"></i>
        `;
        
        // Close button handler
        const closeBtn = notification.querySelector('.fa-times');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(notification);
        });
        
        // Auto-close
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }
        
        // Hover to pause auto-close
        notification.addEventListener('mouseenter', () => {
            notification.dataset.paused = 'true';
        });
        
        notification.addEventListener('mouseleave', () => {
            delete notification.dataset.paused;
            if (duration > 0) {
                setTimeout(() => {
                    if (!notification.dataset.paused) {
                        this.remove(notification);
                    }
                }, 1000);
            }
        });
        
        this.container.appendChild(notification);
        
        // Limit visible notifications
        const notifications = this.container.querySelectorAll('.advanced-notification');
        if (notifications.length > this.maxVisible) {
            this.remove(notifications[0]);
        }
        
        return notification;
    },
    
    remove(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },
    
    success(message, options = {}) {
        return this.show(message, 'success', options.duration || 3000, options);
    },
    
    error(message, options = {}) {
        return this.show(message, 'error', options.duration || 5000, options);
    },
    
    warning(message, options = {}) {
        return this.show(message, 'warning', options.duration || 4000, options);
    },
    
    info(message, options = {}) {
        return this.show(message, 'info', options.duration || 3000, options);
    }
};

// Add animation styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .advanced-notification:hover {
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// Data Export Functionality
// ========================================
const DataExporter = {
    exportToCSV(data, filename = 'export.csv') {
        const isRTL = document.body.classList.contains('rtl');
        
        if (!data || data.length === 0) {
            AdvancedNotify.warning(isRTL ? 'لا توجد بيانات للتصدير' : 'No data to export');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            }).join(','))
        ].join('\n');
        
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, filename);
        
        AdvancedNotify.success(isRTL ? 'تم التصدير بنجاح' : 'Exported successfully');
    },
    
    exportToJSON(data, filename = 'export.json') {
        const isRTL = document.body.classList.contains('rtl');
        
        if (!data) {
            AdvancedNotify.warning(isRTL ? 'لا توجد بيانات للتصدير' : 'No data to export');
            return;
        }
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        this.downloadFile(blob, filename);
        
        AdvancedNotify.success(isRTL ? 'تم التصدير بنجاح' : 'Exported successfully');
    },
    
    exportTableToCSV(tableSelector, filename = 'table-export.csv') {
        const table = document.querySelector(tableSelector);
        const isRTL = document.body.classList.contains('rtl');
        
        if (!table) {
            AdvancedNotify.error(isRTL ? 'الجدول غير موجود' : 'Table not found');
            return;
        }
        
        const rows = Array.from(table.querySelectorAll('tr'));
        const csv = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            return cells.map(cell => {
                const text = cell.textContent.trim();
                return text.includes(',') ? `"${text}"` : text;
            }).join(',');
        }).join('\n');
        
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, filename);
        
        AdvancedNotify.success(isRTL ? 'تم تصدير الجدول بنجاح' : 'Table exported successfully');
    },
    
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    
    printContent(selector) {
        const element = document.querySelector(selector);
        const isRTL = document.body.classList.contains('rtl');
        
        if (!element) {
            AdvancedNotify.error(isRTL ? 'العنصر غير موجود' : 'Element not found');
            return;
        }
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="${isRTL ? 'rtl' : 'ltr'}">
            <head>
                <title>Print</title>
                <style>
                    body { font-family: 'Tajawal', Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: ${isRTL ? 'right' : 'left'}; }
                    th { background-color: #f4f4f4; }
                    @media print {
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                ${element.outerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }
};

// ========================================
// Advanced Table Filters & Sorting
// ========================================
class TableEnhancer {
    constructor(tableSelector) {
        this.table = document.querySelector(tableSelector);
        if (!this.table) return;
        
        this.tbody = this.table.querySelector('tbody');
        this.thead = this.table.querySelector('thead');
        this.rows = Array.from(this.tbody?.querySelectorAll('tr') || []);
        this.originalOrder = [...this.rows];
        
        this.initSorting();
        this.addTableActions();
    }
    
    initSorting() {
        if (!this.thead) return;
        
        const headers = this.thead.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            header.style.position = 'relative';
            
            const sortIcon = document.createElement('i');
            sortIcon.className = 'fas fa-sort';
            sortIcon.style.cssText = 'margin-left: 8px; font-size: 12px; opacity: 0.5;';
            header.appendChild(sortIcon);
            
            header.addEventListener('click', () => this.sortTable(index, header, sortIcon));
        });
    }
    
    sortTable(columnIndex, header, icon) {
        const isAscending = header.dataset.order !== 'asc';
        header.dataset.order = isAscending ? 'asc' : 'desc';
        
        // Update icon
        icon.className = isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down';
        
        // Reset other headers
        this.thead.querySelectorAll('th').forEach(th => {
            if (th !== header) {
                th.dataset.order = '';
                const otherIcon = th.querySelector('i');
                if (otherIcon) otherIcon.className = 'fas fa-sort';
            }
        });
        
        // Sort rows
        const sortedRows = [...this.rows].sort((a, b) => {
            const aValue = a.cells[columnIndex]?.textContent.trim() || '';
            const bValue = b.cells[columnIndex]?.textContent.trim() || '';
            
            // Try numeric comparison first
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAscending ? aNum - bNum : bNum - aNum;
            }
            
            // String comparison
            return isAscending 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        
        // Update DOM
        sortedRows.forEach(row => this.tbody.appendChild(row));
        this.rows = sortedRows;
    }
    
    addTableActions() {
        const isRTL = document.body.classList.contains('rtl');
        
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        `;
        
        actionsDiv.innerHTML = `
            <button class="table-action-btn" onclick="DataExporter.exportTableToCSV('${this.table.className}', 'data.csv')">
                <i class="fas fa-file-csv"></i>
                ${isRTL ? 'تصدير CSV' : 'Export CSV'}
            </button>
            <button class="table-action-btn" onclick="DataExporter.printContent('.${this.table.className}')">
                <i class="fas fa-print"></i>
                ${isRTL ? 'طباعة' : 'Print'}
            </button>
            <input type="text" class="table-search" placeholder="${isRTL ? 'بحث في الجدول...' : 'Search table...'}" />
        `;
        
        this.table.parentNode.insertBefore(actionsDiv, this.table);
        
        // Search functionality
        const searchInput = actionsDiv.querySelector('.table-search');
        searchInput.style.cssText = `
            padding: 8px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            flex: 1;
            min-width: 200px;
        `;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
        
        // Style action buttons
        const style = document.createElement('style');
        style.textContent = `
            .table-action-btn {
                background: var(--primary);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            .table-action-btn:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// Drag & Drop File Upload
// ========================================
class DragDropUpload {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.options = {
            maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB
            acceptedTypes: options.acceptedTypes || ['image/*', '.pdf', '.doc', '.docx'],
            onUpload: options.onUpload || this.defaultUpload,
            multiple: options.multiple !== false
        };
        
        this.init();
    }
    
    init() {
        const isRTL = document.body.classList.contains('rtl');
        
        this.container.innerHTML = `
            <div class="drop-zone" style="
                border: 2px dashed var(--primary);
                border-radius: 12px;
                padding: 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(74, 108, 247, 0.05);
            ">
                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: var(--primary); margin-bottom: 15px;"></i>
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                    ${isRTL ? 'اسحب وأفلت الملفات هنا' : 'Drag & Drop files here'}
                </div>
                <div style="font-size: 14px; color: var(--text-light); margin-bottom: 15px;">
                    ${isRTL ? 'أو' : 'or'}
                </div>
                <button class="browse-btn" style="
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    ${isRTL ? 'تصفح الملفات' : 'Browse Files'}
                </button>
                <input type="file" style="display: none;" ${this.options.multiple ? 'multiple' : ''} 
                       accept="${this.options.acceptedTypes.join(',')}">
            </div>
            <div class="upload-progress" style="margin-top: 20px;"></div>
        `;
        
        const dropZone = this.container.querySelector('.drop-zone');
        const fileInput = this.container.querySelector('input[type="file"]');
        const browseBtn = this.container.querySelector('.browse-btn');
        const progressContainer = this.container.querySelector('.upload-progress');
        
        // Browse button click
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
        
        // Drop zone click
        dropZone.addEventListener('click', () => fileInput.click());
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files, progressContainer);
        });
        
        // Drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.style.borderColor = 'var(--accent)';
                dropZone.style.background = 'rgba(0, 184, 148, 0.1)';
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.style.borderColor = 'var(--primary)';
                dropZone.style.background = 'rgba(74, 108, 247, 0.05)';
            });
        });
        
        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFiles(files, progressContainer);
        });
    }
    
    handleFiles(files, progressContainer) {
        const isRTL = document.body.classList.contains('rtl');
        progressContainer.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            if (file.size > this.options.maxSize) {
                AdvancedNotify.error(
                    `${file.name}: ${isRTL ? 'الملف كبير جداً' : 'File too large'}`,
                    { duration: 3000 }
                );
                return;
            }
            
            const progressItem = document.createElement('div');
            progressItem.style.cssText = `
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            
            progressItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 600;">${file.name}</span>
                    <span style="color: var(--text-light);">${this.formatFileSize(file.size)}</span>
                </div>
                <div style="background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div class="progress-bar" style="
                        height: 100%;
                        width: 0%;
                        background: linear-gradient(90deg, var(--primary), var(--accent));
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div class="status" style="margin-top: 8px; font-size: 12px; color: var(--text-light);"></div>
            `;
            
            progressContainer.appendChild(progressItem);
            
            this.uploadFile(file, progressItem);
        });
    }
    
    uploadFile(file, progressItem) {
        const progressBar = progressItem.querySelector('.progress-bar');
        const status = progressItem.querySelector('.status');
        const isRTL = document.body.classList.contains('rtl');
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                status.textContent = isRTL ? 'تم الرفع بنجاح' : 'Upload complete';
                status.style.color = 'var(--accent)';
                progressBar.parentElement.style.background = 'rgba(0, 184, 148, 0.2)';
                
                AdvancedNotify.success(
                    `${file.name} ${isRTL ? 'تم رفعه بنجاح' : 'uploaded successfully'}`
                );
                
                if (this.options.onUpload) {
                    this.options.onUpload(file);
                }
            }
            progressBar.style.width = progress + '%';
            status.textContent = `${isRTL ? 'جاري الرفع...' : 'Uploading...'} ${Math.round(progress)}%`;
        }, 200);
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    defaultUpload(file) {
        console.log('File uploaded:', file);
    }
}

// ========================================
// Smart Caching System
// ========================================
const CacheManager = {
    prefix: 'dt_edu_cache_',
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    
    set(key, value, ttl = this.defaultTTL) {
        const item = {
            value: value,
            expiry: Date.now() + ttl
        };
        localStorage.setItem(this.prefix + key, JSON.stringify(item));
    },
    
    get(key) {
        const itemStr = localStorage.getItem(this.prefix + key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
            localStorage.removeItem(this.prefix + key);
            return null;
        }
        
        return item.value;
    },
    
    remove(key) {
        localStorage.removeItem(this.prefix + key);
    },
    
    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    },
    
    async fetchWithCache(url, options = {}) {
        const cacheKey = url;
        const cached = this.get(cacheKey);
        
        if (cached && !options.forceRefresh) {
            return cached;
        }
        
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            this.set(cacheKey, data, options.ttl);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return cached || null;
        }
    }
};

// ========================================
// Initialize Advanced Features
// ========================================
function initAdvancedFeatures() {
    // Initialize notification system
    AdvancedNotify.init();
    
    // Enhance all tables
    document.querySelectorAll('.attendance-table, .content-list').forEach((table, index) => {
        if (table.tagName === 'TABLE') {
            new TableEnhancer(`.${table.className.split(' ')[0]}`);
        }
    });
    
    // Add export buttons to stat cards
    addExportButtons();
    
    // Initialize tooltips
    initTooltips();
}

function addExportButtons() {
    const isRTL = document.body.classList.contains('rtl');
    const statsCards = document.querySelector('.stats-cards');
    
    if (statsCards && !document.getElementById('export-stats-btn')) {
        const exportBtn = document.createElement('button');
        exportBtn.id = 'export-stats-btn';
        exportBtn.innerHTML = `<i class="fas fa-download"></i> ${isRTL ? 'تصدير الإحصائيات' : 'Export Stats'}`;
        exportBtn.style.cssText = `
            position: absolute;
            top: -50px;
            right: 20px;
            background: var(--primary);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        
        exportBtn.addEventListener('click', () => {
            const stats = Array.from(document.querySelectorAll('.stat-card')).map(card => ({
                label: card.querySelector('.stat-label')?.textContent || '',
                value: card.querySelector('.stat-value')?.textContent || ''
            }));
            
            DataExporter.exportToCSV(stats, 'statistics.csv');
        });
        
        statsCards.style.position = 'relative';
        statsCards.appendChild(exportBtn);
    }
}

function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.style.position = 'relative';
        element.style.cursor = 'help';
        
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10000;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-bottom: 8px;
                pointer-events: none;
                animation: fadeIn 0.2s ease;
            `;
            
            this.appendChild(tooltip);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.custom-tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedFeatures);
} else {
    initAdvancedFeatures();
}

// Export for global use
window.AdvancedNotify = AdvancedNotify;
window.DataExporter = DataExporter;
window.TableEnhancer = TableEnhancer;
window.DragDropUpload = DragDropUpload;
window.CacheManager = CacheManager;
