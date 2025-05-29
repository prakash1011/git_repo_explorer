import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import RepositoryList from "./components/RepositoryList";

const App = () => {
  const [searchParams, setSearchParams] = useState({ query: "react", language: "", sort: "stars", searchAll: false });
  const [darkMode] = useState(true); // Default to dark mode based on user preference
  const [searchTitle, setSearchTitle] = useState("GitHub Trending Repositories");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  
  useEffect(() => {
    // Hide the welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 3500);
    
    // Clean up the timer when component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query, language, sort, searchAll) => {
    setSearchParams({ query, language, sort, searchAll });
    
    // Update search title based on the query
    if (query.startsWith('user:')) {
      const username = query.split(' ')[0].substring(5);
      setSearchTitle(`${username}'s GitHub Repositories`);
    } else if (query.includes('/')) {
      setSearchTitle(`Repository: ${query}`);
    } else if (searchAll) {
      setSearchTitle(`All GitHub Repositories: ${query}`);
    } else {
      setSearchTitle(`Trending GitHub Repositories: ${query}`);
    }
  };
  
  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {showWelcomeMessage && (
        <div className="welcomeMessageContainer">
          <div className="welcomeMessage">
            <h2>Welcome to GitHub Explorer!</h2>
            <p>This app helps you search and discover repositories on GitHub. You can find trending repos, search by username, or look for specific repositories.</p>
            <p>Click on any repository card to open it on GitHub.</p>
          </div>
        </div>
      )}
      
      <header className="headerContainer">
        <h1 className="headerText">{searchTitle}</h1>
        <p className="subHeaderText">Discover repositories from the GitHub community</p>
      </header>
      
      <main className="mainContent">
        <SearchBar onSearch={handleSearch} />
        <RepositoryList {...searchParams} />
      </main>
      
      <footer className="appFooter">
        <p>GitHub Repository Explorer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;