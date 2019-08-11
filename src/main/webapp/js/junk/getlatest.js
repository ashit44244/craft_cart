/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
function getLatest(){
	var html=GetURLParameter("arg1");
	var offset=GetURLParameter("arg2");
	var nodeName=GetURLParameter("arg3");
	var bookname=GetURLParameter("arg4");
	var elementId=GetURLParameter("arg5");
	var topicKey=GetURLParameter("arg6");
	var file=GetURLParameter("arg7");
	var book=GetURLParameter("arg8");
	
	for (var x in spine) {
		 ////console.log('spine index key: ' + x);
		 if(x!='toc' && x!='cover' && x!='pagenav' && x!='pageindex')
			 spineIndex.push(x);
	 }
	 
	for(key in spine) {
		if(key!='toc' && key!='cover' && key!='pagenav' && key!='pageindex'){
			  firstPage = spine[key];
			  break;
			}
	}
	
		//case 1: history navigation for specific history
		 if((html!=undefined)){ 
				for (key in spine) {
					if (key == html) {
					file = spine[key];
					break;
					}
					}
				   // createEbookMetadata(username, epubFileName).done(function (){
							status='true';
							$("#wrapper").css("visibility", "hidden");
							$("#hidden_content").css("visibility", "visible");
							loadChapters(file,html).done(function(){
								scrollChapter(null, offset,null,html);	
								if(window.history.replaceState){

									window.history.replaceState({}, "", "../"+bookname+"/read?");

									}
								
							});
							
				   // });
	
			}
		// case 2: cross ebook navigation
			else if(elementId!=undefined){
				for (key in spine) {
					if (spine[key] == file) {
						topicKeyNew = key;
						break;
					}
			    }
				// createEbookMetadata(username, epubFileName).done(function (){
				
				  	 $("#wrapper").css("visibility", "hidden");
					 $("#hidden_content").css("visibility", "visible");
					 loadChapters(file,topicKeyNew).done(function(){
						 CFINavigation(file,topicKeyNew,elementId);	 
						 if(window.history.replaceState){

								window.history.replaceState({}, "", "../"+book+"/read?");

								}
					 }); 
						//	setTimeout(getLatest(),3000);
					
			
				 
				
				
				//	});
	}
	
			
			//case 3: historyobj is present but no specific history or cross ebook navigation, navigate to last viewed
			else if(html==undefined && offset==undefined && elementId==undefined && file==undefined && historyobj.History[epubFileName]!=undefined){
	
				/*$.ajax({
					type : 'POST',
					dataType:'json',
					data : {
						userid : username+"#"+epubFileName,
						bookname : epubFileName
						
						//serverSyncJson : serverSyncJson
					},
					async:false,
					url : baseurl1+'LocalSyncServerHistory',
					success : function(response) {
						//console.log('here');*/
						//response=decodeLocalSyncServer(response);
					
						//SaveInLocalStorage(username +"#history",historyDetails);
						var historyDetails=historyobj.History;
						
						for(var history in historyDetails){
							if(history==epubFileName){
					  		var list = historyDetails[history];
				             //alert("in getlatestNew");
					  			var htmlName = list[0].htmlName;
					  			var nodeName = list[0].nodeName;
					  			var pageNo = list[0].pageNo;
					  			var offsets = list[0].offsets;
					  			
					  			var strBook = htmlName+"~~"+offsets+"~~"+pageNo+"~~"+nodeName;
					  			
					  			if(strBook==null){
					  				
					  			}
					  			else{
					  				showClickedPage(strBook);
					  			}
							}
						}				
				/*	},
					error : function(xhr, textStatus, errorThrown, req) {
						for(n in xhr) {
							//console.log('Error xhr:' + xhr[n]);
						}
						////console.log('ServerSyncLocalHistory file :' + fileLocation+htmlFileName);
						//console.log('textStatus :' + textStatus);
						//console.log('errorThrown :' + errorThrown);
					}*/
			//	});
			}
		 //case 4: no history, book opened for first time, load first page
			else if(elementId==undefined && topicKey==undefined && file==undefined && html==undefined && offset==undefined && historyobj.History[epubFileName]==undefined){
				if (firstPage != null) { 
					$("base").attr("href",baseurl+firstPage);
					loadChapters(firstPage,key).done(function(){
					addChapterMetadata(firstPage);
			 //for get meta data details
				    	 alignFirstPage();

					});
			
				}
		
			}
	/*
		if(book==undefined){
		if(window.history.replaceState){

			window.history.replaceState({}, "", "../"+bookname+"/read?");

			}
		}
		else{
			if(history.replaceState){

				window.history.replaceState({}, "", "../"+book+"/read?");

				}
		}*/
	
}

function getLatestSync(){
	var dfd=$.Deferred();
	var html=GetURLParameter("arg1");
	var offset=GetURLParameter("arg2");
	var nodeName=GetURLParameter("arg3");
	var bookname=GetURLParameter("arg4");
	var elementId=GetURLParameter("arg5");
	var topicKey=GetURLParameter("arg6");
	var file=GetURLParameter("arg7");
	var book=GetURLParameter("arg8");
	var pageno=GetURLParameter("arg9");
	var asyncFlag = false;
	
	for (var x in spine) {
		 if(x!='toc' && x!='cover' && x!='pagenav')
			 spineIndex.push(x);
	}
	 
	for(key in spine) {
		if(key!='toc' && key!='cover' && key!='pagenav'){
			firstPage = spine[key];
			break;
		}
	}
	
	//case 1: history navigation for specific history
	if((html!=undefined)){ 
		for (key in spine) {
			if (key == html) {
				file = spine[key];
				break;
			}
		}
		status='true';
		$("#wrapper").css("visibility", "hidden");
		$("#hidden_content").css("visibility", "visible");
		ajaxCallForChapter(fileLocation, spine[html], spine[html], bLocalStorageFull, asyncFlag).done(function(){
			loadChapters(file,html).done(function(){
				scrollChapter(null, offset,null,html);	
				//10/2
				/*SaveInLocalStorage(epubFileName + "#realPageNum", (pageno));
				$('.page_no_field').val(pageno);
				pagetojump=(pageno);
				rePaintSlider((pageno));*/
				/*updateRealPageNum().done(function(){		
				});*/
				updateRealPageNum().done(function(pc){	
				//	 setTimeout(placeAllNoteIcon(null,pc),400);
				});
				showBookMarkIcon();
			   // setTimeout(placeAllNoteIcon,0400);
				if(window.history.replaceState){
					window.history.replaceState({}, "", "../"+bookname+"/read?");
                    dfd.resolve();
				}
			});
	    });
	}
	// case 2: cross ebook navigation
	else if(elementId!=undefined){
		for (key in spine) {
			if (spine[key] == file) {
				topicKeyNew = key;
				break;
			}
	    }
		$("#wrapper").css("visibility", "hidden");
		$("#hidden_content").css("visibility", "visible");
		ajaxCallForChapter(fileLocation, topicKeyNew, topicKeyNew, bLocalStorageFull, asyncFlag).done(function(){
			loadChapters(file,topicKeyNew).done(function(){
				CFINavigation(file,topicKeyNew,elementId);	 
				if(window.history.replaceState){
					window.history.replaceState({}, "", "../"+book+"/read?");
					dfd.resolve();
				}
			 }); 
		});
	}
	//case 3: historyobj is present but no specific history or cross ebook navigation, navigate to last viewed
	else if(html==undefined && offset==undefined && elementId==undefined && file==undefined && historyobj.History[epubFileName]!=undefined){
		var historyDetails=historyobj.History;
		for(var history in historyDetails){
			if(history==epubFileName){
		  		var list = historyDetails[history];
	  			var htmlName = list[0].htmlName;
	  			var nodeName = list[0].nodeName;
	  			var pageNo = list[0].pageNo;
	  			var offsets = list[0].offsets;
	  			var strBook = htmlName+"~~"+offsets+"~~"+pageNo+"~~"+nodeName;
	  			if(strBook==null){
	  			}
	  			else{
	  				$("#wrapper").css("visibility", "hidden");
	  				$("#hidden_content").css("visibility", "visible");
	  				ajaxCallForChapter(fileLocation,spine[htmlName], spine[htmlName], bLocalStorageFull, asyncFlag).done(function(){
	  				//	loadChapters(spine[htmlName],htmlName).done(function(){
	  						showClickedPage(strBook).done(function(){
	  							dfd.resolve();
	  						});
	  				//	});
					});
	  			}
			}
		}				
	}
	//case 4: no history, book opened for first time, load first page
	else if(elementId==undefined && topicKey==undefined && file==undefined && html==undefined && offset==undefined && historyobj.History[epubFileName]==undefined){
		if (firstPage != null) { 
			$("base").attr("href",baseurl+firstPage);
			ajaxCallForChapter(firstPage, key, key, bLocalStorageFull, asyncFlag).done(function(){
				loadChapters(firstPage,key).done(function(){
					addChapterMetadata(firstPage);
					alignFirstPage();
					dfd.resolve();

				});
			});
		}
	}
	return dfd.promise();
}


