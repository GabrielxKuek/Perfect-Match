import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  X, 
  UserCircle, 
  Briefcase,
  Loader2
} from 'lucide-react';
import { getRandomUsers, createMatch } from '../../services/api/user';
import { toast } from '@/hooks/use-toast';

const SwipePage = () => {
  const currentUsername = sessionStorage.getItem('username');
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SWIPE_THRESHOLD = 200;
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getRandomUsers(currentUsername);
      if (result.success) {
        setProfiles(result.users.map(user => ({
          id: user.username,
          name: user.name,
          age: calculateAge(user.birthday),
          occupation: user.occupation,
          bio: user.bio,
          interests: []
        })));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (currentUsername && profiles.length === 0) {
      fetchProfiles();
    }
  }, [currentUsername]);

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

  const handleSwipe = async (direction) => {
    const offset = direction === 'left' ? -SWIPE_THRESHOLD * 1.5 : SWIPE_THRESHOLD * 1.5;
    setDragOffset(offset);
    setIsDisappearing(true);
    
    // If it's a right swipe, try to create a match
    if (direction === 'right' && currentProfileIndex < profiles.length) {
      try {
        const currentProfile = profiles[currentProfileIndex];
        const result = await createMatch(currentUsername, currentProfile.id);
        
        if (result.success) {
          toast({
            title: "It's a match! 🎉",
            description: `You matched with ${currentProfile.name}!`,
            duration: 3000,
          });
        }
      } catch (error) {
        // Only show error if it's not a "match already exists" error
        if (!error.message.includes('Match already exists')) {
          toast({
            title: "Couldn't create match",
            description: error.message,
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    }

    setTimeout(() => {
      if (currentProfileIndex < profiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      } else {
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
      return { background: baseColor };
    }

    const gradientDirection = swipeDirection === 'left' ? 'to left' : 'to right';
    const accentColor = swipeDirection === 'left' ? leftColor : rightColor;
    const gradientStop = Math.min(Math.abs(dragOffset) / SWIPE_THRESHOLD * 100, 100);
    
    return {
      background: `linear-gradient(${gradientDirection}, ${baseColor}, ${accentColor} ${gradientStop}%)`
    };
  };

  const EmptyStateMessage = () => {
    const isWoman = localStorage.getItem('role') === 'woman';
    const message = isWoman
      ? "You have exhausted all users"
      : "You have exhausted all users";
    const subMessage = isWoman
      ? "Would you like to see some suggestions of potential partners?"
      : "If you have any female friends, please send them over to +65 8268 8969";

    return (
      <Card className="w-full h-full flex items-center justify-center bg-[#FFFFFC] shadow-lg">
        <CardContent className="p-8 text-center max-w-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {message}
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            {subMessage}
          </p>
          {isWoman && (
            <Button
              className="bg-[#318CE7] hover:bg-[#318CE7]/90 text-lg px-8 py-6 h-auto"
              onClick={() => {
                // Redirect to the LinkedIn profile
                window.location.href = "https://www.linkedin.com/in/gabrielxkuek/";
              }}
            >
              See Suggestions
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#BEB7A4]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mb-4 mx-auto" />
          <p className="text-white text-lg">Finding potential matches...</p>
        </div>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BEB7A4]">
        <Card className="w-full max-w-md m-4 bg-[#FFFFFC]">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4 text-lg">{error}</p>
            <Button 
              className="bg-[#318CE7] hover:bg-[#318CE7]/90"
              onClick={fetchProfiles}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 relative transition-colors duration-300" 
      style={getBackgroundStyle()}
    >
      <div className="max-w-md mx-auto relative h-[600px]">
        {profiles.length > 0 && currentProfileIndex < profiles.length ? (
          <Card 
            className="absolute w-full transform bg-[#FFFFFC] cursor-grab active:cursor-grabbing shadow-xl"
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
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profiles[currentProfileIndex].name}, {profiles[currentProfileIndex].age}
                  </h2>
                </div>

                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {profiles[currentProfileIndex].occupation}
                </div>

                <p className="text-gray-700 leading-relaxed">{profiles[currentProfileIndex].bio}</p>

                {profiles[currentProfileIndex].interests?.length > 0 && (
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
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyStateMessage />
        )}
      </div>

      {currentProfileIndex < profiles.length && (
        <div className="fixed bottom-8 left-0 right-0">
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="rounded-full w-16 h-16 shadow-lg bg-[#FF7F11] hover:bg-[#FF7F11]/90"
              onClick={() => handleSwipe('left')}
              disabled={loading}
            >
              <X className="w-8 h-8" />
            </Button>
            <Button 
              size="lg" 
              className="rounded-full w-16 h-16 shadow-lg bg-[#318CE7] hover:bg-[#318CE7]/90"
              onClick={() => handleSwipe('right')}
              disabled={loading}
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipePage;