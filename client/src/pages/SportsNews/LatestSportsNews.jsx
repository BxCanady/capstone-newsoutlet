import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchSportsNews = async () => {
    try {
        const baseUrl = process.env.NODE_ENV === 'production' ? 'https://your-production-api-url.com' : 'http://localhost:3001';
        const response = await axios.get(`${baseUrl}/api/sportsNews`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const LatestSportsNews = () => {
    const { data: latestNews, isLoading, error } = useQuery('sportsNews', fetchSportsNews);
    const [linkCopiedState, setLinkCopiedState] = useState({});

    const handleCopyToClipboard = (link, index) => {
        navigator.clipboard.writeText(link).then(() => {
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

    const getImageUrl = (article) => {
        if (article.imageUrl && article.imageUrl.startsWith('http')) {
            return article.imageUrl;
        }
        return '/defaultNewsImage.jpg'; // Path to a default image
    };

    const displayedArticles = latestNews ? latestNews.slice(0, 5) : [];

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="newsFeed">
            <h2 className="latestSportsHeader">Latest Sports News</h2>
            <ul className="news-content">
                {displayedArticles.map((article, index) => (
                    <li className="itemCard" key={index}>
                        <h4>{article.title || 'Title Not Available'}</h4>
                        <div className="imageDiv">
                            <img className="image" src={getImageUrl(article)} alt={article.title || 'Image Not Available'} />
                        </div>
                        <p className="article">{article.description || article.link}</p>
                        <a className="readMore" href={article.link} target="_blank" rel="noopener noreferrer">
                            Read More
                        </a>
                        <button
                            className="copyLinkButton"
                            onClick={() => handleCopyToClipboard(article.link, index)} // Changed article.url to article.link
                            disabled={linkCopiedState[index]}
                        >
                            {linkCopiedState[index] ? "Link Copied!" : "Copy Link"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LatestSportsNews;
