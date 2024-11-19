
import{useEffect, useState} from 'react'
import CryptoJS from 'crypto-js';


 function useEncryptedStorage(key, defaultValue) {

    const getDecryptedValue = () => {
        try {
              const secretKey =+ 'x1' + `${process.env.TAES_KEY}` 
          const encryptedValue = localStorage.getItem(key);
          if (encryptedValue) {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
            const decryptedValue = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedValue;
          }
          return defaultValue;
        } catch (error) {
          console.error('Error decrypting value:', error);
          return defaultValue;
        }
      };

      const [value, setValue] = useState(getDecryptedValue);


    useEffect(() => {
        const secretKey =`${process.env.TAES_KEY}`
        try {
          // Convert value to string and encrypt it
          const valueStr = JSON.stringify(value);
          const encryptedValue = CryptoJS.AES.encrypt(valueStr, secretKey).toString();
          localStorage.setItem(key, encryptedValue);
        } catch (error) {
          console.error('Error encrypting value:', error);
        }
      });
    
      return [value, setValue];
}

export default useEncryptedStorage