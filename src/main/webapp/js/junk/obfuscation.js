/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
//variable to store obfuscation status
var obfuscation;

//getter for obfuscation
function getObfuscation(){
	return obfuscation;
}

//caller for obfuscation servlet
$(document).ready(function() {
	if (isConnected) {
	$.ajax({
		type : 'POST',
		url : baseurl1+'obfuscation',
		success : function(response) {
			var json = JSON.stringify(response);
			//console.log(json);
			json=json.replace(/"/g,"");
			json=json.substring(0,json.length-4);
			obfuscation = json;
		},
		error : function(xhr, textStatus, errorThrown) {
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
		}
	}); }
});

//method to store json key-value pair in local storage
function SaveInLocalStorage(strKey, strVal){  

	//encode if obfuscation is enabled
	if(obfuscation==1){  
		try{        
			strVal=window.btoa(unescape(encodeURIComponent(strVal)));
		}
		catch(err){
			console.error("error: "+err);
		}
	}
	localStorage.setItem(strKey,strVal); 
}

//method to retrieve json key values from local storage
function GetFromLocalStorage(strKey){
	
	
	var stringToDecode = localStorage.getItem(strKey);
	var DRM=1;
	if(DRM==1&&stringToDecode!= null&&stringToDecode!= undefined &&stringToDecode.indexOf("\"ct")==14){
		stringToDecode=decryptLS(stringToDecode);
		}
		//alert(stringToDecode);
	else{
	if(stringToDecode!= undefined){
		//decode if obfuscation is enabled
		if(obfuscation==1){
			try{
				stringToDecode=decodeURIComponent(escape(window.atob(stringToDecode)));
				
			}
			catch(err){
				console.error("error: "+err);
			}
		} 
	}
	}
	return stringToDecode;
}


//method to store json key-value pair in local storage
function SaveInDataStorage(strKey, strVal){  
	var dfd = $.Deferred();
	//encode if obfuscation is enabled
	if(obfuscation==1){  
		try{        
			strVal=window.btoa(unescape(encodeURIComponent(strVal)));
		}
		catch(err){
			console.error("error: "+err);
		}
	}
	
	storeValueInDatabase(strKey,strVal).done(function (){
		dfd.resolve();
	}); 
	return dfd.promise();
}

//method to retrieve json key values from local storage
function GetFromDataStorage(strKey){
	var dfd = $.Deferred();
	getValueFromDatabase(strKey).done(function (stringToDecode){
		var DRM=1;
		//stringToDecode= JSON.stringify(stringToDecode);
		if(typeof stringToDecode === 'object')
			{
			stringToDecode= JSON.stringify(stringToDecode);
			}
		if( stringToDecode!= null ){
		if(DRM==1&&stringToDecode!= null && stringToDecode.indexOf("\"ct")==14){
			decryptLS(stringToDecode).done(function(decryptedString){
				stringToDecode=decryptedString;
				//alert('x');
			});
			}else{
		if(stringToDecode!= undefined){
			//decode if obfuscation is enabled
			if(obfuscation==1){
				try{
					stringToDecode=decodeURIComponent(escape(window.atob(stringToDecode)));
					
				}
				catch(err){
					console.error("error: "+err);
				}
			} 
		}
	  }
		}
		dfd.resolve(stringToDecode);
		
	});
	
	return dfd.promise();
}

//method to encode data
function encodeData(strVal){
	var strVal=window.btoa(unescape(encodeURIComponent(strVal)));
	return strVal;
}

//method to decode data
function decodeData(strVal){
	var strVal=decodeURIComponent(escape(window.atob(strVal)));
	return strVal;
}

//method to decode EpubReaderServlet response on the client side
function decodeEpubReader(data){
	if(obfuscation==1){
		json = JSON.stringify(data);
		json = json.replace(/"/g,"");
		json = json.substring(0,json.length-4);
		json = window.atob(json);
		return json;
	}
	else{
		return data;
	}
}

//method to decode LocalSyncServerData response on the client side
function decodeLocalSyncServer(response){
	if(obfuscation==1){
		var json = JSON.stringify(response);
		json=json.replace(/"/g,"");
		json=json.substring(0,json.length-4);	
		if(!(json=='null++null')){
			json=decodeURIComponent(escape(window.atob(json)));
		}
		return json;	
	}
	else{
		return response;
	}	
}

//method to decode FileRequestServlet response on the client side
function decodeFileRequest(data){
	if(obfuscation==1){
		var json = data;
		json.content = decodeURIComponent(escape(window.atob(json.content)));
		json.fileKey = decodeURIComponent(escape(window.atob(json.fileKey)));
		return json;
	}
	else{
		return data;
	}
}

//method to decode SearchRequestHandlerServlet response on the client side
function decodeSearchRequest(response){	
	if(obfuscation==1){
		var json = JSON.stringify(response);
		//console.log(json);
		json=json.replace(/"/g,"");
		json=decodeURIComponent(escape(window.atob(json)));
		return JSON.parse(json);
	}
	else{
		return JSON.parse(response);
	}
}

function updateBookForOfflineAccess(){
	var connected = navigator.onLine;
	if (connected) {
	SaveInLocalStorage(username+bookName+"Offline",true);
	}
}
