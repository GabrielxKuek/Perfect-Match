import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCircle, Send, AlertCircle } from 'lucide-react';
import { getConversation, sendMessage } from '../../services/api/chat';

// Type definitions
const MessageType = PropTypes.shape({
  message_id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  sender: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profile_url: PropTypes.string
  }).isRequired,
  receiver: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profile_url: PropTypes.string
  })
});

const UserType = PropTypes.shape({
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  profileUrl: PropTypes.string,
  role: PropTypes.string,
  senderToImpersonate: PropTypes.string
});

const ChatDialog = ({ 
  isOpen = false, 
  onClose, 
  selectedUser = null, 
  currentUsername,
  isAdminView = false
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && selectedUser) {
      fetchMessages();
    } else {
      setMessages([]);
      setNewMessage('');
      setError(null);
    }
  }, [isOpen, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getConversation(
        selectedUser.senderToImpersonate || currentUsername,
        selectedUser.username
      );
      setMessages(response.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || isSubmitting) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately
    setIsSubmitting(true); // Prevent duplicate submissions

    try {
      const response = await sendMessage(
        selectedUser.senderToImpersonate || currentUsername,
        selectedUser.username,
        messageContent
      );
      
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setNewMessage(messageContent); // Restore message if failed
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            {selectedUser.profileUrl ? (
              <img
                src={selectedUser.profileUrl}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-gray-400" />
            )}
            <div className="flex flex-col">
              <span>{selectedUser.name}</span>
              {isAdminView && selectedUser.senderToImpersonate && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Sending as {selectedUser.senderToImpersonate}</span>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading messages...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full text-red-500">
              <p>{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.message_id}
                className={`flex ${
                  message.sender.username === (selectedUser.senderToImpersonate || currentUsername)
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.sender.username === (selectedUser.senderToImpersonate || currentUsername)
                      ? isAdminView 
                        ? 'bg-red-500 text-white rounded-l-lg rounded-tr-lg'
                        : 'bg-[#318CE7] text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-gray-200 text-black rounded-r-lg rounded-tl-lg'
                  } px-4 py-2`}
                >
                  {isAdminView && (
                    <p className="text-xs mb-1 opacity-75">
                      {message.sender.username === selectedUser.senderToImpersonate 
                        ? 'Sent by ' + message.sender.name
                        : 'Received by ' + message.receiver.name
                      }
                    </p>
                  )}
                  <p className="break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender.username === (selectedUser.senderToImpersonate || currentUsername)
                      ? isAdminView ? 'text-red-100' : 'text-blue-100'
                      : 'text-gray-500'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t flex gap-2 bg-white"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Type a message${isAdminView ? ` as ${selectedUser.senderToImpersonate}` : ''}...`}
            className="flex-1"
            disabled={loading || isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || loading || isSubmitting}
            variant={isAdminView ? "destructive" : "default"}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

ChatDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: UserType,
  currentUsername: PropTypes.string.isRequired,
  isAdminView: PropTypes.bool
};

export default ChatDialog;