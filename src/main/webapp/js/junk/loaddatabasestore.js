/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var idbRequest;
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var db;
var browserType;
var readerlib = {};
readerlib.webdb = {};
readerlib.webdb.db = null;
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isSafari = (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) ||  /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
var isIPad=(/(iPad|iPhone|iPod)/g.test( navigator.userAgent) );
//alert("isIPad::: "+isIPad);
function loadDatabase(){
	var dfd = $.Deferred();

	if(isSafari){
		openWebSqlDatabase().done(function (){
		dfd.resolve(); 	
		});
		 
	}else{
	 openIndexDatabase().done(function (){
			dfd.resolve(); 	
		});
	}
	 return dfd.promise();
}

function openIndexDatabase(){
	var dfd = $.Deferred();
	var  dbSize = 50 * 1024 * 1024; //5mb
	 idbRequest = indexedDB.open("ReaderDB");
	
	 idbRequest.onsuccess = function (evt) {
         db = idbRequest.result;
         //console.log("db"+db+"indexedDB"+indexedDB); 
         dfd.resolve(db);   
      
     };

     idbRequest.onerror = function (evt) {
         //console.log("IndexedDB error: " + evt.target.errorCode);
     };

     idbRequest.onupgradeneeded = function (evt) {                   
    	 var objectStore = evt.currentTarget.result.createObjectStore(
                 "readerObjectList", { keyPath: "key"});
     };
     
     return dfd.promise();
}

function openWebSqlDatabase(){
	var dfd = $.Deferred();
	  var dbSize = 50 * 1024 * 1024; // 50MB
	  readerlib.webdb.db = openDatabase("db", "1.0", "ReaderDB", dbSize);
	  
	  readerlib.webdb.db.transaction(function(tx) {
	      tx.executeSql("CREATE TABLE IF NOT EXISTS myLib(key text PRIMARY KEY, value  TEXT)", []);
	  	dfd.resolve();
	  });
	  return dfd.promise();
}

function storeValueInDatabase(keyvalue,keystoreobject){
	var dfd = $.Deferred();
	if(isSafari){
		updateWebSqlDatabase(keyvalue,keystoreobject).done(function (){
			dfd.resolve();
		});
	}else{
		updateIndexDatabase(keyvalue,keystoreobject).done(function (){
			dfd.resolve();
		});
	}
	 return dfd.promise();
}

//function updateIndexDatabase(keyvalue,keystoreobject){
//	var dfd = $.Deferred();
//	//console.log("db in update is****"+transaction);
//	//checkIfObjectExist(keyvalue);
//	 var transaction = db.transaction("readerObjectList","readwrite");
//	 //console.log("transaction is****"+transaction);
//     var objectStore = transaction.objectStore("readerObjectList");                    
//     var request = objectStore.add({ key: keyvalue, keyobject: keystoreobject });
//     request.onsuccess = function (evt) {
//         // do something after the add succeeded
//    	 //console.log("saved value with key ****"+keyvalue);
//    	 dfd.resolve();
//     };
//     request.onError=function(evt){
//    	    //console.log("update error*******");
//    	    dfd.resolve();
//    	    };
//    return dfd.promise();
//}
function updateIndexDatabase(keyvalue,keystoreobject){
    var dfd = $.Deferred();
    var transaction = db.transaction("readerObjectList","readwrite");
    //console.log("transaction is****"+transaction);
   var objectStore = transaction.objectStore("readerObjectList");  
   var request = objectStore.openCursor(keyvalue);
   request.onsuccess = function(e) {
     var cursor = e.target.result;
     if (cursor) { // key already exist
        cursor.update({ key: keyvalue, keyobject: keystoreobject });
     } else { // key not exist
        objectStore.add({ key: keyvalue, keyobject: keystoreobject});      
     }
     dfd.resolve();
   };
  
   request.onError=function(evt){
        //console.log("update error*******");
        //check for error condition 
       
        };
  return dfd.promise();
}



function updateWebSqlDatabase(keyvalue,keystoreobject){
	var dfd = $.Deferred();
			if(isIPad){
			checkone(keyvalue,keystoreobject).done(function(){
				dfd.resolve();
			});
			}
		else{
	  var websqldb = readerlib.webdb.db;
	  
	  websqldb.transaction(function(tx){
	    tx.executeSql("INSERT INTO myLib(key,value) VALUES (?,?)",
	        [keyvalue,keystoreobject],
	        readerlib.webdb.onSuccess= function (evt) {
	         // do something after the add succeeded
	    	dfd.resolve();
	     },
	     readerlib.webdb.onError = function(tx, e) {
	    	 if(e.message=="constraint failed" ||  tx.message==undefined){
	    		 WebSqlDatabaseupdate(keyvalue,keystoreobject);
	    	 }
	    	 //console.log("There has been an error: " + e.message+" tx "+tx.message);
	    	 dfd.resolve();
	    	});
	   });}
	  return dfd.promise();
}

function WebSqlDatabaseupdate(keyvalue,keystoreobject){
	var dfd = $.Deferred();
	  var websqldb = readerlib.webdb.db;
//26/12
		 var storedata= JSON.stringify(keystoreobject);  
//**
	  websqldb.transaction(function(tx){
	    tx.executeSql("UPDATE myLib set value=? where key=? ",
//26/12
	    		[storedata,keyvalue],
	        //[keystoreobject,keyvalue],
//**	    		
	        readerlib.webdb.onSuccess= function (evt) {
	         // do something after the add succeeded
	    	//console.log('websql updated');
	    	dfd.resolve();
	     },
	     readerlib.webdb.onError = function(tx, e) {
	    	 //console.log("There has been an error update :: " + e.message+" tx "+tx.message);
	    	 dfd.resolve();
	    	});
	   });
	  return dfd.promise();
}


function getValueFromDatabase(keyvalue){
var dfd = $.Deferred();
if(isSafari){
	getFromWebSqlDatabase(keyvalue).done(function (response){
		dfd.resolve(response);
	});
}else{
	getFromIndexDatabase(keyvalue).done(function (response){
		dfd.resolve(response);
	});
}	
 return dfd.promise();
 }

function getFromIndexDatabase(keyvalue){
	  var dfd = $.Deferred();
	  var transaction = db.transaction("readerObjectList", "readonly"); 
	//  //console.log("db******read"+db+"indexedDB"+indexedDB); 
var responseObjectDetails;
var objectStore = transaction.objectStore("readerObjectList");  
var request = objectStore.get(keyvalue);  
////console.log("key value is**********"+keyvalue);
request.onsuccess = function(evt) {
	if(request.result != undefined && request.result != null){ //Modified - 24/02
		responseObjectDetails=request.result.keyobject;
	//var response= JSON.stringify(request.result);
	//if(response!=undefined){
	//var responseDet=JSON.parse(response);
	//responseObjectDetails=responseDet.keyobject;
	////console.log("Name for id 1 "+responseDet+"*******"+responseObjectDetails); 
	//JSON.stringify(responseObjectDetails);
	dfd.resolve(responseObjectDetails);
	}else{
		dfd.resolve(null);	
	}
};
request.onError=function(evt){
    //console.log("error");
    dfd.resolve();
    };
return dfd.promise();
}

function getFromWebSqlDatabase(keyvalue){
var dfd = $.Deferred();
if(isIPad){
	keyvalue=keyvalue.replace("/","");
	getFileContent(keyvalue+".txt").done(function(returned){
		dfd.resolve(returned); 
	});	  
}
else{
var responseObjectDetails=null;
var webdb = readerlib.webdb.db;

webdb.transaction(function(tx) {
  tx.executeSql("SELECT * FROM myLib where key=(?)", [keyvalue],function (tx, results)  {
       // do something after the getting row succeeded
	  var len = results.rows.length, i;
	   for (i = 0; i < len; i++){
		   var rowOutput = results.rows.item(i);
		   //if the value is not a json, then simply pass the raw value 
		   //responseObjectDetails = (rowOutput.value.indexOf("\"") == -1 ? rowOutput.value : JSON.parse(rowOutput.value));
		   //responseObjectDetails= JSON.parse(rowOutput.value);
		   responseObjectDetails= rowOutput.value;
		   dfd.resolve(responseObjectDetails);  
		    //console.log("******"+responseObjectDetails);
			//var bookDetails = JSON.parse(ab);
			
	   }
	   if(len==0){

		   dfd.resolve(responseObjectDetails); 

		   }

  	 
   },
   readerlib.webdb.onError = function(tx, e) {
  	 //console.log("There has been an error: " + e.message+" tx "+tx.message);
	   
  	 dfd.resolve();
  	});
  
});}

return dfd.promise();
}

function deleteFromDatbase(keyvalue) {
	var dfd = $.Deferred();
	if(isSafari){
		deleteFromWebSqlDatabase(keyvalue).done(function (response){
			dfd.resolve(response);
		});
	}else{
		deleteFromIndexDB(keyvalue).done(function (response){
			dfd.resolve(response);
		});
	}	
	 return dfd.promise();

}

function deleteFromIndexDB(key){
	var dfd = $.Deferred();
	  var transaction = db.transaction("readerObjectList","readwrite");
	    //console.log("transaction is****"+transaction);
	   var objectStore = transaction.objectStore("readerObjectList"); 
	   var request = objectStore.openCursor(key);
		request.onsuccess = function (event){
		    var cursor = event.target.result;
		    if (cursor) {
		      var key = cursor.key;
		      var primaryKey = cursor.primaryKey;
		      objectStore["delete"](key);
		      dfd.resolve();
		     
	 }
		  
	  
	  };
	  request.onerror=function(){
		  displayError(propertiesMap.error,propertiesMap.close,"172px");
	    	//alert("ERROR!!");
	    };
	  return dfd.promise();
}

function deleteFromWebSqlDatabase(key){
	var dfd = $.Deferred();
	  var sqldb = readerlib.webdb.db;
	  sqldb.transaction(function(tx){
	    tx.executeSql("DELETE FROM myLib WHERE key=?", [key],
	       readerlib.webdb.onSuccess= function (evt) {
	                // do something after the add succeeded
	    	   dfd.resolve();  
	     },
	     readerlib.webdb.onError = function(tx, e) {
	      	 //console.log("There has been an error: " + e.message+" tx "+tx.message);
	    	 dfd.resolve();
	      	});	
	    });
	  return dfd.promise();
}
/* 1/8 - removed the BrowserDetect to be inline with product code*/ 


function checkIfObjectExist(objectID){
	var dfd=$.Deferred();
    var request = indexedDB.open("ReaderDB");
    request.onsuccess = function() {
        var db = request.result;
        var transaction = db.transaction("readerObjectList", 'readonly');
        var objectStore = transaction.objectStore("readerObjectList");
        var selectRequest = objectStore.get(objectID);
        selectRequest.onsuccess = function (e) {
            if (e.target.result != null) {
             
               dfd.resolve("True");
               
            }else{
            	dfd.resolve("False");
                //console.log("Object doesn't exist");
            }
        };

    };
    return dfd.promise();
}
