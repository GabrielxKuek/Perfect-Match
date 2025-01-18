import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SignupLayout from '../../components/signup/SignupLayout';
import { signup } from "../../services/api/authentication";

const ProfilePage = ({ onSubmit, allFormData }) => {
  const [formData, setFormData] = useState({
    occupation: '',
    bio: ''
  });
  const [errors, setErrors] = useState({
    occupation: '',
    bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.occupation.trim().length < 2) {
      newErrors.occupation = 'Occupation must be at least 2 characters long';
    }
    
    if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters long';
    }
    
    if (formData.bio.trim().length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
        const finalData = {
          ...allFormData,
          occupation: formData.occupation.trim(),
          bio: formData.bio.trim()
        };
  
        const response = await signup(finalData);
        
        if (response.data.success) {
          // Store the user data in localStorage or your auth context
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Call the onSubmit callback with both form data and user data
          onSubmit({
            ...formData,
            user: response.data.user
          });
          
          // Navigate to the appropriate page after successful signup
          navigate('/dashboard'); // Or any other protected route
        } else {
          // Handle unsuccessful signup (status 200 but success: false)
          setSubmitError(response.data.message || 'Signup was not successful. Please try again.');
        }
      } catch (error) {
        console.error('Signup failed:', error);
        setSubmitError(
          error.response?.data?.message || 
          'An error occurred during signup. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const characterCount = formData.bio.length;
  const maxBioLength = 500;

  return (
    <SignupLayout 
      title="Complete Your Profile" 
      description="Tell us more about yourself"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            placeholder="What do you do?"
            className="border-gray-300 focus:border-blue-500"
            required
          />
          {errors.occupation && (
            <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="bio">Bio</Label>
            <span className="text-sm text-gray-500">
              {characterCount}/{maxBioLength}
            </span>
          </div>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            className="min-h-32 border-gray-300 focus:border-blue-500"
            maxLength={maxBioLength}
            required
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
          )}
        </div>

        {submitError && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-500 text-sm">{submitError}</p>
          </div>
        )}

        <div className="space-y-4">
          <Button 
            type="submit"
            className="w-full bg-[#FF7F11] hover:bg-[#FF7F11]/90 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Signup'}
          </Button>

          <Button 
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Back
          </Button>
        </div>
      </form>
    </SignupLayout>
  );
};

ProfilePage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  allFormData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    birthday: PropTypes.string.isRequired,
    role_id: PropTypes.number.isRequired
  }).isRequired
};

export default ProfilePage;