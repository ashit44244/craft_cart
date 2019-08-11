/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var iv = "0f0e0d0c0b0a09080706050403020100";
var salt = "0a0b0c0d0e0f09080706050403020100";
//plain text to encrypt
var plainText = "7afd57c7fc41e404ade4283b4c1661735179d565775836aecae88314f6da3eca"; 

//key params
var keySize = 128/32;
var iterations = iterationCount = 10;
if(isConnected){
userkey=$.trim(userkey);
userbookkey=$.trim(userbookkey);
}
else{
	userkey= $.trim(GetFromLocalStorage(epubFileName + "#" + 'userkey'));
	userbookkey= $.trim(GetFromLocalStorage(epubFileName + "#" + 'userbookkey'));

}
//alert(userkey);
//alert(userbookkey);
//var passPhrase="9268837154a927f0530390e44f459e29";
//var cipherText="6ouP++l2R1wsqdqOI2IsxupdbuNaGUF4mwIZEg1wDft+75V2s+b59JdR1qSte7j/";
var passPhrase=userkey;
var cipherText=userbookkey;
//console.log(passPhrase+" cipher "+cipherText);
//passphrase to generate key
//var passPhrase = "replace this with user key";

// get the key
var key = CryptoJS.PBKDF2(
      passPhrase, 
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount });

//encrypt the content  
//you need to pull encrypted userbook key from db along with user key
//var encrypted = CryptoJS.AES.encrypt(
//      plainText,
//      key,
//      { iv: CryptoJS.enc.Hex.parse(iv) });

//get the cipher text in base64
//var cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);


//extract cipher params
var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
  });
                  
//decrypt the content
var decrypted = CryptoJS.AES.decrypt(
		cipherParams,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });

//get decrypted string in utf-8
var decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
//alert("key for decryption:"+decryptedString);
//console.log("decryptedkeys:"+decryptedString);
//alert(decryptedString);
//console("decrypted key:"+decryptedString);
//decrypting userbook key using userkey

function decryptLS(stringFromLS)
{
	var dfd = $.Deferred();
	//	alert(stringFromLS);
		var temp=stringFromLS.substr(12,stringFromLS.length);
		var lastString=temp.substr(temp.lastIndexOf(","),temp.length);
		//alert(lastString);
		temp=temp.substr(0,temp.lastIndexOf(",")-1);

		 var encrypted = temp.replace(/\\/g, '');
         encrypted = encrypted.toString();
         var JsonFormatter = {
                 stringify: function (cipherParams) {
                     var jsonObj = {
                         ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
                     };
                     if (cipherParams.iv) {
                         jsonObj.iv = cipherParams.iv.toString();
                     }
                     if (cipherParams.salt) {
                         jsonObj.s = cipherParams.salt.toString();
                     }
                     return JSON.stringify(jsonObj);
                 },
                 parse: function (jsonStr) {
                     var jsonObj = JSON.parse(jsonStr);
                     var cipherParams = CryptoJS.lib.CipherParams.create({
                         ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
                     });
                     if (jsonObj.iv) {
                         cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
                     }
                     if (jsonObj.s) {
                         cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
                     }
                     return cipherParams;
                 }
             };
                 var keys =decryptedString; //"fedcba9876543210";
                 var decrypted = CryptoJS.AES.decrypt(encrypted, keys, {
                     format: JsonFormatter
                 });

                 ////console.log(decrypted.toString(CryptoJS.enc.Utf8).replace(/\"/g, '\\"'));
             //  //console.log("{\"content\":"+JSON.stringify(decrypted.toString(CryptoJS.enc.Utf8))+"\""+lastString);
               // return "{\"content\":"+JSON.stringify(decrypted.toString(CryptoJS.enc.Utf8))+lastString;
                dfd.resolve("{\"content\":"+JSON.stringify(decrypted.toString(CryptoJS.enc.Utf8))+lastString);

                return dfd.promise();

}





