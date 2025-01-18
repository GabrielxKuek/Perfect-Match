import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Briefcase, Calendar, Edit2, Save } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "johndoe",
    name: "John Doe",
    birthday: "1990-01-01",
    occupation: "Software Developer",
    bio: "Passionate about creating amazing web experiences and solving complex problems."
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#BEB7A4' }}>
      <Card className="max-w-3xl mx-auto" style={{ backgroundColor: '#FFFFFC' }}>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold" style={{ color: '#000000' }}>Profile</CardTitle>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              style={{ backgroundColor: isEditing ? '#FF3F00' : '#FF7F11' }}
              className="hover:opacity-90"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex justify-center">
            <div className="relative">
              <UserCircle className="w-32 h-32" style={{ color: '#318CE7' }} />
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={userData.username}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Birthday
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  value={userData.birthday}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, birthday: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  value={userData.occupation}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, occupation: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  className="min-h-[100px] border-gray-300"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;