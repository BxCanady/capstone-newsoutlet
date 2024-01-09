import React, { useState, useEffect } from "react";
import { NEWS_API_KEY } from "../configs/constants";

const WorldNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkCopiedState, setLinkCopiedState] = useState({});

  // Use Vite's environment variable handling
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const fetchArticles = async () => {
    const apiKey = NEWS_API_KEY;
    const regions = {
      Africa: ["za", "ng", "ke"],
      Americas: ["us", "ca", "br", "mx"],
      Asia: ["in", "cn", "jp", "kr"],
      Australia: ["au", "nz"],
      Canada: ["ca"],
      Europe: ["gb", "de", "fr", "es", "it"],
      "Middle East": ["ae", "sa", "eg", "jo"],
      "United Kingdom": ["gb"],
    };

    const articlesArray = [];
    setLoading(true);

    try {
      for (const region in regions) {
        const countryCodes = regions[region];

        for (const country of countryCodes) {
          const storedData = localStorage.getItem(`worldNews_${country}`);
          if (storedData) {
            const cachedArticles = JSON.parse(storedData);
            articlesArray.push(...cachedArticles);
          } else {
            const response = await fetch(`${API_BASE_URL}/api/world-news/${country}`);

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            articlesArray.push(...(data.articles || []));

            localStorage.setItem(`worldNews_${country}`, JSON.stringify(data.articles));
          }
        }
      }

      setArticles(articlesArray);
    } catch (error) {
      console.error("Error fetching world news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

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
    <div className="newsFeed">
      <h4 className="pageTitle">World News</h4>

      {loading ? (
        <p>Loading articles...</p>
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

export default WorldNews;
