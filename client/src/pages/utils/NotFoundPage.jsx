import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: '#000000', color: '#FFFFFC' }}
    >
      {/* Main Content Container */}
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Error Code */}
        <h1 
          className="text-8xl md:text-9xl font-bold mb-4"
          style={{ color: '#FF3F00' }}
        >
          404
        </h1>
        
        {/* Glitch Effect Text */}
        <div className="relative">
          <h2 
            className="text-2xl md:text-3xl font-semibold mb-6 animate-pulse"
            style={{ color: '#FF7F11' }}
          >
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p 
          className="text-lg md:text-xl mb-8"
          style={{ color: '#BEB7A4' }}
        >
          Oops! The page you&apos;re looking for seems to have vanished into the digital void.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3"
            style={{ 
              backgroundColor: '#FF7F11',
              color: '#000000',
              borderRadius: '0.5rem'
            }}
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>

          <Button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3"
            style={{ 
              backgroundColor: '#FF3F00',
              color: '#FFFFFC',
              borderRadius: '0.5rem'
            }}
          >
            <Home size={20} />
            Home
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div 
        className="absolute top-0 left-0 w-full h-2"
        style={{ backgroundColor: '#FF3F00' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-full h-2"
        style={{ backgroundColor: '#FF3F00' }}
      />
    </div>
  );
};

export default NotFound;