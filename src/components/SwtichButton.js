import { useState } from 'react';

const SwitchButton = ({onModeChange}) => {
  const [isDark, setIsDark] = useState(false);

  
  const toggleTheme = () => {
    onModeChange(!isDark ? 'light' : 'dark' );    
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        px-4 
        py-2 
        rounded-md 
        font-medium 
        transition-colors 
        duration-200
        ${isDark ? 
          'bg-gray-800 text-white hover:bg-gray-700' : 
          'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }
      `}
    >
      {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
};

export default SwitchButton;