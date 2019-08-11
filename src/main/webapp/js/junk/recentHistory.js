/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var sortedHistoryListDescending=[];
var sortedHistoryListAscending=[];
function dataToHistoryObject(){
	var dfd=$.Deferred();
	//console.log('inside recenthistory.js document.reaady');
	var serverSyncJson;
	serverSyncJson=GetFromLocalStorage(username +"#history"); 
	////console.log(username+"........"+epubFileName+"///////////"+serverSyncJson);
	if(isConnected){
	$.ajax({
		type : 'POST',
		data : {
			userid : username +"#"+ epubFileName
			//commented out on Jan 24
			//,serverSyncJson : serverSyncJson
		},
		datatype:json,
		url : baseurl1+'LocalSyncServerHistory',
		success : function(response) {
			 //response=decodeLocalSyncServer(response);
			 var strHistory=response;
			 if(strHistory!=null && $.trim(strHistory)!="null" && strHistory!="")
		    	{
		    	try{
						var history = JSON.parse(strHistory);
						if(history!=null && history!="null"  ){
						    SaveInLocalStorage(username +"#history",strHistory);
						 	//var history = GetFromLocalStorage(username +"#history");
							//If User object was already created just update in that. Otherwise createEbookMetadata method will take care of it 
							if(historyobj!=null){
								historyMetadata = JSON.parse(strHistory);
								if(historyMetadata!=null){
									historyobj.History=historyMetadata;

								}
								if(historyobj.History[epubFileName]!=undefined){
								    $('#back').removeClass('disabled');
								    sortedHistoryListAscending=historyobj.sortHistory(epubFileName);
									sortedHistoryListDescending=historyobj.reverseArray(sortedHistoryListAscending);//for back button
									backCounter=sortedHistoryListDescending.length-1;
								    }
							}
						}
						dfd.resolve();
					} catch(e) {
						  if(e.name === 'QuotaExceededError') {
							  for (var i = 0; i < localStorage.length; i++){
								   if(localStorage.key(i).indexOf(bookName)== -1 && localStorage.key(i).indexOf('#json')==-1)
								    {
									   localStorage.removeItem(localStorage.key(i));
								    }
								}
			    		SaveInLocalStorage(username +"#history", strHistory);
						  }
						  dfd.resolve();
					}	 
		    	////console.log("updating localstorage..with history:"+strHistory);
		    	}
			 else{
				 dfd.resolve();
			 }
			
	},
	error : function(xhr, textStatus, errorThrown) {
		for(n in xhr) {
			////console.log('Error xhr:' + xhr[n]);
			}
		////console.log('LocalSyncServerHistory file :' + fileLocation+htmlFileName);
		/////console.log('textStatus :' + textStatus);
		////console.log('errorThrown :' + errorThrown);
		//decode value of json from local storage
 	//var history = GetFromLocalStorage(username +"#history");
		//If User object was already created just update in that. Otherwise createEbookMetadata method will take care of it 
		if(historyobj!=null){
			historyMetadata = JSON.parse(serverSyncJson);
			if(historyMetadata!=null){
				historyobj.History=historyMetadata;

			}
			if(historyobj.History[epubFileName]!=undefined){
			    $('#back').removeClass('disabled');
			    sortedHistoryListAscending=historyobj.sortHistory(epubFileName);
				sortedHistoryListDescending=historyobj.reverseArray(sortedHistoryListAscending);//for back button
				backCounter=sortedHistoryListDescending.length-1;
			    }
			    dfd.resolve();
		}
	}
});
	}
	else{
		temphist=GetFromLocalStorage(username +"#history"); 
		if(historyobj!=null){
			historyMetadata = JSON.parse(temphist);
			if(historyMetadata!=null){
				historyobj.History=historyMetadata;

			}
			if(historyobj.History[epubFileName]!=undefined){
			    $('#back').removeClass('disabled');
			    sortedHistoryListAscending=historyobj.sortHistory(epubFileName);
				sortedHistoryListDescending=historyobj.reverseArray(sortedHistoryListAscending);//for back button
				backCounter=sortedHistoryListDescending.length-1;
			    }
			    dfd.resolve();
		}
		 dfd.resolve();
	}
	return dfd.promise();
}

function serversynchistorydata(){ 

	var serverSyncJsonForUser;

	
	serverSyncJsonForUser=GetFromLocalStorage(username +"#history");
	
	//currentPage=GetFromLocalStorage(epubFileName +"#currentPage",1); 
	//spineJson=localStorage.getItem(epubFileName +"#"+ json);
	//alert(serverSyncJson);
	////console.log("updating DB..with currentPage:"+currentPage);
	////console.log("updating DB..with history:"+serverSyncJsonForUser);
	//alert(currentPage);
	//alert(spineJson);
	if(isConnected){
   $.ajax({
		type : 'POST',
		data : {
			userid : username +"#"+ epubFileName,
			serverSyncJson : serverSyncJsonForUser
		},
		async:false,
		url : baseurl1+'ServerSyncLocalHistory',
		success : function(response) {
			////console.log('File Name: loc + htmlFile >' + fileLocation + htmlFileName );
			////console.log('from JSON :>' +  JSON.stringify(data.fileKey));
			//response.setContentType("application/json");
			/*check */
			response= JSON.parse(response);
			//console.log("syncStatus for History :"+ response.syncStatus);
			/*check */
		},
		error : function(xhr, textStatus, errorThrown) {
			for(n in xhr) {
				////console.log('Error xhr:' + xhr[n]);
				}
			//console.log('ServerSyncLocalHistory file :' + fileLocation+epubFileName);
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
		}
	});
	}
	
}


var backCounter;	
function backwardAction(){
	if(backCounter!=undefined){
		$('#forward').removeClass('disabled');
		}
		if ($('#back').hasClass('disabled')) return;	
		backCounter = (backCounter - 1) ;
	    if(sortedHistoryListDescending[backCounter]!=undefined){
	    //navigate on the basis of sorted history list
	    	historyobj.navigateToHistory(sortedHistoryListDescending[backCounter],epubFileName);
	     }
	    if(backCounter==0){
			$('#back').addClass('disabled');
		}
}
function forwardAction(){
if(backCounter!=undefined){
	$('#back').removeClass('disabled');
	}
	if ($('#forward').hasClass('disabled')) return;
	backCounter = (backCounter + 1) ;
    if(sortedHistoryListDescending[backCounter]!=undefined){
    //navigate on the basis of sorted history list
    	historyobj.navigateToHistory(sortedHistoryListDescending[backCounter],epubFileName);
    }
    if(backCounter==sortedHistoryListDescending.length-1){
		$('#forward').addClass('disabled');
	}
}
$("#back").click(function(){
	backwardAction();
});
$("#forward").click(function(){
	forwardAction();
});

userHistoryEbook.prototype.addHistoryItem=function (bookname,offset,actionPerformed){
	historyMeta=this.History;
	if(historyMeta!=undefined ){
		if(historyMeta[bookname]!=undefined){
		$('#back').removeClass('disabled');
	var previousObj=(historyMeta[bookname][0]);
	previousObjOffset=previousObj.offsets;
	previousObjHtml=previousObj.htmlName;
	if(previousObjOffset==offset.toString() && previousObjHtml==GetFromLocalStorage(userobj.ebook+"#currentPage")){
		historyMeta[bookname].splice(0, 1);
	}
	else if(actionPerformed=='next' ||actionPerformed=='previous'){
		historyMeta[bookname].splice(0, 1);
	}
	}
	
	if (!(bookname in historyMeta)){
		historyMeta[bookname] = new Array();	}
	
	var value = new Object();
	value.timestamp=new Date().getTime();
	value.htmlName=GetFromLocalStorage(bookName+"#currentPage");
	value.nodeName=GetFromLocalStorage(bookName+"#subtopic");
	value.pageNo=GetFromLocalStorage(bookName+"#realPageNum");
	value.offsets=JSON.stringify(offset);
	value.nodeNameValue=getChapterName(value.htmlName,value.nodeName);
	historyMeta[bookname].push(value);
	sortedHistoryListAscending=this.sortHistory(bookname);
	sortedHistoryListDescending=this.reverseArray(sortedHistoryListAscending);//for back button
	backCounter=sortedHistoryListDescending.length-1;
	$('#forward').addClass('disabled');
	}
};

userHistoryEbook.prototype.navigateToHistory=function(historyObj,bookname){

	var html=historyObj.htmlName;
	var nodeName=historyObj.nodeName;
	var pageNo=historyObj.pageNo;
	var offset=historyObj.offsets;
	//var nodeNameValue=historyObj.nodeNameValue;
	//store value of currentPage in local storage
	SaveInLocalStorage(bookName + "#" + 'currentPage', html);
	loadChapters(spine[html], html).done(function(){
	$("#wrapper").css("visibility", "hidden");
	$("#hidden_content").css("visibility", "visible");
	// }
	 readEbookMetaFromLocal(username, epubFileName).done (function (ebookmdata){	
		 ebookmetadata=ebookmdata;
	//store value of subtopic in local storage
	SaveInLocalStorage(bookname + "#" + 'subtopic', nodeName);
	setTimeout(function() {
		scrollChapter(null, offset);
		$("#hidden_content").css("visibility", "hidden");
		$("#wrapper").css("visibility", "visible");
	
	}, 10); 
	
	//store value of realPageNum in local storage
	/*SaveInLocalStorage(bookName + "#realPageNum", pageNo);
	$('.page_no_field').val(pageNo);
	pagetojump=(pageNo);
	rePaintSlider((pageNo));*/
	//selectPageNumInFooter(pageNo);
	// $('.page_no_field').val(pageNo);
	showBookMarkIcon();
	$("#popup_container").fadeOut();
	$("#background_overlay").css('display', 'none');
	
	updateRealPageNum().done(function(pc){	
		 setTimeout(placeAllNoteIcon(null,pc),000);
	});

	return false;});
	});
};
		
userHistoryEbook.prototype.sortHistory=function(bookname){
	var historyMeta=this.History;
	var arraySorted=[];
	for ( var book in historyMeta) {
		if(book==bookname){
		var bookOpen = historyMeta[book];
		
			arraySorted=bookOpen.sort(function(a,b)
			{  var d1 = new Date(a.timestamp);
			var d2 = new Date(b.timestamp); 
			return d2-d1;});
		}
	}
	return arraySorted;
};

userHistoryEbook.prototype.reverseArray=function(sortedHistoryListAscending)
{   var reverse=[];
    for(var i=0;i<(sortedHistoryListAscending.length)/2;i++)
    {   
        var temp = sortedHistoryListAscending[i];
        reverse[i] = sortedHistoryListAscending[sortedHistoryListAscending.length - i - 1];
        reverse[sortedHistoryListAscending.length - i - 1] = temp;
    }
    return reverse;
};
/* UI Cust Suman*/
/*$('#book_store').on("click",function(){*/
$('#mylibrary_link').on("click",function(){
	var curPage = GetFromLocalStorage(bookName + "#" + 'currentPage');
	manageSync().done(function(){
		  //event.preventDefault();
		  //event.stopPropagation();
		    	 //setMyLibraryHostName();
	});
	document.getElementById("mylibrary_link").href="/ePubReader/readerlibrary/myLibrary.html";
	findStartingWords(spine[curPage],curPage,'highlight').done(function(offset){
		historyobj.addHistoryItem(userobj.ebook,offset,'bookstoreclick');
		writeHistoryToLocal(historyobj);
		serversynchistorydata();
	});
	localStorage.removeItem('textFlag');
});

