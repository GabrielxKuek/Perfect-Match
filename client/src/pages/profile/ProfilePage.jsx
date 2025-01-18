import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Briefcase, Edit2, Save, Camera, Heart, Cake } from 'lucide-react';

import { getUser } from "../../services/api/user";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser(sessionStorage.getItem("username"));
        if (response.success) {
          const user = response.user;
          setUserData({
            username: user.username,
            name: user.name,
            birthday: user.birthday.split('T')[0],
            occupation: user.occupation,
            bio: user.bio,
          });
        } else {
          console.error("Failed to fetch user data.", response);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    console.log("User data saved:", userData);
  };

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#BEB7A4' }}>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 overflow-hidden" style={{ backgroundColor: '#FFFFFC' }}>
          {/* Hero Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-100 to-orange-50">
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="absolute top-4 right-4 z-10"
              style={{ backgroundColor: isEditing ? '#FF3F00' : '#FF7F11' }}
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
            <div className="relative inline-block">
              <div className="rounded-full border-4 border-white overflow-hidden" style={{ backgroundColor: '#FFFFFC' }}>
                <UserCircle className="w-40 h-40" style={{ color: '#318CE7' }} />
              </div>
              {isEditing && (
                <Button 
                  className="absolute bottom-2 right-2 rounded-full p-2"
                  style={{ backgroundColor: '#FF7F11' }}
                >
                  <Camera className="w-4 h-4" />
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
                
                <div className="flex gap-6 text-gray-600">
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