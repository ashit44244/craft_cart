/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var errorstring;
var searchJson;
var isCtrl = false;
var indexingStatus;
var isFirstTime=true;//UI cust- Darshan
var handle;
var currentIndex;
var currentResults;
var maxResults;
var query;
var windowResizeSearch=false;


document.onkeyup=function(e){
    if(e.keyCode == 17) isCtrl=false;
}
document.onkeydown=function(e){
    if(e.keyCode == 17 || e.keyCode == 91) isCtrl=true;
    if(e.keyCode == 70 && isCtrl == true) {
	e.preventDefault();
       // alert('Please use search field');
        return false;
    }
}

$('#searchQuery').keypress(function (e) {  
	if (e.which == 13) {
		if(isConnected){
	         e.preventDefault();
	         $("#searchButton").click(); 
	         return false;
		}
		else{
			e.preventDefault();
	         $("#nextsearchoff").click(); 
	         return false;
		}
	    }
	
	
    
});
function stripEndQuotes(s){
	var t=s.length;
	var x="";
	if (s.charAt(0)=='"'||s.charAt(0)=='\''){
		s=s.substring(1,t);
	} 
	t=s.length;
	if (s.charAt(t-1)=='"'||s.charAt(t-1)=='\'') {
		s=s.substring(0,t-1);
	}
	x=s;
	
	return x;
}

var data;
/* UI cust Darshan
 */
/*function searchAndRetrieve(keyword){ 
	//alert('xx');
	
	var q=keyword;
	var s="";
	var bookname=epubFileName;
	
	//console.log("inside searchAndRetrieve");
	
	if(typeof q.value!="undefined")
		{
		q=q.value;
		}
	
    if(q=="")
    	{    	
    	//alert("Oops!! Empty Search");
    	alert(document.getElementById("emptysearch").value);
    	}
    else{
    	var keywords=q.split(" ");
    	var processedKeyword=[];
    	$.each( keywords, function( key, value ) {
    		  //alert( key + ": " + value );
    		processedKeyword.push(stripEndQuotes(value));
    		});
    	//alert(processedKeyword.join(" "));
    	s=processedKeyword.join(" ");
    	if(isConnected){
    	$.ajax({
			type : 'POST',
			async: false,
			data : {
				urls:epubFileName
			},
			url : baseurl1+ 'indexstatus',
			
			success : function(res) {
			   
			//	//console.log("index Status:"+res);
				data=res;
				
			},
			error : function(xhr, textStatus, errorThrown) {
				for(n in xhr) {
					////console.log('Error xhr:' + xhr[n]);
					}
				//console.log('textStatus :' + textStatus);
				//console.log('errorThrown :' + errorThrown);
			}
		});
    	}
    	
    	}
	    	
	    	var checkIndexing=JSON.stringify(data);
	    	var checkstring = jQuery.parseJSON(checkIndexing);
	    //	//console.log("result"+checkIndexing);
	    	//var resultcheck = checkIndexing."indexStatus";
	    	
	    	$(resultcheck).each(function(i) {	
	    		var idcheck=resultcheck[i].id;
	    		if(idcheck==epubFileName+"IndexingStatus")
	    			{
	    			indexingStatus=resultcheck[i].status;
	    			}
	    	});

    	if(checkstring.indexStatus!=true)
		{
		errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri;font-size:110%\"><b>Info: Indexing is on Progress...</b><br/><br/>" +
				"Your Book <b>"+epubFileName+"</b> is currently being indexed... <br/><br/>Kindly try after some time.</div>";
	$("#searchcontent").html(errorstring);
	$("#numberofresults").html('<div/>');
	showSearchResults();
		}
    	else{
    		if (isConnected) {
   $.ajax({
		type : 'POST',
		async: false,
		data : {
			q : s,
			bname : bookname,
			job:'search'
		},
		url : baseurl1+ 'dtsearch',
		
		success : function(response) {
		   	var responseObj=decodeSearchRequest(response.content);
			//console.log('inside success');
			//localStorage.setItem("search#json",JSON.stringify(response));
			$("#popup_container").css('display', 'none');
			$(".keywordsfield").val(q);
			searchJson=JSON.stringify(responseObj);
			populateSearchResults();
			showSearchResults();
		},
		error : function(xhr, textStatus, errorThrown) {
						errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri\">"
								+ " We couldn't find anything for your search !!!<p><br>Suggestions:</p><br> <ul style=\"padding-left:8%\"><li>Make sure that all words are spelled correctly.</li><li>Try different keywords.</li><li>Try more general keywords.</li><li>Try fewer keywords.</li></ul> </div>";
						$("#searchcontent").html(errorstring);
						$("#numberofresults").html('<div>'+document.getElementById("numofresults").value+':0</div><hr/>');
						showSearchResults();
			for(n in xhr) {
				////console.log('Error xhr:' + xhr[n]);
				}
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
			}
	});}
    		
	
    }
}

function showSearchResults(){

	  $("#search_container").slideDown(500);
	  $("#background_overlay").css('display','block');
	  $("#background_overlay").css('opacity','0');
	  searchPositionPopup();
}




function populateSearchResults() {
	var outputStr = "";
	var keyword="";
	var book=epubFileName;
	var texttobeshown="";
	var xpathnav="";
	var filename="";
	var offset="";
	//console.log('inside populateSearchResults');
	var searchjson=searchJson;//localStorage.getItem("search#json");
	var jsonstring = jQuery.parseJSON(searchjson);
	var resultfound = jsonstring.searchResult.response;
	////console.log(resultfound);
	keyword=jsonstring.searchResult.keyword;
	var count=jsonstring.searchResult.resultCount;
	var haswildchar=jsonstring.searchResult.hasWildChar;
	//alert(haswildchar);
	//keyword=keyword.substring(1, keyword.length - 1);
	//alert(keyword);
	
	var star= new Array();
	var en=new Array();
	$(resultfound).each(function(i) {	
		var numhighlight=this.highlights;
		var showtext = resultfound[i].showtext;
		filename=this.filename ;
		//alert(filename);
		$(showtext).each(function(j) {
			//var xpath = showtext[j].xPaths;
			texttobeshown=this.text;
			arrayPosition=this.location;
			curtoken=this.currentTokenCount;
			prevtoken=this.prevTokenCount;
//			$(xpath).each(function(k) {
//
//				xpathnav=this.xPath;
//				var offset=	xpath[k].offset;
//				
//				$(offset).each(function(x) {
//					keyword=jsonstring.searchResult.keyword;
//				var start=offset[x].start;	
//					$(start).each(function(y) {
//						star[y-1]=start[y];
//						////console.log("start[y]:"+start[y]);
//					});
//					var end=offset[x].end;
//					$(end).each(function(z) {
//						en[z-1]=end[z];
//						////console.log("end[z]:"+end[z]);
//					});
//					
//				});
//			});
			for (key in spine) {
				if (spine[key] .indexOf(filename) != -1)
				{
					currentPage = key;
					break;
				}
		    }
			var chapname=getChapterName(currentPage,"null");
			if(chapname===undefined)
				{
				//chapname="";
				}
				outputStr += "<div id=\"showtext\" align=\"left\">"+chapname+"</div><div id=\"searchresultsdiv\">" +
				"<a class=\"searchlink\" href='javascript:getXpath(\""+book+"~~"+filename+"~~"+keyword+"~~"+arrayPosition+"~~"+curtoken+"~~"+prevtoken+"~~"+haswildchar+"\");'>..."+texttobeshown+"...</a></div><hr />";
				
			
		});
		$("#searchcontent").html(outputStr);
		$("#numberofresults").html('<div>'+document.getElementById("numofresults").value+':'+count+'</div><hr/>');
	});
	
	if(jsonstring.searchResult.resultFound==0)
	{
	errorstring="<div id=\"errordiv\" align=\"left\">" +
			" We couldn't find anything for your search !!!<p><br>Suggestions:</p><br> <ul style=\"padding-left:8%\"><li>Make sure that all words are spelled correctly.</li><li>Try different keywords.</li><li>Try more general keywords.</li><li>Try fewer keywords.</li></ul> </div>";
	$("#searchcontent").html(errorstring);
	$("#numberofresults").html('<div>'+document.getElementById("numofresults").value+':0</div><hr/>');
	showSearchResults();
	}
	
}
*/
/*UICUST:arsha*/
/*$("#searchButton").click(function(){
	 //$("#searchloading").css("display","block");
	
	 
});*/

function searchAndRetrieve(keyword, start){ 
	//alert('xx');
	query = keyword;	
	var q=keyword;
	var startindex = start;
	//alert(q+"  "+startindex);
	var s="";
	var bookname=epubFileName;
	
	console.log("inside searchAndRetrieve");
	$("#paginatesearch").css("display","block");	
	$("#previoussearch").attr("class","prevsearchdis");
	$("#nextsearch").attr("class","nxtsearchdis");
		
	if(typeof q.value!="undefined")
	{
		q=q.value;
	}
	
    var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
    if(q=="")
    {   
	errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri;color: white;\">"+ propertiesMap.empty_search+"</div>";
	$("#searchcontent").html(errorstring);
	$("#paginatesearch").css("display","none");
	showSearchResults();
	//displayError(propertiesMap.empty_search,propertiesMap.close,"172px");
  //  alert(propertiesMap.empty_search/*document.getElementById("emptysearch").value*/);
   

    }
else{
    var keywords=q.split(" ");
    var processedKeyword=[];
    $.each( keywords, function( key, value ) {
                      //alert( key + ": " + value );
                    processedKeyword.push(stripEndQuotes(value));
                    });
    //alert(processedKeyword.join(" "));
    s=processedKeyword.join(" ");
   
    if(isConnected){
    $.ajax({
                                    type : 'POST',
                                    async: false,
                                    data : {
                                                    urls:epubFileName
                                    },
                                    url : baseurl1+ 'indexstatus',
                                    
                                    success : function(res) {
                                       
                                    //            //console.log("index Status:"+res);
                                                    data=res;
                                                    
                                    },
                                    error : function(xhr, textStatus, errorThrown) {
                                                    for(n in xhr) {
                                                                    ////console.log('Error xhr:' + xhr[n]);
                                                                    }
                                                    //console.log('textStatus :' + textStatus);
                                                    //console.log('errorThrown :' + errorThrown);
                                    }
                    });
    }
    
                    
                    var checkIndexing=JSON.stringify(data);
                    var checkstring = jQuery.parseJSON(checkIndexing);
        //        //console.log("result"+checkIndexing);
                    //var resultcheck = checkIndexing."indexStatus";
                    
      /*         $(resultcheck).each(function(i) {              
                                    var idcheck=resultcheck[i].id;
                                    if(idcheck==epubFileName+"IndexingStatus")
                                                    {
                                                    indexingStatus=resultcheck[i].status;
                                                    }
                    });*/

    if(checkstring.indexStatus!=true)
                    {
                    errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri;font-size:110%\"><b>Info: Indexing is on Progress...</b><br/><br/>" +
                                                    "Your Book <b>"+epubFileName+"</b> is currently being indexed... <br/><br/>Kindly try after some time.</div>";
    $("#searchcontent").html(errorstring);
    $("#paginatesearch").css("display","none");
    /*$("#numberofresults").html('<div/>');*/
    showSearchResults();
   
                    }
    else{ 
                    if (isConnected) {
$.ajax({
                    type : 'POST',
                    async: false,
                    data : {
                                    q : s,
                                    bname : bookname,
                                    startindex : startindex,
                                    job:'search'
                    },
                    url : baseurl1+ 'dtsearch',
                    
                    success : function(response) {
                                    var responseObj=decodeSearchRequest(response.content);
                                    //console.log('inside success');
                                    //localStorage.setItem("search#json",JSON.stringify(response));
                                    $("#popup_container").css('display', 'none');
                                   /* $("#searchloading").css("display","none");*/
                                    $(".keywordsfield").val(q);
                                    searchJson=JSON.stringify(responseObj);
                                    populateSearchResults();
                                    showSearchResults();
                    },
                    error : function(xhr, textStatus, errorThrown) {               /* $("#searchloading").css("display","none");*/
			                    	$("#paginateTable").empty();
			                    	errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri;color:white;\">"
			                                    + propertiesMap.couldnot_find_search+"<p><br>"+propertiesMap.suggestions+"</p><br> <ul style=\"padding-left:8%\"><li>"
			                                    +propertiesMap.make_sure+"</li><li>"+propertiesMap.try_different_keywords+"</li><li>"+propertiesMap.try_more_general_keywords+
			                                    "</li><li>"+propertiesMap.try_fewer_keywords+"</li></ul> </div>";
			                        $("#searchcontent").html(errorstring);
			                                                                                   /* $("#numberofresults").html('<div>'+document.getElementById("numofresults").value+':0</div><hr/>');*/
			                        $("#paginatesearch").css("display","none");
				                    showSearchResults();
                                    for(n in xhr) {
                                                    ////console.log('Error xhr:' + xhr[n]);
                                                    }
                                    //console.log('textStatus :' + textStatus);
                                    //console.log('errorThrown :' + errorThrown);
                                    }
    });}
                    
    }    
}
}

/**
 * Function to hide Search container - if clicked outside.
 */
$(document).mouseup(function (e){
	
        var container = $("#search_container");
        if(!windowResizeSearch){//avoid fading out when window is resized
        	if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
        	{
              container.fadeOut(400);
        	}
        }else{
        	   windowResizeSearch=false;
        }
});

$( window ).resize(function() {//Important to keep overlay visible on resize.
	if ($("#search_container").is(':visible')) {
		windowResizeSearch = true;
		searchPositionPopup();
	}
});

function showSearchResults(){
	 //$("#searchloading").css("display","none");
	
	  $("#search_container").fadeIn(400);
	  $("#search_field2").fadeIn(400);
	  $("#search_hrDivider").fadeIn(400);
	  $("#searchcontent").fadeIn(400);
	  searchPositionPopup();
	 
}

/**
 * function called - on click of search button of top ribbon.
 */

$("#searchD").click(
		function() {
			
			
			
			if ($("#search_container").is(':visible')) {

				$("#search_container").fadeOut(400);

			} else {
				if (isFirstTime || $('#searchcontent').is(':empty')) {
					$("#search_container").fadeIn(400);
					$('#searchQuery').focus();
					if ($("#search_container").is(':visible')) {
						
						$("#search_field2").fadeIn(400);
						$("#searchcontent").fadeOut(400);
					}
					if (!$("#search_container").is(':visible')) {
						return;
					}

					$("#search_container")
							.css(
									'left',
									($(window).width() - $('#search_container')
											.width()) / 2);

					$("#arrowID").css(
							'left',
							$("#search_field").offset().left
									- $("#search_field2").offset().left
									+ $("#search_field").width() / 2 - 10);

					isFirstTime = false;
				} else {
					
					showSearchResults();
					$('#searchQuery').focus();
				}
			}
		});



function populateSearchResults() {
	var outputStr = "";
	var keyword = "";
	var book = epubFileName;
	var texttobeshown = "";
	var xpathnav = "";
	var filename = "";
	var offset = "";
	var searchjson = searchJson;// localStorage.getItem("search#json");
	var jsonstring = jQuery.parseJSON(searchjson);
	var resultfound = jsonstring.searchResult.response;
	keyword = jsonstring.searchResult.keyword;
	var count = jsonstring.searchResult.resultCount;
	var haswildchar = jsonstring.searchResult.hasWildChar;
	var filenameOutputString = {};
	var newOutputAfterSort = new Array();
	var outputStrDummy = "";
	var propertiesMap = getPropertiesMap();
	
	var isFirst = jsonstring.searchResult.isFirst;
	if(!Boolean(isFirst))
		{
		//$("#previoussearch").css("visibility","hidden");
		$("#previoussearch").attr("class","prevsearch");
	//	alert(isFirst);
		}
	
	var hasMore = jsonstring.searchResult.hasMore;
	
	if(Boolean(hasMore))
	{
	//$("#previoussearch").css("visibility","hidden");
		$("#nextsearch").attr("class","nxtsearch");
	//	alert(hasMore);
	}
	
	currentIndex = jsonstring.searchResult.currentIndex;
	currentResults = jsonstring.searchResult.currentResults;
	maxResults = jsonstring.searchResult.maxResults;
	var snippetCount = jsonstring.searchResult.snippetCount;
	
	var star = new Array();
	var en = new Array();
	$(resultfound)
			.each(
					function(i) {
						var numhighlight = this.highlights;
						var showtext = resultfound[i].showtext;
						filename = this.filename;
						$(showtext)
								.each(
										function(j) {
											texttobeshown = this.text;
											arrayPosition = this.location;
											curtoken = this.currentTokenCount;
											prevtoken = this.prevTokenCount;
											// $(xpath).each(function(k) {
											//
											// xpathnav=this.xPath;
											// var offset= xpath[k].offset;
											//                                                
											// $(offset).each(function(x) {
											// keyword=jsonstring.searchResult.keyword;
											// var start=offset[x].start;
											// $(start).each(function(y) {
											// star[y-1]=start[y];
											// ////console.log("start[y]:"+start[y]);
											// });
											// var end=offset[x].end;
											// $(end).each(function(z) {
											// en[z-1]=end[z];
											// ////console.log("end[z]:"+end[z]);
											// });
											//                                                                
											// });
											// });
											for (key in spine) {
												if (spine[key]
														.indexOf(filename) != -1) {
													currentPage = key;
													break;
												}
											}
											var chapname = getChapterName(
													currentPage, "null");
											if (chapname === undefined) {
												// chapname="";
											}

											// Object is populated with the
											// key/value pair
											// resultString/Filename for sorting at client side.- This is not required as the results are coming as sorted from server.
											/*filenameOutputString["<div id=\"showtext\" align=\"left\">"
													+ chapname
													+ "</div><div id=\"searchresultsdiv\">"
													+ "<a class=\"searchlink\" href='javascript:getXpath(\""
													+ book
													+ "~~"
													+ filename
													+ "~~"
													+ keyword
													+ "~~"
													+ arrayPosition
													+ "~~"
													+ curtoken
													+ "~~"
													+ prevtoken
													+ "~~"
													+ haswildchar
													+ "\");'>..."
													+ texttobeshown
													+ "...</a></div><hr id=\"search_hr\" />"] = filename;*/

											
										 
											 outputStr += "<div id=\"showtext\" align=\"left\">"+chapname+"</div><div id=\"searchresultsdiv\">" + "<a class=\"searchlink\" href='javascript:getXpath(\""+book+"~~"+filename+"~~"+keyword+"~~"+arrayPosition+"~~"+curtoken+"~~"+prevtoken+"~~"+haswildchar+"\");'>..."+texttobeshown+"...</a></div><hr id=\"search_hr\" />";
											 
										});
					});

	// Sort the output based on spine order.- Darshan
	/*for (keySpine in spine) {
		for (keyResultString in filenameOutputString) {
			if (filenameOutputString[keyResultString].indexOf(spine[keySpine]) != -1
					|| spine[keySpine]
							.indexOf(filenameOutputString[keyResultString]) != -1) {
				newOutputAfterSort.push(keyResultString);
			}
		}
	}

	for ( var i = 0; i < newOutputAfterSort.length; i++) {
		outputStr += newOutputAfterSort[i];
	}*/
	// end sorting change

	$("#searchcontent").html(outputStr);
	/*$("#numberofresults").html( 
			'<div>' + document.getElementById("numofresults").value + ':'
					+ count + '</div><hr/>');*/
	buildPaginator(snippetCount,currentIndex,currentResults);	
	if (jsonstring.searchResult.resultFound == 0) {
		$("#paginateTable").empty();
		var getI18nMap = JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));	
		errorstring="<div id=\"errordiv\" align=\"left\">" +
		propertiesMap["couldnot_find_search"]+"<p><br>"+propertiesMap["suggestions"]+"</p><br> <ul style=\"padding-left:8%\"><li>"+getI18nMap["make_sure"]+"</li><li>"+getI18nMap["try_different_keywords"]+"</li><li>"+getI18nMap["try_more_general_keywords"]+"</li><li>"+getI18nMap["try_fewer_keywords"]+"</li></ul> </div>";
		$("#searchcontent").html(errorstring);
		/*$("#numberofresults").html(
				'<div>' + document.getElementById("numofresults").value
						+ ':0</div><hr/>');*/
		showSearchResults();
	}

}

function buildPaginator(snippetCount,currentIndex,currentResults)
{
	$("#paginateTable").empty();
	//alert($("#paginateTable"));
	var counter = 10;
	var table = document.createElement('table');
	var tr = document.createElement('tr');
	var k;
	var resultIndex= currentIndex-currentResults;
	var multiple = parseInt(resultIndex.toString().length);
	if(multiple>3)
		{
		counter = 8;
		}
	else
		{
		counter = 10;
		}
	
//	k = multiple*10+1;
	//	k = parseInt(Math.floor(resultIndex/(maxResults*10))*(multiple*10)+1);
	k = parseInt(Math.floor(resultIndex/(maxResults)));
	var increment = Math.floor(resultIndex/(maxResults))+1;
	
//	var j = k;
	if(increment >=10)
		{
		k = k - parseInt(Math.floor(counter/2));  
		}
	else
		{
		k=0;
		}
	var maxLoop = parseInt(Math.floor(snippetCount/maxResults));
	if(snippetCount%maxResults>0)
		{
		maxLoop= maxLoop+1;
		}
//	alert("  Current Index "+resultIndex+"  Start "+k+"  max loop "+maxLoop);
	
	for(var i=0; i<(counter); i++)
		{
		if(k<maxLoop)
			{
		var startCounter = k*maxResults; 
		var td = document.createElement('td');
		var a = document.createElement('a');
		var att1=document.createAttribute("class");
		if(startCounter==resultIndex)
			{
			att1.value="pagLinkdis";
			}
		else
			{
			att1.value="pagLink";
			}
		
		a.setAttributeNode(att1);
		var att=document.createAttribute("href");
		att.value='javascript:getNextSet('+startCounter+')';
		a.setAttributeNode(att);
		var text = document.createTextNode((k+1));
		a.appendChild(text);
		td.appendChild(a);
		tr.appendChild(td);
		}
		k++;
		}
	table.appendChild(tr);
	$('#paginateTable').append(table);
}

function showsearch(params)
{
	var xpath='';
	var tempsearchjson=JSON.stringify(params);
	//console.log("temp response:"+JSON.stringify(params));
	var jsonstring = jQuery.parseJSON(tempsearchjson);
	var file = jsonstring.searchResult.response.filename;
	var resp=jsonstring.searchResult.response.showtext.xPaths;
	
	$(resp).each(function(i) {	
		xpath = resp[i].xPath;
		
		offset=resp[i].offset;
		$(offset).each(function(k) {
			id=offset[k].id;
			//console.log("id:"+id);
		pos=offset[k].position;
		$(pos).each(function(j) {
		//console.log("position:"+pos[j]);
		});
		});
		});
	var paraText=xpath;
	paraText=paraText.substring(1, paraText.length);
	var selectedText=jsonstring.searchResult.keyword;
	for (key in spine) {
		if (spine[key].indexOf(file)!=-1)
		{
			currentPage = key;
			break;
		}
    }
	//store value of currentPage in local storage 
	SaveInLocalStorage(bookName+"#"+'currentPage', currentPage);
	/*check*/
	$("#wrapper").css("visibility", "hidden");
	$("#hidden_content").css("visibility", "visible");
	/*check*/
	  loadChapters(spine[currentPage], currentPage).done(function (){
		  readEbookMetaFromLocal(username, epubFileName).done (function (ebookmdata){	
			  ebookmetadata=ebookmdata;
			  //addChapterMetadata(currentPage);
		  //addChapterMetadataForNotes(currentPage);
		  //scrollChapter(null, offset);
		  /*check*/
		  scrollChapterForSearchResult(currentPage,paraText,selectedText,resp,false,'search'); //added for scroll to particular highlight
		  //Jan 24
		  setTimeout(placeAllNoteIcon,000);
		  /*check*/
		  updateRealPageNum().done(function(pc){	
			//	 setTimeout(placeAllNoteIcon(null,pc),000);
			});
		 // localStorage.setItem(bookName+"#realPageNum",selection);
		 // selectPageNumInFooter(selection);	
		  return false;  
		  });
	  });
	 
}

/*//check
function scrollChapterForSearchResult(currentPage,paraTexts,selectedText,posdetails,orphan,actiontype) {
	var resultMap={};
	var listOfSelectedIds = [];
	var hid;
	//check
	//console.log('inside scrollChapterForSearchResult');
	//$("#hidden_content").html('');
	//var hiddenStr;
	//var epubContentStr = $("#epub_content").html();
	//var htmlStr ;
	
	//get value of json key from local storage
var chapter = JSON.parse(GetFromLocalStorage(bookName+"#"+spine[currentPage]));
    //content is take from local storage instead of epub_content div because the div content will have notes and highlights
    //but make sure to add extra spaces that are ed for pagination to calculate the scrollwidth, also subtract that number before saving the bookmark
	/*if(chapter!=null) {
       htmlStr = chapter.content;
	} else {
		htmlStr = $("#epub_content").html();
	}
	var param;
	//check
	var task="search";
	//check
	
	var getElementByXpath = function (pathdet) {
	    return document.evaluate(pathdet, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	};
	
	var seltext=selectedText.toLowerCase();
	//alert(xpathtexts.indexOf(seltext));
	//paraTexts=paraTexts.replace('/html[1]/body[1]','//html[1]/body[1]/div[7]/div[1]/div[1]/div[1]/div[1]');
	//var xpathtexts=getElementByXpath(paraTexts).innerText.toLowerCase();
	//highnode=getElementByXpath(paraTexts);
	//var arraystr = xpathtexts.split(" ");
	//var st;
	//var len;
	//var prevstring="";
	//var start ;
	//var end;
var xpathtoscroll;
var searchId;
	$(posdetails).each(function(i) {	
		xpath = posdetails[i].xPath;
		xpathtoscroll=xpath;
		searchId=posdetails[i].searchId;
		//alert("searchId: "+searchId);
		//xpath=xpath.replace('/html[1]/body[1]','//html[1]/body[1]/div[7]/div[1]/div[1]/div[1]/div[1]');
		//xpath=xpath.replace('/html[1]/body[1]','//html[1]/body[1]/div[2]/div[8]/div[2]/div[1]/div[1]/div[1]');
				xpath=xpath.replace('/html[1]/body[1]','//div[@id="epub_content"]');
		
		//	xpath=xpath.replace('/html[1]/body[1]','//html[1]/body[1]/div[8]/div[2]/div[1]/div[1]/div[1]');
		///html/body/div[8]/div[2]/div/div/div[1]/
		paraTexts=xpath;
		xpathtexts=getElementByXpath(xpath).innerText.toLowerCase();
		highnode=getElementByXpath(xpath);
		offset=posdetails[i].offset;
		$(offset).each(function(k) {
			id=offset[k].id;
			//alert("id:"+id);
		pos=offset[k].position;
		start=offset[k].startOffset;
		end=offset[k].endOffset;
		$(pos).each(function(j) {
		//alert("position:"+pos[j]);
		$(start).each(function(l) {
			//alert("start:"+start[l]);
		$(end).each(function(m) {
			//alert("end:"+end[m]);
			//alert("k "+k);
			if(k==0)
			{
				$(highnode).highlight(id, "searchHighlight", start[l],end[m],searchId);
			}else
			{
				
				$(highnode).highlight(id, "searchHighlight", start[l],end[m],"null");
			}
			
		});
		});
			//$(highnode).highlight(id, "searchHighlight", start,end,"null");
//		st=0;
//		len=0;
//		prevstring="";
//		st=pos[j];
//		
//		for(var x=0;x<st;x++){
//			prevstring+=arraystr[x];	
//		}
//		len=prevstring.length;
//		start=len+st;
		//		end=start+id.length;
	//alert("start end positions:" +start+","+ end);
	   //start =xpathtexts.indexOf(id, end+1);
		  //count=1;
		
		
		
		});
		});
		});
	
	
	
	
	
	
	
	//alert(arraystr[y]);
	//alert(len+y);
	//alert( xpathtexts.indexOf(arraystr[49]));
	
	$("#hidden_content").html('');
	var hiddenStr;
	var epubContentStr = $("#epub_content").html();
	var param;
	var paraText1 =  $.xpath(paraTexts);
	var innerHtmlText =  $(paraText1).outerHTML(); //getting innertext with html source tags instead of only text
	paraText =  $.xpath(paraTexts).text(); //get only text with our html source
	//console.log("paraText1: "+paraText1);
	if(paraText.length!=0){
		var index=epubContentStr.indexOf(innerHtmlText);
		var htmlEnd=epubContentStr.substring(index,epubContentStr.length);
		////console.log(htmlEnd);
		var moveIndex=htmlEnd.indexOf('id=\"'+searchId+'\">');
		indexFinal=index+moveIndex;
		////console.log(index+'cxc'+moveIndex);
		////console.log(htmlEnd.substring(0,moveIndex));
		////console.log(htmlEnd.substring(0,moveIndex).length);
		indexFinal=index+moveIndex;
		////console.log(indexFinal);
		hiddenStr = epubContentStr.substring(0, indexFinal);
	}
	//writing content to hidden content
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
		}
		});
		//added timeout for get accurate scollwidth for LN books
		setTimeout(function(){
			scrollwidth = document.getElementById("hidden_content").scrollWidth;
			navigateToPosition(scrollwidth, epubWidth);
		}, 50);
		
	    setTimeout(placeAllNoteIcon,100);

};
*/
function scrollChapterForSearchResult(currentPage,paraTexts,selectedText,posdetails,orphan,actiontype) {
	var resultMap={};
	var listOfSelectedIds = [];
	var hid;
	/*check*/
	//console.log('inside scrollChapterForSearchResult');
	//$("#hidden_content").html('');
	//var hiddenStr;
	//var epubContentStr = $("#epub_content").html();
	//var htmlStr ;
	
	//get value of json key from local storage
var chapter = JSON.parse(GetFromLocalStorage(bookName+"#"+spine[currentPage]));
    //content is take from local storage instead of epub_content div because the div content will have notes and highlights
    //but make sure to add extra spaces that are ed for pagination to calculate the scrollwidth, also subtract that number before saving the bookmark
	/*if(chapter!=null) {
       htmlStr = chapter.content;
	} else {
		htmlStr = $("#epub_content").html();
	}*/
	var param;
	//check
	var task="search";
	//check
	
	var getElementByXpath = function (pathdet) {
	    return document.evaluate(pathdet, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	};
	
	var seltext=selectedText.toLowerCase();
	//alert(xpathtexts.indexOf(seltext));
	//paraTexts=paraTexts.replace('/html[1]/body[1]','//html[1]/body[1]/div[7]/div[1]/div[1]/div[1]/div[1]');
	//var xpathtexts=getElementByXpath(paraTexts).innerText.toLowerCase();
	//highnode=getElementByXpath(paraTexts);
	//var arraystr = xpathtexts.split(" ");
	//var st;
	//var len;
	//var prevstring="";
	//var start ;
	//var end;
var xpathtoscroll;
var searchId;
	$(posdetails).each(function(i) {	
		xpath = posdetails[i].xPath;
		xpathtoscroll=xpath;
		searchId=posdetails[i].searchId;
		//alert("searchId: "+searchId);
		//xpath=xpath.replace('/html[1]/body[1]','//html[1]/body[1]/div[7]/div[1]/div[1]/div[1]/div[1]');
		//xpath=xpath.replace('/html[1]/body[1]','//html[1]/body[1]/div[2]/div[8]/div[2]/div[1]/div[1]/div[1]');
				xpath=xpath.replace('/html[1]/body[1]','//div[@id="epub_content"]');
		
		//	xpath=xpath.replace('/html[1]/body[1]','//html[1]/body[1]/div[8]/div[2]/div[1]/div[1]/div[1]');
		///html/body/div[8]/div[2]/div/div/div[1]/
		paraTexts=xpath;
		xpathtexts=getElementByXpath(xpath).innerText.toLowerCase();
	    highnode=getElementByXpath(xpath);
		offset=posdetails[i].offset;
		$(offset).each(function(k) {
			id=offset[k].id;
			//alert("id:"+id);
			pos=offset[k].position;
			start=offset[k].startOffset;
			end=offset[k].endOffset;
			/*check*/
			for(var i=0; i < start.length ; i++)
				{
				if(i==0)
				{
					//console.log("offset start******"+i+"*****"+start[i]+"offset end"+end[i]);
					if(!orphan){
					$(highnode).highlight(id, "searchHighlight", start[i],end[i],searchId,task);
					}
					listOfSelectedIds.push(start[i]);
					listOfSelectedIds.push(end[i]);
				}else
				{
					//console.log("offset start******"+i+"*****"+start[i]+"offset end"+end[i]);
					if(!orphan){
					$(highnode).highlight(id, "searchHighlight", start[i],end[i],"null",task);
					}
					listOfSelectedIds.push(start[i]);
					listOfSelectedIds.push(end[i]);
				}
				}
		
		/*$(pos).each(function(j) {
		//alert("position:"+pos[j]);
		$(start).each(function(l) {
			//alert("start:"+start[l]);
		$(end).each(function(m) {
			//alert("end:"+end[m]);
			if(k==0)
			{
				$(highnode).highlight(id, "searchHighlight", start[l],end[m],searchId,offset.length);
			}else
			{
				$(highnode).highlight(id, "searchHighlight", start[l],end[m],"null",offset.length);
			}
			
		});
		});
			//$(highnode).highlight(id, "searchHighlight", start,end,"null");
//		st=0;
//		len=0;
//		prevstring="";
//		st=pos[j];
//		
//		for(var x=0;x<st;x++){
//			prevstring+=arraystr[x];	
//		}
//		len=prevstring.length;
//		start=len+st;
		//		end=start+id.length;
	//alert("start end positions:" +start+","+ end);
	   //start =xpathtexts.indexOf(id, end+1);
		  //count=1;
		
		
		
		});*/
		});
		});
	//commented out on Jan 24
	//setTimeout(placeAllNoteIcon,100);
	listOfSelectedIds=listOfSelectedIds.sort();
	resultMap['start']=listOfSelectedIds[0];
	resultMap['end']=listOfSelectedIds[listOfSelectedIds.length-1];
	resultMap['xpath']=xpath;
	resultMap['xpathelement']=highnode;
	resultMap['text']=selectedText;
	
	//console.log("offset start"+	resultMap['start']+"offset end"+resultMap['end']);
	if(!orphan){
		scrollChapterForOffset("", "",paraTexts, "","", "",searchId,"search").done(function(){});
	}else{
		if(actiontype=='Highlights'){
			hid = "highlightId" + (Math.floor(Math.random() * 900000) + 100000);	
			$(highnode).highlight(selectedText, "highlight", resultMap['start'],resultMap['end'],hid);
			resultMap['id']=hid;
			scrollChapterForOffset("", "",paraTexts, "","", "",hid,"highlight").done(function(){});
		}else if(actiontype=='Notes'){
		hid = "noteId" + (Math.floor(Math.random() * 900000) + 100000);
		$(highnode).highlight(selectedText, "note", resultMap['start'],resultMap['end'],hid);
		resultMap['id']=hid;
		scrollChapterForOffset("", "",paraTexts, "","", "",hid,"note").done(function(){});
		}
	}
	return resultMap;
};

function x(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}


function getXpath(paramString){ 
	var strsval = paramString.split("~~");
	var bookname=strsval[0];
	var file = strsval[1];
	/*check*/
	var keyword = unescape(strsval[2]);
	/*check*/
	var location=strsval[3];
	var currentTokenCount=strsval[4];
	var prevTokenCount=strsval[5];
	var haswildchar=strsval[6];
	//alert(bookname+','+file+','+keyword+','+location+','+currentTokenCount+','+prevTokenCount+','+haswildchar);
	//console.log('inside getXpath');
	if (isConnected) {
   $.ajax({
		type : 'POST',
		async: false,
		data : {
			q : keyword,
			bname : bookname,
			filename:file,
			location:location,
			currentTokenCount:currentTokenCount,
			prevTokenCount:prevTokenCount,
			job:'fetch',
			wildchar:haswildchar
		},
		url : baseurl1+'dtsearch',
		
		success : function(response) {
			//console.log('inside getXpath success');
			//localStorage.setItem("search#json",JSON.stringify(response));
			var responseObj=decodeSearchRequest(response.content);
			showsearch(responseObj);
			//alert(JSON.stringify(response));
		},
		error : function(xhr, textStatus, errorThrown) {
			for(n in xhr) {
				////console.log('Error xhr:' + xhr[n]);
				}
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
		}
	}); }
    $("#search_container").hide();// slideup once u click on search result
    $("#background_overlay").fadeOut(500);
}


function getNextSet(index)
{
	searchAndRetrieve(query, index);
}

$("#previoussearch").click(
		function() 
		{
			currentIndex = currentIndex-(currentResults+maxResults);
			searchAndRetrieve(query, currentIndex);
		}
		);

$("#nextsearch").click(
		function() 
		{
			//alert("Next Clicked "+currentIndex+" "+query.value);
			searchAndRetrieve(query, currentIndex);
		}
		);

function preventFind(){
	 var isCtrl = false;
	document.onkeyup=function(e){
	    if(e.keyCode == 17) isCtrl=false;
	}
	document.onkeydown=function(e){
	    if(e.keyCode == 17 || e.keyCode == 91) isCtrl=true;
	    if(e.keyCode == 70 && isCtrl == true) {
		e.preventDefault();
	        //alert('find');
	        return false;
	    }
	}
	}

/*function updateSolrIndexStatus(){
	$.getJSON("http://ecsppsvm3:8181/dtsearch/query?q=status:*&id="+epubFileName+"IndexingStatus&wt=json&json.wrf=?&indent=true").done( function(data){
	    	
	    	var checkIndexing=JSON.stringify(data);
	    	var checkstring = jQuery.parseJSON(checkIndexing);
	    	var resultcheck = checkstring.response.docs;
	    	$(resultcheck).each(function(i) {	
	    		var idcheck=resultcheck[i].id;
	    		if(idcheck==epubFileName+"IndexingStatus")
	    			{
	    			indexingStatus=resultcheck[i].status;
	    		//	alert(indexingStatus);
	    			}
	    	});
	    	   // alert(result);	
	    		//return Json("true", JsonRequestBehavior.AllowGet);
	    	  });	
		
	}*/
