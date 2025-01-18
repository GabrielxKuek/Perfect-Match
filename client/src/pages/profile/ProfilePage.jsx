import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  UserCircle, 
  Briefcase, 
  Edit2, 
  Save, 
  Camera, 
  Heart, 
  Cake,
  Loader2,
  Trash2
} from 'lucide-react';
import { 
  getUser, 
  uploadProfileImage, 
  deleteProfileImage
} from "../../services/api/user";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

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

  const formatBirthday = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteImage = async () => {
    try {
      setIsUploading(true);
      setError(null);

      const response = await deleteProfileImage(userData.username);
      
      if (response.success) {
        setUserData(prev => ({
          ...prev,
          profile_url: null
        }));
        setProfileImage(null);
      } else {
        setError('Failed to delete image');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);

    try {
      const response = await uploadProfileImage(userData.username, file);
      
      if (response.success) {
        setUserData(prev => ({
          ...prev,
          profile_url: response.user.profile_url
        }));
        setProfileImage(response.user.profile_url);
      } else {
        setError(response.message || 'Failed to upload image');
        setProfileImage(userData.profile_url);
      }
    } catch (error) {
      setError(error.message);
      setProfileImage(userData.profile_url);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(previewUrl); // Clean up preview URL
    }
  }, [userData?.username]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: !isEditing || isUploading
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser(localStorage.getItem("username"));
        if (response.success) {
          const user = response.user;
          setUserData({
            username: user.username,
            name: user.name,
            birthday: user.birthday.split('T')[0],
            occupation: user.occupation,
            bio: user.bio,
            profile_url: user.profile_url
          });
          setProfileImage(user.profile_url);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      // Add your save logic here for other profile fields
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#BEB7A4' }}>
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}
        
        <Card className="mb-6 overflow-hidden" style={{ backgroundColor: '#FFFFFC' }}>
          {/* Hero Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-100 to-orange-50">
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="absolute top-4 right-4 z-10"
              style={{ backgroundColor: isEditing ? '#FF3F00' : '#FF7F11' }}
              disabled={isUploading}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>

          {/* Profile Picture Overlay */}
          <div className="relative -mt-24 px-6">
            <div 
              className="relative inline-block"
              {...(isEditing ? getRootProps() : {})}
            >
              <div className={`rounded-full border-4 border-white overflow-hidden relative ${
                isEditing && !isUploading ? 'cursor-pointer hover:opacity-90' : ''
              }`} style={{ backgroundColor: '#FFFFFC', width: '160px', height: '160px' }}>
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                ) : profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-40 h-40" style={{ color: '#318CE7' }} />
                )}
                {isEditing && !isUploading && (
                  <>
                    <input {...getInputProps()} />
                    <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
                      isDragActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                    }`}>
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
                )}
              </div>
              {isEditing && profileImage && !isUploading && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -bottom-2 -right-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage();
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <CardContent className="px-6 pt-4 pb-8">
            <div className="space-y-6">
              {/* Name and Basic Info */}
              <div className="space-y-4">
                {isEditing ? (
                  <Input
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="text-3xl font-bold border-none p-0 focus:ring-0"
                    style={{ color: '#000000' }}
                  />
                ) : (
                  <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>
                    {userData.name}
                  </h1>
                )}
                
                <div className="flex flex-wrap gap-6 text-gray-600">
                  {/* Birthday and Age Display */}
                  <div className="flex items-center gap-2">
                    <Cake className="w-5 h-5" style={{ color: '#FF7F11' }} />
                    {isEditing ? (
                      <Input
                        type="date"
                        value={userData.birthday}
                        onChange={(e) => setUserData({ ...userData, birthday: e.target.value })}
                        className="border rounded p-1"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-orange-500">
                          {calculateAge(userData.birthday)}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({formatBirthday(userData.birthday)})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Occupation */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {isEditing ? (
                      <Input
                        value={userData.occupation}
                        onChange={(e) => setUserData({ ...userData, occupation: e.target.value })}
                        className="border rounded p-1"
                      />
                    ) : (
                      <span>{userData.occupation}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: '#FF3F00' }} />
                  About Me
                </Label>
                {isEditing ? (
                  <Textarea
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    className="min-h-[120px] text-lg leading-relaxed resize-none"
                    placeholder="Share a bit about yourself..."
                  />
                ) : (
                  <div className="text-lg leading-relaxed">
                    {userData.bio || "No bio provided yet."}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Profile Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6" style={{ backgroundColor: '#FFFFFC' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#000000' }}>Interests</h3>
            {/* Add interests section content */}
          </Card>
          <Card className="p-6" style={{ backgroundColor: '#FFFFFC' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#000000' }}>Looking For</h3>
            {/* Add preferences section content */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;