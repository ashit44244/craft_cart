/*
*? 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

//26/12
/*getIndexParsingDone is the variable to  check whether get Index is already called. This function should be called only once  for a book*/
var getIndexParsingDone=false;
var windowHeight = parseInt($("#epub_content").height()); 
$(document).ready(function(){
	
	var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	var syncing=propertiesMap.label_syncing;
	
	setTimeout(function(){
		 manageSync().done(function(){
			 
				//alert(".....syncing+....");
				 });
			},5000);
			setInterval(function(){
				 // sync
				 manageSync().done(function(){
					 serversynchistorydata();
				 //alert(syncing+".....");
				 });
			},5*60*1000);

});

//setting the base url for a book
var windowLocation=window.location.toString();
var baseurl = windowLocation.substring(0, windowLocation.indexOf("index.html"));
$("base").attr("href",baseurl);
window.addEventListener("online", function() {
	console.log("online # readerview");
	//Search UI
	$("#searchButton").css("display","inline");
	 $("#offsearchbuttons").css("display","none");
	  $("#resetDiv").css("display","none");
	  $("#offlineSearch").css("display","none");
	  stopSearch();
	var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	var you_are_online=propertiesMap.you_are_online;
	displayError(you_are_online,propertiesMap.close,"172px");
	 isConnected=true;
	 var annotations_synced=propertiesMap.annotations_synced;
	//setTimeout( serversynclocaldata(),20000);	
	setTimeout(function(){
//26/12		
		// serversynclocaldata();
		// sync
		manageSync().done(function() {	});
			// serversynclocaldata();
			serversynchistorydata();
			displayError(annotations_synced,propertiesMap.close,"190px"); 
		}, 20000);
		
	}, true);
	

	window.addEventListener("offline", function() {
		console.log("offline # readerview");
			
        //Search UI
        $("#searchButton").css("display","none");
        $("#offsearchbuttons").css("display","block");
        $("#search_hrDivider").css("display","none");
	    $("#searchcontent").empty();
		$("#paginatesearch").css("display","none");
		$("#search_container").css("height","64px"); 
		
/* if  search text box has value while going offline*/
        if($("#searchQuery").val()){
             enableSearchButton();
             $("#resetDiv").css("display","inline");
        }  else{
        	disableSearchButton();
        }		
		
	   
		var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
		var offline_annotations_update=propertiesMap.offline_annotations_update;
		displayError(offline_annotations_update,propertiesMap.close,"208px");
	
	isConnected=false;
		
	}, true);
		
var status='false';
var spineIndex = [];
var json;
var spineDetail;
var folder;
var fileLocation;
var styleSheet;
var cssValue;
var bookName;
var epubMetaDetails;
var epubFileName;
var style1;
var cssName;
var loadAllChapters = true;
var indexCtr = 1;
var spine;
var toc;
var fileDetails;
var gDom;
var username;
var listOfHrefs=[];
var temps=0;
var topic;
var firstPage;

  /*Arsha:-index*/
var indexhtmlName;
var indexloadCount=0;
  
var pagenavigationmap = new Array();
var bLocalStorageFull = false;
var chapterKeys = new Array();


//10/2
var tocmap = new Object();
var globalFlagForPrintedVersionAvailability= false;

  /*Arsha:-index---- ends*/
//get value of json key from local storage
GetFromDataStorage(epubFileName+'#'+'json').done(function (json){
	spineDetail = jQuery.parseJSON(json);
	folder = spineDetail.folder;
	fileLocation = folder.contentfolder;
	styleSheet = spineDetail.style;
	style1 = spineDetail.style;
	cssValue = styleSheet.stylesheet;
	fileDetails =spineDetail.fileDetails;
	username = GetFromLocalStorage('UserName');
	bookName = fileDetails["epubfilename"];
	epubMetaDetails =spineDetail.metaDetails; 
	epubFileName = fileDetails.epubfilename;
	spine = spineDetail.spine;
	for(key in spine) {
		if(key=='toc'){
			tochtmlkey=key;
			tochtmlName=spine[key];
		} else if(key=='pagenav'){
			navhtmlkey=key;
			navhtmlName=spine[key];
		} else if(key=="pageindex") {
			//alert("spine check");
			indexhtmlName = spine[key];
		} else {
			chapterKeys.push(key);
		}
	}
	//console.log("indexhtmlname = " + indexhtmlName);
	for(key in spine) {
		if(key!='toc' && key!='cover' && key!='pagenav' && key!='pageindex'){
			  firstPage = spine[key];
			  break;
		}
	}
	for (var x in spine) { 
        if(x!='toc' && x!='cover'&& x!='pagenav') 
                lastfile=x;               
}

	toc = spine.toc;
	
	
	var asyncFlag = true;
	//AJAX CALL FOR TOC TO LOAD THE TOPIC OF CONTENTS ON LEFT HAND PANE
//26/12
	GetFromDataStorage(epubFileName+"#downloaded").done(function(fileDownloaded){
		if(fileDownloaded!="true"){
			
	ajaxCallForChapter(fileLocation,tochtmlName,tochtmlName,bLocalStorageFull,asyncFlag).done(function(){
		//getTopicContainer().done(function(){
		//	TOCPane().done(function(){
		
		if(indexhtmlName) {
			ajaxCallForChapter(fileLocation, indexhtmlName, indexhtmlName, bLocalStorageFull, false).done(function(){
				//alert("index html done");
				
			});
		}
		ajaxCallForChapter(fileLocation, navhtmlName, navhtmlName, bLocalStorageFull, false).done(function(){
			
		loadTopic(tochtmlName).done(function(){
			var i=0,j=getSize(spine);
			getNav().done(function(){
			// manageSync().done(function(){
			  createEbookHistoryMeta(username,bookName).done(function(){
				dataToHistoryObject().done(function(){
					createEbookMetadata(username, epubFileName).done(function(){
					if(historyobj.History!=undefined){
						//typeOfNavigation();
							 /* /*check*/
						// 1/8
						if(ebookmetadata!=null){
						var recentfontsize=ebookmetadata.fontsize;
						var recentlineheight=ebookmetadata.lineheight;
						}
						getLatestSync().done(function(){
						if(recentfontsize!=undefined && recentlineheight!=undefined){
							//console.log("resizing font to recently viewed font size:"+recentfontsize);
						$("#epub_content").css('font-size', (parseInt(recentfontsize, 10) - 2) + 'px');
						$("#epub_content").css('line-height', (parseInt(recentlineheight, 10) - 2) + 'px');
						}
							 /*****/
						$("#loading").css("display", "none");
						$("#mylibrary_hidden").css("display", "none");//26/12
						$("#content").css("display", "block");
						$("#bookTitle").html(epubMetaDetails["title"]);
					//26/12	
						/*removing this local storage storeValueInDatabase(bookName+"#downloaded","true"); in loadDB listener and adding it at the end of the book download part*/
						
						if(action=='annotations'){
							displayAction(action);
						} else if(action == 'history') {
							$("#show_history").trigger("click");
						}
                     //**
						});
					/*	if(action=='annotations'){
							displayAction(action);
						} else if(action == 'history') {
							$("#show_history").trigger("click");
						}*/
					}
					});
					});
					});
				//});
			});
			/*performance change for Index:- get index should not call on each page load*/
			if(action=='index'){
				getIndex().done(function(){
				loadPageIndex();
			
		});}
	//	});
		});
		});
		
		viewPageCheckbox();
	});
	//26/12
		}
		else{
			
			if (updateVersion > 0) {
				$("#updateDiv").css("display", "block");
			} else{
				$("#updateDiv").css("display", "none");
			}
		clearInterval(intervalId);
			loadTopic(tochtmlName).done(function(){
				var i=0,j=getSize(spine);
				getNav().done(function(){
				createEbookHistoryMeta(username,bookName).done(function(){
					dataToHistoryObject().done(function(){
						createEbookMetadata(username, epubFileName).done(function(){
						if(historyobj.History!=undefined){
							//typeOfNavigation();
							if(ebookmetadata!=null){
								var recentfontsize=ebookmetadata.fontsize;
								var recentlineheight=ebookmetadata.lineheight;
							}
							getLatestSync().done(function(){
							if(recentfontsize!=undefined && recentlineheight!=undefined){
								//console.log("resizing font to recently viewed font size:"+recentfontsize);
							$("#epub_content").css('font-size', (parseInt(recentfontsize, 10) - 2) + 'px');
							$("#epub_content").css('line-height', (parseInt(recentlineheight, 10) - 2) + 'px');
							}
							$("#loading").css("display", "none");
							$("#mylibrary_hidden").css("display", "none");
							$("#content").css("display", "block");
							$("#bookTitle").html(epubMetaDetails["title"]);
							loadTopic(tochtmlName);
							if(action=='annotations'){
								displayAction(action);
							} else if(action == 'history') {
								$("#show_history").trigger("click");
							}
							});
							/*if(action=='annotations'){
								displayAction(action);
							} else if(action == 'history') {
								$("#show_history").trigger("click");
							}*/
							/*if(action == "toc") {
								//showTOCPane();
								$("#tocButton").trigger("click");
							}*/
							
								//alert("1.getIndex done");
							/*performance change for Index:- get index should not call on each page load*/
								if(action=='index'){
									getIndex().done(function(){
									loadPageIndex();
								
							});}
							
							viewPageCheckbox();
							
						}
						});
						});
					});
				});
			});
			//});
			
		}
		});

	//**
	/*performance change for Index:- get index should not call on each page load*/
	/*added by Arsha performance issue solution:*/
	$('#indexImages').click(function(E){
		
		 if(getIndexParsingDone){
			 loadPageIndex();
			 return;
		 }
		 else{
			 /*performance change for Index:- get index should not call on each page load*/
		 getIndex().done(function(){
				loadPageIndex();
			
		});
		 }
		 });
	
	
	function getIndex() {
		getIndexParsingDone=true;
		var dfd=$.Deferred();
		GetFromDataStorage(bookName+"#"+indexhtmlName).done(function (pageindexxml){
			//console.log("pageindexxml = " + pageindexxml);
			if(pageindexxml=="null"||pageindexxml==null){
				// $("#indexAvailable").attr("value","false");
				//showIndexPane(false);
				//positionNoIndexPopup();
				dfd.resolve();
			} else {
				var indexXmlDOM;
				try {
					indexXmlDOM = $.parseXML(JSON.parse(pageindexxml).content);
				}catch(e) {
					console.log("parsing index xml is failed");
				}
				
				var index =$(indexXmlDOM).find('html').html();
				if(index) {
					if(index.indexOf("epub:type=\"index-group\"")== -1) {
						//$("#nongroupindex").removeClass("hideContent");
						$("#nongroupindex").html(index);
						$("#nongroupindex").find('h1').remove();
						//$("#nongroupindex").fadeIn(400);
					} else {
						//$("#nongroupindex").addClass("hideContent");
						$("#IndexContent").html(index);
						parseIndex();
					}
					
					$("#indexContainer").contents().find("a").each(function() {	
						//console.log("inside anchor contents..........");
						var epubTypeClass = (this.attributes.class ? this.attributes.class.nodeValue : "");
						//alert("epubTypeClass = " + epubTypeClass);
								
						if(epubTypeClass != "indexGroupHeading") {
							intraDocumentNav(this);
						}
					});
				}
				dfd.resolve();
			}
		});
		return dfd.promise();
	}
	
	function getNav(){
		var dfd=$.Deferred();
		GetFromDataStorage(bookName+"#"+"navfile.xhtml").done(function (pagenavxml){
			if(pagenavxml!="null"&& pagenavxml!=null && pagenavxml!=""){
				//console.log('inside if nav');
			var xmlDOM;	
			var parser=new DOMParser();
			  var xmlDOM=parser.parseFromString(JSON.parse(pagenavxml).content,"text/xml");
				//xmlDOM = $.parseXML(JSON.parse(pagenavxml).content);
	        	gDom=xmlDOM;
				temp=0;
				$(xmlDOM).find('a').each(function(){
					var page = $(this).text();
					/*if(isNaN(page)){
						countPrintedNo++;
					}*/
					//pagenavmap[$(this).text()] = $(this).attr('href');
					pagenavigationmap[temp] = $(this).text();
					temp++;
			    });
				//commented out on jan 24
				//$("#totalpages").text("/"+(parseInt(fileDetails["noOfPages"])-countPrintedNo));
				CheckForPrintedVersionAvailability().done(function(flag){
					globalFlagForPrintedVersionAvailability= flag;//10/2
					if(flag==false){
						$("#totalpages").text("/"+(parseInt(fileDetails["noOfPages"])));
					}
				});
				$( "#slider" ).slider({
				    range: false,
				    min: 0,
				    max:fileDetails["noOfPages"]-1,
				    slide: function(event, ui) {
				      
				        $('.page_no_field').val(pagenavigationmap[ui.value]);
				            },
				        change : function(event, ui) {
				        	  if (event.originalEvent) {
				        	jumpToPage(pagenavigationmap[ui.value]);
				        	  }
				            }
				   
				});
				displayAction(action);
				dfd.resolve();
			}
			else{
				//console.log('inside else nav');
				ajaxCallForChapter(fileLocation, "navfile.xhtml", "navfile.xhtml", bLocalStorageFull, asyncFlag).done(function(){
					GetFromDataStorage(bookName+"#"+"navfile.xhtml").done(function (pagenavxml){
						if(pagenavxml!="null" && pagenavxml!==null ){
						var xmlDOM;	
						var parser=new DOMParser();
						  var xmlDOM=parser.parseFromString(JSON.parse(pagenavxml).content,"text/xml");
							//xmlDOM = $.parseXML(JSON.parse(pagenavxml).content);
							gDom=xmlDOM;
							temp=0;
							$(xmlDOM).find('a').each(function(){
								var page = $(this).text();
								/*if(isNaN(page)){
									countPrintedNo++;
								}*/
								//pagenavmap[$(this).text()] = $(this).attr('href');
								pagenavigationmap[temp] = $(this).text();
								temp++;
						    });
							//commented out on jan 24
							//$("#totalpages").text("/"+(parseInt(fileDetails["noOfPages"])-countPrintedNo));
							CheckForPrintedVersionAvailability().done(function(flag){
								globalFlagForPrintedVersionAvailability= flag;//10/2
								if(flag==false){
									$("#totalpages").text("/"+(parseInt(fileDetails["noOfPages"])));
								}
							});
							$( "#slider" ).slider({
							    range: false,
							    min: 0,
							    max:fileDetails["noOfPages"]-1,
							    slide: function(event, ui) {
							      
							        $('.page_no_field').val(pagenavigationmap[ui.value]);
							            },
							        change : function(event, ui) {
							        	  if (event.originalEvent) {
							        	jumpToPage(pagenavigationmap[ui.value]);
							        	  }
							            }
							   
							});
						}
						dfd.resolve();
					});
				});
			}
		});
		return dfd.promise();
	}
/*	for (index in spine) {	
		var htmlFileName = spine[index];
		var htmlFileKey = spine[index];
		////console.log('html :' + htmlFileName + ' key:' + htmlFileKey);
		//false mention local storage is not full 
		var bLocalStorageFull = false;
		var asyncFlag = true;
		//TODO: Temporary fix to avoid too many calls going into server. This may stop offline reading capability
		if (loadAllChapters && indexCtr < 100) {
			ajaxCallForChapter(fileLocation, htmlFileName, htmlFileKey,
					bLocalStorageFull, asyncFlag).done(function (){
						temps=temps+1;
						//console.log("temps : "+temps);
						//console.log("getSize(spine) : "+getSize(spine));
						if(temps==getSize(spine)){
						loadTopic(toc).done(function(){
							$(".paginator_p.selected").removeClass("selected");
							var fiPage = GetFromLocalStorage(bookName + "#realPageNum");
							if(fiPage==undefined || fiPage==null){
								fiPage=1;
							}
							var firstpg;
							var counter=0;
							
							GetFromDataStorage(bookName+"#"+"navfile.xhtml").done(function (pagenavxml){
								var xmlDOM;								
									xmlDOM = $.parseXML(JSON.parse(pagenavxml).content);
							
									temp=0;
									$(xmlDOM).find('a').each(function(){
										var page = $(this).text();
										if(isNaN(page)){
											countPrintedNo++;
										}
										//pagenavmap[$(this).text()] = $(this).attr('href');
										pagenavigationmap[temp] = $(this).text();
										temp++;
								    }); 
									$("#totalpages").text("/"+(parseInt(fileDetails["noOfPages"])-countPrintedNo));
							});
							CheckForPrintedVersionAvailability().done(function(flag){
								if(flag==true){
									var xmlDOM= getNavFile();
									$(xmlDOM).find('a').each(function(){
										//pagenav[$(this).attr('href')] = $(this).text();
										if(counter==0){
										 firstpg= $(this).text();
										}
										 counter++;		
								    });
									//paintPaginator(fiPage);	
									
									//selectPageNumInFooter(firstpg);
									//alert("inside if "+firstpg);
									}
									else{
										//alert("inside else ");
										//paintPaginator(fiPage);
									} 
										
							});
							//var currentChap=GetFromLocalStorage(bookName + "#currentPage");
							loadChapters(firstPage,key);
							alignFirstPage();
							
							//getLatest();	
						});
						//readEbookMetaFromLocal("jim_holloway", "a-christmas-carol3");
//						if(temp==0){
//						callServerData();
//						temp=1;}
						
						}
					});
		}
		indexCtr++;
		loadAllChapters = true;
			
	}*/
	
});

function displayAction(action) {
	

	//console.log(" displayAction()===============================action = " + action);
	if(action == "toc") {
		//showTOCPane();
		$("#tocButton").trigger("click");
	} else if (action == "index") {
		//loadPageIndex();
		//$("#indexImages").trigger("click");
	} else if (action == "annotations") {
		if(userobj!=undefined){
			//displayAnnotationList();
			 showAllAnnotations();// method responsible for annotation
		}
	} else if (action == "history") {
		if(userobj!=undefined){
			$("#show_history").trigger("click");
		}
	}
}

function loadTopic(fileName){
	////console.log('fileName Topic :' + fileName );
	//var css = JSON.parse(localStorage.getItem(firstPage));
	var dfd = $.Deferred();
	//get value of json key from local storage
	GetFromDataStorage(bookName+"#"+fileName).done(function (topicContent){
		////console.log("topic content********"+bookName+"#"+fileName+"*******"+topicContent);
		 topic = JSON.parse(topicContent);	
		////console.log('Chapter Page :' + fileName);
		////console.log('Chapter key :' + key);
		////console.log('Chapter chapter :' + topic);
		if(topic == null) {
		//var bLocalStorageFull = true;
			ajaxCallForChapter(fileLocation,fileName, fileName, bLocalStorageFull,false).done(function (){
				//get value of json key from local storage
				GetFromDataStorage(bookName+"#"+fileName).done(function (topicCont){
				topic = JSON.parse(topicCont);
				////console.log("topic content********"+bookName+"#"+fileName+"******"+topicCont);
				$("base").attr("href",baseurl+fileName);
				
				//});
			//	dfd.resolve();
			//	});
			
		//}
		if(topic!=null){
		$('#topic-content').html(topic.content, function (responseText, statusText, xhr) {
			//console.log("load failed in  : " + fileName);
			//console.log("responseText :\n\n" + responseText);
		    //console.log("statusText : " + statusText);
			// for(n in xhr) {
			// //console.log('topic-content Error xhr:' + xhr[n]);
			//}
		    if (statusText == "error") {
		    	//console.log("Not able to load file!!");
		    }
		});}
				// code for showing peinted page no as a drop down in the TOC- currently commented out
				/*var tocxml = $.parseXML(topic.content);
				$(tocxml).find('nav').each(function() {
					if ($(this).attr('epub:type') == 'page-list') {	
						$('#topic-content').append("<div  class=\"dropdown\" id=\"pageDropdown\" > <a class=\"account\" ><h3>Navigation</h3></a> <div class=\"submenu\"><ol class=\"root\" id=\"rootData\"> </ol></div</div>");
						 $(this).find('li').each(function(){
							$('#rootData').append($(this));
						});
						 
						
					}			
				});*/
				//PageListNavigation();
				// code for removing the printed page no from the TOC
				$("#topic-content").find('nav').each(function(){
					if ($(this).attr('epub:type') == 'page-list') {	
						$(this).remove();
					}
					}) ;
			    
				listOfTOChrefs();
				////console.log('TOPIC :' + $("#topic-content").contents().find('link').length);

				if($("#topic-content").contents().find('link').length==0) {
					$("#topic-content").contents().find("head").append("<link rel='stylesheet' type='text/css' href='"+cssValue +"' />");
					////console.log('added link tag for TOPIC');
				}
				/* For LN TOC - Extracted the click event
				 * 
				// incase of multilevel toc
				if ($("#toc").length > 0) {
					$("#toc").treeview({
						collapsed : true,
						unique : true,
						animated : "normal",
						persist : "location"
					});
				}

				
				$("#topic-content").contents().find("ol li a").each(function() {
					//alert($('#topic-content > li:first'));
					$(this).addClass('topic_nav_link');
					$("#topic_container").addClass('topic_nav_link');
					$(this).click(function(event) {});
					
				});*/
				$("#topic-content").contents().find("ol li a").addClass('topic_nav_link');
				dfd.resolve();
				});
					
					});
				
			}
		else if(topic!=null){
			$('#topic-content').html(topic.content, function (responseText, statusText, xhr) {
				//console.log("load failed in  : " + fileName);
				//console.log("responseText :\n\n" + responseText);
			    //console.log("statusText : " + statusText);
				// for(n in xhr) {
				// //console.log('topic-content Error xhr:' + xhr[n]);
				//}
			    if (statusText == "error") {
			    	//console.log("Not able to load file!!");
			    }
			});
					// code for showing peinted page no as a drop down in the TOC- currently commented out
					/*var tocxml = $.parseXML(topic.content);
					$(tocxml).find('nav').each(function() {
						if ($(this).attr('epub:type') == 'page-list') {	
							$('#topic-content').append("<div  class=\"dropdown\" id=\"pageDropdown\" > <a class=\"account\" ><h3>Navigation</h3></a> <div class=\"submenu\"><ol class=\"root\" id=\"rootData\"> </ol></div</div>");
							 $(this).find('li').each(function(){
								$('#rootData').append($(this));
							});
							 
							
						}			
					});*/
					//PageListNavigation();
					// code for removing the printed page no from the TOC
					$("#topic-content").find('nav').each(function(){
						if ($(this).attr('epub:type') == 'page-list') {	
							$(this).remove();
						}
						}) ;
				    
					listOfTOChrefs();
					////console.log('TOPIC :' + $("#topic-content").contents().find('link').length);

					if($("#topic-content").contents().find('link').length==0) {
						$("#topic-content").contents().find("head").append("<link rel='stylesheet' type='text/css' href='"+cssValue +"' />");
						////console.log('added link tag for TOPIC');
					}
					/* For LN TOC - Extracted the click event and commented the treeview
					 * 
					// incase of multilevel toc
					if ($("#toc").length > 0) {
						$("#toc").treeview({
							collapsed : true,
							unique : true,
							animated : "normal",
							persist : "location"
						});
					}

					
					$("#topic-content").contents().find("ol li a").each(function() {
						//alert($('#topic-content > li:first'));
						$(this).addClass('topic_nav_link');
						$("#topic_container").addClass('topic_nav_link');
						$(this).click(function(event) {});
						
					});*/
					
					$("#topic-content").contents().find("ol li a").addClass('topic_nav_link');
					
					dfd.resolve();
					
		}
		//dfd.resolve(topicContent);
	});
	return dfd.promise();
}

function loadChapterOnHrefClick(event, currentTarget){
	event.stopPropagation();
	event.preventDefault();
	var parentDiv = currentTarget.parentNode.parentNode;
	var subMenus = $(parentDiv).nextAll(".subMenuDiv");
	if(subMenus.length>0) {
			$(subMenus).remove();
			$(parentDiv).children("li").children("a").removeClass('highlightLink');
			$(parentDiv).children("li").children("a").removeHighlight();
	} else {
		$("#topic_container").fadeOut(400);
		$("span.tocDivBefore").fadeOut(400);
	var topicKey;
	var topicAttr;
	var hash;
	/*For LN TOC changed this to currentTarget*/
	var targetHref = $(currentTarget).attr('href');
	//checking the link is cfi or not
	if(!(targetHref.match(/epubcfi/))){
	////console.log('Link Location:' + targetHref);
	hash = targetHref.indexOf('#');
	if(hash!= -1) {		
		//stores the href upto#
		topicKey = targetHref.substring(0,hash);
		//stores the href after the #
		topicAttr = targetHref.substring(hash+1, targetHref.length);
		//override the targetHref with out #attribute
		targetHref = topicKey;
	}
	
	//spine store the key and value as name of html file
	for (key in spine) {
		if (spine[key] == targetHref) {
			topicKey = key;
			break;
		}
    }
	// when SubTopics are present
	if(hash!= -1) {
		//findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
		//	historyobj.addHistoryItem(userobj.ebook,offset,'toc');
		//	writeHistoryToLocal(historyobj);
			//serversynchistorydata();
		//});
		status='true';
      	$("#wrapper").css("visibility", "hidden");
		$("#hidden_content").css("visibility", "visible");
		 $(".page_break_revisited").css("visibility","hidden");
		loadChapters(targetHref,topicKey).done(function (){
			//console.log("values  :"+targetHref+"--"+topicKey+"--"+topicAttr);
			// Checks if Images are present in the loaded chapter
			if($("#epub_content").find("img").length>0){
			    //console.log("image found ...");
			    var $images = $('#epub_content img');
			    preloaded = 0,
			    total = $images.length;
			    $images.load(function() {
			    if (++preloaded === total) {
			    	//console.log("images loaded :"+preloaded);
					 loadSubTopicChapters(targetHref,topicKey, topicAttr);					 
			       }
			    });
      	    } else {
				// if no images are present
				// setTimeout(function() {
				    //console.log("no images present");
				     loadSubTopicChapters(targetHref,topicKey, topicAttr);	
				    						 
				// },10);
			}			
										 /* check */			
			//setTimeout(function() {				
				  imageAlterSize();	
				   updateRealPageNum().done(function(pc){
					   var valuesReturned=pc.split('~~');
						  var offset=valuesReturned[1];
						  
	                  	 /* check */	
				var folder=targetHref.lastIndexOf("/");
				// findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
						historyobj.addHistoryItem(userobj.ebook,parseInt(offset),'toc');
						writeHistoryToLocal(historyobj);
						//serversynchistorydata();
				//	});
                                /* check */
				if(topicAttr==undefined){
				 /* check */
					if(folder!=-1 ){
						targetHref=targetHref.substring(folder+1,targetHref.length);
					}
					
					var hash=targetHref.indexOf("#");
						if(hash!=-1){
							targetHref=targetHref.substring(hash+1,targetHref.length);
						
						}
					if(targetHref.indexOf(".html")!=-1){
						targetHref=targetHref.substring(0,targetHref.indexOf(".html"));
					}
	 /* check */
													if(targetHref.indexOf("toc")!=-1 && targetHref!="toc"){
														targetHref=targetHref.substring(0,targetHref.indexOf("toc"));
													}
													SaveInLocalStorage(bookName+"#"+'subtopic',targetHref);
												  }
												  else{
													  SaveInLocalStorage(bookName+"#"+'subtopic',topicAttr);
												  }
										  //addChapterMetadata(targetHref);
										  //addChapterMetadataForNotes(targetHref);
									// }); 
				setTimeout(placeAllNoteIcon(null,pc),800);
										  });
										 //},100);	 /* check */	
				  // setTimeout(placeAllNoteIcon,800);	

		});			    
		//});		 
		 } else {		
		// called when no # implementation is present;
		loadChapters(targetHref,topicKey).done(function (){
	    var key=null;
	    for(key in spine) {
			if(key!='toc' && key!='cover' && key!='pagenav' && key!='pageindex'){
				var  fPage = spine[key];
				  break;
			}
		}		   
	    if(fPage==targetHref)
	    	 alignFirstPage();
	    currentPosition= 1;
	 //   setTimeout(function() {
			 //currentPosition= 1;
			  imageAlterSize();
                          /* check */
				  updateRealPageNum().done(function(pc){
					  var valuesReturned=pc.split('~~');
					  var offset=valuesReturned[1];
			  	 /* check */
			 // findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
					historyobj.addHistoryItem(userobj.ebook,parseInt(offset),'toc');
					writeHistoryToLocal(historyobj);
					//serversynchistorydata();
				//});
			  var folder=targetHref.lastIndexOf("/");
				
	 /* check */
							  if(topicAttr==undefined){
							  	 /* check */
				if(folder!=-1 ){
					targetHref=targetHref.substring(folder+1,targetHref.length);
				}
				
				var hash=targetHref.indexOf("#");
					if(hash!=-1){
						targetHref=targetHref.substring(hash+1,targetHref.length);
					
					}
				if(targetHref.indexOf(".html")!=-1){
					targetHref=targetHref.substring(0,targetHref.indexOf(".html"));
				}
					 /* check */
					if(targetHref.indexOf("toc")!=-1 && targetHref!="toc"){
						targetHref=targetHref.substring(0,targetHref.indexOf("toc"));
					}
					SaveInLocalStorage(bookName+"#"+'subtopic',targetHref);
					 }
				  else{
	        			  SaveInLocalStorage(bookName+"#"+'subtopic',topicAttr);
						  }
						//  addChapterMetadata(targetHref);
						//  addChapterMetadataForNotes(targetHref);
						//  },100);
								
					//});
				 /* check */
			  setTimeout(placeAllNoteIcon(null,pc),400);
	});
				 // setTimeout(placeAllNoteIcon,400);	
	});
	}
	showTOCPane();
	}
	else{
		manipulateCFIPath(targetHref);
		//loadCFIRef(htmlFileName);
		
	}
	}
}

function loadChapters(fileName, key, pageLength,offterm){
	////console.log('loadChapters fileName :' + fileName + '  key :' + key);
	//var css = JSON.parse(localStorage.getItem(firstPage));
	var dfd = $.Deferred();
	//get value of json key from local storage
	$("#next").show(); 
    $("#prev").show(); 

	GetFromDataStorage(bookName+"#"+fileName).done(function (chapterCont){
		var chapter = JSON.parse(chapterCont);
		//var chapterContent  = chapter.content;
		//console.log("chapterContent "  + chapterContent);
		if(offterm != undefined && offterm != null && chapter.content.toLowerCase().indexOf(offterm.toLowerCase())==-1)
			{
			//console.log("term " + offterm + " is not present in the chapter "  + fileName);
			dfd.resolve('not found');
			return dfd.promise();
			}
		else{
		////console.log('Chapter Page :' + fileName);
		////console.log('Chapter key :' + key);
		////console.log('Chapter chapter :' + chapter);
		localStorage.removeItem(bookName+"#"+'currentPage');
		
		//store value of currentPage in local storage
		SaveInLocalStorage(bookName+"#"+'currentPage', key);
		localStorage.removeItem(bookName+"#"+'subtopic');
		localStorage.setItem(bookName+"#"+'subtopic',null);
		if(chapter!=null && chapter!="null") {
			$("base").attr("href",baseurl+fileName);
			////console.log("baseurl  :"+baseurl+" windowLocation :"+windowLocation);
		//	 var html = $.parseHTML(chapter.content);
		 document.getElementById('epub_content').innerHTML = chapter.content;
		  
	 	/*$('#epub_content').html(chapter.content, function (responseText, statusText, xhr) {
		//	$('#epub_content').html(html, function (responseText, statusText, xhr) {
	 			//console.log("loadChapters failed in  : " + fileName);
			    //console.log("responseText :\n\n" + responseText);
			    //console.log("statusText : " + statusText);
			    for(n in xhr) {
					////console.log('epub_content Error xhr:' + xhr[n]);
					}
			    if (statusText == "error") {
			    	//console.log("Not able to load file!!");
			    }
		 });
		 */

		 //$('#epub_content').find(function() {  Commented 24/02 
			 var contentPane = $('#epub_content');
			  //pageLength = $("#epub_content")[0].scrollWidth;
			  ////console.log('Page length @ localstorage: ' + pageLength);
			 contentPane.css("right","0");
			 
			//get value of json key from local storage
			 contentPane.attr('name',GetFromLocalStorage(bookName+"#"+'currentPage'));
			 //var windowHeight = parseInt($("#epub_content").height());
			 //var windowWidth = $(window).width();
			  $('#epub_content div img').load(function() {
					if($(this).height() > windowHeight) {
						$(this).height(windowHeight);
				    } else if($(this).width() > 420) {
						$(this).width(420);
				    }
					
			   });
		 //});
		 
		 intraDocumentNavigation();
		
		$("#epub_content").contents().find("epub\\:trigger").each(function(){ 
		var actionAttribute=$(this).attr("action");
		var refElement=$(this).attr("ref");
		var eventAttribute=$(this).attr("ev:event");
		var observerElement	="#"+$(this).attr("ev:observer");

		$(observerElement).on(eventAttribute, function(){ 
	    var videoElement=document.getElementById(refElement); 
	   switch(actionAttribute)
	 	{
	 	case "show":
	 	videoElement.css("visibility", "visible");
	 	  break;
	 	case "hide":
	 	videoElement.css("visibility", "hidden");
	 	  break;
	 	case "play":
	 	videoElement.currentTime = 0;
	 	videoElement.play();
	 	  break;
	 	case "pause":
	 	videoElement.pause();
	 	  break;
	 	case "resume":
	 	videoElement.play();
	 	  break;
	 	case "mute":
	 	videoElement.muted = true;
	 	  break;
	 	case "unmute":
	 	videoElement.muted = false;
	 	  break;
	 	default:
	 	  //console.log("do not no how to handle trigger " + this.action);
	 	}
	       	});
		});
		$("#epub_content").contents().find("span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']").each(function(){ 
		var epub_type = $(this).attr('epub:type');
		if(epub_type=="pagebreak"){	
			if(pageNumberCheckBox=="true"){
        		if(showLocalPageNumber=="true"){
        			$(this).css('display','block');
            		$(this).css('visibility','visible');
            		$(this).addClass('new_page_break');
				}else{
					$(this).css('display','block');
	        		$(this).css('visibility','hidden');
	        		$(this).addClass('new_page_break');
        		}
        	}else{
        		$(this).css('display','block');
        		$(this).css('visibility','hidden');
        		$(this).addClass('new_page_break');
        	}
		}
		
	});
				  // dfd.resolve();
		
		
		if(status=='true'){
			setTimeout(function() {
			//added for highlighting
			addChapterMetadata(fileName).done(function (){
				 addChapterMetadataForNotes(fileName);	
				 status='false';
				 setTimeout(function() { placeAllNoteIcon(null, null); },100);
				 dfd.resolve();
				 	//commented out on jan 24
				   // setTimeout(placeAllNoteIcon,100);
			});
		   
			},100);
			
			}else{
				addChapterMetadata(fileName).done(function (){
					 addChapterMetadataForNotes(fileName);	
					 status='false';
					setTimeout(function() { placeAllNoteIcon(null, null); },100);
					 dfd.resolve();
					//commented out on jan 24
					// setTimeout(placeAllNoteIcon,100);
				});
			}
		
		
		
		}else{
			////console.log('PAGE not found, making aJax call');
			//var chapter = JSON.parse(localStorage.getItem(bookName+"#"+targetHref));
			//var bLocalStorageFull = true;
			var asyncFlag = false;
			ajaxCallForChapter(fileLocation, fileName, fileName, true, asyncFlag).done(function (chapterCont){
					$('#epub_content').find(function() {
					 var contentPane = $('#epub_content');
					  //pageLength = $("#epub_content")[0].scrollWidth;
					  ////console.log('Page length @ localstorage: ' + pageLength);
					 contentPane.css("right","0");
					 
					//get value of json key from local storage
					 contentPane.attr('name',GetFromLocalStorage(bookName+"#"+'currentPage'));
					  $('#epub_content div img').load(function() {
							if($(this).height() > windowHeight) {
								$(this).height(windowHeight);
						    } else if($(this).width() > 420) {
								$(this).width(420);
						    }
					});
				 });

				 intraDocumentNavigation();
				
				$("#epub_content").contents().find("epub\\:trigger").each(function(){ 
				var actionAttribute=$(this).attr("action");
				var refElement=$(this).attr("ref");
				var eventAttribute=$(this).attr("ev:event");
				var observerElement	="#"+$(this).attr("ev:observer");

				$(observerElement).on(eventAttribute, function(){ 
			    var videoElement=document.getElementById(refElement); 
			   switch(actionAttribute)
			 	{
			 	case "show":
			 	videoElement.css("visibility", "visible");
			 	  break;
			 	case "hide":
			 	videoElement.css("visibility", "hidden");
			 	  break;
			 	case "play":
			 	videoElement.currentTime = 0;
			 	videoElement.play();
			 	  break;
			 	case "pause":
			 	videoElement.pause();
			 	  break;
			 	case "resume":
			 	videoElement.play();
			 	  break;
			 	case "mute":
			 	videoElement.muted = true;
			 	  break;
			 	case "unmute":
			 	videoElement.muted = false;
			 	  break;
			 	default:
			 	  //console.log("do not no how to handle trigger " + this.action);
			 	}
			       	});
				}); 
				//dfd.resolve();----
			//});-------
			
			$("#epub_content").contents().find("span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']").each(function(){ 
				var epub_type = $(this).attr('epub:type');
				if(epub_type=="pagebreak"){	
					if(pageNumberCheckBox=="true"){
		        		if(showLocalPageNumber=="true"){
		        			$(this).css('display','block');
		            		$(this).css('visibility','visible');
		            		$(this).addClass('new_page_break');
						}else{
							$(this).css('display','block');
			        		$(this).css('visibility','hidden');
			        		$(this).addClass('new_page_break');
		        		}
		        	}else{
		        		$(this).css('display','block');
		        		$(this).css('visibility','hidden');
		        		$(this).addClass('new_page_break');
		        	}
					
				}
				 //dfd.resolve();------
			});
			
			if(status=='true'){
				setTimeout(function() {
				//added for highlighting
				addChapterMetadata(fileName).done(function (){
					 addChapterMetadataForNotes(fileName);	
					 status='false';
					 setTimeout(function() { placeAllNoteIcon(null, null); },100);
					 dfd.resolve();
					 	//commented out on jan 24
					   // setTimeout(placeAllNoteIcon,100);
				});
			   
				},100);
				
				}else{
					addChapterMetadata(fileName).done(function (){
						 addChapterMetadataForNotes(fileName);	
						 status='false';
						 setTimeout(function() { placeAllNoteIcon(null, null); },100);
						 dfd.resolve();
						//commented out on jan 24
						// setTimeout(placeAllNoteIcon,100);
					});
				}
		});
		}
		/*if(status=='true'){
		setTimeout(function() {
		//added for highlighting
		addChapterMetadata(fileName).done(function (){
			 addChapterMetadataForNotes(fileName);	
			 status='false';
			 	//commented out on jan 24
			   // setTimeout(placeAllNoteIcon,100);
		});
	   
		},100);
		
		}else{
			addChapterMetadata(fileName).done(function (){
				 addChapterMetadataForNotes(fileName);	
				 status='false';
				//commented out on jan 24
				// setTimeout(placeAllNoteIcon,100);
			});
		}*/
		
		//updateRealPageNum();	
		}
	});
	/* to load the book read view screen */
	//bookViewResize();
	$("body").addClass("bodyBackground");
	return dfd.promise();
}

function loadSubTopicChapters(targetHref,topicKey, topicAttr){
	 var flagforsubtopic= false;
      //var chapter = JSON.parse(localStorage.getItem(bookName+"#"+targetHref));
	//localStorage.setItem(bookName+"#"+'currentPage', topicKey);
	
	//store value of subtopic in local storage
	SaveInLocalStorage(bookName+"#"+'subtopic', topicAttr);
	var epubContentStr = $("#epub_content").html();
	var epubWidth = parseInt($('#epub_content').css('width'), 10);
	$("#hidden_content").html('');
	$("#epub_content").contents().find('#'+topicAttr).each(function(){    	
		flagforsubtopic= true;
		// 1st logic to calculate offset
		//var offset= $(this).offset();		
		var xpath = getXPath(this);
	    //  var offsetLeft= offset.left-100;
	    //  var offsetTop= offset.top;      
	    var pageLength = $("#epub_content")[0].scrollWidth;
	    //console.log("pageLength :"+pageLength);	
	    //console.log("targetHref :"+targetHref+"topicKey :"+topicKey+"topicAttr :"+topicAttr);	
	    ////console.log("offsetLeft :"+offsetLeft+"  offsetTop :"+offsetTop);		
			var paraText1 =  $.xpath(xpath);
			var innerHtmlText =  $(paraText1).outerHTML();
			var index=epubContentStr.indexOf(innerHtmlText);
			hiddenStr = epubContentStr.substring(0, index);
			//writing content to hidden content
			$("#hidden_content").css('height', $("#epub_content").css('height'));
			$("#hidden_content").css('width', $("#epub_content").css('width'));
			$("#hidden_content").css('font-size', $("#epub_content").css('font-size'));
			$("#hidden_content").css('line-height', $("#epub_content").css('line-height'));
			$("#hidden_content").html(hiddenStr);
			// 1/8
			//var scrollwidth = document.getElementById("hidden_content").scrollWidth;
			//console.log("scrollwidth:"+scrollwidth);
			var noTextWidth = parseInt($('#hidden_content').css("padding-left"), 10) + parseInt($('#hidden_content').css("padding-right"), 10);
			var scrollwidth = document.getElementById("hidden_content").scrollWidth;
			var extraSpace = "";
			//check if its in the first page 
			if(scrollwidth == noTextWidth ||(epubWidth+noTextWidth === scrollwidth)) {
				//No text at the left of the anchor, no need to scroll
				currentPosition = 1;
				shiftPosition=0;
				pageLength = $("#epub_content")[0].scrollWidth;
				if(pageLength > shiftPosition) {
					$("#epub_content").css("right", shiftPosition+"px");
					$("#epub_content").css("opacity", "1");
				}}
			
		     else      {
	            var length = scrollwidth;
	        	var width = parseInt($('#epub_content').css('width'), 10);
	         	var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
	     	    currentPosition =  ((length) / (width + gap));	
	        	currentPosition =  Math.floor(currentPosition);	
	    	    //console.log("currentPosition:"+currentPosition);
	        	shiftPosition =  currentPosition * (width + gap);
	    	    //console.log("shiftPosition:"+shiftPosition);					
	   	if(pageLength > shiftPosition) {
			$("#epub_content").css("right", shiftPosition+"px");
			$("#epub_content").css("opacity", "1");
		}
		  currentPosition=currentPosition+1;
			}						
	});
	// - 1/8
	// added for toc,intra-doc, footer note navigation of above condition fails
	if(!flagforsubtopic){		
		//var getNodeforTopic=$("#"+topicAttr).get[0];		
		var getNodeforTopic=document.getElementById(topicAttr);
		var xpath = getXPath(getNodeforTopic);
		var paraText1 =  $.xpath(xpath);
		var innerHtmlText =  $(paraText1).outerHTML();
		var index=epubContentStr.indexOf(innerHtmlText);
		var index2 = epubContentStr.indexOf("#"+topicAttr);
		if(index==-1){
			index=index2;
		}
		pageLength = $("#epub_content")[0].scrollWidth;
		hiddenStr = epubContentStr.substring(0, index);
		//writing content to hidden content
		$("#hidden_content").css('height', $("#epub_content").css('height'));
		$("#hidden_content").css('width', $("#epub_content").css('width'));
		$("#hidden_content").css('font-size', $("#epub_content").css('font-size'));
		$("#hidden_content").css('line-height', $("#epub_content").css('line-height'));
		$("#hidden_content").html(hiddenStr);
		//var scrollwidth = document.getElementById("hidden_content").scrollWidth;
		console.log("scrollwidth:"+scrollwidth);
		var noTextWidth = parseInt($('#hidden_content').css("padding-left"), 10) + parseInt($('#hidden_content').css("padding-right"), 10);
		var extraSpace = "";
		//check if its in the first page 
		var scrollwidth = document.getElementById("hidden_content").scrollWidth;
		if(scrollwidth == noTextWidth ||(epubWidth+noTextWidth === scrollwidth)) {
			//No text at the left of the anchor, no need to scroll
			currentPosition = 1;
			shiftPosition=0;
			pageLength = $("#epub_content")[0].scrollWidth;
			if(pageLength > shiftPosition) {
				$("#epub_content").css("right", shiftPosition+"px");
				$("#epub_content").css("opacity", "1");
			}}
		
	     else      {
            var length = scrollwidth;
        	var width = parseInt($('#epub_content').css('width'), 10);
         	var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
     	    currentPosition =  ((length) / (width + gap));	
        	currentPosition =  Math.floor(currentPosition);	
    	    //console.log("currentPosition:"+currentPosition);
        	shiftPosition =  currentPosition * (width + gap);
    	    //console.log("shiftPosition:"+shiftPosition);	
    	   // alert("line1138 :"+shiftPosition);
   	if(pageLength > shiftPosition) {
		$("#epub_content").css("right", shiftPosition+"px");
		$("#epub_content").css("opacity", "1");
	}
	  currentPosition=currentPosition+1;
		}			
		}	

	
	// Repainting after navigatation
	$("#wrapper").css("visibility", "visible");
	$("#hidden_content").css("visibility", "hidden");
	$("#hidden_content").html('');
	$("body").addClass("bodyBackground");
}

var shiftPage = function(page_num, left) {
	var shift = 0 ;
	var length = $("#epub_content")[0].scrollWidth;
	var width = parseInt($('#epub_content').css('width'), 10);
	var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
	  if(length > left) {
			$("#epub_content").css("right", left+"px");
			$("#epub_content").css("opacity", "1");
		}
};

/*check */
/*
function ajaxCallForChapter(fileLocation, htmlFileName, htmlFileKey, bLocalStorageFull, asyncFlag,flag){
	//console.log('ajaxCallForChapter called :' +htmlFileName +' : ' +bLocalStorageFull);
	var dfd = $.Deferred();
	if(isConnected){
		GetFromDataStorage(bookName+"#"+htmlFileName).done(function (data){
			if(data){
				$.ajax({
					type : 'POST',
					dataType : 'json',
					data : {
						fileName : fileLocation + htmlFileName,
						fileKey : htmlFileKey,
						fileType : 'html'
					},
					url : baseurl1+'FileRequestServlet',
					async: asyncFlag,
					success : function(data, textStatus) {
					    var dataObj = decodeFileRequest(data);
						if(!bLocalStorageFull){
						try{
							//store value of json key in local storage	
						  SaveInDataStorage(bookName+"#"+htmlFileName, JSON.stringify(dataObj)).done(function (){
							  dfd.resolve();  
						  });
						} catch(e) {
							 ////console.log('catch error:' + e.name + ' e :' + e);
							  if(e.name === 'QuotaExceededError') {
								  replaceOldDataInLocalStore(bookName, dataObj);
							  }
						  }	 
						} else {
							//comes here when local storage got full
							////console.log("Data:>" + data);
							//var htmlData = $.parseHTML(data.content);	
							if(dataObj!=null){
							  $("base").attr("href",baseurl+htmlFileName);															
							  document.getElementById('epub_content').innerHTML=dataObj.content;			 	 
							//store value of currentPage in local storage
						 	SaveInDataStorage(bookName+"#"+'currentPage', htmlFileKey).done(function (){
							 	if(flag==1){
							 		//alert("flag :"+ flag);
							 		replaceOldDataInLocalStore(bookName, dataObj);
							 	}
						 		dfd.resolve();	
						 	});
			
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
				});	
			} else {
				dfd.resolve();
			}
});
	}	
	else{
		dfd.resolve();
	}
	return dfd.promise();
};
*/
/*check*/

function replaceOldDataInLocalStore(bookName, dataObj) {
	  for (var i = 0; i < localStorage.length; i++){
		   if(localStorage.key(i).indexOf(bookName)== -1 && localStorage.key(i).indexOf('#json')==-1) {
			   //TODO: Intelligently remove the old books
			   if(localStorage.key(i)=="UserName"){
				   continue;
			   }
			   else{
			   localStorage.removeItem(localStorage.key(i));
			   }
		    }
	   }
	  ////console.log('quota exceed save file in local storage :' + data.fileKey);
		try{
			//store value of json key in local storage
			SaveInDataStorage(bookName+"#"+dataObj.fileKey, JSON.stringify(dataObj)).done(function (){
				
			});	
		} catch(e) {
			//console.log("UNABLE TO SAVE THE FILE IN LOCAL STORE " +e.name);
			loadAllChapters = false;
			//Replace the chapters of the current book
			var exception = true;
			while(exception) {
				if(localStorage.key(0).indexOf('#json')==-1 && localStorage.key(i)!="UserName") {
					localStorage.removeItem(localStorage.key(0));
				} else if(localStorage.key(i)!="UserName"){
					localStorage.removeItem(localStorage.key(1));
				}
				try{
					//store value of json key in local storage
					SaveInDataStorage(bookName+"#"+dataObj.fileKey, JSON.stringify(dataObj)).done(function (){
						
					});
					exception = false;
				} catch(e) {
					//DO Nothing, remove another item and try
				}
			}
		}
}
function ajaxCallForTopic(fileLocation, htmlFileName, htmlFileKey, bLocalStorageFull){
	////console.log('called :' +htmlFileName +' : ' +bLocalStorageFull);
	var dfd = $.Deferred();
	if(isConnected){
	$.ajax({
		type : 'POST',
		dataType : 'json',
		data : {
			fileName : fileLocation + htmlFileName,
			fileKey : htmlFileKey,
			fileType : 'html'
		},
		url : baseurl1+'FileRequestServlet',
		async:false,
		success : function(data, textStatus) {
		    var dataObj = decodeFileRequest(data);
			try {
				//store value of json key in local storage
			  ////console.log("chapter******"+dataObj.fileKey+"****"+JSON.stringify(dataObj));
			  SaveInDataStorage(bookName+"#"+dataObj.fileKey, JSON.stringify(dataObj)).done(function (){
				  dfd.resolve();  
			  });
			} catch(e) {
				 ////console.log('catch error:' + e.name + ' e :' + e);
				  if(e.name === 'QuotaExceededError') {
					  //console.log('quota exceed save TOC file in local storage');
					  replaceOldDataInLocalStore(bookName, dataObj);
					  dfd.resolve();  
				  }
			 }	 
		},
		error : function(xhr, textStatus, errorThrown) {
			for(n in xhr) {
				////console.log('Error xhr:' + xhr[n]);
				}
			//console.log('FileRequestServlet file :' + fileLocation+htmlFileName);
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
			dfd.resolve();
		}
	});
	}
	else{
		dfd.resolve();
	}
	return dfd.promise();
};

// used for intra-Document link navigation
function intraDocumentNavigation(){
	/*$("#epub_content").contents().find("a[href^='http://']").each(function() {	 
		 $(this).attr('target', '_blank');
	});
	*/	
	
	//$("#epub_content").contents().find("a").not("[href^='http://']").each(function() {
		$("#content_pane").contents().find("a").each(function() {	
				//if(bookName=dvd)
			intraDocumentNav(this);
		
		});
	
}

function intraDocumentNav(element) {
	var domainName=document.domain;
	var host= location.host;
	$(element).click(function(event) {
		 var nodeValue=this.attributes.href.nodeValue;
        if(!(nodeValue.match(/epubcfi/))){
		    var href= this.href;   
		    var contains_Domain=href.indexOf(domainName); 
		    var remhref=href.substring(href.indexOf(host)+host.length+1 , href.length); 
		    var domainname = remhref.substring(0, remhref.indexOf("/"));
		    var url = remhref.substring(remhref.indexOf(domainname)+domainname.length+1, remhref.length);
		    var contains_ContextRoot=href.indexOf(domainname); 
		    //console.log("href: "+href+"domainName"+domainName+"contains_domain: "+contains_Domain+"contains_ContextRoot :"+contains_ContextRoot);			
		   // link points to same domain
		    if(contains_Domain!=-1 && contains_ContextRoot!=-1){
	    	    var bookNameOfLink= url.substring(0, url.indexOf("/"));
		      //console.log("url:  "+url+   "bookNameOfLink :"+bookNameOfLink);

		    if(bookName==bookNameOfLink){	  
		    	event.stopPropagation();
		    	event.preventDefault();
		     	var targetHref = $(this).attr('href');				
			   hash = targetHref.indexOf('#');
			  // var splitUrl = targetHref.match(/([^#]*)(?:#(.*))?/);
			if(hash!= -1 && hash!=0) {				
				//stores the href upto#
				topicKey = targetHref.substring(0,hash);
				//stores the href after the #
				topicAttr = targetHref.substring(hash+1, targetHref.length);		
				//override the targetHref with out #attribute
				targetHref = topicKey;
			}	
			// Added for FootNote link Implementation
			else if(hash==0){
				var hrefFootNote = href.substring(href.indexOf(bookNameOfLink)+bookNameOfLink.length+1, href.length);
				hashV = hrefFootNote.indexOf('#');
				//stores the href upto#
				topicKey=hrefFootNote.substring(0,hashV);
				//stores the href after the #
				topicAttr = hrefFootNote.substring(hashV+1, hrefFootNote.length);
				//override the targetHref without # attribute
				targetHref = topicKey;
			}
			//spine store the key and value as name of html file
			for (key in spine) {
				if (spine[key].indexOf(targetHref)!=-1)
				{
					targetHref = spine[key];
					topicKey=key;
					break;
				}
		    }
			if(hash!= -1) {
				status='true';
				// For showing blank page till the chapter navigates
				$("#wrapper").css("visibility", "hidden");
				$("#hidden_content").css("visibility", "visible");
				findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
					historyobj.addHistoryItem(userobj.ebook,offset,'intradoc');
					writeHistoryToLocal(historyobj);
					//serversynchistorydata();
				//});
				
				loadChapters(targetHref,topicKey).done(function (){
					//console.log("values  :"+targetHref+"--"+topicKey+"--"+topicAttr);
					// Checks if Images are present in the loaded chapter
					if($("#epub_content").find("img").length>0){
					    //console.log("image found ...");
					    var $images = $('#epub_content img');
					    preloaded = 0,
					    total = $images.length;
					    $images.load(function() {
					    if (++preloaded === total) {
					    	//console.log("images loaded :"+preloaded);
							 loadSubTopicChapters(targetHref,topicKey, topicAttr);						    
					       }
					    });
		      	      }
					// if no images are present
					else {
						 setTimeout(function() {	
						    //console.log("no images present");
						     loadSubTopicChapters(targetHref,topicKey, topicAttr);							
						 },10);
					 }			
						 setTimeout(function() {				
							  imageAlterSize();
							  	 /* check */
							  updateRealPageNum().done(function(pc){
							  	 /* check */
								  var valuesReturned=pc.split('~~');
								  var offset=valuesReturned[1];
							//  findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
									historyobj.addHistoryItem(userobj.ebook,parseInt(offset),'intradoc');
									writeHistoryToLocal(historyobj);
									//serversynchistorydata();
							//	});
							  });
							  var folder=targetHref.lastIndexOf("/");
							  	 /* check */
							  if(topicAttr==undefined){
							  	 /* check */
								if(folder!=-1 ){
									targetHref=targetHref.substring(folder+1,targetHref.length);
								}
								var hash=targetHref.indexOf("#");
									if(hash!=-1){
										targetHref=targetHref.substring(hash+1,targetHref.length);
									}
								if(targetHref.indexOf(".html")!=-1){
									targetHref=targetHref.substring(0,targetHref.indexOf(".html"));
								}
								if(targetHref.indexOf("toc")!=-1 && targetHref!="toc"){
									targetHref=targetHref.substring(0,targetHref.indexOf("toc"));
								}
								SaveInLocalStorage(bookName+"#"+'subtopic',targetHref);
									 /* check */
							  }
							  else{
								  SaveInLocalStorage(bookName+"#"+'subtopic',topicAttr);
							  }
							  	 /* check */
						  },100);	
				});			    
				});
			}
			else
			{	
				findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
					historyobj.addHistoryItem(userobj.ebook,offset,'intradoc');
					writeHistoryToLocal(historyobj);
					//serversynchistorydata();
				//});
				loadChapters(targetHref,topicKey).done(function (){		    
			    currentPosition= 1;
			   
			    setTimeout(function() {						 
					  imageAlterSize();
					  	 /* check */
					  updateRealPageNum().done(function(pc){							  
					  });
					  var folder=targetHref.lastIndexOf("/");
					  if(topicAttr==undefined){
					  	 /* check */
							if(folder!=-1 ){
								targetHref=targetHref.substring(folder+1,targetHref.length);
							}
							var hash=targetHref.indexOf("#");
								if(hash!=-1){
									targetHref=targetHref.substring(hash+1,targetHref.length);
								}
							if(targetHref.indexOf(".html")!=-1){
								targetHref=targetHref.substring(0,targetHref.indexOf(".html"));
							}
							if(targetHref.indexOf("toc")!=-1 && targetHref!="toc"){
								targetHref=targetHref.substring(0,targetHref.indexOf("toc"));
							}
							SaveInLocalStorage(bookName+"#"+'subtopic',targetHref);
								 /* check */
						  }
						  else{
							  SaveInLocalStorage(bookName+"#"+'subtopic',topicAttr);
						  }
						  	 /* check */
				  },100);
				});
				});
			}
		    }   	  
		    	  else{
		    		  /*this is inter epub link (assumption is the link would be as per epub3 CFI standard
                     Check the subscription of the book for the user (should be done at the server side), 
                     Open the book
                     Navigate to the location specified*/	
		              }
	}
		       // Open the link in the another tab 
		    else{
		    	 $(this).attr('target', '_blank');
		        } }
        else{
        	/*
        	 * CFI links Handelling
        	 */
        	var targetHref = $(this).attr('href');
        	event.stopPropagation();
			event.preventDefault();
        	manipulateCFIPath(targetHref);
        }
		});
}

/*function PageListNavigation(){
$(".account").click(function()
{
var X=$(this).attr('id');
if(X==1)
{
$(".submenu").hide();
//$("a.account h3").css('color','#fff !important;');
$("a.account ").css('background-color','white');
$("a.account ").css('border-radius','6px');
$(this).attr('id', '0'); 
}
else
{
$(".submenu").show();
$("a.account ").css('background-color','none');
$("a.account ").css('border-radius','6px');
//	$("a.account h3").css('color','#555 !important;');
$(this).attr('id', '1');
}

});

//Mouse click on sub menu
$(".submenu").mouseup(function()
{
return false;
});

//Mouse click on my account link
$(".account").mouseup(function()
{
return false;
});


//Document Click
$(document).mouseup(function()
{
$(".submenu").hide();
//$("a.account h3").css('color','#fff !important;');
$(".account").attr('id', '');
});
}*/
function listOfTOChrefs(){
$("#topic-content").contents().find("a").each(function() {
var targetHref = this.href;
var folder=targetHref.lastIndexOf("/");

if(folder!=-1 ){
	targetHref=targetHref.substring(folder+1,targetHref.length);
}

var hash=targetHref.indexOf("#");
	if(hash!=-1){
		targetHref=targetHref.substring(hash+1,targetHref.length);
	
	}
if(targetHref.indexOf(".html")!=-1){
	targetHref=targetHref.substring(0,targetHref.indexOf(".html"));
}

listOfHrefs.push(targetHref.toUpperCase());
});
}

showClickedPage = function(bookMark) {

	var dfd=$.Deferred(); //Prashanth N.
	var strs = bookMark.split("~~");
	currentPage = strs[0];
	offset = strs[1];
	pgno = strs[2];
	subtopic = strs[3];
	//get value of json key from local storage
	var pageAlreadyLoaded = GetFromLocalStorage(bookName + "#" + 'currentPage');
	//if (pageAlreadyLoaded != currentPage) {
	//store value of currentPage into local storage
	SaveInLocalStorage(bookName + "#" + 'currentPage', currentPage);
	loadChapters(spine[currentPage], currentPage, offset).done(function(){
		if(firstPage==spine[currentPage]){
			alignFirstPage();
		}
	//}
	//store value of subtopic into local storage
	SaveInLocalStorage(bookName + "#" + 'subtopic', subtopic);
	//ebookmetadata = readEbookMetaFromLocal(username, epubFileName);
	scrollChapter(null, offset,null).done(function(){// added for scroll to particular bookmark
		if(firstPage==spine[currentPage]){
			alignFirstPage();
		}
	
	// Commenting out below two lines----  LN Cust Annotation --- Pravin
	//$("#popup_container").fadeOut();               
	//$("#background_overlay").css('display', 'none');	
		
	/*SaveInLocalStorage(bookName + "#realPageNum", (pgno));  //store value of realPageNum into local storage
	$('.page_no_field').val(pgno);
	pagetojump=(pgno);
	rePaintSlider(pgno);*/
	//paintPaginator(pgno);
	showBookMarkIcon();	
	
	updateRealPageNum().done(function(pc){	
		 setTimeout(placeAllNoteIcon(null,pc),000); //02/24
		 dfd.resolve(); 
	});
	

	
	});
	});
	return dfd.promise(false); //Prashanth N.
	};
	
/*
 * This method is being used for getting the parameters from the url.
 */
function GetURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for ( var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}

/*
* validating  the access of current user for reading the book referenced in the cfi link, from the database.
*/
function validateBookForCurrentUser(newBook,currentUser) {
var avail;
if(isConnected){
$.ajax({
type : 'POST',
dataType : 'json',
data : {
	bookName:newBook,
	user:currentUser
},
url : baseurl1+'CheckBooksForUserServlet',
async:false,
success : function(data, textStatus) {
   // var dataObj = decodeFileRequest(data);
	try {
	
		avail=data;
		//console.log("pravin:"+avail);
		if(avail==false){
			//alert(xhr.status);
			$("#background_overlay").css('opacity', '0.9');
			$("#message_container").fadeIn(1000);
			$("#background_overlay").fadeIn(1000);
			$("#background_overlay").css('display', 'block');
			text="You are not authorised to read"+" "+newBook+".";
			$("#message_container").attr({
				style:'padding-left:10px;padding-top:10px;padding-right:5px;border-style:inset;border-width:5px;'
			}).text(text);
			showMessagePopup();
		}
	
	} catch(e) {
		
	 }	 
},
error : function(xhr, textStatus, errorThrown) {
	//alert(xhr.status);
	//console.log('FileRequestServlet file :' + fileLocation+htmlFileName);
	//console.log('textStatus :' + textStatus);
	//console.log('errorThrown :' + errorThrown);
	}
});
}
return avail;
}

/*
* showing message pop when  book is unavailable  to open via cfi links.
*/
function showMessagePopup() {
if (!$("#message_container").is(':visible')) {
return;
}
$("#message_container").css({
left : ($(window).width() - $('#message_container').width()) / 2,
top : ($(window).width() - $('#message_container').width()) / 7,
position : 'absolute'
});
}
$(window).bind('resize', showMessagePopup);

/*
* CFIPath Manipulataion
* argument: clicked link .
*/
function manipulateCFIPath(targetHref) {
var opfFileName;
var CFI;
hash = targetHref.indexOf('#');
var htmlFileName;
var flag='a';
var newEpub;
var avail="check";
if(hash!= -1) {		
//stores the opf file name
opfFileName = targetHref.substring(0,hash);
if(opfFileName.match(/.epub/)){
	//console.log(opfFileName);
	newEpub=opfFileName;
	avail=validateForCrossBook(newEpub);
	if(avail==true){
		flag='b';
		var dotIndex=newEpub.indexOf(".");
		bookNameWithoutExtension=newEpub.substring(0,dotIndex);
		filePath="C:/DT/epub3sample/"+bookNameWithoutExtension+"/META-INF"+"/container.xml";
		opfFileName=getOPFFromContainerFile(filePath);
	}
}
//stores the CFI Path after the #
if(avail!=false){
if(flag=='a'){
CFI = targetHref.substring(hash+1, targetHref.length);
readOPF(opfFileName,CFI);
}
else if(flag=='b'){
	CFI = targetHref.substring(hash+1, targetHref.length);
	readOPF(opfFileName,CFI,newEpub);
}
}
}	
//return htmlFileName;
}
/*
* get opf full path from container.xml file 
* Only for cross Book CFI.
*/
function getOPFFromContainerFile(filePath) {
var packagePath;
if(isConnected){
$.ajax({
type : 'POST',
dataType : 'json',
data : {
	fileName : filePath,
	fileKey : "container.xml",
	fileType : 'html'
},
url : baseurl1+'FileRequestServlet',
async: false,
success : function(data, textStatus) {
    var dataObj = decodeFileRequest(data);
    content=dataObj.content;
    var xmlContent = $.parseXML(content);
    var x=$(xmlContent)[0].childNodes;
    packagePath= recursiveCallForpackagePath(x);
},
error : function(xhr, textStatus, errorThrown) {
	for(n in xhr) {
		////console.log('Error xhr:' + xhr[n]);
		}
	//console.log('FileRequestServlet file :' + fileLocation+htmlFileName);
	//console.log('textStatus :' + textStatus);
	//console.log('errorThrown :' + errorThrown);
	//alert(textStatus+":"+xhr+":"+errorThrown);
}
});
}
return packagePath;
}

/*
* Recursive method for finding the "full path" attribute in container.xml file. 
*/
function recursiveCallForpackagePath(x) {
for(var i=0;i<x.length;i++){
if(x[i].nodeType==3){
	continue;
}
else{
	var nodeName=x[i].nodeName;
	if(nodeName=='rootfile'){
		var y=x[i].attributes;
    	for(var j=0;j<y.length;j++){
    		if(y[j].nodeName=='full-path'){
    			packagePath=y[j].nodeValue;
    			break;
    		}
    		else{
    			continue;
    		}
    	}
	}
	else{
		 var z=x[i].childNodes;
		if(z.length>0){
			packagePath=recursiveCallForpackagePath(z);
		}
	  }
}
if(packagePath!=undefined||packagePath!=null){
return packagePath;
}
}
}

/*
* purpose: validating the book access for the user from db
* return avail=true --> for success
*       /false --> for failure
*/
function validateForCrossBook(newEpub) {
//var array=document.documentURI.split("=");
var currentUser=username;
var newBook=newEpub;
var avail=validateBookForCurrentUser(newBook,currentUser);
return avail;
}

/*
* THis method reads the opf file.
* purpose: get the .html page referred by cfi link.
* Notation:intra for intradocument cfi link and cross for croosbook cfi link.
*/
function readOPF(opfFileName,CFI,newEpub) {
var patt='[/]';
var val;
var flag='intra';
var bookNameWithoutExtension;
if(newEpub!=undefined||newEpub!=null){
var dotIndex=newEpub.indexOf(".");
bookNameWithoutExtension=newEpub.substring(0,dotIndex);
fileName1="C:/DT/epub3sample/"+bookNameWithoutExtension+"/"+opfFileName;
}
else{
fileName1=fileLocation + opfFileName;
}
if(isConnected){
$.ajax({
type : 'POST',
dataType : 'json',
data : {
	fileName : fileName1,
	fileKey : opfFileName,
	fileType : 'html'
},
url : baseurl1+'FileRequestServlet',
async: false,
success : function(data, textStatus) {
    var dataObj = decodeFileRequest(data);
    content=dataObj.content;
    var opfContent = $.parseXML(content);
    //$opfContent = $(opfContent);
    var id=CFIPathInterpreterForOpfId(CFI);
    if(id==undefined||id==null){
    	flag='cross';
    	var getcfiWithoutepubcfi=CFI.split("(");
		getcfiWithoutepubcfi=getcfiWithoutepubcfi[1].split(")");
		var splitOnIndirection=getcfiWithoutepubcfi[0].split("!");
		cfiBeforeIndirection=splitOnIndirection[0];
		splitOnSlash=cfiBeforeIndirection.split("/");
		var childNodes=opfContent.childNodes[0].childNodes;
		var val=getElementNodes(splitOnSlash,childNodes);
		//alert(val);
    }
    else{
    $elementNode=opfContent.getElementById(id);
    $ref=$elementNode.attributes;
        for(var i=0;i<$ref.length;i++){
    	if($ref[i].name=='idref'){
    		val=$ref[i].value;
    		break;
    	}
    }
    }
    $refItem=opfContent.getElementById(val);
    $htmlHREF=$refItem.attributes;
    for(var i=0;i<$htmlHREF.length;i++){
    	if($htmlHREF[i].name=='href'){
    		var val1=$htmlHREF[i].value;
     		loadCFIRef(val1,CFI,flag,val,bookNameWithoutExtension);
    		break;
    	}
    }
    
},
error : function(xhr, textStatus, errorThrown) {
	for(n in xhr) {
		////console.log('Error xhr:' + xhr[n]);
		}
	//console.log('FileRequestServlet file :' + fileLocation+htmlFileName);
	//console.log('textStatus :' + textStatus);
	//console.log('errorThrown :' + errorThrown);
}
});
}
}

/*
* Recursive method 
* argument-splitted data on slash from cfi link, childnode
* return-last element node present in the cfi (remaining cfi after indirection and before [number:number] if any)
*/
function getElementNodes(splitOnSlash,childNodes) {
	for(var j=1;j<splitOnSlash.length;j++){
		index=splitOnSlash[j]/2;
		for(var i=0;i<childNodes.length;i++){
			if(childNodes[i].nodeType==3){
				continue;
			}
			else if(childNodes[i].nodeType==1){
				index=index-1;
				if(index==0){
					if(j!=splitOnSlash.length-1){
					childNodes=childNodes[i].childNodes;
					break;
					}
					else{
						childNodes=childNodes[i];
						idref=childNodes.getAttribute('idref');
						if(idref==null||idref==undefined){
						idref=childNodes.getAttribute('id');
						//alert(idref);
						}
						if(idref==null||idref==undefined){
							idref=childNodes;
						}
						break;
					}
				}
			}
	
	}
	
}
	return idref;	
}

/*
* loading the  chapter after intrepreting the cfi links.
* Being used also in the case of intradocument CFIS by putting checks.
* intra for intradocument cfi link
* cross for crossbook cfi links.
*/
function loadCFIRef(htmlFileName,CFI,flag,val,bookNameWithoutExtension){
	//spine store the key and value as name of html file
	var check=flag;
	var file;
	var elementId;
	var topicKey;
	var bookName;
	var url;
	if(check=='intra'){
	for (key in spine) {
		if (spine[key] == htmlFileName) {
			topicKey = key;
			break;
		}
    }
	 status='true';
  	 $("#wrapper").css("visibility", "hidden");
	 $("#hidden_content").css("visibility", "visible");
	 loadChapters(htmlFileName,topicKey).done(function(){
	 var elementIds=CFIContentCalculation(CFI);
	 CFINavigation(htmlFileName,topicKey,elementIds);
	 });
	}
	else if(check=='cross'){
		elementId=CFIContentCalculation(CFI);
		topicKey=val;
		file=htmlFileName;
		bookName=bookNameWithoutExtension;
		//username=GetURLParameter("username");
		var firstReadUrl = "../";
        var lastReadUrl = "/read?username="+username;
     	url=firstReadUrl+bookName+lastReadUrl+"&arg5=" + elementId + "&arg6=" + topicKey+ "&arg7=" + file+ "&arg8=" + bookName;
       	window.location.href =url;
  	}
}

/*
* Navigation method for "intradocument cfi" as well  for "crossbook cfi" links.
*/
function CFINavigation(htmlFileName,topicKey,elementIds) {
	var elementId;
	var noOfCharacters;
	var id=elementIds.split("+")[0];
	 GetFromDataStorage(bookName+"#"+htmlFileName).done(function(chapter){
	if(!(id.match(/\//))){
		elementId=id;
		noOfCharacters=elementIds.split("+")[1];
	}
	else{
		splitOnSlash=id.split("/");
		content=JSON.parse(chapter).content;		
	    var chapContent = $.parseXML(content);
	   
		var childNodes=chapContent.documentElement.childNodes;
		var val=getElementNodes(splitOnSlash,childNodes);
		if($(val).html()==undefined){
		    elementId=val;
		    noOfCharacters=elementIds.split("+")[1];
		}else{
		elementId=$(val).html();
		noOfCharacters=elementIds.split("+")[1];
		}
	}
	$("#hidden_content").html('');
	var hiddenStr;
	var epubContentStr = $("#epub_content").html();
	if(noOfCharacters!=0){
		var index=epubContentStr.indexOf(elementId) + parseInt(noOfCharacters);
	}
	else{
		var index=epubContentStr.indexOf(elementId);
	}
	var htmlEnd=epubContentStr.substring(index,epubContentStr.length);
	hiddenStr = epubContentStr.substring(0, index);
	$("#hidden_content").css('height', $("#epub_content").css('height'));
	$("#hidden_content").css('width', $("#epub_content").css('width'));
	$("#hidden_content").css('font-size', $("#epub_content").css('font-size'));
	$("#hidden_content").css('line-height', $("#epub_content").css('line-height'));
	$("#hidden_content").html(hiddenStr);
	var epubWidth = parseInt($('#epub_content').css('width'), 10);
	var scrollwidth = document.getElementById("hidden_content").scrollWidth;
	var hiddenImageLength = $("#hidden_content").find('img').length;
		var $images = $("#hidden_content img"); // Get my img elem
		var real_width, real_height;
		var preloaded = 0;
		var total = $images.length;
		//get scrollwidth after image get loaded
		$images.load(function() {
			if (++preloaded === total) { 
				scrollwidth = document.getElementById("hidden_content").scrollWidth;
				navigateToPosition(scrollwidth, epubWidth);
				 updateRealPageNum();
		}
		});
		//added timeout for get accurate scollwidth for LN books
		setTimeout(function(){
			scrollwidth = document.getElementById("hidden_content").scrollWidth;
			var contentHidden = $("#hidden_content").html();
			if(contentHidden.length!=0){
			navigateToPosition(scrollwidth, epubWidth);
			 updateRealPageNum();
			}
		}, 400);
	 });
}

/*
* 
* checking if the cfi has ID before indirection sign.
*/

function CFIPathInterpreterForOpfId(CFI) {
	var regex='[//]+|[)]+|[\]]+';
	var splitOnIndirection=CFI.split("]!");
	var idRefToOpf;
	if(!(CFI==splitOnIndirection[0])){
	var beforeIndirection=splitOnIndirection[0].split("[");
	beforeIndirection=$(beforeIndirection);
	for(var i=0;i<beforeIndirection.length;i++){
		if(beforeIndirection[i].match(regex)){
			continue;
		}
		else{
			idRefToOpf=beforeIndirection[i];
		}
	}
	}
	return idRefToOpf;
}

/*
* matching the cfi pattern and checking if the 2nd last and last  part has "ID/[number1:number2]" or "NODE/[number1:number2]" or "NODE".
* return:
* id+number1, incase of ID/[number1:number2]
* pattern till 2nd last +number1,incase of NODE/[number1:number2]
*node  till 2nd last ,in case of NODE.
*/

function CFIContentCalculation(CFI) {
	var noOfCharacters;
	var elementId;
	splitForPath=CFI.split("(");
	splitForPath=splitForPath[1].split(")");
	var actualPath=splitForPath[0];
	var splitOnSlash=actualPath.split("/");
	var length=splitOnSlash.length;
	var lastsplittedData=splitOnSlash[length-1];
	var secondLastsplittedData=splitOnSlash[length-2];
	if(lastsplittedData.match(/:/)){
	noOfCharacters=lastsplittedData.split(":")[0];
	}
	else{
		noOfCharacters=0;
	}
	//for pattern like '/number[]', exculde this pattern
	regex1='[:]+&[;]+&[,]';
	//for pattern like 'number[]/number:number'
	regex2='^[0-9]+[:][0-9]+$';
	//for pattern like 'number[]/number:number[qqq,1%and]'
	regex3='^[0-9]+[:][0-9]+[\[][a-zA-Z]*[,]';
	regex4='^[0-9]+[\[]';
	//for pattern like '/number'
	regex5='^[0-9]+$';
	
	if((lastsplittedData.match(regex3))||(lastsplittedData.match(regex2))){
		if(secondLastsplittedData.match(regex4)){
			elementId=secondLastsplittedData.split("[");
			elementId=elementId[1].split("]");
			elementId=elementId[0];
		}
		else if(secondLastsplittedData.match(regex5)){
			var splitOnIndirection=actualPath.split("!");
			cfiAfterIndirection=splitOnIndirection[1];
			cfiAfterIndirection=cfiAfterIndirection.split("/"+lastsplittedData);
			elementId=cfiAfterIndirection[0];
		}
	}
	else if(lastsplittedData.match(regex4)){
		elementId=secondLastsplittedData.split("[");
		elementId=elementId[1].split("]");
		elementId=elementId[0];
	}
	else if(lastsplittedData.match(regex5)){
		var splitOnIndirection=actualPath.split("!");
		cfiAfterIndirection=splitOnIndirection[1];
		elementId=cfiAfterIndirection;
	}
	return elementId+"+"+noOfCharacters;
}

function scrollChapter(anchor,offset,nav,html,action) {   // Code modified for Performance - 02/24

    var dfd = $.Deferred();
    var offsetAnchor= 0;
    var offsetTopAnchor=0;
    if(anchor!=null && anchor!="null" ){
    //$("#hidden_content").html('');
    //var hiddenStr;
   // var epubContentStr = $("#epub_content").html();
    var htmlStr ;
    var currentPage=GetFromLocalStorage(bookName + "#" + 'currentPage');
    if(currentPage==null && html!=null){
    	currentPage=html;
    }
    //get value of json key from local storage
//    GetFromDataStorage(bookName+"#"+spine[currentPage]).done(function(chap){
//    var chapter = JSON.parse(chap);
  //content is take from local storage instead of epub_content div because the div content will have notes and highlights
  //but make sure to add extra spaces that are ed for pagination to calculate the scrollwidth, also subtract that number before saving the bookmark
    //console.log("chapter1111: "+chapter);
//    if(chapter!=null && chapter!="null") {
//     htmlStr = chapter.content;
//    } else {
//          htmlStr = $("#epub_content").html();
//    }
    var epubContentNode=document.getElementById("epub_content");
    htmlStr = epubContentNode.innerHTML;
 /*   var text1=htmlStr.substring(0,offset);
    var text2=htmlStr.substring(offset);
    var dummyNode = document.createElement('a');
	dummyNode.setAttribute('id', 'DUMMYID');
	epubContentNode.appendChild(document.createTextNode(text1));
	epubContentNode.appendChild(dummyNode);
	epubContentNode.appendChild(document.createTextNode(text2));*/
    var anchorElem = document.getElementById(anchor);
    if(anchorElem != null){
    	 offsetAnchor = anchorElem.offsetLeft;
    	 offsetTopAnchor= anchorElem.offsetTop;
    	 
    }
    else if($("#epub_content a[name=\""+anchor+"\"]")[0]!=null){
         offsetAnchor = $("#epub_content a[name=\""+anchor+"\"]")[0].offsetLeft;
   }

	var length=offsetAnchor;
	if(offsetAnchor!=0 && offsetTopAnchor !=0){
	var width = parseInt($('#epub_content').css('width'), 10);
	var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
	currentPosition =  ((length) / (width + gap));
	//shiftPosition1 =  currentPosition *  (width + gap);
	//console.log(anchor+" postn");
	currentPosition =  Math.floor(currentPosition) ;
	shiftPosition =  currentPosition *  (width + gap);
	$("#epub_content").css("right", shiftPosition+"px");
	$("#wrapper").css("visibility", "visible");
	$("#hidden_content").css("visibility", "hidden");

	currentPosition = currentPosition + 1;
	}
	else{
		GetFromDataStorage(bookName+"#"+spine[currentPage]).done(function(chap){ 
            var chapter = JSON.parse(chap); 
    if(chapter!=null && chapter!="null") { 
     htmlStr = chapter.content; 
    } else { 
          htmlStr = $("#epub_content").html(); 
    } 
   
    var anchorElem = document.getElementById(anchor); 
    if(anchorElem != null){ 
         offsetAnchor = anchorElem.offsetLeft; 
    } 
    else if($("#epub_content a[name=\""+anchor+"\"]")[0]!=null){ 
         offsetAnchor = $("#epub_content a[name=\""+anchor+"\"]")[0].offsetLeft; 
   }  

        var length=offsetAnchor; 
        var width = parseInt($('#epub_content').css('width'), 10); 
        var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10); 
        currentPosition =  ((length) / (width + gap)); 
        //shiftPosition1 =  currentPosition *  (width + gap); 
        //console.log(anchor+" postn"); 
        currentPosition =  Math.floor(currentPosition) ; 
        shiftPosition =  currentPosition *  (width + gap); 
        $("#epub_content").css("right", shiftPosition+"px"); 
        $("#wrapper").css("visibility", "visible"); 
        $("#hidden_content").css("visibility", "hidden"); 

        currentPosition = currentPosition + 1; 
         });


	}
   // hiddenStr = htmlStr.substring(0, offset);
    ////console.log("offsetting----------------:"+offset +" : " +hiddenStr);
    //writing content to hidden content
   /* $("#hidden_content").css('height', $("#epub_content").css('height'));
    $("#hidden_content").css('width', $("#epub_content").css('width'));
    $("#hidden_content").css('font-size', $("#epub_content").css('font-size'));
    $("#hidden_content").css('line-height', $("#epub_content").css('line-height'));
    if(nav != "pagination"){
        $("#hidden_content").html(htmlStr);
        var hiddenContent = $("#hidden_content").html().substring(0, offset);
    	$("#hidden_content").html(hiddenContent);
        }
    	else if(nav == "pagination"){
        	    hiddenStr = htmlStr.substring(0, offset);
        	  $("#hidden_content").html(hiddenStr);
        }
    
    var epubWidth = parseInt($('#epub_content').css('width'), 10);
    	  check 
    var swidth= $("#hidden_content")[0].scrollWidth;
    	  check 
    var scrollwidth = document.getElementById("hidden_content").scrollWidth;
    var hiddenImageLength = $("#hidden_content").find('img').length;
          var $images = $("#hidden_content img"); // Get my img elem
          var real_width, real_height;
          var preloaded = 0;
          var total = $images.length;
          //get scrollwidth after image get loaded
          $images.load(function() {
                if (++preloaded === total) { 
                      scrollwidth = document.getElementById("hidden_content").scrollWidth;
                      if(action=="offlinesearch"){
                    	  scrollwidth=$('#1').position().left;
                      }
                      navigateToPositionPaginator(scrollwidth, epubWidth,offset,nav,action);
          }
          });
          //added timeout for get accurate scollwidth for LN books
        
                scrollwidth = document.getElementById("hidden_content").scrollWidth;
                if(action=="offlinesearch"){
                	scrollwidth=$('#1').position().left;
                }
                navigateToPositionPaginator(scrollwidth, epubWidth,offset,nav,action);
       */
          dfd.resolve();
    
//    });
    }
    else if(action=="offlinesearch") 
    { 
            var scrollwidth=$('#1').position().left; 
             var length=scrollwidth; 
          var width = parseInt($('#epub_content').css('width'), 10); 
          var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10); 
          currentPosition =  Math.floor((length) / (width + gap)); 
          console.log("currentPosition one at two "+currentPosition); 
          shiftPosition =  currentPosition *  (width + gap); 
           console.log(shiftPosition+"inside scroll chapter"); 
          $("#epub_content").css("right", shiftPosition+"px"); 
          $("#wrapper").css("visibility", "visible"); 
          currentPosition = currentPosition + 1; 
          dfd.resolve(); 
    }
    else{
//    	 	var htmlStr ;
//    	    var currentPage=GetFromLocalStorage(bookName + "#" + 'currentPage');
//    	    if(currentPage==null && html!=null){
//    	    	currentPage=html;
//    	    }
    	    //get value of json key from local storage
//    	    GetFromDataStorage(bookName+"#"+spine[currentPage]).done(function(chap){
//    	    var chapter = JSON.parse(chap);
    	  //content is take from local storage instead of epub_content div because the div content will have notes and highlights
    	  //but make sure to add extra spaces that are ed for pagination to calculate the scrollwidth, also subtract that number before saving the bookmark
    	    //console.log("chapter1111: "+chapter);
//    	    if(chapter!=null && chapter!="null") {
//    	    	htmlStr = chapter.content;
//    	    } else {
//    	          htmlStr = $("#epub_content").html();
//    	    }
    	    var epubContentNode=document.getElementById("epub_content");
    	    var htmlStr = epubContentNode.innerHTML;
    	   // var offset = $("#"+anchor)[0].offsetLeft;
    	    offset=parseInt(offset)+100;
    	    var text1=htmlStr.substring(0,offset);
    	    var indexofleft=text1.lastIndexOf("<");
    	    var indexofright=text1.lastIndexOf(">");
    	    var text2;
    	    if(indexofleft>indexofright) {
    	    	text1=htmlStr.substring(0,indexofleft);
    	    	text2=htmlStr.substring(indexofleft);
    	    } else {
    	    	text2=htmlStr.substring(offset);
    	    }
    	    var dummyNode = "<span id=\"DUMMYID\"></span>";
    	    epubContentNode.innerHTML = text1 + dummyNode + text2;
			$("#content").css("display", "block");
    	    var offsetDummy = document.getElementById("DUMMYID").offsetLeft;
    		var length=offsetDummy;
    		var width = parseInt($('#epub_content').css('width'), 10);
    		var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
    		currentPosition =  Math.floor((length) / (width + gap));
    		shiftPosition =  currentPosition *  (width + gap);
    		$("#epub_content").css("right", shiftPosition+"px");
    		$("#wrapper").css("visibility", "visible");
    		currentPosition = currentPosition + 1;
    		dfd.resolve();
    	    /*GetFromDataStorage(bookName+"#"+spine[currentPage]).done(function(chap){
       	    var chapter = JSON.parse(chap);
       	    //content is take from local storage instead of epub_content div because the div content will have notes and highlights
       	    //but make sure to add extra spaces that are ed for pagination to calculate the scrollwidth, also subtract that number before saving the bookmark
       	    //console.log("chapter1111: "+chapter);
       	    if(chapter!=null && chapter!="null") {
       	    	htmlStr = chapter.content;
       	    } else {
       	          htmlStr = $("#epub_content").html();
       	    }
    		 hiddenStr = htmlStr.substring(0, offset);
    	    ////console.log("offsetting----------------:"+offset +" : " +hiddenStr);
    	    //writing content to hidden content
    	    $("#hidden_content").css('height', $("#epub_content").css('height'));
    	    $("#hidden_content").css('width', $("#epub_content").css('width'));
    	    $("#hidden_content").css('font-size', $("#epub_content").css('font-size'));
    	    $("#hidden_content").css('line-height', $("#epub_content").css('line-height'));
    	    if(nav != "pagination"){
    	        $("#hidden_content").html(htmlStr);
    	        var hiddenContent = $("#hidden_content").html().substring(0, offset);
    	    	$("#hidden_content").html(hiddenContent);
    	        }
    	    	else if(nav == "pagination"){
    	        	    hiddenStr = htmlStr.substring(0, offset);
    	        	  $("#hidden_content").html(hiddenStr);
    	        }
    	    
    	    var epubWidth = parseInt($('#epub_content').css('width'), 10);
    	    	 // check 
    	    var swidth= $("#hidden_content")[0].scrollWidth;
    	    	//  check 
    	    var scrollwidth = document.getElementById("hidden_content").scrollWidth;
    	    var hiddenImageLength = $("#hidden_content").find('img').length;
    	          var $images = $("#hidden_content img"); // Get my img elem
    	          var real_width, real_height;
    	          var preloaded = 0;
    	          var total = $images.length;
    	          //get scrollwidth after image get loaded
    	          $images.load(function() {
    	                if (++preloaded === total) { 
    	                      scrollwidth = document.getElementById("hidden_content").scrollWidth;
    	                      if(action=="offlinesearch"){
    	                    	  scrollwidth=$('#1').position().left;
    	                      }
    	                      navigateToPositionPaginator(scrollwidth, epubWidth,offset,nav,action);
    	          }
    	          });
    	          //added timeout for get accurate scollwidth for LN books
    	        
    	                scrollwidth = document.getElementById("hidden_content").scrollWidth;
    	                if(action=="offlinesearch"){
    	                	scrollwidth=$('#1').position().left;
    	                }
    	                navigateToPositionPaginator(scrollwidth, epubWidth,offset,nav,action);
    	                dfd.resolve();*/
//    	    });
    }
    return dfd.promise(); 


}
/*INDEX functionality implemneted here code:arsha*/
/*Arsha:EDITED*/


function parseIndex(){
	var e="<ul id='indexList'></ul>";
	$("#IndexContent").hide();
	$("#indexHeadings").html(e);
	$("#subIndex").html("");
	$("#ExpandedContent").html("");
	$("#indexHeadings").removeClass("divider");
	$("#subIndex").removeClass("divider");

	//console.log("index file fetched parsing started");
	
$("#IndexContent").find("section").each(function(){
		var epupType=$(this).attr("epub:type");
		if(epupType==="index-group"){
		
			var h2Text=$(this).find("h2").text();/* onclick='getSection("+h2Text+");'*/
			var list="<li><a class='indexGroupHeading' href='#' id="+h2Text+">"+h2Text+"</a></li>";//
			$("#indexList").append(list);
			$(this).attr("id",h2Text);

		}

	$("section>ul>li").children("span").each(function(){
			var epupType=$(this).attr("epub:type");
			if(epupType==="index-term"){
				
				//alert("here");
				


				var indexTerm=$.trim($(this).text());/* onclick='getSection("+h2Text+");'*/
				var headTerm=(indexTerm.substr(0,2)).toUpperCase();
				// alert(indexTerm+"----->"+headTerm);
				$(this).parent().attr("id",headTerm);
				$(this).parent().attr("class","subIndexTerms"); 
				$(this).attr("class","subIndexSpan");
			}

		});
	});

	positionIndexPopup();
	/*----------------CODE:for fetching REquired content as per selection--------------------------------*/

	var curHead="";
	var prevHead="";
	$(".indexGroupHeading").click(function (e){e.preventDefault();
	$("#indexHeadings").addClass("divider");
	var e="<ul id='subIndexList'></ul>";
	$("#subIndex").html(e);
	$("#ExpandedContent").html("");
	var href=$(this).attr('id');
	$("section#"+href).find(".subIndexTerms").each( function(){
		// alert("inside function 2");

		var li_Id=$(this).attr("id");
		// alert(li_Id);
		curHead=li_Id;

		//alert(curHead+"-----"+prevHead);
		if(curHead!==prevHead){
			//	alert("inside if");
			var list="<li><a id="+curHead+" href='#' class='subindexLink'>"+curHead+"</a></li>";
			$("#subIndexList").append(list);
		}
		prevHead=curHead;

	}	  

	);

	$(".subindexLink").click(function(e){

		e.preventDefault();
		$("#subIndex").addClass("divider");
		$("#ExpandedContent").html("");
		var indexGroup=$(this).attr("id");
		$("li#"+indexGroup).each(function(){
			$("#ExpandedContent").append($(this).html());

		});

		$(".subindexLink").removeClass("activeTab");
		$(this).addClass("activeTab");

	});       


//	var selectedContent=$("section#"+href).html();



//	$("#ExpandedContent").html(selectedContent);
//	$("#indexHeadings").addClass("divider");
	/* $('#'+id_click[1]).show();  */

	/*..CODE FOR HIGHLIGHTING THE SELECTED DIV...*/
	$(".indexGroupHeading").removeClass("activeTab");
	$(this).addClass("activeTab");
	/*------------------------------------------------*/

	});


}

function positionNoIndexPopup(){
	/* if (!$("#noIndexMsg").is(':visible')) {
          return;
          }*/


	if($("#indexImages").length>0 && $("#noIndexMsg").is(':visible')){    
		/*$("#noIndexMsg").css({
         left : ($(window).width() - $('#noIndexMsg').width()) / 2,
       //  top : ($(window).width() - $('#noIndexMsg').width()) / 7,
         position : 'absolute'
});*/
		//var propertiesMap = JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
		//$("#no_index").text(propertiesMap.no_index_available);
		
		$("#noIndexMsg").css('left', ($(window).width() - $('#noIndexMsg').width()) / 2);
		$("#arrowNoIndex").css('left', $("#indexImages").offset().left  - $("#noIndexMsg").offset().left+$("#indexImages").width()/2-7);
		}
	else{
		setTimeout(positionNoIndexPopup ,100);
	}
	/*var icon= $("#indexImages");
    	 iconPos=icon.position();
    	 //console.log("the indexImages lEFT"+iconPos.left);
    	 //console.log("the arrow left b4 css"+$("#arrowNoIndex").position().left);
    	 $("#arrowIndex").css({left:iconPos.left});
    	 //console.log("the arrow left after css"+$("#arrowNoIndex").position().left);
	 */}
function positionIndexPopup(){
	/*//console.log("index resizer:inside loadLOcalstorage");*/
	/*if (!$("#indexContainer").is(':visible')) {return;}*/
	if($("#indexImages").length>0 && $("#indexContainer").is(':visible')){ 
		/*$("#indexContainer").css({
		                    left : ($(window).width() - $('#indexContainer').width()) / 2,
		                    //top : ($(window).width() - $('#indexContainer').width()) / 7,
		                    position : 'absolute'
	});
		 */

		
		
		
		
		$("#indexContainer").css('left', ($(window).width() - $('#indexContainer').width()) / 2);
		$("#arrowIndex").css('left', $("#indexImages").offset().left  - $("#indexContainer").offset().left+$("#indexImages").width()/2-7);

		/*below code is added so that data fix to the container on resizing vertically:arsha*/
		var winHeight=$(window).height();
		var topRibbonHeight=$("#top-ribbon").height();
		var halfBottomRibbonHeight=$("#bottom-ribbon").height()/2;
		var bottomRibbonHeight=$("#bottom-ribbon").height();
		var paddingBtwOverlayAndTopRibbon = 3;
		var scrollGap = 20;
		var indexContainerHeightipad=winHeight-topRibbonHeight-halfBottomRibbonHeight;
		var indexContainerHeightDesktop=winHeight-topRibbonHeight-paddingBtwOverlayAndTopRibbon;
		//$("#indexContainer").css('height',indexContainerHeightDesktop);
		if(window.matchMedia("screen and  (max-device-width : 1500px)").matches) {
			var indexHeading = $("#closeIndexTag").css("height");
			indexHeading = parseInt(indexHeading, 10);
			$("#nongroupindex").css('height',indexContainerHeightDesktop - indexHeading - scrollGap);
			$("#indexContainer").css('height',indexContainerHeightDesktop);
		}else{
		if (window.matchMedia("screen and (min-device-width : 768px) and (max-device-width : 1024px) ").matches||window.matchMedia("screen and (min-device-width : 0px) and (max-device-width : 768px) ").matches) {
			$("#indexContainer").css('height',indexContainerHeightipad);
		}
			
		
		/*if(window.matchMedia("screen and (min-device-width : 0px) and (max-device-width : 768px) ").matches) {
			$("#indexContainer").css('height',indexContainerHeightipad);
		}*/
		}
		
		var containerHeight=$("#indexContainer").height();
		var headingHeight=$("#closeIndexTag").height();
		var paddingBottom=10;
		var height=containerHeight-headingHeight-paddingBottom;
		var expandedContentPaddingTop=8;/*8px padding at the top*/
		$("#indexHeadings").css('height',height);
		$("#subIndex").css('height',height);
		$("#ExpandedContent").css('height',height-expandedContentPaddingTop);
		
	}
	else{
		setTimeout(positionIndexPopup ,100);
	}
	
	// var arrow=$("#arrowIndex");
	 /*var icon= $("#indexImages");
	 iconPos=icon.position();
	 //console.log("the indexImages lEFT"+iconPos.left);
	 //console.log("the arrow left b4 css"+$("#arrowIndex").position().left);
	 $("#arrowIndex").css({left:iconPos.left});
	 //console.log("the arrow left after css"+$("#arrowIndex").position().left);
*/}

/*-----------------------edited by arsha:variables added in the begining*/

/*pageindexxml is null when i call this function in the begining in list view*/


function loadPageIndex(){
	//console.log("inside load page index");
	var groupIndex = $("#indexList").contents().length != 0;
	var nonGroupIndex = $("#nongroupindex").contents().length != 0;
	
	console.log("groupIndex = " + groupIndex + " nonGroupIndex = " + nonGroupIndex);
	if(!groupIndex && !nonGroupIndex) {
		showIndexPane(false);
		positionNoIndexPopup();
	}
	else {
		if(nonGroupIndex) {
			$("#nongroupindex").removeClass("hideContent");
			$("#nongroupindex").css("display", "block");
		} else {
			$("#nongroupindex").addClass("hideContent");
			$("#nongroupindex").css("display", "none");
		}
		showIndexPane(true);
		positionIndexPopup();
		
		$("#nongroupindex a").click(function(e){
		   
		    $("#indexContainer").fadeOut();
		});
		$("#ExpandedContent a").click(function(e){
		   
		    $("#indexContainer").fadeOut();
		});
	}
}/*load index ends here-----*/

function CheckForPrintedVersionAvailability(){
    var dfd = $.Deferred();
    var flag= false;
    for (key in spine) {
          if (key == 'toc') {
                tocfilename = spine[key];
                break;
          }
    }
          GetFromDataStorage(bookName + "#" + tocfilename).done(function (tocxhtml){
                var tocxml = JSON.parse(tocxhtml);  
                var tocxmlDOM = $.parseXML(tocxml.content);
                $(tocxmlDOM).find('nav').each(function() {
                      if ($(this).attr('epub:type') == 'page-list') {
                            flag= true;
                      }
                      else{
                      $(this).find('a').each(function() {
                            tocmap[$(this).attr('href')] = $(this).text();

                      });
                      }
                });
                dfd.resolve(flag);
                
          });
          return dfd.promise();
          
    }


var loadevent = new CustomEvent("loadDB", {
	detail : {
		message : "Loading indexed DB or Web SQL",
		time : new Date()
	},
	bubbles : true,
	cancelable : true
});

window.addEventListener("loadDB", function() {
	if(bookName==undefined){
		bookName=epubFileName;
	}
	for(var i=0; i<3;i++) {
		var chapterKey = chapterKeys.pop();
		if (chapterKey == undefined) {
			clearInterval(intervalId);
			storeValueInDatabase(epubFileName+"#downloaded","true");
		} else {
			if (isConnected) {
				var htmlFileName = spine[chapterKey];
				var htmlFileKey = spine[chapterKey];
				ajaxCallForChapterWW(fileLocation, htmlFileName, htmlFileKey,
						bLocalStorageFull, true, bookName).done(function(success){
							if(!success)
								chapterKeys.push(chapterKey);
						});
			}
		}
	}
}, false);

var intervalId = null;
 intervalId = window.setInterval(function() {
	window.dispatchEvent(loadevent);
}, 1000);
 
 
 
 
 /*performance change for index*/

 