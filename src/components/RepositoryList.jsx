import React, { useState, useEffect } from "react";
import { fetchRepositories } from "../api/GitApi";
import forkIcon from "../assets/git-fork-svgrepo-com.svg";


const RepositoryList = ({ query, language, sort, searchAll }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRepositories(query, language, sort, searchAll);
        setRepos(data);
      } catch (err) {
        setError('Failed to fetch repositories. Please try again.');
        console.error('Error fetching repositories:', err);
      } finally {
        setLoading(false);
      }
    };
    getRepos();
  }, [query, language, sort]);

  return (
    <div className="repoContainer">
      {loading ? (
        <div className="loadingContainer">
          <div className="loadingSpinner"></div>
          <p>Loading repositories...</p>
        </div>
      ) : error ? (
        <div className="errorContainer">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retryButton">Retry</button>
        </div>
      ) : repos.length === 0 ? (
        <div className="noResultsContainer">
          <p>No repositories found for your search criteria</p>
        </div>
      ) : (
        repos.map((repo) => (
          <div key={repo.id} className="repoData" onClick={() => window.open(repo.html_url, '_blank', 'noopener,noreferrer')}>
            <div className="clickIndicator">Click to view</div>
            <h2 className="repoName">{repo.name}</h2>
            <p className="repoDescription">{repo.description || "No description available"}</p>
            <div className="repoStats">
              <p className="starCount">⭐ <span>{repo.stargazers_count.toLocaleString()}</span></p>
              <p className="forkCount"><img src={forkIcon} alt="Fork" className="forkIcon" /> <span>{repo.forks_count.toLocaleString()}</span></p>
              {repo.language && <p className="languageData">🔠 <span>{repo.language}</span></p>}
            </div>
            <div className="repoFooter">
              <small>Updated: {new Date(repo.updated_at).toLocaleDateString()}</small>
              {repo.license && <small>License: {repo.license.name}</small>}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RepositoryList;