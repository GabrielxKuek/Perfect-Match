import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SignupLayout from '../../components/signup/SignupLayout';
import { Textarea } from "@/components/ui/textarea";
import { signup } from "../../services/api/authentication";

const ProfilePage = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
    return {
      occupation: savedData.occupation || initialData?.occupation || '',
      bio: savedData.bio || initialData?.bio || ''
    };
  });

  const [errors, setErrors] = useState({
    occupation: '',
    bio: '',
    submit: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
    sessionStorage.setItem('signupFormData', JSON.stringify({
      ...savedData,
      ...formData
    }));
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.occupation.trim().length < 2) {
      newErrors.occupation = 'Occupation must be at least 2 characters long';
    }
    
    if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        setErrors(prev => ({ ...prev, submit: '' }));

        const submittedData = {
          occupation: formData.occupation.trim(),
          bio: formData.bio.trim()
        };

        // Get all form data from session storage
        const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
        const allFormData = {
          ...savedData,
          ...submittedData
        };

        // Make signup API call with all form data
        const response = await signup({
          username: allFormData.username,
          password: allFormData.password,
          name: allFormData.name,
          birthday: allFormData.birthday,
          role_id: allFormData.role_id,
          occupation: allFormData.occupation,
          bio: allFormData.bio
        });

        // Clear session storage after successful signup
        sessionStorage.removeItem('signupFormData');
        
        // Call onSubmit with the final data
        onSubmit(submittedData);
        
        // Navigate to success page or login
        navigate('/login');
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to complete signup. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

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
            placeholder="Enter your occupation"
            className="border-gray-300 focus:border-blue-500"
            required
          />
          {errors.occupation && (
            <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            className="border-gray-300 focus:border-blue-500 min-h-[100px]"
            required
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
          )}
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm">{errors.submit}</p>
        )}

        <div className="space-y-4">
          <Button 
            type="submit"
            className="w-full bg-[#FF7F11] hover:bg-[#FF7F11]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Completing Signup...' : 'Complete Signup'}
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
  initialData: PropTypes.shape({
    occupation: PropTypes.string,
    bio: PropTypes.string
  })
};

export default ProfilePage;