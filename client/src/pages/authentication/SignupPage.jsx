import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import CredentialsPage from './CredentialsPage';
import PersonalInfoPage from './PersonalInfoPage';
import GenderPage from './GenderPage';
import ProfilePage from './ProfilePage';

const SIGNUP_STEPS = [
  '/signup/credentials',
  '/signup/personal',
  '/signup/gender',
  '/signup/profile'
];

const SignupPage = () => {
  // Initialize formData from session storage
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(sessionStorage.getItem('signupFormData') || '{}');
    return savedData;
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Sync formData with session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('signupFormData', JSON.stringify(formData));
  }, [formData]);

  // Prevent accessing steps out of order
  useEffect(() => {
    const currentStepIndex = SIGNUP_STEPS.indexOf(location.pathname);
    if (currentStepIndex === -1) {
      navigate(SIGNUP_STEPS[0]);
      return;
    }

    // Check if previous steps are completed
    const requiredFields = {
      '/signup/personal': ['username', 'password'],
      '/signup/gender': ['username', 'password', 'name', 'birthday'],
      '/signup/profile': ['username', 'password', 'name', 'birthday', 'role_id']
    };

    const required = requiredFields[location.pathname];
    if (required && !required.every(field => formData[field])) {
      navigate(SIGNUP_STEPS[0]);
    }
  }, [location.pathname, formData, navigate]);

  const handleFormUpdate = (stepData) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        ...stepData
      };
      // Update session storage
      sessionStorage.setItem('signupFormData', JSON.stringify(newData));
      return newData;
    });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/signup/credentials" replace />}
      />
      <Route
        path="credentials"
        element={
          <CredentialsPage
            onSubmit={handleFormUpdate}
            initialData={formData}
          />
        }
      />
      <Route
        path="personal"
        element={
          <PersonalInfoPage
            onSubmit={handleFormUpdate}
            initialData={formData}
          />
        }
      />
      <Route
        path="gender"
        element={
          <GenderPage
            onSubmit={handleFormUpdate}
            initialData={formData}
          />
        }
      />
      <Route
        path="profile"
        element={
          <ProfilePage
            onSubmit={handleFormUpdate}
            initialData={formData}
          />
        }
      />
      <Route
        path="*"
        element={<Navigate to="/signup/credentials" replace />}
      />
    </Routes>
  );
};

export default SignupPage;