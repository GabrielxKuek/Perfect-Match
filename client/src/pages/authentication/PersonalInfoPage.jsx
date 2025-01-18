import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SignupLayout from '../../components/signup/SignupLayout';

const PersonalInfoPage = ({ onSubmit, initialData }) => {
  // Initialize form data from session storage or initialData
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
    return {
      name: savedData.name || initialData?.name || '',
      birthday: savedData.birthday || initialData?.birthday || ''
    };
  });

  const [errors, setErrors] = useState({
    name: '',
    birthday: ''
  });
  const navigate = useNavigate();

  // Update session storage whenever form data changes
  useEffect(() => {
    const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
    sessionStorage.setItem('signupFormData', JSON.stringify({
      ...savedData,
      ...formData
    }));
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    
    // Validate birthday
    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 18); // Must be at least 18
      
      if (birthDate > minAge) {
        newErrors.birthday = 'You must be at least 18 years old';
      }
      
      const maxAge = new Date();
      maxAge.setFullYear(today.getFullYear() - 120); // Reasonable maximum age
      
      if (birthDate < maxAge) {
        newErrors.birthday = 'Please enter a valid birth date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submittedData = {
        name: formData.name.trim(),
        birthday: formData.birthday
      };
      
      // Update session storage with submitted data
      const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
      sessionStorage.setItem('signupFormData', JSON.stringify({
        ...savedData,
        ...submittedData
      }));
      
      onSubmit(submittedData);
      navigate('/signup/gender');
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

  // Calculate max date (must be at least 18 years old)
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString().split('T')[0];

  // Calculate min date (reasonable maximum age of 120 years)
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
    .toISOString().split('T')[0];

  return (
    <SignupLayout 
      title="Personal Information" 
      description="Tell us about yourself"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="border-gray-300 focus:border-blue-500"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthday">Date of Birth</Label>
          <Input
            id="birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleInputChange}
            min={minDate}
            max={maxDate}
            className="border-gray-300 focus:border-blue-500"
            required
          />
          {errors.birthday && (
            <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>
          )}
        </div>

        <div className="space-y-4">
          <Button 
            type="submit"
            className="w-full bg-[#FF7F11] hover:bg-[#FF7F11]/90"
          >
            Continue
          </Button>

          <Button 
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </form>
    </SignupLayout>
  );
};

PersonalInfoPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    birthday: PropTypes.string
  })
};

export default PersonalInfoPage;