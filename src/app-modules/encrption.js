
import crypto from 'crypto-js';
import { escape } from 'lodash';

export const globalKey = '8674834030082752'

export const Encrption = (id) => {
    const CryptoJS = require('crypto-js');
    const key = CryptoJS.enc.Utf8.parse("8674834030082752");
    const iv = CryptoJS.enc.Utf8.parse("9845009819491522");

    let srcs = CryptoJS.enc.Utf8.parse(id);
    let encryptedId = CryptoJS.AES.encrypt(srcs, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString()
    return encodeURIComponent(id)
}

export const telehealthEncrption = (id, isEncoded = true) => {
    const CryptoJS = require('crypto-js');
    const key = CryptoJS.enc.Utf8.parse(globalKey);
    const iv = CryptoJS.enc.Utf8.parse("9845009819491522");
    let srcs = CryptoJS.enc.Utf8.parse(id);
    let encryptedId = CryptoJS.AES.encrypt(srcs, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString()
    
    return isEncoded ? encodeURIComponent(encryptedId) : encryptedId;
}


export const telehealthDecrption = (id) => {
    const CryptoJS = require('crypto-js');
    const key = CryptoJS.enc.Utf8.parse(globalKey);
    const iv = CryptoJS.enc.Utf8.parse("9845009819491522");
    
    let srcs = decodeURIComponent(id);
    let decryptedId = CryptoJS.AES.decrypt(srcs, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(crypto.enc.Utf8)

    return decryptedId
}


export const EncrpytUrl = (id) => {
    let CryptoJS = require("crypto-js");
    let ciphertext = CryptoJS.AES.encrypt(id, globalKey).toString();
    return ciphertext;

}

export const DecrpytUrl = (ciphertext) => {
    let CryptoJS = require("crypto-js");
    let bytes = CryptoJS.AES.decrypt(ciphertext, globalKey);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText

}