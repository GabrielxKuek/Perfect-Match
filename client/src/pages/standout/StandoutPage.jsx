import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/utils/LoadingSpinner';
import { getGabrielProfiles, createMatch } from '../../services/api/user';
import { ChevronLeft, ChevronRight, Heart, Briefcase } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const StandoutPage = () => {
  const currentUsername = 'currentuser';
  const [matchStatus, setMatchStatus] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await getGabrielProfiles();
        if (response.success) {
          setProfiles(response.profiles);
        } else {
          setError('Failed to fetch profiles');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profiles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleMatch = async (targetUsername) => {
    try {
      await createMatch(currentUsername, targetUsername);
      setMatchStatus(prev => ({
        ...prev,
        [targetUsername]: 'matched'
      }));
    } catch (error) {
      console.error('Error creating match:', error);
      setMatchStatus(prev => ({
        ...prev,
        [targetUsername]: 'error'
      }));
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    const container = document.getElementById('profile-container');
    const scrollAmount = 300;
    if (container) {
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      setScrollPosition(container.scrollLeft);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#BEB7A4' }}>
        <p className="text-xl font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#BEB7A4' }}>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-black">Standout Profiles</h1>
        
        <div className="relative">
          <div 
            id="profile-container"
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory hide-scrollbar pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {profiles.map((profile) => (
              <div 
                key={profile.username}
                className="snap-center shrink-0 first:pl-4 last:pr-4"
              >
                <Card className="w-80 h-96 shadow-lg backdrop-blur-sm" style={{ backgroundColor: '#FFFFFC' }}>
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="relative w-72 h-48 mb-4 flex-shrink-0">
                      <img 
                        src={profile.profile_url || '/api/placeholder/320/320'} 
                        alt={profile.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button 
                        onClick={() => handleMatch(profile.username)}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 hover:bg-opacity-100`}
                        style={{ 
                          backgroundColor: matchStatus[profile.username] === 'matched' 
                            ? '#FF3F00' 
                            : matchStatus[profile.username] === 'error'
                            ? '#FF3F00'
                            : '#FF7F11',
                          opacity: 0.9
                        }}
                      >
                        <Heart 
                          className={`w-6 h-6 text-white ${matchStatus[profile.username] === 'matched' ? 'fill-current' : ''}`} 
                        />
                      </button>
                    </div>
                    
                    <div className="flex flex-col flex-grow space-y-3">
                      <h2 className="text-xl font-bold text-black line-clamp-1">{profile.name}</h2>
                      
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-black flex-shrink-0" />
                        <p className="text-black font-medium line-clamp-1">{profile.occupation}</p>
                      </div>
                      
                      <p className="text-sm text-black line-clamp-3">{profile.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {profiles.length > 3 && (
            <>
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: '#FF3F00' }}
              >
                <ChevronLeft className="w-7 h-7 text-white" />
              </button>
              
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: '#FF3F00' }}
              >
                <ChevronRight className="w-7 h-7 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default StandoutPage;