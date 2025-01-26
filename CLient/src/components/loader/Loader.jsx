import React from 'react';
import loaderImage from './Webloader-W.svg'; // Update path to your SVG

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <img 
        src={loaderImage} 
        alt="Loading..." 
        className="w-40 h-40 animate-blink" // Increased size from w-20 h-20
      />
    </div>
  );
};

export default Loader;
