import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SignupLayout from '../../components/signup/SignupLayout';

const GenderPage = ({ onSubmit }) => {
  const [selectedGender, setSelectedGender] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedGender) {
      onSubmit({ role_id: selectedGender });
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
  onSubmit: PropTypes.func.isRequired
};

export default GenderPage;