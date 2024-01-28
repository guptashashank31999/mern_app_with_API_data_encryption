import CryptoJS from 'crypto-js';
const decrypt = 'YourEncryptionKe'; 

const ProductEncrypt = (actualResult) => {
    let decryptedData = CryptoJS.AES.decrypt(actualResult, decrypt ).toString(CryptoJS.enc.Utf8);
    return decryptedData;
}

export default ProductEncrypt;