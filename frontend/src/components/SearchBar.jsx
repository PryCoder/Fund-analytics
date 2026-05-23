// SearchBarExpandable.jsx - Subtle Professional Version
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

const SearchBarExpandable = ({
  onSearch,
  loading,
  placeholder = "Search mutual funds...",
}) => {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const debounceTimerRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedSearch = useCallback(
    (searchQuery) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        if (searchQuery.trim().length >= 2) {
          onSearch(searchQuery);
        } else if (searchQuery.length === 0) {
          onSearch("");
        }
      }, 400);
    },
    [onSearch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setExpanded(false);
    setQuery("");
    onSearch("");
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleExpand();
      }
      if (e.key === 'Escape' && expanded) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  return (
    <div className="flex justify-center w-full">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="search-button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleExpand}
            className="relative"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 whitespace-nowrap">
              ⌘K
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="search-input"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {loading ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border border-purple-500/30 border-t-purple-500" />
                ) : (
                  <Search className="h-3.5 w-3.5 text-gray-500" />
                )}
              </div>

              <input
                ref={inputRef}
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="
                  w-full h-10 pl-9 pr-16
                  rounded-lg
                  bg-white/5
                  border border-white/10
                  text-white text-sm
                  placeholder:text-gray-500
                  focus:outline-none focus:border-white/20
                  transition-colors
                "
              />

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <button
                    onClick={handleClear}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            </div>

            {query.length > 0 && query.length < 2 && (
              <p className="text-[10px] text-amber-500/70 mt-1.5 ml-1">
                Enter at least 2 characters
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBarExpandable;