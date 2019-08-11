/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var winWidth=$(window).width(); 

//26/12
function manageSync() {
	var ann = null;
	currentPage = GetFromLocalStorage(epubFileName + "#currentPage");
	var dfd=$.Deferred();
	GetFromDataStorage(username + "#" + epubFileName).done(
			function(clientjson) {
				if(!clientjson || clientjson =="null" || clientjson == "NOT FOUND"){
					  userobj = new userEbook(username, epubFileName);
					  clientjson = JSON.stringify(userobj);
				}
				//console.log("clientjson"+ clientjson);
				if (isConnected) {
				$.ajax({
					type : 'POST',
					async : false,

					data : {
						fileName : username + "#" + epubFileName,
						clientlatestjson : clientjson,
						currentPage : currentPage
						
					},
					url : baseurl1 + 'CompareJsonServlet',
					success : function(response) {
						//return dfd.resolve(response);
						SaveInDataStorage(
								username + "#" + epubFileName, response)
								.done(function() {
									
									dfd.resolve();
								});
						
					},
					error : function(data){
						dfd.resolve();
					}
				});
				}
				else{
					dfd.resolve();
				}
			});
	
	return dfd.promise();
}


//**

$("#indexContainer").hide();

var windowResizeToc = false;
var windowResizeIndexContainer=false;
var windowResizeNoIndex=false;

function showIndexPane(indexAvailable) { 

	if (indexAvailable) {
		var indexContent = $("#indexContainer");
		if ($("#indexContainer").is(':visible')) {
			$("#indexContainer").fadeOut(400);
		} else {
			$("#indexContainer").fadeIn(400);
			/*
			 * $("#background_overlay").css('display','block');
			 * 
			 * $("#background_overlay").css('opacity','0');
			 */
			$("#arrowIndex").fadeIn(400);
			$("#indexContainer").css({
				left : ($(window).width() - $('#indexContainer').width()) / 2,
				// top : ($(window).width() - $('#indexContainer').width()) / 7,
				position : 'absolute'
			});
		}
	}
    
	/*if(!indexAvailable)*/
	else {
		
		/*
		 * if ( $("#noIndexMsg").css('display') != 'none') { // alert("inside
		 * if");
		 */
       	  

		if ($("#noIndexMsg").is(':visible')) {

			$("#noIndexMsg").fadeOut(400);
		}

		else {
			
			$("#noIndexMsg").fadeIn(400);
			/*
			 * $("#background_overlay").css('display','block');
			 * 
			 * $("#background_overlay").css('opacity','0');
			 */
			/*
			 * if (!$("#noIndexMsg").is(':visible')) { return; }
			 */
			$("#noIndexMsg").css({
				left : ($(window).width() - $('#noIndexMsg').width()) / 2,
				// top : ($(window).width() - $('#noIndexMsg').width()) / 7,
				position : 'absolute'
			});
			
		}
	
	}


}
$(document).mouseup(function (e){
    var container = $("#noIndexMsg");
    if(!windowResizeNoIndex){
    if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
       {
          container.fadeOut(400);
       }
    }else{
    	windowResizeNoIndex = false;
    }
});
$(document).mouseup(function (e){
    var container = $("#indexContainer");
    if(!windowResizeIndexContainer){
    if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
       {
          container.fadeOut(400);
       }
}else{
	windowResizeIndexContainer = false;
}
});
$(document).mouseup(function (e){
    var container = $("#topic_container");
    if(!windowResizeToc){
	    if (!container.is(e.target) // if the target of the click isn't the container...
	            && container.has(e.target).length === 0) // ... nor a descendant of the container
	       {
	          container.fadeOut(400);
	          $('span.tocDivBefore').fadeOut(400);
	       }
    }else{
    	windowResizeToc = false;
    }
});

function setTocPosition(){
	if($("#tocButton").length>0 && $("#tocButton").offset().left>0){
		$("#topic_container").css('left', $("#tocButton").offset().left + $("#tocButton").width() - $("#topic_container").width()/2 + 10);
		if($(window).width()>1024){
			$('.subMenuDiv').removeClass('minSubMenuDivWidth').addClass('maxSubMenuDivWidth');
		}else{
			$('.subMenuDiv').removeClass('maxSubMenuDivWidth').addClass('minSubMenuDivWidth');
		}
		if(!$("#topic_container").is(":visible")){
			$("#topic_container").fadeIn(400);
		}
		
		$('span.divBefore').css('left',  $("#tocButton").offset().left - $("#topic_container").width() + 10);
		$("#toc_wrapper").css('height',((($("#topic_container").height() - $($("#topic_container").find("div")[0]).outerHeight()-41)/$("#topic_container").outerHeight())*100) +"%");
		$(".tocOverlayWrapper").each(function() {
			$(this).find("div.subMenuDiv").css('height',((($(this).height() - $($(this).find("div")[0]).outerHeight()-41)/$(this).outerHeight())*100) +"%");
		});
	}else {
		setTimeout(setTocPosition ,100);
	}
}

function showTOCPane() {
	var topicContent = $("#topic_container");

	if (topicContent.css('display') != 'none') {
		/*$("#topic_container").hide('slide', {
			direction : 'left'
		}, 570);			*/
		/*For LN TOC*/
		$("#topic_container").fadeOut(400);
		$("span.tocDivBefore").fadeOut(400);
	} else {
		/*For LN TOC*/
		$("#topic_container").children().remove();
		$("#topic_container").append("<span class='divBefore tocDivBefore'></span>");
		showTOCFor();
		$("#toc_wrapper").attr("offsetLeft", 0);
		
		$("body").on('click', "#toc_wrapper .spanIcon, .tocOverlayWrapper .spanIcon", function(event){
			event.stopPropagation();
		});
		
		$("body").on('click', "#topic_container hr, #topic_container,  #toc_wrapper, .tocOverlayWrapper", function(event){
			event.stopPropagation();
			closeChildMenus(event.currentTarget);
		});
		
		/* setting up the left position for toc*/
		setTimeout(setTocPosition ,100);
		/*$("#topic_container").show('slide', {
			direction : 'left'
		}, 607);*/
		//$("#closeButton").show();			
	}
}
function showTOCFor(textInLi, subMenu) {
	var propertiesMap = getPropertiesMap();
	var selector = undefined;
	var target = undefined;
	if (textInLi == null || textInLi == undefined) {
		selector = $("#topic-content nav").filter(function(){
			  return $(this).attr('epub:type') == 'toc';
		}).children("ol").children("li");
	}else{
		selector = $("#topic-content nav[epub\\:type='toc'] li:contains('"+textInLi+"')").filter(function(){
			  return $($(this).children("a[href]")).text() == textInLi;
		}).children("ol").children("li");
	}
	
	target = $("<div></div>");
	var overlayWrapper = $("<div class ='tocOverlayWrapper'></div>");
	if(subMenu){
		target.attr("id",textInLi+"Div");
		var parentA = $("<a>" +textInLi+"</a>");
		parentA.addClass("toc_child_header");
		var href = $($("#topic-content nav[epub\\:type='toc'] li:contains('"+textInLi+"')").filter(function(){
			  return $($(this).children("a[href]")).text() == textInLi;
		}).children("a[href]")[0]).attr('href');
		parentA.attr('href',href);
		parentA.addClass("topic_nav_link");
		var aTagDiv = $('<div style="padding: 8px;"></div>');
		aTagDiv.append(parentA);
		target.addClass("subMenuDiv");
		
		/* Logic to increase the Left of submenu through % instead of hard coding the pixel*/
		var offsetLeft = $("#topic_container>.tocOverlayWrapper:last-child").attr('offsetLeft');
		if(offsetLeft == undefined){
			offsetLeft = 0;
		}
		offsetLeft = (offsetLeft - 0) +20;
		overlayWrapper.css('left', offsetLeft + "%");
		overlayWrapper.attr('offsetLeft', offsetLeft);
		overlayWrapper.append(aTagDiv);
		overlayWrapper.append("<hr class='toc_child_header_separator'>");
		overlayWrapper.append(target);
		$("#topic_container").append(overlayWrapper);
		target.css('height',(((overlayWrapper.height() - aTagDiv.outerHeight()-41)/overlayWrapper.height())*100) +"%");
	}else{
		target.attr("id","toc_wrapper");
		var toc = $("#tocButton").attr('title');
		var aTagDiv = $('<div style="padding: 8px;"></div>');
		var aTagForToc = $("<a>" +propertiesMap.toc_title+"</a>");
		aTagForToc.addClass("toc_child_header");
		aTagForToc.attr('href', 'javascript:void(0);');
		aTagDiv.append(aTagForToc);
		$("#topic_container").append(aTagDiv);
		$("#topic_container").append("<hr class='toc_child_header_separator'>");
		$("#topic_container").append(target);
	}
	
	
	var bookName = window.location.pathname.split('/')[2];
	$(selector).each(function() {
		//List Item 
		var li = $("<li></li>");
		
		if ($(this).find("ol").length>0) {
			li.addClass("subMenu");
			// icon with an id that has to be passed when showing next level of TOC > Generally id of li which contains the ol
			var iconImg = $('<img class="spanIcon"></img>');
			/* To fix the issue:
			 * the url is constructed as 
			 * http://localhost:8080/ePubReader/41402_EB12RV06_2012/html/epubimages/forwardicon.png
			 * instead of 
			 * http://localhost:8080/ePubReader/41402_EB12RV06_2012/epubimages/forwardicon.png
			 * so have manually appended the book name between the app name and image
			 */
			 
			iconImg.attr("src", "/ePubReader/" + bookName + "/epubimages/TOCArrow-Icon.png");
			li.append(iconImg);
		}
		li.append($($(this).find("a[href]")[0]).clone());
		target.append(li);
	});
	//Unbinding and binding click events for > icon 
	$('.spanIcon').unbind('click');
	$(".spanIcon").click(function(event){
		$(this).next().addClass('highlightLink');
	    showTOCFor($(this).parent().text(), true);
	});
	//Unbinding and binding the click event for links
	$('.topic_nav_link').unbind('click');
	$(".topic_nav_link").click(function(event){
		loadChapterOnHrefClick(event, event.currentTarget);
	});
	$('.toc_child_header').css('color', '#BCBEC0 !important');
	$("#toc_wrapper, .tocOverlayWrapper").unbind('click');
	
	if($(window).width()>1024){
		$('.subMenuDiv').removeClass('minSubMenuDivWidth').addClass('maxSubMenuDivWidth');
	}else{
		$('.subMenuDiv').removeClass('maxSubMenuDivWidth').addClass('minSubMenuDivWidth');
	}
}

function closeChildMenus(currentTarget){
	$(currentTarget).nextAll(".tocOverlayWrapper").remove();
	$(currentTarget).children(".tocOverlayWrapper").remove();
	$(currentTarget).find("li a.highlightLink").removeHighlight();
	$(currentTarget).find("li a.highlightLink").removeClass('highlightLink');
}

$(document).ready(function() {
	//disabling the right click
	$("#epub_content").bind("contextmenu", function(e) {
     e.preventDefault();
	});
	// height for content pane
	var h =  $(window).height() - ($("#top-ribbon").height()+ $("#bottom-ribbon").height()+ 2);
	
	$("#content_pane").css('height','auto !important');
	$("#epub_content").css('height',h-26);
	$('#tocButton').click(function(event) {
	    showTOCPane();
	});
	/*changes recommended by product team: this function is moved to loadLocalStorageTo bOOk.js*/
	/*$('#indexImages').click(function(e) {
		//alert("click captured");
		//alert("click inside toolbar.js");
		
		
		
		loadPageIndex();
		//showIndexPane();
	});*/
	
	$('#closeButton').click(function() {
		var topicContent = $("#topic_container");
		$("#topic_container").hide('slide', {
			direction : 'left'
		}, 570);
		// $("#closeButton").hide();
		
		$(".top-ribbon").slideUp("slow", "linear");
		$(".bottom-ribbon").slideUp("slow", "linear");
	});
	
	$('#content_pane').hover(function() {     
		// alert('zxc');
		 $("#bottom-ribbon").css("visibility","visible");
		 $("#bottom-ribbon-invisible").css("visibility","visible");
	    });
	 $('#content_pane').click(function() {     
			// alert('zxc');
			 $("#bottom-ribbon").css("visibility","visible");
			 $("#bottom-ribbon-invisible").css("visibility","visible");
		    });
	 
	 resizeFrame();
	imageAlterSize();
   //setTimeout(alignFirstPage,000);
    //setMyLibraryHostName();
    bookViewResize();
});


/* 
    purpose of method - To Show and hide Top and Bottom Sliding panel
    where and what condition it should get called -  Hover over top or bottom of the Reader.
    if any conditions inside then comment for that -
    argument details - Null.
    return types - Null.
*/	
/*$(document).ready(function() {
	var topicContent = $("#topic_container");
		var bottomRibbon = $("#bottom-ribbon"); 
	if($(bottomRibbon) && $(bottomRibbon).css("display")!= "none" && $(bottomRibbon).css("visibility") == "visible") {
		//do nothing, just maintain the current status
	} else {
		$("#bottom-ribbon").css("display","none");
		$("#bottom-ribbon").css("visibility","visible");
	}
	//var screenWidth = $(document).width();
	//$("#paginator_slider").css("width",screenWidth*0.8);
	var sleepTopRibbon = 0;
	$(".top-ribbon-invisible").hover(function() {
		$("#bottom-ribbon").css("visibility","visible");
		$("#bottom-ribbon-invisible").css("visibility","visible");
		sleepTopRibbon = 1;
		 setTimeout(function() {
			if (sleepTopRibbon == 1) {
				if (topicContent.css('display') == 'none') {
					$(".top-ribbon").slideDown("slow", "linear");
					$(".bottom-ribbon").slideDown("slow", "linear");

				} else {
					$(".top-ribbon").slideDown("slow", "linear");
					$(".bottom-ribbon").slideDown("slow", "linear");
				}
			}
			var gp=$('#pageField').offset().left-($('#BacknForth').offset().left + 144);
			$("#sliderdiv").css("width",gp);
		}, 500);

	}, function() {
		// mouse out
		sleepTopRibbon=0;
	});

	$(".top-ribbon").hover(function() {
		//mouse in

	}, function() {
		// mouse out
		sleepTopRibbon = 0;
		setTimeout(function() {
			if (sleepTopRibbon == 0) {
		if (topicContent.css('display') == 'none') {
			$(".top-ribbon").slideUp("slow", "linear");
			$(".bottom-ribbon").slideUp("slow", "linear");
		} else {
			$(".top-ribbon").slideDown("slow", "linear");
			$(".bottom-ribbon").slideDown("slow", "linear");
		}
		}
		}, 1500);
	});

	var sleepBottomRibbon = 0;
	$(".bottom-ribbon-invisible").hover(function() {
		// mouse in
		var bottomRibbon = $("#bottom-ribbon"); 
		var bottomRibbonin = $("#bottom-ribbon-invisible"); 
		if($(bottomRibbon).css("visibility")!= "visible" ||$(bottomRibbonin).css("visibility")!= "visible" )
			{
			//alert('df');
			$("#bottom-ribbon").css("visibility","visible");
			$("#bottom-ribbon-invisible").css("visibility","visible");
			}
		var ele = document.getElementsByClassName('context-menu-list context-menu-root');
		//alert(ele[0].style.display);
		
		
		sleepBottomRibbon = 1;
		setTimeout(function() {
			if (sleepBottomRibbon == 1 && ele[0].style.display=="none") {
				if (topicContent.css('display') == 'none') {
					$(".top-ribbon").slideDown("slow", "linear");
					$(".bottom-ribbon").slideDown("slow", "linear");
					//alert('asd');
				} else {
					$(".top-ribbon").slideDown("slow", "linear");
					$(".bottom-ribbon").slideDown("slow", "linear");
					//alert('asd');
				}

			}
			else
				{
				$("#bottom-ribbon").css("visibility","hidden");
				$("#bottom-ribbon-invisible").css("visibility","hidden");
				}
			var gp=$('#pageField').offset().left-($('#BacknForth').offset().left + 144);
			$("#sliderdiv").css("width",gp);
		}, 500);

	}, function() {
		// mouse out
		
		sleepBottomRibbon = 0;
	});
	$(".bottom-ribbon").hover(function() {
		//mouse in

	}, function() {
		// mouse out
		sleepBottomRibbon = 0;
		setTimeout(function() {
			if (sleepBottomRibbon == 0) {
		
		if (topicContent.css('display') == 'none') {
			$(".top-ribbon").slideUp("slow", "linear");
			$(".bottom-ribbon").slideUp("slow", "linear");
		} else {
			$(".top-ribbon").slideDown("slow", "linear");
			$(".bottom-ribbon").slideDown("slow", "linear");
		}
		}
	}, 1500);
	});

});
*/
$('#epub_content').click(function(e) {
	hightlightMenuStopPropagation=true;
	setTimeout(function(){
		hightlightMenuStopPropagation=false;
	}, 100);
});

$("#wrapper, #top-ribbon").click(function(){
	/*UI cust removed by suman*/ 
	/*$(".top-ribbon").slideUp("slow", "linear");
	$(".bottom-ribbon").slideUp("slow", "linear");	
	*/
	/*$("#indexContainer").hide();
	$("#noIndexMsg").hide();*/
	/*Note Display Changes*/
	$("#notesDiv").prev('.divBefore').remove();	
	$("#notesDiv").remove();
	$('span.highlightNote').css('text-decoration', 'none');
	if (!hightlightMenuStopPropagation) {
		closeContextMenu();
	}
});



function loadChapterWithAnchor(pageLoc) {
	var dfd = $.Deferred();
	//console.log("pagenavmap[pageNumber]:"+pageLoc);
	var arr = pageLoc.split("#");
	var currentPage = arr[0];
	var anchor = arr[1];
	var chapterkey = null;
	for (var key in spine) {
	    if(spine[key] == currentPage) {
	    	chapterkey = key;
	    	break;
	    }
	    //TODO : change the Navfile to set the current page with complete path of href for customPage (eg : "html/Prelims.html")
	    //below is a temporary fix for the same 
	  /*  else{
	    	spinekeydata=spine[key].split('/');
	    	chap=spinekeydata[spinekeydata.length-1];
	    	if(chap==currentPage){
	    		chapterkey=key;
	    		currentPage=spine[key];
	    	}
	    }*/
	}
	loadChapters(currentPage, chapterkey).done(function (){
		scrollChapter(anchor, 0,"pagination").done(function (){
			
				  //pageLength = $("#epub_content")[0].scrollWidth;
				  imageAlterSize();
				   var key=null;
				    for(key in spine) {
						if(key!='toc' && key!='cover' && key!='pagenav' && key!= 'pageindex'){
							var  fPage = spine[key];
							  break;
						}
					}		   
				    if(fPage==currentPage)
				    	{		    	
				    	 alignFirstPage();
				    	}
				  //added for highlighting 1
				//	addChapterMetadata(currentPage);
				 //   addChapterMetadataForNotes(currentPage);
				    var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage',1);
				    dfd.resolve();
			        /*findStartingWords(spine[chapterkey], chapterkey, "wordsForNextNPrev").done(function(chapterHTML){
			        dfd.resolve();
			        getNodeName(chapterHTML,'first');
		            //writeEbookMetaToLocal(userobj);
				   // writeEbookMetaToLocal(userobj).done(function (){
				    
			        });*/
				   // });
				   
				
		});	
	});
	return dfd.promise();
}



/*
 * selectedText was added due to if the para start end of first page and end at beginning of the next page, 
 * then navigation moves to the stat page instead of next page.
 * 
 */
jQuery.fn.outerHTML = function(s) {
	return (s)
	? this.before(s).remove()
	: jQuery("<p>").append(this.eq(0).clone()).html();
	};
/*check */
function scrollChapterForOffset(anchor, offset,xpath, selectedText,anchorOffset, filename,id,action) {
	var dfd = $.Deferred();
	$("#hidden_content").empty();
	var hiddenStr="";
	/****************/
	var epubContentStr = $("#epub_content").html();
	//var param;
	var paraText1 =  $.xpath(xpath);
	var innerHtmlText =  $(paraText1).outerHTML(); //getting innertext with html source tags instead of only text
	paraText =  $.xpath(xpath).text(); //get only text with our html source
	//console.log("paraText1: "+paraText1);
	if(paraText.length!=0){
		var index=epubContentStr.indexOf(innerHtmlText);
		var htmlEnd=epubContentStr.substring(index,epubContentStr.length);
		////console.log(htmlEnd);
		var moveIndex=htmlEnd.indexOf('id=\"'+id+'\">');
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
	//var hiddenImageLength = $("#hidden_content").find('img').length;
		var $images = $("#hidden_content img"); // Get my img elem
		//var real_width, real_height;
		var preloaded = 0;
		var total = $images.length;
		/*check */
		
		if(action=="search")
			{
			//scrollwidth=scrollwidth-1309;
			
			}
			/*************/
		//get scrollwidth after image get loaded
		if(total!=0){
		$images.load(function() {
			if (++preloaded === total) { 
				scrollwidth = document.getElementById("hidden_content").scrollWidth;
				navigateToPosition(scrollwidth, epubWidth);
				dfd.resolve();
		}
		});
		}
		//added timeout for get accurate scollwidth for LN books
		/*check  *** statement removed 
		
				scrollwidth = document.getElementById("hidden_content").scrollWidth;
				
				*/
		else{
			var contentHidden = $("#hidden_content").html();
			if(contentHidden.length!=0){
			navigateToPosition(scrollwidth, epubWidth);
			dfd.resolve();
			}
		}
		return dfd.promise();
};  

/*
 * navigate to the highlighted/noted text 
 */
function navigateToPosition(scrollwidth, epubWidth){
	var noTextWidth = parseInt($('#hidden_content').css("padding-left"), 10) + parseInt($('#hidden_content').css("padding-right"), 10);
	//var extraSpace = "";
	//check if its in the first page 
	if(scrollwidth == noTextWidth ||(epubWidth+noTextWidth === scrollwidth)) {
		//No text at the left of the anchor, no need to scroll
		currentPosition = 1;
		shiftPosition=0;
		pageLength = $("#epub_content")[0].scrollWidth;
		/* check */
		if(pageLength >= shiftPosition) {
			$("#epub_content").css("right", shiftPosition+"px");
			$("#epub_content").css("opacity", "1");
		}
		else if (pageLength < shiftPosition) {
			shiftPositionNew = shiftPosition / 2;
			$("#epub_content").css("right", shiftPositionNew + "px");
			$("#epub_content").css("opacity", "1");
			/***********************/
		}
	} else {
		//if its not in the first page
		var length = scrollwidth;
		var width = parseInt($('#epub_content').css('width'), 10);
		var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
		currentPosition =  ((length) / (width + gap));
		//shiftPosition1 =  currentPosition *  (width + gap);
		currentPosition =  Math.floor(currentPosition) ;
		shiftPosition =  currentPosition *  (width + gap);
		pageLength = $("#epub_content")[0].scrollWidth;
		////console.log(currentPosition+'    shiftPosition      '+shiftPosition1);
		////console.log(currentPosition+'    shiftPosition      '+shiftPosition);
		/* check */
		currentPosition = currentPosition + 1;
		if(pageLength >= shiftPosition) {
			$("#epub_content").css("right", shiftPosition+"px");
			$("#epub_content").css("opacity", "1");
		}
		
	
		else if (pageLength < shiftPosition) {
			shiftPositionNew = shiftPosition / 2;
			$("#epub_content").css("right", shiftPositionNew + "px");
			$("#epub_content").css("opacity", "1");
		}
		/*****************/
	}
	$("#wrapper").css("visibility", "visible");
	$("#hidden_content").css("visibility", "hidden");
  /* check statement removed */
//	$("#hidden_content").html('');

	
}
/*
function rightShitPosition(shiftPosition, currentPosition){
	   var correction = 33;
		if($(document).width() > 697 && currentPosition < 1.25) {
			correction = -57;
		}
		var shift = shiftPosition + correction;
		return shift;
} 
*/

function isSecondPage(htmlStr, currentPage) {
	var firstPage = htmlStr.substring(htmlStr.indexOf("custompage")+10, htmlStr.indexOf("custompage")+14);
	if(parseInt(currentPage, 10) - parseInt(firstPage, 10) == 1) 
		return true;
	else return false;
};


/* 
  purpose of method - For bookmark,notes and highlight summary tab implementation.
  where and what condition it should get called -  Click on Tabs present in the Show Bookmark Pop up 
  if any conditions inside then comment for that -
  argument details - Null.
  return types - Null.
*/	
$('ul.tabs').each(function(){
	 
	  var $active, $content, $links = $(this).find('a');
	  $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
	  $active.addClass('active');
	  $content = $($active.attr('href'));	
	  $links.not($active).each(function () {
	    $($(this).attr('href')).hide();
	  });

	  // Bind the click event handler
	  $(this).on('click', 'a', function(e){
	    // Make the old tab inactive.
	    $active.removeClass('active');
	    $content.hide();
	    // Update the variables with the new link and content
	    $active = $(this);
	    $content = $($(this).attr('href'));
	    // Make the tab active.
	    $active.addClass('active');
	    $content.show();
	    // Prevent the anchor's default click action
	    e.preventDefault();
	  });
	});

function resizebrowser() {
	var dfd= $.Deferred();
	
	/*UI cust suman */
	bookViewResize();
	/*positionIndexPopup();*/
	
	setNotesPopoverPosition();
	/*edited by arsha: resizing should happen only if the container is visible*/
	if($("#indexContainer").is(":visible")){
		
		windowResizeIndexContainer=true;
		positionIndexPopup();
	}
	if($("#noIndexMsg").is(":visible")){
		windowResizeNoIndex=true;
		positionNoIndexPopup();
	}
	if($("#topic_container").is(":visible")){
		windowResizeToc = true;
		setTocPosition();
	}
	setContextMenuPosition();
	if ($("#error_popup").is(':visible')) {//error window
		positionerrorPopup();
	}
	if ($("#loading_overlay").is(':visible')) {
		$("#loading_overlay").css({
			'height':$(window).height()-$("#top-ribbon").css("height")
	     	});
	}
	
	var gp=$('#pageField').offset().left-($('#BacknForth').offset().left + 144);
	/* UI cust suman 
	$("#sliderdiv").css("width",gp);*/
	var screenWidth = $(document).width();
	$("#paginator_slider").css("width",screenWidth*0.7);
	imageAlterSize();
	if(screenWidth<700)
	{
	$("#pagntn").css("text-align", "left");
	//$("#pagntn").css("margin-left", -88);
	$("#paginator_slider").css("width", "100% !important");

	}
else
	{
	$("#pagntn").css("text-align", "center");
	$("#pagntn").css("margin-left", 0);
	}
	 var temp=null;
	    for(temp in spine) {
			if(temp!='toc' && temp!='cover' && temp!='pagenav' && temp!= 'pageindex'){
				  fPage = spine[temp];
				  break;
			}
		}
	    //console.log('first page:'+fPage);
	    //console.log('current Page:'+currentPage);
	    if(fPage==currentPage)
	    	{
	    		alignFirstPage();
	    	}
	    dfd.resolve();
		return dfd.promise();

	};

$(window).resize(function(){ 
	resizebrowser().done(function(){
		//14/2
		updateRealPageNum().done(function(pc){
			// setTimeout(placeAllNoteIcon(null,pc),000);
		});
		//Jan 24
		//setTimeout(placeAllNoteIcon,0000);
	});	
});

jQuery.event.add(window, "load", resizeFrame);
jQuery.event.add(window, "resize", resizeFrame);

function resizeFrame() 
{
    var h = $(window).height();
    /*UI Cust suman */
    /*
    $("#content_pane").css('height',h);
    $("#epub_content").css('height',h*0.805);
    */
    var h =  $(window).height() - ($("#top-ribbon").height()+ $("#bottom-ribbon").height()+ 2);
    
    $("#content_pane").css('height','auto !important');
    $("#epub_content").css('height',h-26);
    //Jan 24
    //$("#epub_content").css('height',h*0.806);
    
    //$("#epub_content").css('height',h*0.650);
    alignFirstPage();
}

function alignFirstPage() {	
	var noofpage=calc_num_pages();
	//console.log("numofpages:"+noofpage);
	if (noofpage==1||noofpage==0||noofpage==2||noofpage==3){
//		var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
//		var width = parseInt($('#epub_content').css(COLUMN_WIDTH), 10);
//	    var pageWidth = parseInt($('#epub_content').css('width'), 10);
	    //$("#epub_content").css('right',-(pageWidth+gap));
		var windowWidth = $(window).width(); 
		//console.log(windowWidth);
	    if(windowWidth>1024){
	    	if($("#epub_content").find("img").length>0){
	            $("#epub_content").css('right',-(windowWidth/2.164));}
	    	else{
	    		$("#epub_content").css('right',-(windowWidth/2.111));
	    	}
	    	}
	    else if(windowWidth> 675 && windowWidth<=1024 ){//&&windowWidth>800
		$("#epub_content").css('right',-(windowWidth/2.25));}
	    else {
	    	$("#epub_content").css('right', "0px");	
	    }
	}
	
}




$(window).load(function(){
	
	
	
	if($("#epub_content").find("img").length>0){
	    //console.log("image found ...");
	    var $images = $('#epub_content img');
	   var   preloaded = 0;
	    var  total = $images.length;
	    $images.load(function() {
	    if (++preloaded === total) {
	    	//console.log("images loaded :"+preloaded);
	    	imageAlterSize();
	    	//alignFirstPage();
	       }	    
	    });
	      }
	else{
		 //console.log("no image  ...");
    	 imageAlterSize();
    	 //setTimeout(alignFirstPage,000);
    }
});


function setMyLibraryHostName() {	
// Changed for URL display while inspection

	//document.getElementById("mylibrary_link").href="http://"+window.document.location.hostname+":"+window.document.location.port+"/ePubReader"+"/readerlibrary/myLibrary.html"; 
	document.getElementById("mylibrary_link").href="/ePubReader/readerlibrary/myLibrary.html"; 




}
	
function bookViewResize()
{
	

/*if (window
		.matchMedia("screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait)").matches) {
	portrait
	$("#settings").css("right","15px");
	$("#updateDiv").css("right","12px");
	$("#bookMark-invisible").css({
		"right" : "12px",
		"width" : "40px",
		"text-align" : "right"
		
	});
	title

	var totalLeftIconsWidthTpRbn = ( parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) + parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("padding-left")) + parseInt($("#mylibrary_link").css("width"))) * 2  ;
	var bookTitleWidth = $(window).width() - totalLeftIconsWidthTpRbn ;
	$("#bookTitle").css({
		"width" : bookTitleWidth
	});
	slider
	var sliderWidth = 468 ; width of the slider bar 
	$("#sliderdiv").css("width", sliderWidth + "px");
	
	var pageNoFieldwidth = 60; width of the page number input field 
	var gp = 84 ; gap between the slider and page number field 
	var pageNoFieldRight = ($(window).width() - sliderWidth) / 2 - gp - pageNoFieldwidth;
	$("#pageField").css("right", pageNoFieldRight);
	$("#mylibrary_link").css("padding-left", "14px");

}

else if (window
		.matchMedia("screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : landscape)").matches) {
	landscape
	update icon 
	//alert("landscape");
	//var x=$("#epub_content").offset().left;
	var updateWidth = 24; width of the update icon 
	var settingWidth = 24; width of the settings icon 
	//var updateRight = parseInt($("#epub_content").css("padding-right") ) - updateWidth + "px";
	var updateRight = "20px"; right padding of the update button with respect to the right margin 
	$("#updateDiv").css("right", updateRight);
	settings icon 
	var gp = 5 ;  gap to align settings and update in the same line 
	//var settingRight = parseInt($("#epub_content").css("padding-right") ) - settingWidth + gp + "px";
	var settingRight = 20 + gp + "px"; right padding of the settings button with respect to the right margin 
	$("#settings").css("right", settingRight);
	
	$("#mylibrary_link").css("padding-left", "20px");
	$("#bookMark-invisible").css({
		"right" : "8px",
		"width" : "40px",
		"text-align" : "right"
		
	});
	
	title

	var totalLeftIconsWidthTpRbn = ( parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) + parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("padding-left")) + parseInt($("#mylibrary_link").css("width"))) * 2  ;
	var bookTitleWidth = $(window).width() - totalLeftIconsWidthTpRbn ;
	$("#bookTitle").css({
		
		"width" : bookTitleWidth
		
		
	});
	
	 slider 
	//alert($("#sliderdiv").offset().left);
	//var c = (parseInt($("#sliderdiv").css("width"))) + 468 + 84 + "px";
	
	slider
	var sliderWidth = 468 ; width of the slider bar 
	$("#sliderdiv").css("width", sliderWidth + "px");
	var pageNoFieldwidth = 60; width of the page no. field input area 
	var gp = 84 ; gap between the slider and page number field 
	var pageNoFieldRight = ($(window).width() - sliderWidth) / 2 - gp - pageNoFieldwidth;
	$("#pageField").css("right", pageNoFieldRight);
	for book partition line 
	var gpForPartition = 24;  the gap required between the book partition line and the top and bottom ribbons 
	var bookPartitionTop = (parseInt($("#top-ribbon").css("height")) + (gpForPartition/2)) + "px";
	var bookPartitionHeight = parseInt($(window).height()) - (parseInt($("#top-ribbon").css("height")) + parseInt($("#bottom-ribbon").css("height")) + gpForPartition) + "px";
	var bookPartitionWidth = "2px "; width of the book partition image for the 2 page view 
	$("body").css({
		"moz-background-size" : bookPartitionWidth + bookPartitionHeight,
		"-webkit-background-size" : bookPartitionWidth + bookPartitionHeight,
		"-o-background-size" : bookPartitionWidth + bookPartitionHeight,
		"background-position" : "50%" + bookPartitionTop
	});
   
}
else if (window.matchMedia("screen and (max-width: 643px)").matches) {
	portrait
	$("#settings").css("right","15px");
	$("#updateDiv").css("right","12px");
	$("#bookMark-invisible").css({
		"right" : "12px",
		"width" : "40px",
		"text-align" : "right"
		
	});
	title

	var totalLeftIconsWidthTpRbn = ( parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) + parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("padding-left")) + parseInt($("#mylibrary_link").css("width"))) * 2  ;
	var bookTitleWidth = $(window).width() - totalLeftIconsWidthTpRbn ;
	$("#bookTitle").css({
		"width" : bookTitleWidth
	});
	slider
	var sliderWidth = 468 ; width of the slider bar 
	$("#sliderdiv").css("width", sliderWidth + "px");
	
	var pageNoFieldwidth = 60; width of the page number input field 
	var gp = 84 ; gap between the slider and page number field 
	var pageNoFieldRight = ($(window).width() - sliderWidth) / 2 - gp - pageNoFieldwidth;
	$("#pageField").css("right", pageNoFieldRight);
	$("#mylibrary_link").css("padding-left", "14px");
	
}
else if (window
		.matchMedia("screen and (min-width: 676px) and (max-width: 869px)").matches) {
	$("#pageField").css("right", '10.5px');
}*/
/*else if (window
		.matchMedia("screen and (min-width: 644px) and (max-width: 869px)").matches) {*/
	if (window.matchMedia("screen and  (max-width : 768px) ").matches) {
	/*portrait */
		//console.log("portrait" +$(window).width());
	$("#settings").css("right","15px");
	$("#updateDiv").css("right","12px");
	$("#bookMark-invisible").css({
		"right" : "12px",
		"width" : "40px",
		"text-align" : "right"
		
	});
	/*title*/

	var totalLeftIconsWidthTpRbn = ( parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) 
			+ parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("margin-left")) 
			+ parseInt($("#mylibrary_link").css("width"))/*+parseInt($("#settings").css("width"))+parseInt($("#settings").css("right"))*/) *2 ;
	var margins=parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) 
	+ parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("margin-left"))+ parseInt($("#mylibrary_link").css("width"));
	
	//var marginRight=parseInt($("#settings").css("width"))+parseInt($("#settings").css("right"));
	var bookTitleWidth = $(window).width() - totalLeftIconsWidthTpRbn ;
	$("#bookTitle").css({
		"width" : bookTitleWidth,
		"margin-left":margins,
	    "margin-right":margins
	});
	/*slider*/
	var sliderWidth = 468 ; /*width of the slider bar */
	$("#sliderdiv").css("width", sliderWidth + "px");
	
	var pageNoFieldwidth = 60; /*width of the page number input field */
	var gp = 84 ; /*gap between the slider and page number field */
	var pageNoFieldRight = ($(window).width() - sliderWidth) / 2 - gp - pageNoFieldwidth;
	$("#pageField").css("right", pageNoFieldRight);
	$("#mylibrary_link").css("margin-left", "14px");
	//hide navigation panels
	if(isiPhone()){
		$("#prev").css('visibility','hidden');
		$("#next").css('visibility','hidden');
	}else{
		$("#prev").css('visibility','visible');
		$("#next").css('visibility','visible');
		$("#epub_content").css('padding-left','64px');
		$("#epub_content").css('padding-right','70px');
		$("#epub_content").css('-webkit-column-gap','79px');
	}
	
}
/*else if (window
		.matchMedia("screen and (min-width: 870px) and (max-width: 1086px)").matches) {*/
	/*landscape*/	
	/*update icon */
	
	/*var x = parseInt($("#epub_content").css("padding-right") )  + "px";
	
	$("#updateDiv").css("right", x);
	settings icon 
	var y = parseInt($("#epub_content").css("padding-right")  )  + 5 + "px";
	$("#settings").css("right", y);
	 bookmark 
	var z = (parseInt($("#epub_content").css("padding-right") )  - 29 )+ "px";
	$("#bookMark-invisible").css({
		"right" : z,
		"width" : "29px",
		"text-align" : "right"
		
	});*/
	else if (window.matchMedia("screen and (max-width : 1024px) ").matches) {
		//console.log("landscape" +$(window).width());
	var updateWidth = 24; /*width of the update icon */
	var settingWidth = 24; /*width of the settings icon */
	//var updateRight = parseInt($("#epub_content").css("padding-right") ) - updateWidth + "px";
	var updateRight = "20px"; /*right padding of the update button with respect to the right margin */
	$("#updateDiv").css("right", updateRight);
	/*settings icon */
	var gp = 8 ; /* gap to align settings and update in the same line */
	//var settingRight = parseInt($("#epub_content").css("padding-right") ) - settingWidth + gp + "px";
	var settingRight = 20 + gp + "px"; /*right padding of the settings button with respect to the right margin */
	$("#settings").css("right", settingRight);
	
	$("#mylibrary_link").css("margin-left", "20px");
	$("#bookMark-invisible").css({
		"right" : "6px",
		"width" : "40px",
		"text-align" : "right"
		
	});
	
	/*title*/

	var totalLeftIconsWidthTpRbn = ( parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) 
			+ parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("margin-left"))
			+ parseInt($("#mylibrary_link").css("width"))/*+parseInt($("#settings").css("width"))+parseInt($("#settings").css("right"))*/)*2   ;
	var bookTitleWidth = $(window).width() - totalLeftIconsWidthTpRbn ;
	var margins=parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) 
	+ parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("margin-left"))+ parseInt($("#mylibrary_link").css("width"));
	
	//var marginRight=parseInt($("#settings").css("width"))+parseInt($("#settings").css("right"));
	$("#bookTitle").css({
		
		"width" : bookTitleWidth,
		"margin-left":margins,
	    "margin-right":margins
		
		
	});
	
	/* slider */
	//alert($("#sliderdiv").offset().left);
	//var c = (parseInt($("#sliderdiv").css("width"))) + 468 + 84 + "px";
	
	/*slider*/
	var sliderWidth = 468 ; /*width of the slider bar */
	$("#sliderdiv").css("width", sliderWidth + "px");
	var pageNoFieldwidth = 60; /*width of the page no. field input area */
	var gp = 84 ; /*gap between the slider and page number field */
	var pageNoFieldRight = ($(window).width() - sliderWidth) / 2 - gp - pageNoFieldwidth;
	$("#pageField").css("right", pageNoFieldRight);
	/*for book partition line */
	var gpForPartition = 24; /* the gap required between the book partition line and the top and bottom ribbons */
	var bookPartitionTop = (parseInt($("#top-ribbon").css("height")) + (gpForPartition/2)) + "px";
	var bookPartitionHeight = parseInt($(window).height()) - (parseInt($("#top-ribbon").css("height")) + parseInt($("#bottom-ribbon").css("height")) + gpForPartition) + "px";
	var bookPartitionWidth = "2px "; /*width of the book partition image for the 2 page view */
	$("body").css({
		"moz-background-size" : bookPartitionWidth + bookPartitionHeight,
		"-webkit-background-size" : bookPartitionWidth + bookPartitionHeight,
		"-o-background-size" : bookPartitionWidth + bookPartitionHeight,
		"background-position" : "50%" + bookPartitionTop
	});
	//hide navigation panels
	if(isiPhone()){
		$("#prev").css('visibility','hidden');
		$("#next").css('visibility','hidden');
		//$("#epub_content").css('padding-left','32px');
		//$("#epub_content").css('padding-right','32px');
	}else{
		$("#prev").css('visibility','visible');
		$("#next").css('visibility','visible');
		$("#epub_content").css('padding-left','64px');
		$("#epub_content").css('padding-right','66px');
		$("#epub_content").css('-webkit-column-gap','75px');
	}
}

/*else if (window
		.matchMedia("screen and (min-width: 1087px) and (max-width: 1283px)").matches) {
	desktop
	update icon 
	
	var epubcontentRight = parseInt($("#epub_content").css("padding-right") )  + "px";
	
	$("#updateDiv").css("right", epubcontentRight);
	settings icon 
	var gp = 5;  gap to align setting icon in same vertical line as update icon 
	var settingWidth = parseInt($("#epub_content").css("padding-right"))  + gp  + "px";
	$("#settings").css("right", settingWidth);
	 bookmark 
	var bookmarkWidth = 29 ;  width of the book mark Icon 
	var bookmarkWidthpx = 29 + "px" ;
	var bookMarkRight = (parseInt($("#epub_content").css("padding-right") )  - bookmarkWidth )+ "px";
	$("#bookMark-invisible").css({
		"right" : bookMarkRight,
		"width" : bookmarkWidthpx,
		"text-align" : "right"
		
	});
	library icon 
	var gpFromContent = 24;  library icon to be 24 px to the right of epub content 
	var libraryLeft = (parseInt($("#epub_content").css("padding-left") )  + gpFromContent )+ "px";
	$("#mylibrary_link").css({
		"padding-left" : libraryLeft
		
	});
	title

	var totalLeftIconsWidthTpRbn = ( parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) + parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("padding-left")) + parseInt($("#mylibrary_link").css("width"))) * 2  ;
	var bookTitleWidth = $(window).width() - totalLeftIconsWidthTpRbn ;
	$("#bookTitle").css({
		
		"width" : bookTitleWidth
		
		
	});
	var sliderWidth = 468 ; width of the slider bar 
	$("#sliderdiv").css("width", sliderWidth + "px");
	var pageNoFieldwidth = 60; width of the page No. field input area 
	var gp = 84 ; gap between the slider and page number field 
	var pageNoFieldRight = ($(window).width() - sliderWidth) / 2 - gp - pageNoFieldwidth;
	$("#pageField").css("right", pageNoFieldRight);
	
	for book partition line 
	var gpForPartition = 24;  the gap required between the book partition line and the top and bottom ribbons 
	var bookPartitionTop = (parseInt($("#top-ribbon").css("height")) + (gpForPartition/2)) + "px";
	var bookPartitionHeight = parseInt($(window).height()) - (parseInt($("#top-ribbon").css("height")) + parseInt($("#bottom-ribbon").css("height")) + gpForPartition) + "px";
	var bookPartitionWidth = "2px "; width of the book partition image for the 2 page view 
	$("body").css({
		"moz-background-size" : bookPartitionWidth + bookPartitionHeight,
		"-webkit-background-size" : bookPartitionWidth + bookPartitionHeight,
		"-o-background-size" : bookPartitionWidth + bookPartitionHeight,
		"background-position" : "50%" + bookPartitionTop
	});
	
	
}*/
else if (window.matchMedia("screen and (min-width: 1024px)").matches) {
	/*desktop*/
	/*update icon */
	
	//console.log("desktop" +$(window).width());
var epubcontentRight = parseInt($("#epub_content").css("padding-right") )  + "px";
	
	$("#updateDiv").css("right", epubcontentRight);
	/*settings icon */
	var gp = 5; /* gap to align setting icon in same vertical line as update icon */
	var settingWidth = parseInt($("#epub_content").css("padding-right"))  + gp  + "px";
	$("#settings").css("right", settingWidth);
	/* bookmark */
	/* Decreased the right of bookmark icon
	var bookmarkWidth = 29 ; width of the book mark Icon
	var bookmarkWidthpx = 29 + "px" ;
	var bookMarkRight = (parseInt($("#epub_content").css("padding-right") )  - bookmarkWidth )+ "px"; */
	
	$("#bookMark-invisible").css({
		"width" : "29px",
		"right" : "10px"
		/*"text-align" : "right"*/
		
	});
	/*library icon */
	var gpFromContent = 24; /* library icon to be 24 px to the right of epub content */
	var libraryLeft = (parseInt($("#epub_content").css("padding-left") )  + gpFromContent )+ "px";
	$("#mylibrary_link").css({
		"margin-left" : libraryLeft
		
	});
	/*title*/

	var totalLeftIconsWidthTpRbn = ( parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left"))
			+ parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("margin-left"))
			+ parseInt($("#mylibrary_link").css("width"))/*+parseInt($("#settings").css("width"))+parseInt($("#settings").css("right"))*/)*2  ;//removed *2
	
	var bookTitleWidth = $(window).width() - totalLeftIconsWidthTpRbn ;
	var margins=parseInt($("#back").css("width")) +  parseInt($("#forward").css("padding-left")) 
	+ parseInt($("#forward").css("width")) +  parseInt($("#mylibrary_link").css("margin-left"))+ parseInt($("#mylibrary_link").css("width"));
	
	//var marginRight=parseInt($("#settings").css("width"))+parseInt($("#settings").css("right"));
	$("#bookTitle").css({
		
		"width" : bookTitleWidth,
		"margin-left":margins,
	    "margin-right":margins
		
		
	});
	var sliderWidth = 468 ; /*width of the slider bar */
	$("#sliderdiv").css("width", sliderWidth + "px");
	var pageNoFieldwidth = 60; /*width of the page No. field input area */
	var gp = 84 ; /*gap between the slider and page number field */
	var pageNoFieldRight = ($(window).width() - sliderWidth) / 2 - gp - pageNoFieldwidth;
	$("#pageField").css("right", pageNoFieldRight);
	
	/*for book partition line */
	var gpForPartition = 24; /* the gap required between the book partition line and the top and bottom ribbons */
	var bookPartitionTop = (parseInt($("#top-ribbon").css("height")) + (gpForPartition/2)) + "px";
	var bookPartitionHeight = parseInt($(window).height()) - (parseInt($("#top-ribbon").css("height")) + parseInt($("#bottom-ribbon").css("height")) + gpForPartition) + "px";
	var bookPartitionWidth = "2px "; /*width of the book partition image for the 2 page view */
	$("body").css({
		"moz-background-size" : bookPartitionWidth + bookPartitionHeight,
		"-webkit-background-size" : bookPartitionWidth + bookPartitionHeight,
		"-o-background-size" : bookPartitionWidth + bookPartitionHeight,
		"background-position" : "50%" + bookPartitionTop
	});
	//show navigation panels
	if(isiPhone()){
		$("#prev").css('visibility','hidden');
		$("#next").css('visibility','hidden');
	}else{
		$("#prev").css('visibility','visible');
		$("#next").css('visibility','visible');
		$("#epub_content").css('padding-left','95px');
		$("#epub_content").css('padding-right','110px');
		$("#epub_content").css('-webkit-column-gap','123px');
		
	}
}
/*else {
	//console.log("error");
}*/
// to hide & show navigation panels based on screen resolution
/*if ( (window.matchMedia("screen and (max-width: 768px)").matches) || (window.matchMedia("screen and (max-width : 1024px)").matches)) {
	//console.log("Hide Navigation buttons" +$(window).width());
	$("#prev").hide();
	$("#next").hide();

} 

 else if (window.matchMedia("screen and (min-width : 1024px)").matches) {
	//console.log("inside desktop" + $(window).width());
	$("#prev").show();
	$("#next").show();
}*/

}

//26/12
function manageSyncL2S() {
	var ann = null;
	var propertiesMap = getPropertiesMap();
	currentPage = GetFromLocalStorage(epubFileName + "#currentPage");
	var dfd=$.Deferred();
	GetFromDataStorage(username + "#" + epubFileName).done(
			function(clientjson) {
				if (isConnected) {
				$.ajax({
					type : 'POST',
					async : false,

					data : {
						fileName : username + "#" + epubFileName,
						clientlatestjson : clientjson,
						currentPage : currentPage
						
					},
					url : baseurl1 + 'CompareJsonServlet',
					success : function(response) {
						//return dfd.resolve(response);
						displayError(propertiesMap.sync_success,propertiesMap.close,"172px");
						//alert("in manage sync:success");
						dfd.resolve();
					},
					error : function() {
						//return dfd.resolve(response);
									dfd.resolve();	
					}
				});
				}
				else{
					dfd.resolve();
				}
			});
	return dfd.promise();
}
/*$('#mylibrary_link').bind('click', function(event) {
  //  var x=22;
  //  alert('xczc');  
	manageSync().done(function(){
  //event.preventDefault();
  //event.stopPropagation();
    	 setMyLibraryHostName();
    });
   
});*/

//**
function errorPopup(errortext,buttontext){
	errorpopup = document.getElementById('error_popup');
	$("#error_popup").empty();
	$("#error_popup").html('<div style="border-top: 2px solid #ED1C24;"></div>');
	
	
	
	var spancheck = document.createElement('span');
	var div1 = document.createElement('div');
	div1.setAttribute('style', 'text-align: justify;margin-top:48px;margin-left:64px;margin-right:48px;font-family: Helvetica light,calibri;font-size:14px;color:#939598;');
	div1.appendChild(document.createTextNode(errortext));
	
	var div4 = document.createElement('div');
	div4.setAttribute('style','height:24px;margin-top:48px;margin-left:130px;');
	var closeButton = document.createElement('input');
	closeButton.setAttribute('id', 'closebutton');
	closeButton.setAttribute('Class', 'closeButton');
	closeButton.setAttribute('type', 'button');
	closeButton.setAttribute('value', buttontext);
	closeButton.setAttribute('onClick', 'javascript:closePopup();');
	closeButton.setAttribute('style',
	'text-decoration:none;height:30px;background-color: #939598 !important;font-size:16px;font-family:Helvetica Light,Calibri;color: white !important;border: none;cursor: pointer;border-radius:2px;padding-left:24px;padding-right:24px;-webkit-appearance: none');

	
	
	div4.appendChild(closeButton);
	spancheck.appendChild(div1);
	spancheck.appendChild(div4);
	errorpopup.appendChild(spancheck);
}
 
function positionerrorPopup(){
	
	if (!$("#error_popup").is(':visible')) {
		return;
	}
	
	else{
		$("#error_popup").css({
		    left : (($(window).width() - $('#error_popup').width())/2),
		    top : (($(window).height() - $('#error_popup').height())/2),
		    position : 'absolute',
		    display:'block'
		   
		});
	}
	
}

function displayError(errortext,buttontext,customheight){
	
	disableIcons();
	//if(!$("#error_popup").is(':visible')){
		$("#loading_overlay").css
		({
			"margin-top":$("#top-ribbon").height()+2,//2-red border width
			"display": "block"
		});
	errorPopup(errortext,buttontext);
	$('#error_popup').css("height",customheight);
	$("#error_popup").fadeIn(400);
	$("#loadingwhite").css("display", "none");
	positionerrorPopup();
//	}
}

function closePopup(){
	 enableIcons();
	$("#loading_overlay").css('display', 'none');
	$("#error_popup").fadeOut(400);
	if (updateVersion > 0) {
	$("#updateBook" ).css('display', 'inline');
	}
}


function disableIcons(){
	$("#mylib_icon").attr('src', "./epubimages/bookReadViewImagesNew/LibraryIconDisabled.png");
	$("#fwd_icon").attr('src', "./epubimages/bookReadViewImagesNew/ForwardIconDisabled.png");
	$("#back_icon").attr('src', "./epubimages/bookReadViewImagesNew/BackIconDisabled.png");
	$("#searchD").attr('src', "./epubimages/bookReadViewImagesNew/SearchIconDisabled.png");
	$("#show_info").attr('src', "./epubimages/bookReadViewImagesNew/InfoIconDisabled.png");
	$("#tocButton").attr('src', "./epubimages/bookReadViewImagesNew/TOCIconDisabled.png");
	$("#show_bookmark").attr('src', "./epubimages/bookReadViewImagesNew/AnnotationsIconDisabled.png");
	$("#indexImages").attr('src', "./epubimages/bookReadViewImagesNew/IndexIconDisabled.png");
	$("#show_history").attr('src', "./epubimages/bookReadViewImagesNew/HistoryIconDisabled.png");
	$(".settings_icon").attr('src', "./epubimages/bookReadViewImagesNew/SettingsIconDisabled.png");
	
	$("#mylibrary_link").css('pointer-events', 'none');
	$("#back").css('pointer-events', 'none');
	$("#forward").css('pointer-events', 'none');
	$("#search_field").css('pointer-events', 'none');
	$("#showInfoAnchor").css('pointer-events', 'none');
	$("#tocAnchor").css('pointer-events', 'none');
	$("#annotationsAnchor").css('pointer-events', 'none');
	$("#indexAnchor").css('pointer-events', 'none');
	$("#historyAnchor").css('pointer-events', 'none');
	$("#settings").css('pointer-events', 'none');
	
	
}


function enableIcons(){
	$("#mylib_icon").attr('src', "./epubimages/bookReadViewImagesNew/Library-Icon.png");
	$("#fwd_icon").attr('src', "./epubimages/bookReadViewImagesNew/Forward-Icon.png");
	$("#back_icon").attr('src', "./epubimages/bookReadViewImagesNew/Back-Icon.png");
	$("#searchD").attr('src', "./epubimages/bookReadViewImagesNew/Search-Icon.png");
	$("#show_info").attr('src', "./epubimages/bookReadViewImagesNew/Info-Icon-white.png");
	$("#tocButton").attr('src', "./epubimages/bookReadViewImagesNew/TOC-Icon-white.png");
	$("#show_bookmark").attr('src', "./epubimages/bookReadViewImagesNew/Annotations-Icon-white.png");
	$("#indexImages").attr('src', "./epubimages/bookReadViewImagesNew/Index-Icon-white.png");
	$("#show_history").attr('src', "./epubimages/bookReadViewImagesNew/History-Icon-white.png");
	$(".settings_icon").attr('src', "./epubimages/bookReadViewImagesNew/Settings-Icon.png");
	
	$("#mylibrary_link").css('pointer-events', 'auto');
	$("#back").css('pointer-events', 'auto');
	$("#forward").css('pointer-events', 'auto');
	$("#search_field").css('pointer-events', 'auto');
	$("#showInfoAnchor").css('pointer-events', 'auto');
	$("#tocAnchor").css('pointer-events', 'auto');
	$("#annotationsAnchor").css('pointer-events', 'auto');
	$("#indexAnchor").css('pointer-events', 'auto');
	$("#historyAnchor").css('pointer-events', 'auto');
	$("#settings").css('pointer-events', 'auto');
	
}