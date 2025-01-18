import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Smile, Frown, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import RedirectPage from './RedirectPage';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState(null);

  const handleSentimentClick = (sentiment) => {
    setSelectedSentiment(sentiment);
    setShowTransition(true);
  };

  if (showTransition) {
    return (
      <RedirectPage
        url="/"
        sentiment={selectedSentiment}
        emoji={
          selectedSentiment === 'good' ? '😊' :
          selectedSentiment === 'bad' ? '😢' : '🤔'
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#BEB7A4] flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="bg-[#FFFFFC] rounded-lg shadow-2xl w-full max-w-2xl p-8 relative overflow-hidden">
        {/* Decorative Corner Lines */}
        
        <div className="space-y-8">
          {/* 404 Text */}
          <div className="relative">
            <h1 className="text-[200px] font-bold text-black/5 text-center leading-none select-none">
              404
            </h1>
            <h2 className="text-4xl font-bold text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              Page Not Found
            </h2>
          </div>

          {/* Message */}
          <p className="text-lg text-black/70">
            Oops! The page you are looking for cannot be found. If this issue persists, please contact:
          </p>
          <a href="tel:+6582688969" className="block font-medium text-blue-600 hover:underline my-4">
            +65 8268 8969
          </a>
          <p className="text-lg text-black/70">
            Include your information, a picture of yourself, and what you're looking for in a relationship when reporting this issue.
          </p>

          {/* Sentiment Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleSentimentClick('good')}
              className="bg-[#FF7F11] hover:bg-[#FF7F11]/90 text-black font-medium px-6 py-2 rounded-md flex items-center gap-2"
            >
              <Smile className="w-5 h-5" /> Good
            </Button>
            <Button
              onClick={() => handleSentimentClick('bad')}
              className="bg-[#FF3F00] hover:bg-[#FF3F00]/90 text-white font-medium px-6 py-2 rounded-md flex items-center gap-2"
            >
              <Frown className="w-5 h-5" /> Bad
            </Button>
            <Button
              onClick={() => handleSentimentClick('weird')}
              className="bg-[#318CE7] hover:bg-[#318CE7]/90 text-white font-medium px-6 py-2 rounded-md flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5" /> Weird
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-black/10">
            <Button
              onClick={() => navigate(-1)}
              className="bg-[#FF7F11] hover:bg-[#FF7F11]/90 text-black font-medium px-6 py-2 rounded-md flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Go Back
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="bg-[#FF3F00] hover:bg-[#FF3F00]/90 text-white font-medium px-6 py-2 rounded-md flex items-center gap-2"
            >
              <Home className="w-5 h-5" /> Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
