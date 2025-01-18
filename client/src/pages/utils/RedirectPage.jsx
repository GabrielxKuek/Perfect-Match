import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const RedirectPage = ({ url, sentiment, emoji = '💀' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = url;
    }, 1000);
    return () => clearTimeout(timer);
  }, [url]);

  const getSentimentStyle = () => {
    switch (sentiment) {
      case 'good':
        return 'animate-bounce';
      case 'bad':
        return 'animate-pulse';
      case 'weird':
        return 'animate-spin duration-1000';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <div className={`bg-white p-12 rounded-lg shadow-lg ${getSentimentStyle()}`}>
        <span className="text-6xl">{emoji}</span>
      </div>
      {sentiment === 'bad' && (
        <div className="fixed inset-0 bg-red-500 bg-opacity-50 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

RedirectPage.propTypes = {
  url: PropTypes.string.isRequired,
  sentiment: PropTypes.oneOf(['good', 'bad', 'weird']).isRequired,
  emoji: PropTypes.string
};

export default RedirectPage;