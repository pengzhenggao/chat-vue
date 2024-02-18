import cryptoJs from 'crypto-js'
// 加密(16位)
let keyOne = '2825043977@qq123';
export function encrypt(word) {
    let key = cryptoJs.enc.Utf8.parse(keyOne)
    let enc = ''
    if (typeof word === 'string') {
        enc = cryptoJs.AES.encrypt(word, key, {
            // iv: iv
            mode: cryptoJs.mode.ECB,
            padding: cryptoJs.pad.Pkcs7
        })
    } else if (typeof word === 'object') {
        let data = JSON.stringify(word)
        enc = cryptoJs.AES.encrypt(data, key, {
            // iv: iv
            mode: cryptoJs.mode.ECB,
            padding: cryptoJs.pad.Pkcs7
        })
    }
    let encryptedData = enc.ciphertext;
    var encryptedBase64Str = encryptedData.toString().replace(/\//g, "_");
    encryptedBase64Str = encryptedBase64Str.replace(/\+/g,"-");

    return encryptedBase64Str;
}

//解密
export function decrypt(word) {
    let key = cryptoJs.enc.Hex.parse(keyOne)
    let dec = cryptoJs.AES.decrypt(cryptoJs.format.Hex.parse(word), key, {
        // vi: vi
        mode: cryptoJs.mode.ECB,
        padding: cryptoJs.pad.Pkcs7
    })
    return cryptoJs.enc.Utf8.stringify(dec)
}
