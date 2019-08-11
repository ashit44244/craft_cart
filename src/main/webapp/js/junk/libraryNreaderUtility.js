/*
*? 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

/*var pagenavmap;
var currentPosition = 1; 		
var twoPage = true; 
var userkey;
var userbookkey;
var windowLocation=window.location.toString();	*/
var isConnected = navigator.onLine;
var userobj;
var currentTime = new Date();
function ajaxCallForChapter(fileLocation, htmlFileName, htmlFileKey, bLocalStorageFull, asyncFlag,bookName){
	////console.log('called :' +htmlFileName +' : ' +bLocalStorageFull);
	var dfd = $.Deferred();
	if(bookName==undefined){
		bookName=epubFileName;
	}
	if(isConnected){
//26/12		
	/*getFromIndexDatabase(bookName+"#"+htmlFileName).done(function (temp){*/
		getValueFromDatabase(bookName+"#"+htmlFileName).done(function (temp){
//**			
	if(temp=="null"||temp==null||temp==undefined){

		////console.log('prevent redundant saving of file');
		xhr =	$.ajax({//26/12
		type : 'POST',
		dataType : 'json',
		data : {
			fileName : fileLocation + htmlFileName,
			fileKey : htmlFileKey,
			fileType : 'html'
		},
		url : '../FileRequestServlet',
		async: asyncFlag,
		success : function(data, textStatus) {
		    var dataObj = decodeFileRequest(data);
		   // alert("inside the data obbbjj"+dataObj);
			if(!bLocalStorageFull){
			try{
				//store value of json key in local storage	
				storeValueInDatabase(bookName+"#"+htmlFileName, JSON.stringify(dataObj)).done(function (){
			//	  alert("inside save"+dataObj);
				  dfd.resolve();  
			  });
			} catch(e) {
				 ////console.log('catch error:' + e.name + ' e :' + e);
				 /* if(e.name === 'QuotaExceededError') {
					  replaceOldDataInLocalStore(bookName, dataObj);
				  }*/
			  }	 
			} else {
				//comes here when local storage got full
				////console.log("Data:>" + data);
				//var htmlData = $.parseHTML(data.content);	
				if(dataObj!=null){
				  $("base").attr("href",baseurl+htmlFileName);															
				  document.getElementById('epub_content').innerHTML=dataObj.content;			 	 
				//store value of currentPage in local storage
				  //storeValueInDatabase(bookName+"#"+'currentPage', htmlFileKey).done(function (){
				 	/*if(flag==1){
				 		//alert("flag :"+ flag);
				 		replaceOldDataInLocalStore(bookName, dataObj);
				 	}*/
			 	
			 	///s});
				  SaveInLocalStorage(bookName+"#"+'currentPage', htmlFileKey);
				  try {
						storeValueInDatabase(bookName+"#"+htmlFileName, JSON.stringify(dataObj)).done(function (){
						dfd.resolve();
						});
					} catch(e) {
						dfd.resolve();
					}
					dfd.resolve();	
			}	
			}},
		error : function(xhr, textStatus, errorThrown) {
			for(n in xhr) {
				////console.log('Error xhr:' + xhr[n]);
				}
			//console.log('FileRequestServlet file :' + fileLocation+htmlFileName);
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
			dfd.resolve();
		}
	});	}else{
		dfd.resolve();
		//console.log('prevent redundant saving of file');
	}
	
});
	}	
	else{
		dfd.resolve();
	}
	return dfd.promise();
};

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
//26/12
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
function userEbook(userName, ebook) {
	this.username = userName;
	this.ebook = ebook;
	this.HighLights = new Object();
	this.Notes = new Object();
	this.bookmarks = new Object();
	this.orphanHighLights = new Object();
	this.orphanNotes = new Object();
	this.orphanBookmarks = new Object();
	this.lastmodified=currentTime.getTime();
	this.lastsynched=currentTime.getTime();
}

function WebWorkerPool() {
    this.wwpool = [];
    for(var i=0;i<25;i++) {
    	var workerFlag = "flag"+i;
    	this.wwpool.push(workerFlag);
    }
}

WebWorkerPool.prototype.getWorkerFlag = function() {
    var wkrFlg = null;
    if (this.wwpool.length > 0) {
    	wkrFlg = this.wwpool.pop();
    }
    return wkrFlg;
};

WebWorkerPool.prototype.releaseWorkerFlag = function(wkr) {
    this.wwpool.push(wkr);
};
 
// Create a new pool
var myPool = new WebWorkerPool();
var baseurl1;
function ajaxCallForChapterWW(fileLocation, htmlFileName, htmlFileKey, bLocalStorageFull, asyncFlag, bookName) {
	
	var dfd = $.Deferred();

	if(bookName==undefined){
		bookName=epubFileName;
	}
	if(isConnected){
		getValueFromDatabase(bookName+"#"+htmlFileName).done(function (temp){
	
			if(temp=="null"||temp==null||temp==undefined){
				if (typeof (Worker) !== "undefined") {

					var workerFlag = myPool.getWorkerFlag();
					if(workerFlag == null) {
						//console.log("All 5 workers are busy : will retry the file " + htmlFileName +" after some time");
						dfd.resolve(false);
					} else {
						//alert("base url 1"+baseurl1);
						if(baseurl1 == undefined) {
							
							//You are in my library
							baseurl1 = "../WebContent/";
						}
				    	var worker = new Worker(baseurl1 + "js/getServerData_worker.js");
						worker.addEventListener('message', function(event) {
							var dataObj = decodeFileRequest(JSON.parse(event.data));
							if (!bLocalStorageFull) {
								//store value of json key in local storage	
								storeValueInDatabase(bookName+"#"+htmlFileName, JSON.stringify(dataObj)).done(function (){
									worker.terminate();
									myPool.releaseWorkerFlag(workerFlag);
									dfd.resolve(true);  
							  });
							}
						}, false);
						
						worker.postMessage({ "fileLocation":fileLocation, "htmlFileName":htmlFileName, "htmlFileKey":htmlFileKey, "obfuscation":obfuscation});
					}

				} else {
					alert("Sorry, your browser does not support Web Workers");
					dfd.resolve(false);
				}
			}
	
		});
	} else {
		dfd.resolve();
		console.log('prevent redundant saving of file');
	}
	return dfd.promise();
}

function saveAnnotations(epubFileName){
	
	var dfd = $.Deferred();
	var serverSyncJson;
    var username=GetFromLocalStorage("UserName",obfuscation);
		if(isConnected){
	   $.ajax({
			type : 'POST',
			async: false,
			
			data : {
				fileName : username +"#"+ epubFileName
				
				//currentPage:currentPage,
				//spineJson:spineJson
			},
			url :  '../LocalSyncServerData',
			success : function(response) {
				 response=decodeLocalSyncServer(response);
				 var str=response;
				 var ann = null;
				 var cur = null;
				    var sid = new Array();
				    if(str.indexOf("++")!= -1) {
				    sid = (str.split("++"));
				      ann=sid[0];
				      cur=sid[1];
				    } else {
				    	cur = str;
				    }
				  //  
				    if(ann!=null && $.trim(ann)!=="null")
				    	{
				    	try{
				    		//store value of annotations in local storage
				    		storeValueInDatabase(username +"#"+ epubFileName, ann).done(function (){
								
								dfd.resolve();	}
				    		);
							} catch(e) {
								 
								  if(e.name === 'QuotaExceededError') {
								
									  for (var i = 0; i < localStorage.length; i++){
										   if(localStorage.key(i).indexOf(bookName)== -1 && localStorage.key(i).indexOf('#json')==-1)
										    {
											   ////console.log('quota deleted file : '+ localStorage.key(i));
											   localStorage.removeItem(localStorage.key(i));
											  
										    }
										}
									  
									//store value of annotations in local storage
									  storeValueInDatabase(username +"#"+ epubFileName, ann).done(function (){
										  dfd.resolve();
							    		});
							    		
								  }
							}	 
				    	////console.log("updating localstorage..with annotations:"+ann);
				    	}
				    else{
				    	//Jan 24
				    	userobj=new userEbook(username, epubFileName);
						storeValueInDatabase(username +"#"+ epubFileName, JSON.stringify(userobj)).done(function (){
							
							dfd.resolve();	}
			    		);
				    }
				
			},
			error : function(xhr, textStatus, errorThrown) {
				for(n in xhr) {
					//console.log('Error xhr:' + xhr[n]);
					}
				
				//console.log('ServerSyncLocalStorage file :' + fileLocation+epubFileName);
				//console.log('textStatus :' + textStatus);
				//console.log('errorThrown :' + errorThrown);
				
		    }
		});
		}
		else{
			dfd.resolve();
		}

	return dfd.promise();
}


function clearContentFromLocalDB(bookId, bookName){
	//26/12
	//console.log("clearing: clearContentFromLocalDB bookName = " + bookName);
	var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	var dfd=$.Deferred();
	//var clearing=propertiesMap.Clearing;
	//var bookName=bookId.substring(16,bookId.length);
	getValueFromDatabase(bookName+"#json").done(function(spine_json){
//	
	//getValueFromDatabase(selectedNoteId.substring(16,selectedNoteId.length)+"#json").done(function(spine_json){
    	if(spine_json!=null){
	    	var json_obj=JSON.parse(spine_json);
	    	var spine=json_obj.spine;
	    	/*$("#"+selectedNoteId).html("Clearing...");
	    	deleteFromDatbase(selectedNoteId.substring(16,selectedNoteId.length)+"#json").done(function(){*/
	  //26/12
	    	//$("#"+bookId).html(clearing);
	    	deleteFromDatbase(bookName+"#json").done(function(){
		    	var total=Object.keys(spine).length;
		    	var count=0;
		  	//
		    	for (var file in spine){
		    		count++;
		    		console.log("deleted file name = " + file + " count = " + count);
		    		
		    		deleteFromDatbase(bookName+"#"+spine[file]).done(function(){
			    		
			    		//console.log("count = " + count + " total = " + total);
			    		if(count==total){
			    			/*$("#download_"+bookId).css("display","block");
			    			$("#"+bookId).html(propertiesMap.remove_download_success);*/
			    			dfd.resolve();
			    		}
			    		});
		    	}
		    });
	    }else {
	    		var elem = document.getElementById(bookId);
	    		//elem.style.setProperty('cursor','none','');
	    		elem.style.setProperty('text-decoration','none');
	    		$("#"+bookId).html("No content downloaded yet");
	    		dfd.resolve();
	    }
    });
	//console.log("return from clearContentFromLocalDB");
	return dfd.promise();

}


function getBookDownload(bookName,downloadBookId,displayBookId,donwloadIntitated,downloadView) {
	//console.log("getBookDownlaod bookName = " + bookName + " bookId = " + bookId);
	//var dfd=$.Deferred();
	//26/12
	var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	//var clear_download_content=propertiesMap.Clear_download_content;
	//var download_content=propertiesMap.Download_content;
	var  userName=GetFromLocalStorage("UserName", obfuscation);
	var initiating_download=propertiesMap.Initiating_download;
	//**
	var connected = navigator.onLine;
	if (connected) {
		//$("#cleardownloaded_"+bookName).attr('style','display:none');
		//26/12
		//$('#downloadedsts'+'_'+bookName).html(initiating_download);
		var json;
		var downloadDone=0;
		var userbookkey;
		$.ajax({
			type : 'POST',
			data : {
				//downloadBookId : bookIdDownload --changed in product-18/12
				bookName : bookName,
				userName:userName
			},
			//url : '../readerlibrary/BookDownloadServlet',--changed in product-18/12
			url : '../readerlibrary/DownloadContentServlet',
			success : function(data) {

				if(data.trim()!="null"){
					data=JSON.parse(data);
					spineJson = data.spine;
					if(data.userbookkey!=undefined){
					userbookkey=data.userbookkey;
				}
			/*changed in product-18/12
			 * 	json = data;
				window.open(json, '_self');*/
				
				//product code-18/12
				//spineJson = data;
				//alert("spineJson = " + spineJson);
				if(spineJson!="null"){
					bookToDownload=bookName;
					spineJsonObj=JSON.parse(spineJson);					
					var spine=spineJsonObj.spine;
					
					
					//$('#downloadedsts'+'_'+bookName).attr('style','display:block;font-family:Helvetica');
			//26/12
					/*$('#percentdownloaded'+'_'+bookName).attr('max',Object.keys(spine).length);
					$('#percentdownloaded'+'_'+bookName).attr('style','display:block');*/
					//$('#percentdownloaded'+'_'+bookName).attr('max',Object.keys(spine).length+2);
					$("#downloaddiv_" + downloadBookId).css('display', 'inline');// containin activity bar 
					//$("#stopdownload_" + downloadBookId).css('display', 'block');//stop download
					
					var counter=0;
					var totalFiles=(Object.keys(spine).length+2);
         //**
					if(userkey != undefined){
						SaveInLocalStorage(bookName+"#"+'userkey',userkey,obfuscation);
					}
					
					if(userbookkey != undefined){
						SaveInLocalStorage(bookName+"#"+'userbookkey',userbookkey,obfuscation);
					}
					
						getValueFromDatabase(bookName+"#json").done(function(spineAtDB){
							downloadInProgress = true;
									if(spineAtDB==null){
										
										$('#percentdownloaded'+'_'+bookName).attr('style','display:block;font-family: Helvetica;');
								//26/12
										//$('#percentdownloaded'+'_'+bookName).attr('style','display:block');
									//	$("#downloaddiv_" + downloadBookId).css('display', 'inline');// containin activity bar 
									//	$("#stopdownload_" + downloadBookId).css('display', 'block');//stop download
										storeValueInDatabase(bookName+"#json",spineJson).done(function(){
										//var counter=0;
										///	counter++;
											//$('#percentdownloaded'+'_'+bookName).attr('value',counter);
											//$('#downloadedsts'+'_'+bookName).html(parseInt((counter/totalFiles)*100)+"% "+ downloaded);
										saveAnnotations(bookName).done(function(){
										//	counter++;					
											//$('#percentdownloaded'+'_'+bookName).attr('value',counter);
											//$('#downloadedsts'+'_'+bookName).html(parseInt((counter/totalFiles)*100)+"% "+downloaded);
							  //**
										
									for(var count in spine){
										if(count!='pageindex'){
											updateChapterKeys.push(count);
											//	console.log(count+" is "+updateChapterKeys.length);
											}
									}
									console.log("noOfFiles:: "+noOfFiles+"-"+updateChapterKeys.length);
										noOfFiles=updateChapterKeys.length;
										console.log("noOfFiles:: "+noOfFiles+"-"+bookName);
									});
									//$('#percentdownloaded'+'_'+bookName).attr('style','display:none');comented out in product code
										});
									
									}
									else{
										console.log("json is already present in local database");
										//check how many files are already downloaded 
										saveAnnotations(bookName).done(function(){
											counter++;					
										//	$('#percentdownloaded'+'_'+bookName).attr('value',counter);
										//	$('#downloadedsts'+'_'+bookName).html(parseInt((counter/totalFiles)*100)+"% "+downloaded);
									for(var count in spine){
										if(count!='toc' && count!='pagenav'){
											updateChapterKeys.push(count);
										}
									}
									});
									}
									
									});
						}//**
					
				}else{
					displayError(propertiesMap.book_not_available,propertiesMap.close,"172px");
					if(downloadView.toLowerCase()=="libraryview"){
						displayUpdateButton(displayBookId, donwloadIntitated);
					}
				}
			},
			error : function(xhr, textStatus, errorThrown) {
				displayError(propertiesMap.book_not_available,propertiesMap.close,"172px");
				if(downloadView.toLowerCase()=="libraryview"){
					displayUpdateButton(displayBookId, donwloadIntitated);
				}
			}
		});
	}
	else{
		//$('#downloadedsts'+'_'+bookName).html(propertiesMap.no_internet_connection);
		displayError(propertiesMap.no_internet_connection,propertiesMap.close,"190px");
	
		//dfd.resolve();
	}	
	//return dfd.promise();
}