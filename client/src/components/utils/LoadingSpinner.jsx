import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#BEB7A4]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-white mb-4 mx-auto" />
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  );
};
LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;