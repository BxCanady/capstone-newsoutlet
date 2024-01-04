import React, { useState, useEffect } from "react";
import { NEWS_API_KEY } from "../configs/constants";

const LocalNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const userCountryCode = "us";
  const [linkCopiedState, setLinkCopiedState] = useState({});

  const fetchLocalNews = async (countryCode) => {
    const apiKey = NEWS_API_KEY;

    try {
      const storedData = localStorage.getItem(`localNews_${countryCode}`);
      if (storedData) {
        setArticles(JSON.parse(storedData));
        setLoading(false);
      } else {
        const apiUrl = `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=${countryCode}&pageSize=5`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data.articles || []);

        localStorage.setItem(
          `localNews_${countryCode}`,
          JSON.stringify(data.articles)
        );
      }
    } catch (error) {
      console.error("Error fetching local news:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalNews(userCountryCode);
  }, [userCountryCode]);

  const defaultImageUrl = "src/components/images/defaultNewsImage.jpg";

  const filteredArticles = articles.filter(
    (article) => article.title !== "[Removed]"
  );

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
      {loading ? (
        <p className="loading">Loading articles...</p>
      ) : (
        <ul>
          {filteredArticles.map((article, index) => (
            <li className="itemCard" key={index}>
              <h4>{article.title}</h4>
              {article.urlToImage && (
                <div className="imageDiv">
                  <img
                    className="image"
                    src={article.urlToImage}
                    alt="Article"
                  />
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
                    <a
                      className="readMore"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </a>
                  </p>
                  <button
                    className="copyLinkButton"
                    onClick={() => handleCopyToClipboard(article.url, index)}
                    disabled={linkCopiedState[index]}
                  >
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
