// Enhanced Dark Mode with Smooth Transitions and System Preference Detection
(function() {
  const html = document.documentElement;
  const THEME_KEY = 'theme';
  const TRANSITION_CLASS = 'theme-transitioning';
  
  // Detect system preference
  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Get current theme (localStorage > system > default light)
  function getCurrentTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return getSystemPreference();
  }

  // Apply theme with smooth transition
  function applyTheme(theme, withTransition = true) {
    if (withTransition) {
      html.classList.add(TRANSITION_CLASS);
    }
    
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    localStorage.setItem(THEME_KEY, theme);
    
    if (withTransition) {
      setTimeout(() => {
        html.classList.remove(TRANSITION_CLASS);
      }, 300);
    }
  }

  // Toggle theme
  function toggleTheme() {
    const current = html.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  }

  // Keyboard shortcut: Ctrl+Shift+D
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Listen to system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light', true);
      }
    });
  }

  // Export for global use
  window.darkMode = {
    toggle: toggleTheme,
    set: (theme) => applyTheme(theme, true),
    get: getCurrentTheme
  };

  // Add CSS for smooth transitions
  const style = document.createElement('style');
  style.textContent = `
    .theme-transitioning,
    .theme-transitioning *,
    .theme-transitioning *:before,
    .theme-transitioning *:after {
      transition: background-color 0.3s ease, 
                  border-color 0.3s ease, 
                  color 0.3s ease,
                  fill 0.3s ease,
                  stroke 0.3s ease !important;
      transition-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
})();
