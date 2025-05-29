import React, { useState } from "react";

const SearchBar = ({ onSearch, onUserSearch }) => {
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("stars"); // Initialize with a valid sort option
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track if dropdown is open
  const [searchAll, setSearchAll] = useState(false);
  const [searchMode, setSearchMode] = useState("general"); // "general" or "user"

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchMode === "user" && username) {
      // Search for a specific user's repositories
      onSearch(`user:${username} ${query}`, language, sort, true);
    } else if (searchMode === "repo" && query) {
      // If it has a slash, treat it as a direct repo search
      onSearch(query, language, sort, true);
    } else {
      // Normal search
      onSearch(query, language, sort, searchAll);
    }
  };

  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
    if (mode === "user") {
      setSearchAll(true); // Always search all repos when searching by user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formSubmit">
      <div className="searchModeSelector">
        <button 
          type="button" 
          className={`searchModeButton ${searchMode === "general" ? "active" : ""}`}
          onClick={() => handleSearchModeChange("general")}
        >
          General Search
        </button>
        <button 
          type="button" 
          className={`searchModeButton ${searchMode === "user" ? "active" : ""}`}
          onClick={() => handleSearchModeChange("user")}
        >
          User Repositories
        </button>
        <button 
          type="button" 
          className={`searchModeButton ${searchMode === "repo" ? "active" : ""}`}
          onClick={() => handleSearchModeChange("repo")}
        >
          Exact Repository
        </button>
      </div>

      {searchMode === "user" ? (
        <div className="searchField">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="searchInput"
            required
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Repository name (optional)"
            className="searchInput"
          />
        </div>
      ) : searchMode === "repo" ? (
        <div className="searchField">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="username/repository-name"
            className="searchInput fullWidth"
            required
          />
          <p className="searchHint">Example: facebook/react</p>
        </div>
      ) : (
        // General search mode
        <div className="searchField">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories"
            className="searchInput"
          />
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Language"
            className="searchInput"
          />
          <div className="customSelectContainer">
            <div 
              className="searchInput customSelect"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {/* Show 'sort by' as placeholder only if no option is explicitly selected */}
              <span className="selectText">
                {sort ? (
                  sort === 'stars' ? 'Most Stars' : 
                  sort === 'forks' ? 'Most Forks' : 
                  'Recently Updated'
                ) : 'sort by'}
              </span>
              <span className="selectArrow"></span>
              
              {dropdownOpen && (
                <div className="selectDropdown">
                  <div 
                    className={`selectOption ${sort === "stars" ? "selected" : ""}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSort("stars");
                      setDropdownOpen(false);
                    }}
                  >
                    Most Stars
                  </div>
                  <div 
                    className={`selectOption ${sort === "forks" ? "selected" : ""}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSort("forks");
                      setDropdownOpen(false);
                    }}
                  >
                    Most Forks
                  </div>
                  <div 
                    className={`selectOption ${sort === "updated" ? "selected" : ""}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSort("updated");
                      setDropdownOpen(false);
                    }}
                  >
                    Recently Updated
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="searchToggle">
            <label className="toggleLabel">
              <input
                type="checkbox"
                checked={searchAll}
                onChange={() => setSearchAll(!searchAll)}
                className="toggleCheckbox"
                disabled={searchMode !== "general"}
              />
              <span className="toggleSwitch"></span>
              <span className="toggleText">{searchAll ? 'Search all repositories' : 'Search trending only'}</span>
            </label>
          </div>
        </div>
      )}
      
      <button type="submit" className="submitButton">
        {searchMode === "user" ? "Find User Repos" : searchMode === "repo" ? "Find Repository" : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;