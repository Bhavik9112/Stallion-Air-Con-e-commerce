
import React from 'react';
import { useStore } from '../context/StoreContext';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto" }) => {
  const { siteLogo } = useStore();
  
  return (
    <img 
      src={siteLogo} 
      alt="Stallion Air Con Logo" 
      className={`${className} object-contain`}
      style={{
        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
      }}
    />
  );
};

export default Logo;
