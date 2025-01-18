import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getAdminMessages = async () => {
    try {
        console.log('Fetching admin messages...');
        const response = await api.get('/chat/messages/gabriel');
        console.log('Admin messages response:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('Error in getAdminMessages:', error);
        
        if (error.response) {
            // Server responded with error
            const errorMessage = error.response.data.message || 'Error fetching admin messages';
            
            switch (error.response.status) {
                case 401:
                    throw new Error('Unauthorized: Please login as admin');
                case 403:
                    throw new Error('Forbidden: Admin access required');
                case 404:
                    throw new Error('No messages found');
                default:
                    throw new Error(errorMessage);
            }
        } else if (error.request) {
            // No response received
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Request setup error
            throw new Error('Error setting up request');
        }
    }
};

export const getUserMatches = async (username) => {
    try {
        const response = await api.get(`/chat/matches/${username}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error fetching matches');
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error('Error setting up request');
        }
    }
};

export const getConversation = async (username1, username2) => {
    try {
        const response = await api.get(`/chat/conversation/${username1}/${username2}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message || 'Error fetching conversation';
            
            switch (error.response.status) {
                case 404:
                    throw new Error('Conversation not found: ' + errorMessage);
                case 403:
                    throw new Error('Access denied: ' + errorMessage);
                default:
                    throw new Error(errorMessage);
            }
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error('Error setting up request');
        }
    }
};

export const sendMessage = async (senderUsername, receiverUsername, content) => {
    try {
        const response = await api.post('/chat/message', {
            senderUsername,
            receiverUsername,
            content
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message || 'Error sending message';
            
            switch (error.response.status) {
                case 400:
                    throw new Error('Invalid message data: ' + errorMessage);
                case 403:
                    throw new Error('Cannot send message: ' + errorMessage);
                case 404:
                    throw new Error('User not found: ' + errorMessage);
                default:
                    throw new Error(errorMessage);
            }
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error('Error setting up request');
        }
    }
};

export const deleteMessage = async (messageId, username) => {
    try {
        const response = await api.delete(`/chat/message/${messageId}`, {
            data: { username } // Send username in request body for DELETE request
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message || 'Error deleting message';
            
            switch (error.response.status) {
                case 403:
                    throw new Error('Unauthorized to delete message: ' + errorMessage);
                case 404:
                    throw new Error('Message not found: ' + errorMessage);
                default:
                    throw new Error(errorMessage);
            }
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error('Error setting up request');
        }
    }
};