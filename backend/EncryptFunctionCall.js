const encryptionKey = 'YourEncryptionKe'; 
const crypto = require('crypto-js');

const encryptFunction = (products) => {
    let encryptData = crypto.AES.encrypt(JSON.stringify(products), encryptionKey).toString();
    return encryptData;
}

module.exports = { encryptFunction }
