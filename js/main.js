// file name /js/main.js

"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('checkbox');
    const body = document.body;
    
    if (!checkbox) {
        console.error('Theme checkbox not found');
        return;
    }
    
    // Function to set theme
    const setTheme = (isDark) => {
        if (isDark) {
            body.setAttribute('data-theme', 'dark');
            body.classList.remove('light');
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
            body.classList.remove('dark');
            body.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    };

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        checkbox.checked = true;
        setTheme(true);
    } else if (savedTheme === 'light') {
        checkbox.checked = false;
        setTheme(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        checkbox.checked = true;
        setTheme(true);
    } else {
        checkbox.checked = false;
        setTheme(false);
    }

    // Listen for theme toggle
    checkbox.addEventListener('change', () => {
        setTheme(checkbox.checked);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme')) return; // Don't override user preference
        const isDark = e.matches;
        checkbox.checked = isDark;
        setTheme(isDark);
    });
});
