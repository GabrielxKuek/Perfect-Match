import { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  X, 
  UserCircle, 
  Briefcase
} from 'lucide-react';

const SwipePage = () => {
  const [profiles] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      age: 28,
      occupation: "UX Designer",
      bio: "Coffee enthusiast and amateur photographer. Looking for someone who enjoys outdoor adventures!",
      interests: ["Photography", "Hiking", "Coffee"]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      age: 31,
      occupation: "Software Engineer",
      bio: "Passionate about technology and trying new restaurants. Let's grab a bite and chat about life!",
      interests: ["Coding", "Food", "Travel"]
    }
  ]);

  const SWIPE_THRESHOLD = 200;
  
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleMouseDown = (e) => {
    if (isDisappearing) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    setSwipeDirection(null);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isDisappearing) return;
    const offset = e.clientX - dragStartX.current;
    setDragOffset(offset);
    
    if (Math.abs(offset) > 0) {
      setSwipeDirection(offset > 0 ? 'right' : 'left');
    }

    if (Math.abs(offset) > SWIPE_THRESHOLD) {
      setIsDisappearing(true);
      setIsDragging(false);
      handleSwipe(offset > 0 ? 'right' : 'left');
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || isDisappearing) return;
    setIsDragging(false);
    
    if (Math.abs(dragOffset) < SWIPE_THRESHOLD) {
      setDragOffset(0);
      setSwipeDirection(null);
    }
  };

  const handleSwipe = (direction) => {
    const offset = direction === 'left' ? -SWIPE_THRESHOLD * 1.5 : SWIPE_THRESHOLD * 1.5;
    setDragOffset(offset);
    setIsDisappearing(true);
    
    setTimeout(() => {
      if (currentProfileIndex < profiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      }
      setDragOffset(0);
      setIsDisappearing(false);
      setSwipeDirection(null);
    }, 300);
  };

  const getCardStyle = () => {
    const rotate = (dragOffset / 10).toFixed(2);
    const opacity = isDisappearing ? 0 : 1 - Math.abs(dragOffset) / (SWIPE_THRESHOLD * 1.5);
    
    return {
      transform: `translateX(${dragOffset}px) rotate(${rotate}deg)`,
      opacity: Math.max(0, opacity),
      transition: isDragging ? 'none' : 'all 300ms ease-out'
    };
  };

  const getBackgroundStyle = () => {
    const baseColor = '#BEB7A4';
    const leftColor = '#FF7F11';
    const rightColor = '#318CE7';
    
    if (!swipeDirection) {
      return {
        background: baseColor
      };
    }

    const gradientDirection = swipeDirection === 'left' ? 'to left' : 'to right';
    const accentColor = swipeDirection === 'left' ? leftColor : rightColor;
    
    // Calculate gradient stop based on drag offset
    const gradientStop = Math.min(Math.abs(dragOffset) / SWIPE_THRESHOLD * 100, 100);
    
    return {
      background: `linear-gradient(${gradientDirection}, ${baseColor}, ${accentColor} ${gradientStop}%)`
    };
  };

  return (
    <div 
      className="min-h-screen p-4 relative transition-colors duration-300" 
      style={getBackgroundStyle()}
    >

      <div className="max-w-md mx-auto relative h-[600px]">
        {currentProfileIndex < profiles.length && (
          <Card 
            className="absolute w-full transform bg-[#FFFFFC] cursor-grab active:cursor-grabbing"
            style={getCardStyle()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <CardContent className="p-6">
              <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                <UserCircle className="w-32 h-32 text-[#318CE7]" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-black">
                    {profiles[currentProfileIndex].name}, {profiles[currentProfileIndex].age}
                  </h2>
                </div>

                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {profiles[currentProfileIndex].occupation}
                </div>

                <p className="text-gray-700">{profiles[currentProfileIndex].bio}</p>

                <div className="flex flex-wrap gap-2">
                  {profiles[currentProfileIndex].interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-[#318CE7] text-[#FFFFFC]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentProfileIndex >= profiles.length && (
          <Card className="w-full h-full flex items-center justify-center bg-[#FFFFFC]">
            <CardContent>
              <p className="text-xl text-center">No more profiles to show!</p>
              <Button 
                className="mt-4 bg-[#FF7F11] hover:bg-[#FF7F11]/90"
                onClick={() => setCurrentProfileIndex(0)}
              >
                Start Over
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="fixed bottom-8 left-0 right-0">
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="rounded-full w-16 h-16 shadow-lg bg-[#FF7F11] hover:bg-[#FF7F11]/90"
            onClick={() => handleSwipe('left')}
          >
            <X className="w-8 h-8" />
          </Button>
          <Button 
            size="lg" 
            className="rounded-full w-16 h-16 shadow-lg bg-[#318CE7] hover:bg-[#318CE7]/90"
            onClick={() => handleSwipe('right')}
          >
            <Heart className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwipePage;