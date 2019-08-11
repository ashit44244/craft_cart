/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
for (index in style1)
	cssName = style1[index];

window.onunload = function(){
	writeEbookMetaToLocal(userobj).done(function (){
		
	});
//26/12
	/*serversynclocaldata().done(function (){
		//console.log('after updating notes or highlights to server');	
		});*/
//**	
};
window.onbeforeunload=function(){

	serversynchistorydata();
	
};

function callServerData(){
	
	var dfd = $.Deferred();


	//scripts for server and localstorage sync
	//alert(username+epubFileName);
	var serverSyncJson;
	//alert('updating localstorage..');
	//GetFromDataStorage(username +"#"+ epubFileName).done(function (serverJson){
		//serverSyncJson=serverJson;
		//alert(serverSyncJson);
		//currentPage=localStorage.getItem(epubFileName +"#"+ currentFile);
		//spineJson=localStorage.getItem(epubFileName +"#"+ json);
		//alert(serverSyncJson);
		//alert(currentPage);
		//alert(spineJson);
		if(isConnected){
	   $.ajax({
			type : 'POST',
			async: false,
			
			data : {
				fileName : username +"#"+ epubFileName
				
				//currentPage:currentPage,
				//spineJson:spineJson
			},
			url : baseurl1 + 'LocalSyncServerData',
			success : function(response) {
				 response=decodeLocalSyncServer(response);
				////console.log("dbresponse :"+response);
				$("#loading").css("display", "none");
				$("#content").css("display", "block");
//26/12				
				$("#mylibrary_hidden").css("display", "none");
//**				
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
				  //  //console.log("annotation data**************"+ann);
				
				    if(ann!=null && $.trim(ann)!=="null")
				    	{
				    	 userobj = new userEbook(username, epubFileName);
				    	try{
				    		//store value of annotations in local storage
				    		SaveInDataStorage(username +"#"+ epubFileName, ann).done(function (){
				    			
				    			//localStorage.setItem(epubFileName +"#currentPage", cur);
								////console.log("updating localstorage..with currentPage:"+cur);
								//If User object was already created just update in that. Otherwise createEbookMetadata method will take care of it 
								/*if(userobj!=null){
									ebookmetadata = JSON.parse(ann);
									if(ebookmetadata!=null){
								    userobj.HighLights = ebookmetadata.HighLights;
								    userobj.Notes = ebookmetadata.Notes;
								    userobj.bookmarks = ebookmetadata.bookmarks;
								    userobj.orphanHighLights = ebookmetadata.orphanHighLights;
									userobj.orphanNotes = ebookmetadata.orphanNotes;
									userobj.orphanBookmarks = ebookmetadata.orphanBookmarks;

									}*/
								
								dfd.resolve();	}
				    		);
							} catch(e) {
								 ////console.log('catch error:' + e.name + ' e :' + e);
								  if(e.name === 'QuotaExceededError') {
									  ////console.log('inside QuotaExceededError');
									  for (var i = 0; i < localStorage.length; i++){
										   if(localStorage.key(i).indexOf(bookName)== -1 && localStorage.key(i).indexOf('#json')==-1)
										    {
											   ////console.log('quota deleted file : '+ localStorage.key(i));
											   localStorage.removeItem(localStorage.key(i));
											  // break;
										    }
										}
									  ////console.log('quota exceed save file in local storage :' + data.fileKey);
									  //localStorage.setItem(bookName+"#"+data.fileKey, JSON.stringify(data));
									  
									//store value of annotations in local storage
									  SaveInDataStorage(username +"#"+ epubFileName, ann).done(function (){
										//localStorage.setItem(epubFileName +"#currentPage", cur);
											////console.log("updating localstorage..with currentPage:"+cur);
											//If User object was already created just update in that. Otherwise createEbookMetadata method will take care of it 
											/*if(userobj!=null){
												ebookmetadata = JSON.parse(ann);
												if(ebookmetadata!=null){
											    userobj.HighLights = ebookmetadata.HighLights;
											    userobj.Notes = ebookmetadata.Notes;
											    userobj.bookmarks = ebookmetadata.bookmarks;
											    userobj.orphanHighLights = ebookmetadata.orphanHighLights;
												userobj.orphanNotes = ebookmetadata.orphanNotes;
												userobj.orphanBookmarks = ebookmetadata.orphanBookmarks;

												}*/
										  dfd.resolve();
							    		});
							    		
								  }
							}	 
				    	////console.log("updating localstorage..with annotations:"+ann);
				    	}
				    else{
				    	  userobj = new userEbook(username, epubFileName);
				    	 
				    	  SaveInDataStorage(username +"#"+ epubFileName, JSON.stringify(userobj)).done(function (){
				    		  serversynclocaldata();
				    	  dfd.resolve();
				    	  });
				    }
				
			},
			error : function(xhr, textStatus, errorThrown) {
				for(n in xhr) {
					////console.log('Error xhr:' + xhr[n]);
					}
	//26/12			//TO SHOW ERROR DIALOG 
				$("#loading").css("display", "none");
				$("#mylibrary_hidden").css("display", "none");
				//$("#error_popup").css("display", "block");
	//**			
				//console.log('ServerSyncLocalStorage file :' + fileLocation+epubFileName);
				//console.log('textStatus :' + textStatus);
				//console.log('errorThrown :' + errorThrown);
				
				//get values of json keys from local storage
				GetFromDataStorage(username +"#"+ epubFileName).done(function (annotation){
					var annotationData = annotation;	
					var currentPage = GetFromLocalStorage(epubFileName +"#currentPage");
					//If User object was already created just update in that. Otherwise createEbookMetadata method will take care of it 
					/*if(userobj!=null){
						ebookmetadata = JSON.parse(ann);
						if(ebookmetadata!=null){
						    userobj.HighLights = ebookmetadata.HighLights;
						    userobj.Notes = ebookmetadata.Notes;
						    userobj.bookmarks = ebookmetadata.bookmarks;
						    userobj.orphanHighLights = ebookmetadata.orphanHighLights;
							userobj.orphanNotes = ebookmetadata.orphanNotes;
							userobj.orphanBookmarks = ebookmetadata.orphanBookmarks;

						}*/
					
					dfd.resolve();
				});
				
		    }
		});
		}
		else{
	//26/12
			 $("#loading").css("display", "none");
				$("#content").css("display", "block");
				$("#mylibrary_hidden").css("display", "none");

	//**
			dfd.resolve();
		}
		/* UI Cust by suman */
	  /* $("#epub-book-title").html(epubMetaDetails["title"]);*/
	  $("#bookTitle").html(epubMetaDetails["title"]);
	//}); ///important first time not encoded
	
	

	
	return dfd.promise();
}
//mouse over for long booktitle
$(document).on("mouseover", "#bookTitle", function() {
	//console.log("mouseover");
	var title=$("#bookTitle").text();
	var element = document.querySelector("#bookTitle");
	if((element.offsetWidth) < element.scrollWidth){
		//console.log("text overflow");
		$("#bookTitle").text(title);
		$("#bookTitle").css('font-size','12px');
	   
	}

});
$(document).on("mouseleave", "#bookTitle", function() {
	//console.log("mouseleave");
	
	var title=$("#bookTitle").text();
	$("#bookTitle").text(title);
	$("#bookTitle").css('font-size','18px');
	
});

/*$(document).ready(function(){
	var elementId=GetURLParameter("arg5");
	var topicKey=GetURLParameter("arg6");
	var file=GetURLParameter("arg7");
	var book=GetURLParameter("arg8");
	var html=GetURLParameter("arg1");
	var offset=GetURLParameter("arg2");
	var nodeName=GetURLParameter("arg3");
	var bookname=GetURLParameter("arg4");
	var firstPage = null;
	var key = null;
	var topicKeyNew=null;
	 for (var x in spine) {
		 ////console.log('spine index key: ' + x);
		 if(x!='toc' && x!='cover' && x!='pagenav')
			 spineIndex.push(x);
	 }
	 
	for(key in spine) {
		if(key!='toc' && key!='cover' && key!='pagenav'){
			  firstPage = spine[key];
			  break;
		}
	}
	createEbookHistoryMeta(username,epubFileName);
	loadChapters(firstPage,key);
	callServerData().done(function (){
		//book name need to change dynamically
		//readEbookMetaFromLocal('user1', 'a-christmas-carol3');
		if(elementId==undefined && topicKey==undefined && file==undefined && html==undefined && offset==undefined){
		if (firstPage != null) {
			$("base").attr("href",baseurl+firstPage);
			createEbookMetadata(username, epubFileName).done(function (){
				
						
			});
			
			//addChapterMetadata(firstPage);
			 //for get meta data details
			/*setTimeout(function() {
				writeEbookMetaToLocal(userobj);
			}, 5000);
			*/
	/*	}
		
		}
		else if((html!=undefined)){
			for (key in spine) {
				if (key == html) {
				file = spine[key];
				break;
				}
				}
			    createEbookMetadata(username, epubFileName).done(function (){
						status='true';
						$("#wrapper").css("visibility", "hidden");
						$("#hidden_content").css("visibility", "visible");
						loadChapters(file,html);
							scrollChapter(null, offset,null,html);	
						
						
			    });
				
		}
		else if(elementId!=undefined){
			for (key in spine) {
				if (spine[key] == file) {
					topicKeyNew = key;
					break;
				}
		    }
			 createEbookMetadata(username, epubFileName).done(function (){
			
			  	 $("#wrapper").css("visibility", "hidden");
				 $("#hidden_content").css("visibility", "visible");
				 loadChapters(file,topicKeyNew);
					 CFINavigation(file,topicKeyNew,elementId);	 
					 
					//	setTimeout(getLatest(),3000);
				
		
			 
			
			
				});

		}
		
		
	});
	
	
	/*
	 * set time for write for every 5 min
	setTimeout(function() {
		writeEbookMetaToLocal(userobj);
	}, (5 * 60 * 1000));
	*/
	
	 //for get meta data details
/*	window.setInterval(function(){
		writeEbookMetaToLocal(userobj);
		}, 10000);
*/	

 //});


function serversynclocaldata(){ 
	//alert(username+epubFileName);
	var dfd = $.Deferred();
	
	//console.log('updating db..');
	////console.log(ebookmetadata);
	//get value of json key from local storage
//	GetFromDataStorage(username +"#"+ epubFileName).done(function (serverJson){
		//serverSyncJson=ebookmetadata;
	//console.log("serverSyncJson:"+userobj);
//26/12	
	var currdate=userobj.lastsynched;
//**
	serverJson=JSON.stringify(userobj);
	//get value of currentPage from local storage
	currentPage=GetFromLocalStorage(epubFileName +"#currentPage"); 
	
	if(getObfuscation()==1){
		
		//console.log('getObfuscation(): '+getObfuscation());
		
		//call method to encode data
		serverJson=encodeData(serverJson);
				
	}

	//spineJson=localStorage.getItem(epubFileName +"#"+ json);
	//alert(serverSyncJson);
	//console.log("updating DB..with currentPage:"+currentPage);
	//console.log("updating DB..with annotations:"+serverJson);
	//alert(currentPage);
	//alert(spineJson);
	if(isConnected){
   $.ajax({
		type : 'POST',
		data : {
			fileName : username +"#"+ epubFileName,
			serverSyncJson : serverJson,
			currentPage:currentPage,
			lastmodified: currdate//26/12
			//spineJson:spineJson
		},
		url : baseurl1+'ServerSyncLocalStorage',
		success : function(response) {
			////console.log('File Name: loc + htmlFile >' + fileLocation + htmlFileName );
			////console.log('from JSON :>' +  JSON.stringify(data.fileKey));
			//response.setContentType("application/json");
			/*check */
			response= JSON.parse(response);
			//console.log("status for annotation Sync :"+response.syncStatus);
			/*check */
			dfd.resolve();
		},
		error : function(xhr, textStatus, errorThrown) {
			for(n in xhr) {
				////console.log('Error xhr:' + xhr[n]);
				}
			//console.log('ServerSyncLocalStorage file :' + fileLocation+htmlFileName);
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
			dfd.resolve();
		}
   });
	}
	else{
		dfd.resolve();
	}
   
//});
return dfd.promise();	
}


function navigateToPositionPaginator(scrollwidth, epubWidth,offset,nav,action){
	var noTextWidth = parseInt($('#hidden_content').css("padding-left"), 10)
			+ parseInt($('#hidden_content').css("padding-right"), 10);
	var extraSpace = "";
	// check if its in the first page
	if (nav != "pagination") {
		if (offset == 0
				&& (scrollwidth == noTextWidth || (epubWidth + noTextWidth === scrollwidth))) {
			// No text at the left of the anchor, no need to scroll
			currentPosition = 1;
			shiftPosition = 0;
			pageLength = $("#epub_content")[0].scrollWidth;
			if (pageLength > shiftPosition) {
				$("#epub_content").css("right", shiftPosition + "px");
				$("#epub_content").css("opacity", "1");
			}
		} else if(action=="offlinesearch"){
			// if its not in the first page
			var length = scrollwidth;
			var width = parseInt($('#epub_content').css('width'), 10);
			var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
			currentPosition = ((length) / (width + gap));
			currentPosition = Math.floor(currentPosition);
			shiftPosition = currentPosition * (width + gap);
			pageLength = $("#epub_content")[0].scrollWidth;
			if (pageLength > shiftPosition) {
				$("#epub_content").css("right", shiftPosition + "px");
				$("#epub_content").css("opacity", "1");
			} else if (pageLength < shiftPosition) {
				shiftPositionNew = shiftPosition / 2;
				$("#epub_content").css("right", shiftPositionNew + "px");
				$("#epub_content").css("opacity", "1");
			}
			currentPosition = currentPosition + 1;
		}
		else{
			// if its not in the first page
			var length = scrollwidth;
			var width = parseInt($('#epub_content').css('width'), 10);
			var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
			currentPosition = ((length) / (width + gap));
			currentPosition = Math.round(currentPosition);
			shiftPosition = currentPosition * (width + gap);
			pageLength = $("#epub_content")[0].scrollWidth;
			if (pageLength > shiftPosition) {
				$("#epub_content").css("right", shiftPosition + "px");
				$("#epub_content").css("opacity", "1");				
			} else if (pageLength < shiftPosition) {
				shiftPositionNew = shiftPosition / 2;
				$("#epub_content").css("right", shiftPositionNew + "px");
				$("#epub_content").css("opacity", "1");				
			}
			currentPosition = currentPosition + 1;
		}
			

	} else {
		if (scrollwidth == noTextWidth
				|| (epubWidth + noTextWidth === scrollwidth)) {
			// No text at the left of the anchor, no need to scroll
			currentPosition = 1;
			shiftPosition = 0;
			pageLength = $("#epub_content")[0].scrollWidth;
			if (pageLength > shiftPosition) {
				$("#epub_content").css("right", shiftPosition + "px");
				$("#epub_content").css("opacity", "1");
			}
		}

		else {
			// if its not in the first page
			var length = scrollwidth;
			var width = parseInt($('#epub_content').css('width'), 10);
			var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
			currentPosition = ((length) / (width + gap));
			/*check */
			currentPosition = Math.floor(currentPosition);
			/*check */
			shiftPosition = currentPosition * (width + gap);
			pageLength = $("#epub_content")[0].scrollWidth;
			if (pageLength > shiftPosition) {
				$("#epub_content").css("right", shiftPosition + "px");
				$("#epub_content").css("opacity", "1");
				/*check */
				currentPosition = currentPosition + 1;
				/*check */
			} else if (pageLength < shiftPosition) {
				shiftPositionNew = shiftPosition / 2;
				/*check */				
				currentPosition = ((shiftPositionNew) / (width + gap));
				shiftPositions = currentPosition * (width + gap);
				currentPosition = Math.round(currentPosition);
				$("#epub_content").css("right", shiftPositions + "px");
				/*check */
				$("#epub_content").css("opacity", "1");
			}
			/*check removed*/
		//	currentPosition = currentPosition + 1;
			/*check removed*/
		}
	}
	$("#wrapper").css("visibility", "visible");
	$("#hidden_content").css("visibility", "hidden");
	//currentPosition = currentPosition + 1;
}
