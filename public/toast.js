// Toast Notification System
(function() {
  let toastContainer = null;

  function createToastContainer() {
    if (toastContainer) return toastContainer;
    
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
    return toastContainer;
  }

  function showToast(message, type = 'success', duration = 3000) {
    const container = createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto transform translate-x-full transition-transform duration-300 ease-out px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-sm ${
      type === 'success' ? 'bg-green-600 text-white' :
      type === 'error' ? 'bg-red-600 text-white' :
      type === 'info' ? 'bg-blue-600 text-white' :
      'bg-gray-800 text-white'
    }`;
    
    const icon = type === 'success' ? 'check_circle' :
                 type === 'error' ? 'error' :
                 type === 'info' ? 'info' :
                 'notifications';
    
    toast.innerHTML = `
      <span class="material-symbols-outlined text-xl">${icon}</span>
      <span class="text-sm font-medium">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
      toast.classList.add('translate-x-0');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        container.removeChild(toast);
        if (container.children.length === 0) {
          document.body.removeChild(container);
          toastContainer = null;
        }
      }, 300);
    }, duration);
  }

  // Export globally
  window.showToast = showToast;
})();
