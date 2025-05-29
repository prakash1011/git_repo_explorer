import axios from 'axios';

const BASE_URL = "https://api.github.com/search/repositories";

export const fetchRepositories = async (query, language, sort, searchAll = false) => {
    try {
        // Check if the query contains a username/repo format
        const isDirectRepoSearch = query.includes('/');
        
        let queryString;
        let apiUrl = BASE_URL;
        
        if (isDirectRepoSearch && searchAll) {
            // If searching for a specific repo with username/reponame format
            // This helps find exact repositories more easily
            queryString = `repo:${query}`;
        } else {
            // Normal search with filters
            queryString = query;
            
            // Add language filter if provided
            if (language && language.trim() !== '') {
                queryString += ` language:${language}`;
            }
            
            // Add stars filter only if not searching all repositories
            if (!searchAll) {
                queryString += ' stars:>1000';
            }
        }
        
        console.log('Search query:', queryString); // For debugging
        
        const response = await axios.get(apiUrl, {
            params: {
                q: queryString,
                sort: sort || "stars",
                order: "desc",
                per_page: 20 // Increased to show more results
            },
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        return response.data.items;
    } catch (error) {
        console.error("Error fetching repositories:", error);
        console.error("Error details:", error.response?.data || error.message);
        return [];
    }
};

// Function to search for a specific user's repositories
export const fetchUserRepositories = async (username) => {
    try {
        if (!username) return [];
        
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
            params: {
                sort: 'updated',
                direction: 'desc',
                per_page: 20
            },
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error(`Error fetching repositories for user ${username}:`, error);
        return [];
    }
};