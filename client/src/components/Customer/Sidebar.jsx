import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ onFiltersChange, appliedFilters }) => {
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [tempFilters, setTempFilters] = useState(appliedFilters || {
    size: [],
    material: [],
    color: [],
    priceRange: []
  });

  // Sync tempFilters when appliedFilters changes from parent
  useEffect(() => {
    if (appliedFilters) {
      setTempFilters(appliedFilters);
    }
  }, [appliedFilters]);

  const filters = {
    size: {
      title: "Size",
      options: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    material: {
      title: "Material",
      options: ["Cotton", "Polyester", "Silk", "Denim", "Wool"]
    },
    color: {
      title: "Color",
      options: ["Black", "White", "Blue", "Red", "Green", "Gray"]
    },
    priceRange: {
      title: "Price Range",
      options: ["Under $25", "$25-$50", "$50-$100", "$100-$200", "Above $200"]
    }
  };

  const toggleFilter = (key) => {
    setExpandedFilter(expandedFilter === key ? null : key);
  };

  const handleCheckboxChange = (filterKey, option) => {
    setTempFilters(prev => {
      const current = prev[filterKey] || [];
      const isSelected = current.includes(option);

      return {
        ...prev,
        [filterKey]: isSelected
          ? current.filter(item => item !== option)
          : [...current, option]
      };
    });
  };

  const applyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange(tempFilters);
    }
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      size: [],
      material: [],
      color: [],
      priceRange: []
    };
    setTempFilters(emptyFilters);
    if (onFiltersChange) {
      onFiltersChange(emptyFilters);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Filters</h3>
        <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
      </div>

      <div className="filters-list">
        {Object.entries(filters).map(([key, filter]) => (
          <div key={key} className="filter-section">
            <button
              className={`filter-header ${expandedFilter === key ? 'active' : ''}`}
              onClick={() => toggleFilter(key)}
            >
              <span>{filter.title}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ transform: expandedFilter === key ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {expandedFilter === key && (
              <div className="filter-options">
                {filter.options.map((option, index) => (
                  <label key={index} className="filter-option">
                    <input
                      type="checkbox"
                      checked={(tempFilters[key] || []).includes(option)}
                      onChange={() => handleCheckboxChange(key, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="apply-filters-btn" onClick={applyFilters}>Apply Filters</button>
      </div>
    </aside>
  );
};

export default Sidebar;