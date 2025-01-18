import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SignupLayout from '../../components/signup/SignupLayout';

const GenderPage = ({ onSubmit, initialData }) => {
  // Initialize from session storage or initialData
  const [selectedGender, setSelectedGender] = useState(() => {
    const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
    return savedData.role_id || initialData?.role_id || null;
  });

  const navigate = useNavigate();

  // Update session storage when gender selection changes
  useEffect(() => {
    if (selectedGender !== null) {
      const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
      sessionStorage.setItem('signupFormData', JSON.stringify({
        ...savedData,
        role_id: selectedGender
      }));
    }
  }, [selectedGender]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedGender) {
      const submittedData = { role_id: selectedGender };
      
      // Update session storage with submitted data
      const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
      sessionStorage.setItem('signupFormData', JSON.stringify({
        ...savedData,
        ...submittedData
      }));

      onSubmit(submittedData);
      navigate('/signup/profile');
    }
  };

  return (
    <SignupLayout
      title="Select Gender"
      description="Please select your gender"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSelectedGender(1)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-lg border-2
              transition-all duration-200 hover:border-[#FF7F11]
              ${selectedGender === 1
                ? 'border-[#FF7F11] bg-[#FF7F11]/10'
                : 'border-gray-200 bg-white'
              }
            `}
          >
            <span className={`font-medium ${
              selectedGender === 1 ? 'text-[#FF7F11]' : 'text-gray-700'
            }`}>
              Female
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedGender(2)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-lg border-2
              transition-all duration-200 hover:border-[#FF7F11]
              ${selectedGender === 2
                ? 'border-[#FF7F11] bg-[#FF7F11]/10'
                : 'border-gray-200 bg-white'
              }
            `}
          >
            <span className={`font-medium ${
              selectedGender === 2 ? 'text-[#FF7F11]' : 'text-gray-700'
            }`}>
              Male
            </span>
          </button>
        </div>
        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#FF7F11] hover:bg-[#FF7F11]/90 disabled:opacity-50"
            disabled={!selectedGender}
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

GenderPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    role_id: PropTypes.number
  })
};

export default GenderPage;