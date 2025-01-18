import React from 'react';
import { MessageCircle, Heart, MoreVertical, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const matches = [
    {
        username: 'gabrielwife',
        name: 'Gabriela Kueka',
        profileUrl: 'https://res.cloudinary.com/dfgmojcfu/image/upload/v1737224291/profile_pictures/sbd0gzcvalssmjv2i22n.png',
        lastMessage: 'My love is for only one man',
        timestamp: '2:30 PM'
    },
    {
        username: 'gabrielmistress',
        name: 'Gabrielle Kuekke',
        profileUrl: 'https://res.cloudinary.com/dfgmojcfu/image/upload/v1737224291/profile_pictures/sbd0gzcvalssmjv2i22n.png',
        lastMessage: 'My life, my sword, my axe, is yours',
        timestamp: '1:45 PM'
    }
];

const ChatPage = () => {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#BEB7A4' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Matches Card */}
        <Card className="overflow-hidden" style={{ backgroundColor: '#FFFFFC' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold text-black flex items-center justify-between">
              Matches
              <Heart className="w-5 h-5 text-[#FF3F00]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {matches.map((match) => (
                <div key={match.username} className="flex-shrink-0">
                  {match.profileUrl ? (
                    <img
                      src={match.profileUrl}
                      alt={match.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#318CE7]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-2 border-[#318CE7] flex items-center justify-center bg-gray-100">
                      <UserCircle className="w-12 h-12 text-[#318CE7]" />
                    </div>
                  )}
                  <p className="text-center mt-2 text-sm font-medium text-black max-w-[80px] truncate">
                    {match.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages Card */}
        <Card className="overflow-hidden" style={{ backgroundColor: '#FFFFFC' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold text-black flex items-center justify-between">
              Messages
              <MessageCircle className="w-5 h-5 text-[#318CE7]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matches.map((match) => (
                <Card 
                  key={match.username}
                  className="hover:bg-gray-50 cursor-pointer border border-gray-200"
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    {match.profileUrl ? (
                      <img
                        src={match.profileUrl}
                        alt={match.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                        <UserCircle className="w-8 h-8 text-[#318CE7]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-black">{match.name}</h3>
                        <span className="text-sm text-gray-500">{match.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{match.lastMessage}</p>
                    </div>
                    <MoreVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;