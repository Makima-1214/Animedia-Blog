// Bookmark functionality
(function() {
  // Initialize bookmarks
  function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]');
  }

  function saveBookmark(articleId, articleData) {
    const bookmarks = getBookmarks();
    if (!bookmarks.includes(articleId)) {
      bookmarks.push(articleId);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      localStorage.setItem(`bookmark_${articleId}`, JSON.stringify(articleData));
      return true;
    }
    return false;
  }

  function removeBookmark(articleId) {
    const bookmarks = getBookmarks();
    const newBookmarks = bookmarks.filter(id => id !== articleId);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    localStorage.removeItem(`bookmark_${articleId}`);
    return true;
  }

  function isBookmarked(articleId) {
    return getBookmarks().includes(articleId);
  }

  // Toggle bookmark
  window.toggleBookmark = function(articleId, articleData) {
    const bookmarked = isBookmarked(articleId);
    
    if (bookmarked) {
      removeBookmark(articleId);
      updateBookmarkButtons(articleId, false);
      showToast('Dihapus dari bookmark');
    } else {
      saveBookmark(articleId, articleData);
      updateBookmarkButtons(articleId, true);
      showToast('Ditambahkan ke bookmark');
    }
  };

  // Update all bookmark buttons for an article
  function updateBookmarkButtons(articleId, isBookmarked) {
    document.querySelectorAll(`[data-bookmark-id="${articleId}"]`).forEach(btn => {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = isBookmarked ? 'bookmark' : 'bookmark_border';
        icon.style.fontVariationSettings = isBookmarked ? "'FILL' 1" : "'FILL' 0";
      }
      btn.classList.toggle('bookmarked', isBookmarked);
    });
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-up';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-sm">check_circle</span>
      <span class="font-medium text-sm">${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slide-down 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // Initialize bookmark buttons on page load
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-bookmark-id]').forEach(btn => {
      const articleId = btn.getAttribute('data-bookmark-id');
      if (articleId && isBookmarked(articleId)) {
        updateBookmarkButtons(articleId, true);
      }
    });
  });

  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes slide-down {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out forwards;
    }
    .bookmarked {
      color: #7c3aed !important;
    }
  `;
  document.head.appendChild(style);
})();
