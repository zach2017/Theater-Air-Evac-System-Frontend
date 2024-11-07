import React, { useEffect, useState, useRef } from 'react';

/*

Utility to save to local dynamdb when online and encrypt check.

*/
const LocalStorageListener = () => {
  const [storageValue, setStorageValue] = useState(localStorage.getItem('encryptedPatients') || '');
  const previousValueRef = useRef(storageValue);

  useEffect(() => {
    const handleStorageChange = (event) => {
 
      if (event.key === 'patients') {
        const oldValue = previousValueRef.current;
        const newValue = event.newValue;
      
        console.log('LocalStorage changed:');
        if (oldValue !== newValue) {
          console.log('LocalStorage changed:');
          console.log('Old Value:', oldValue);
          console.log('New Value:', newValue);
          console.log('Difference:', getDifference(oldValue, newValue));

          previousValueRef.current = newValue;
         
          setStorageValue(newValue);
        }
      }
    };

    const observeLocalStorage = () => {
      const storedValue = localStorage.getItem('patients');
     
      const oldValue = previousValueRef.current;
     
      if (storedValue !== oldValue) {
        console.log('LocalStorage changed locally:');
        console.log('Old Value:', oldValue);
     
        console.log()
        console.log('New Value:', storedValue);
        console.log('Difference:', getDifference(oldValue, storedValue));

        previousValueRef.current = storedValue;
        setStorageValue(storedValue);
      }
    };

    // Utility to get the difference between old and new values
    const getDifference = (oldValue, newValue) => {
      if (!oldValue || !newValue) return 'No previous value';
      // Assuming both oldValue and newValue are strings; parse JSON if needed
      let diffIndex = 0;
      while (diffIndex < oldValue.length && diffIndex < newValue.length && oldValue[diffIndex] === newValue[diffIndex]) {
        diffIndex++;
      }
      return `Difference starts at index ${diffIndex}: ${oldValue.slice(diffIndex)} -> ${newValue.slice(diffIndex)}`;
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(observeLocalStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  });

  return (
    <div>
    </div>
  );
};

export default LocalStorageListener;
