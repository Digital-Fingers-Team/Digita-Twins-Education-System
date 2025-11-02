# 🚀 Quick Reference Card - DT Edu System

## 🔐 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Teacher | `teacher_math` | `teacher123` |
| Student | `student1` | `student123` |
| Parent | `parent1` | `parent123` |

*All teacher accounts: `teacher_[subject]` / `teacher123`*  
*All student accounts: `student1` to `student12` / `student123`*  
*All parent accounts: `parent1` to `parent12` / `parent123`*

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search bar |
| `Ctrl/Cmd + Q` | Open quick actions menu |
| `Esc` | Close modals |

---

## 🛠️ JavaScript API Reference

### Notifications
```javascript
// Show notification
window.notify.show('Message', 'success', 3000);
// Types: 'success', 'error', 'warning', 'info'
// Duration: milliseconds (0 = persistent)
```

### Loading Overlay
```javascript
// Show loading
window.loading.show('Loading message...');

// Hide loading
window.loading.hide();
```

### Modals
```javascript
// Show modal
const modal = window.ModalManager.show(
    'Title',
    '<p>Content HTML</p>',
    { width: '600px' }
);

// Close modal
window.ModalManager.close(modal);
```

### Data Animation
```javascript
// Animate number change
window.DataAnimator.animateValue(element, startValue, endValue, 1000);

// Highlight element
window.DataAnimator.highlightElement(element, '#00b894');
```

### Form Validation
```javascript
// Validate form
const result = window.FormValidator.validate(formElement);
if (result.isValid) {
    // Submit
} else {
    console.log(result.errors);
}

// Clear validation
window.FormValidator.clearErrors(formElement);
```

### Charts
```javascript
// Create bar chart
const chart = window.ChartHelper.createBarChart(
    ctx,
    ['Label1', 'Label2'],
    [10, 20],
    { label: 'Data', maxValue: 100 }
);

// Create line chart
const lineChart = window.ChartHelper.createLineChart(
    ctx,
    labels,
    datasets,
    { showLegend: true }
);
```

### Session Management
```javascript
// Get current user
const user = window.SessionManager.getCurrentUser();

// Update user info in element
window.SessionManager.updateUserInfo('user-name');

// Require authentication
if (!window.SessionManager.requireAuth()) {
    // Redirects to login if not authenticated
}

// Logout
window.SessionManager.logout();
```

### Search & Filter
```javascript
// Filter table
window.SearchFilter.filterTable(searchInput, tableElement);

// Filter cards
window.SearchFilter.filterCards(searchInput, cardsContainer);
```

---

## 🎨 CSS Classes

### Animation Classes
```css
.animate-pulse        /* Pulsing animation */
.animate-shake        /* Shake animation */
.skeleton            /* Loading skeleton */
```

### Utility Classes
```css
.stat-card           /* Hover effects enabled */
.dashboard-card      /* Hover effects enabled */
.card-btn            /* Button styling */
.submit-btn          /* Submit button styling */
```

---

## 📁 File Structure

```
finsh dt/
├── index.html                    # Login page
├── parent-dashboard.html         # Parent dashboard
├── student-dashboard.html        # Student dashboard
├── teacher-dashboard.html        # Teacher dashboard
├── admin-dashboard.html          # Admin dashboard
├── classroom.html               # 3D Virtual classroom
│
├── js/
│   ├── app.js                   # Core utilities (521 lines)
│   └── dashboard-enhancements.js # Interactive features (452 lines)
│
└── [Other dashboard pages...]
```

---

## 🔧 Common Tasks

### Add New Notification
```javascript
window.notify.show('Your message', 'success', 3000);
```

### Show Loading During Async Operation
```javascript
window.loading.show('Processing...');

// Your async operation
setTimeout(() => {
    window.loading.hide();
    window.notify.show('Complete!', 'success');
}, 2000);
```

### Create Custom Modal
```javascript
const content = `
    <div class="form-group">
        <label>Name</label>
        <input type="text" id="name" />
    </div>
    <button onclick="submitForm()" class="submit-btn">Submit</button>
`;

window.ModalManager.show('Form Title', content);
```

### Validate and Submit Form
```javascript
document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const validation = window.FormValidator.validate(e.target);
    
    if (validation.isValid) {
        window.loading.show('Submitting...');
        // Submit logic here
    } else {
        window.notify.show('Please fill all required fields', 'error');
    }
});
```

### Update Chart Data
```javascript
// Assuming you stored the chart instance
if (window.myChartInstance) {
    window.myChartInstance.data.datasets[0].data = [10, 20, 30];
    window.myChartInstance.update('active'); // Animated update
}
```

---

## 🎯 Feature Toggles

### Enable/Disable Features
```javascript
// Dashboard enhancements initialize automatically
// To disable specific features, remove from initAllEnhancements() in dashboard-enhancements.js

// Example - disable specific feature:
// Comment out in dashboard-enhancements.js:
// initQuickActions(); // Disabled
```

---

## 🐛 Debugging

### Check Current User
```javascript
console.log(window.SessionManager.getCurrentUser());
```

### Check Saved Language
```javascript
console.log(localStorage.getItem('language'));
```

### Check Dark Mode State
```javascript
console.log(localStorage.getItem('darkMode'));
```

### Clear All Local Storage
```javascript
localStorage.clear();
window.location.reload();
```

---

## 📊 Performance Tips

1. **Use CSS for animations** instead of JavaScript when possible
2. **Batch DOM updates** to minimize reflows
3. **Use transform** instead of position changes
4. **Debounce** search input handlers for large datasets
5. **Lazy load** heavy components

---

## 🌐 Language Support

### Switch Language Programmatically
```javascript
// In dashboard pages
switchToArabic();  // Switch to Arabic
switchToEnglish(); // Switch to English
```

### Get Current Language
```javascript
const isRTL = document.body.classList.contains('rtl');
const language = isRTL ? 'ar' : 'en';
```

---

## 🎨 Theming

### Toggle Dark Mode
```javascript
toggleDarkMode(); // Toggle current mode
```

### Check Dark Mode State
```javascript
const isDark = document.body.classList.contains('dark-mode');
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 576px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Small Desktop */
@media (max-width: 992px) { }

/* Large Desktop */
@media (max-width: 1200px) { }
```

---

## 🔗 External Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Font Awesome | 6.4.0 | Icons |
| Chart.js | 3.x | Charts |
| Three.js | 0.132.2 | 3D Graphics |

---

## ✅ Quick Checklist for New Pages

- [ ] Include `js/app.js`
- [ ] Include `js/dashboard-enhancements.js` (for dashboards)
- [ ] Add authentication check: `SessionManager.requireAuth()`
- [ ] Add dark mode support classes
- [ ] Add RTL/LTR support
- [ ] Test in both languages
- [ ] Test keyboard shortcuts
- [ ] Test responsive design

---

## 📞 Support

For issues or questions:
1. Check `TESTING_GUIDE.md` for detailed testing instructions
2. Check `ENHANCEMENTS_SUMMARY.md` for feature documentation
3. Check `CHANGELOG.md` for version history

---

**Last Updated**: November 2, 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
