
import CryptoJS from 'crypto-js';


const secretKey =`${process.env.TAES_KEY}`

console.log(secretKey)
export function encryptData(data) {

  // Encrypt data
  if ( secretKey ) {
  console.log(secretKey)
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

  // Store encrypted data in local storage
  localStorage.setItem("LastEncrypt", encryptedData);
  return encryptedData;
  } else {
    alert('Encryption Failed ERROR insecurely!');
  }
  return "ERROR";
}


export function decryptData(encryptedData) {

  if (encryptedData) {
    if ( secretKey ) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData
    } else {
      alert ( "ERROR")
      return "ERROR"
    }
  } else {
    alert('No data found.');
  }
}
