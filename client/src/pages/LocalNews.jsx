import React, { useState, useEffect } from "react";

const LocalNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const userCountryCode = "us";
  const [linkCopiedState, setLinkCopiedState] = useState({});


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const fetchLocalNews = async (countryCode) => {
    setLoading(true);

    try {
      const storedData = localStorage.getItem(`localNews_${countryCode}`);
      if (storedData) {
        setArticles(JSON.parse(storedData));
      } else {
        const response = await fetch(`${API_BASE_URL}/api/local-news/${countryCode}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const newArticles = data.articles || [];

        setArticles(newArticles);
        localStorage.setItem(`localNews_${countryCode}`, JSON.stringify(newArticles));
      }
    } catch (error) {
      console.error("Error fetching local news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalNews(userCountryCode);
  }, [userCountryCode]);

  const defaultImageUrl = "src/components/images/defaultNewsImage.jpg";

  const filteredArticles = articles.filter(article => article.title !== "[Removed]");

  const handleCopyToClipboard = (url, index) => {
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopiedState({
        ...linkCopiedState,
        [index]: true,
      });

      setTimeout(() => {
        setLinkCopiedState({
          ...linkCopiedState,
          [index]: false,
        });
      }, 3000);
    });
  };

  return (
    <div className="newsFeed1">
      {loading ? (
        <p className="loading">Loading articles...</p>
      ) : (
        <ul>
          {filteredArticles.map((article, index) => (
            <li className="itemCard" key={index}>
              <h4>{article.title}</h4>
              {article.urlToImage && (
                <div className="imageDiv">
                  <img className="image" src={article.urlToImage} alt="Article" />
                </div>
              )}
              {!article.urlToImage && (
                <div className="imageDiv">
                  <img className="image" src={defaultImageUrl} alt="Default" />
                </div>
              )}
              <p className="article">{article.description}</p>
              <p className="author">Author: {article.author}</p>
              <p className="published">Published at: {article.publishedAt}</p>
              <p className="source">Source: {article.source.name}</p>
              {article.url && (
                <div>
                  <p className="article-link">
                    <a className="readMore" href={article.url} target="_blank" rel="noopener noreferrer">
                      Read More
                    </a>
                  </p>
                  <button className="copyLinkButton" onClick={() => handleCopyToClipboard(article.url, index)} disabled={linkCopiedState[index]}>
                    {linkCopiedState[index] ? "Link Copied!" : "Copy Link"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocalNews;
