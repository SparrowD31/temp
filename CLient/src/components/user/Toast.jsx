import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-x-0 bottom-8 flex justify-center items-center pointer-events-none z-50">
      <div className="bg-black text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up pointer-events-auto">
        {message}
      </div>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};