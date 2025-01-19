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

export const getUser = async (username) => {
  const response = await api.get(`/user/username/${username}`);
  
  return response.data;
};

export const getRandomUsers = async (username) => {
    try {
      const response = await api.get(`/user/random/${username}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data.message || 'Error fetching random users');
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server');
      } else {
        // Other error occurred
        throw new Error('Error setting up request');
      }
    }
};

export const createMatch = async (username1, username2) => {
    try {
        const response = await api.post('/user/match', {
            username1,
            username2
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle specific error responses
            const errorMessage = error.response.data.message || 'Error creating match';
            
            switch (error.response.status) {
                case 400:
                    throw new Error('Invalid usernames provided: ' + errorMessage);
                case 404:
                    throw new Error('User not found: ' + errorMessage);
                case 409:
                    throw new Error('Match already exists: ' + errorMessage);
                default:
                    throw new Error(errorMessage);
            }
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('No response from server');
        } else {
            // Error setting up the request
            throw new Error('Error setting up request');
        }
    }
};

export const uploadProfileImage = async (username, imageFile) => {
    try {
        // Create FormData and append the file
        const formData = new FormData();
        formData.append('image', imageFile);

        // Create a custom config to override the default content-type
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await api.post(
            `/user/profile-image/${username}`,
            formData,
            config
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message || 'Error uploading image';
            switch (error.response.status) {
                case 400:
                    throw new Error('Invalid file: ' + errorMessage);
                case 413:
                    throw new Error('File too large: ' + errorMessage);
                case 415:
                    throw new Error('Unsupported file type: ' + errorMessage);
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

export const deleteProfileImage = async (username) => {
    try {
        const response = await api.delete(`/user/profile-image/${username}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message || 'Error deleting image';
            switch (error.response.status) {
                case 404:
                    throw new Error('No profile image found: ' + errorMessage);
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

// If you need to get the current profile image URL
export const getProfileImage = async (username) => {
    try {
        const response = await api.get(`/user/profile-image/${username}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error fetching profile image');
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error('Error setting up request');
        }
    }
};

export const getGabrielProfiles = async () => {
    try {
        const response = await api.get('/user/gabriel-profiles');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error fetching Gabriel profiles');
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error('Error setting up request');
        }
    }
};