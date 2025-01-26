import React from 'react';
// Import your PNG image
import loaderImage from './Webloader.svg'; // Update this path to your image location

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin">
        <img 
          src={loaderImage} 
          alt="Loading..." 
          className="w-20 h-20" // Adjust size as needed
        />
      </div>
    </div>
  );
};

export default Loader; 