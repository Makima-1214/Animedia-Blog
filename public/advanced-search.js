// Advanced Search with Autocomplete, History, and Fuzzy Search
(function() {
  const SEARCH_HISTORY_KEY = 'animedia_search_history';
  const MAX_HISTORY = 10;

  // Get search history from localStorage
  function getSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  }

  // Save search to history
  function saveToHistory(query) {
    if (!query || query.length < 2) return;
    
    let history = getSearchHistory();
    // Remove if already exists
    history = history.filter(h => h.toLowerCase() !== query.toLowerCase());
    // Add to beginning
    history.unshift(query);
    // Keep only MAX_HISTORY items
    history = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  }

  // Clear search history
  function clearHistory() {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }

  // Export for global use
  window.advancedSearch = {
    getHistory: getSearchHistory,
    saveToHistory: saveToHistory,
    clearHistory: clearHistory
  };
})();
