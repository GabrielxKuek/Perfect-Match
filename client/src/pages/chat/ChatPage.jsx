import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MessageCircle, Heart, MoreVertical, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserMatches, getAdminMessages } from '../../services/api/chat';
import ChatDialog from '../../components/chat/ChatDialog';

// Type definitions
const MatchType = PropTypes.shape({
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  profileUrl: PropTypes.string,
  lastMessage: PropTypes.string,
  timestamp: PropTypes.string,
  role: PropTypes.string
});

const ChatPage = () => {
  const [matches, setMatches] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("your-messages");
  
  const currentUsername = localStorage.getItem('username');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Current user role:', userRole);
        
        const matchesResponse = await getUserMatches(currentUsername);
        
        let adminMessagesResponse = { messages: [] };
        if (userRole === 'gabriel') {
          console.log('Fetching admin messages...');
          adminMessagesResponse = await getAdminMessages();
          console.log('Admin messages received:', adminMessagesResponse);
        }

        // Process regular matches
        const formattedMatches = matchesResponse.matches.map(match => ({
          username: match.matchedUsername,
          name: match.name,
          profileUrl: match.profile_url,
          lastMessage: '',
          timestamp: '',
          role: match.role
        }));
        setMatches(formattedMatches);

        // Process admin messages if applicable
        if (userRole === 'gabriel' && adminMessagesResponse.messages) {
          // Group messages by conversation participants
          const conversationMap = new Map();
          
          adminMessagesResponse.messages.forEach(message => {
            const conversationKey = `${message.sender.username}-${message.receiver.username}`;
            if (!conversationMap.has(conversationKey)) {
              conversationMap.set(conversationKey, {
                username: message.receiver.username,
                name: message.receiver.name,
                profileUrl: message.receiver.profile_url,
                senderToImpersonate: message.sender.username,
                lastMessage: message.content,
                timestamp: message.timestamp,
                isAdminView: true
              });
            }
          });

          setAdminMessages(Array.from(conversationMap.values()));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUsername) {
      fetchData();
    }
  }, [currentUsername, userRole]);

  // Filter matches based on the active tab and user role
  const yourMessages = matches;
  const otherMessages = userRole === 'gabriel' ? adminMessages : [];
  
  console.log('User role for filtering:', userRole);
  console.log('Admin messages for Other tab:', adminMessages);
  console.log('Filtered other messages:', otherMessages);

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{ backgroundColor: '#BEB7A4' }}>
        <Card className="p-6 max-w-md w-full" style={{ backgroundColor: '#FFFFFC' }}>
          <p className="text-red-500 text-center">Error loading messages: {error}</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{ backgroundColor: '#BEB7A4' }}>
        <Card className="p-6 max-w-md w-full" style={{ backgroundColor: '#FFFFFC' }}>
          <p className="text-center">Loading messages...</p>
        </Card>
      </div>
    );
  }

  const MessagesList = ({ messages }) => (
    <div className="space-y-2">
      {messages.map((match) => (
        <Card 
          key={match.username}
          className="hover:bg-gray-50 cursor-pointer border border-gray-200"
          onClick={() => {
            setSelectedUser(match);
            setIsDialogOpen(true);
          }}
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
                <span className="text-sm text-gray-500">{match.timestamp || 'No messages'}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {match.isAdminView ? (
                  <span className="text-red-500">Viewing as {match.senderToImpersonate}</span>
                ) : (
                  match.lastMessage || 'Start a conversation!'
                )}
              </p>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </CardContent>
        </Card>
      ))}
      {messages.length === 0 && (
        <p className="text-gray-500 text-center py-4">No messages in this category</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#BEB7A4' }}>
      <div className="max-w-4xl mx-auto space-y-6">
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
              {matches.length === 0 && (
                <p className="text-gray-500 text-center w-full py-4">No matches found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden" style={{ backgroundColor: '#FFFFFC' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold text-black flex items-center justify-between">
              Messages
              <MessageCircle className="w-5 h-5 text-[#318CE7]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="your-messages" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="your-messages">Your Messages</TabsTrigger>
                <TabsTrigger value="other-messages">Other Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="your-messages">
                <MessagesList messages={yourMessages} />
              </TabsContent>
              <TabsContent value="other-messages">
                <MessagesList messages={otherMessages} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ChatDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedUser={selectedUser}
        currentUsername={currentUsername}
        isAdminView={selectedUser?.isAdminView}
      />
    </div>
  );
};

ChatPage.propTypes = {
  matches: PropTypes.arrayOf(MatchType),
};

export default ChatPage;