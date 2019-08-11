/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isSafari = (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) ||  /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
var minFontSize = '15px';
var maxFontSize = '30px';
var minLH = '10px';
var maxLH = '80px';
var dataFromServer='';
var COLUMN_WIDTH;
var COLUMN_GAP;
//get value of json from local storage
var json;
var spineDetail;
var currentPage = "";
var style1;
var cssName;
var image;
var spine;
var toc;
var fileDetails;
var pageLength ;
var username;
var windowHeight = parseInt($("#epub_content").height());
var accuracy = 100;

if(isChrome||isSafari){
	COLUMN_WIDTH = '-webkitColumnWidth';
	COLUMN_GAP = '-webkitColumnGap';
}
else {
	//if( $.browser.mozilla ) { TODO removed as this was not working in android. Need to fix this
	//COLUMN_WIDTH = '-mozColumnWidth';
	//	COLUMN_GAP = '-mozColumnGap';
	// Commented above and added the below code for forward and backward navigation in IPAD Simulator
	COLUMN_WIDTH = '-webkitColumnWidth';
	COLUMN_GAP = '-webkitColumnGap';

}

var e = jQuery.Event("keypress");
e.which = 13; //enter key
e.keyCode = 13;

var columnWidth = parseInt($('#epub_content').css(COLUMN_WIDTH), 10);
var columnGap = parseInt($('#epub_content').css(COLUMN_GAP), 10);

function fontZoomOut() {
	var dfd = $.Deferred();
	var fontSize = $("#epub_content").css("font-size").replace('px','');
	var LH = $("#epub_content").css("line-height").replace('px','');
	if (fontSize > minFontSize) {
		$("#epub_content").css('font-size', (parseInt(fontSize, 10) - 2) + 'px');
		$("#epub_content").css('line-height', (parseInt(LH, 10) - 2) + 'px');
	}
	//scrollBackOrigLoc(fontInfo);
	/*
      Fixed the last page issue when font size is decreased. now its not showing the blank page
	*/
	var pageLength = $("#epub_content")[0].scrollWidth;
	var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
	var pageWidth = parseInt($('#epub_content').css('width'), 10);
	var currentRight = parseInt($('#epub_content').css('right'), 10);
    var page_num = Math.ceil(pageLength / (pageWidth + gap));
    var shift =  (page_num - 1) *  (pageWidth + gap);
    var lastPage = pageLength - ( pageWidth + gap);
    if( currentRight > pageLength)
    {
    	shiftPositionForZoomOut(page_num, shift, pageWidth, lastPage);
    }
    //check
    var fs = $("#epub_content").css("font-size").replace('px','');
	var lh = $("#epub_content").css("line-height").replace('px','');
	userobj.fontsize = fs;
	userobj.lineheight = lh;
	SaveInDataStorage(username + "#" + bookName,(JSON.stringify(userobj))).done(function (){
		 dfd.resolve();
	 });
	// serversynclocaldata().done(function(){});
	 return dfd.promise();
}

function shiftPositionForZoomOut(page_num, shift, pageWidth, lastPage){
	currentPosition = page_num;
	previousCurrentPosition = currentPosition;
	if (shift > 0 && shift > pageWidth && shift >= lastPage) {
		$("#epub_content").css("right", shift + "px");
		$("#epub_content").css("opacity", "1");
	}
}

function fontZoomIn() {

	var dfd = $.Deferred();
	//get values of json keys from local storage
	var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage');
     findStartingWords(spine[chapterkey], chapterkey, "justWords").done(function (pc){
    	//check
	 var strs= pc.split("~~");
    	 pc= strs[0];
    	//check
    	 var pageContent =pc;
    	 var fontSize = $("#epub_content").css('font-size').replace('px','');
    		var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
    		var LH = $("#epub_content").css('line-height').replace('px','');
    		if (fontSize < maxFontSize) {
    			$("#epub_content").css('font-size', (parseInt(fontSize, 10) + 2) + 'px');
    			$("#epub_content").css('line-height', (parseInt(LH, 10) + 2) + 'px');
    		}
    		//check
    		 var fs = $("#epub_content").css("font-size").replace('px','');
    			var lh = $("#epub_content").css("line-height").replace('px','');
    			userobj.fontsize = fs;
    			userobj.lineheight = lh;
    			SaveInDataStorage(username + "#" + bookName,(JSON.stringify(userobj))).done(function (){
   				 dfd.resolve();
   			 	});
    			 //26/12
    			// serversynclocaldata().done(function(){});
    		//scrollBackOrigLoc(fontInfo);
    		/*var hist = GetFromLocalStorage(username+'#history');
    		var histobj=JSON.parse(hist);
    		histobj.fontsize = fontSize;
    		//console.log(JSON.stringify(histobj));
    		SaveInLocalStorage(username+'#history',JSON.stringify(histobj));*/
    			//check

    });

    return dfd.promise();
}

function scrollBackOrigLoc(fontInfo) {

	var offset = fontInfo[2];
    //loadChapters(spine[currentPage], currentPage);
    scrollChapter(null, offset);

}
var calc_num_last = function() { 
    var length = $("#epub_content")[0].scrollWidth; 
    if($(document).width() == length) { 
            //TODO Remove the hardcoding 
            return 1; 
    } 
    var pageWidth = parseInt($('#epub_content').css('width'), 10); 
    return Math.ceil((length) / (pageWidth + columnGap)); 
};

var calc_num_pages = function() {
	var length = $("#epub_content")[0].scrollWidth;
	if($(document).width() == length) {
		//TODO Remove the hardcoding
		return 2;
	}
	//var innerWidth = $("#epub_content").wrapInner("<div>").children().innerWidth();
	//var pageWidth = parseInt($('#epub_content').css('width'), 10);

	//var width = parseInt($('#epub_content').css(COLUMN_WIDTH), 10);
	//var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
	return Math.floor((length) / (columnWidth + columnGap));
};
var globalpageinchap;
var calc_page_shift_for_next = function(page_num) {
	globalpageinchap=page_num;
	var shift = 0 ;
	//var width = parseInt($('#epub_content').css(COLUMN_WIDTH), 10);
	var pageWidth = parseInt($('#epub_content').css('width'), 10);
	var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
		////console.log('Page Number :' + page_num);
		/*if(page_num<=0) page_num = 2;
		  shift =  (page_num - 1) *  (pageWidth + gap);*/

	if(page_num > 0)
		shift =  (page_num - 1) *  (pageWidth + gap);
	else
		shift =  (page_num) *  (pageWidth + gap);
	return shift;
};

var calc_page_shift_for_prev = function(page_num) {
	globalpageinchap=page_num;
	var shift;
	//var noOfPages = calc_num_pages();
	//var width = parseInt($('#epub_content').css(COLUMN_WIDTH), 10);
	var pageWidth = parseInt($('#epub_content').css('width'), 10);
	var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
	//if(page_num==0) page_num = 2;
	if(page_num > 0)
		shift =  (page_num - 1) *  (pageWidth + gap);
	else
		shift =  (page_num) *  (pageWidth + gap);
	return shift;
};



var lastfile= null;
var show_content_for_next = function() {
	//check
	var dfd=$.Deferred();
	var shiftPosition =  calc_page_shift_for_next(currentPosition);
	
	//check
	//alert(lastfile+ GetFromLocalStorage(bookName+"#"+'currentPage',1));
	pageLength = $("#epub_content")[0].scrollWidth;

	if(pageLength > shiftPosition) {
		$("#epub_content").css("right", shiftPosition+"px");
		$("#epub_content").css("opacity", "1");
		//var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage',1);
		//check
		//findStartingWords(spine[chapterkey], chapterkey, "wordsForNextNPrev").done(function(chapterHTML){
		//getNodeName(chapterHTML,'first');
		//Commented out on Jan 24
		//setTimeout(placeAllNoteIcon,100);
		//});
		 dfd.resolve();
	}

	else if(lastfile==GetFromLocalStorage(bookName+"#"+'currentPage',1)){
		$("#next").attr("disabled",true);
		$("#next").hide();
		 dfd.resolve();
	}
	//check
	else {
		////console.log('Inside else part for load next chapters');
		currentPosition = 1;
		load_next_chapter().done(function (){
		//Commented out on Jan 24
		// setTimeout(placeAllNoteIcon,100);
		//check
		 dfd.resolve();
		});
	}
    return dfd.promise();
  //check
};
var load_next_chapter_offline = function(term, curkey){
	var dfd = $.Deferred();
	  if(curkey!=null)
	  {
		  currentPage = spine[curkey];
		  loadChapters(currentPage, curkey, pageLength,term).done(function (returnValue){
			  	if(returnValue == 'not found') {
			  		 dfd.resolve('not found');
			  	} else {
					  currentPosition = 1;
					  pageLength = $("#epub_content")[0].scrollWidth;
					  ////console.log('Page length @ load_next_chapter: ' + pageLength);
					  imageAlterSize();
					   dfd.resolve();
			  	}
		  });
		
	  }else{
		  update_button_state();
		  dfd.resolve("end");
	  }
	  return dfd.promise();
};

var load_prev_chapter_offline = function(term, curkey){
	var dfd = $.Deferred();
	  if(curkey!=null)
	  {
		  currentPage = spine[curkey];
		  loadChapters(currentPage, curkey, pageLength,term).done(function (returnValue){
			  	if(returnValue == 'not found') {
			  		 dfd.resolve('not found');
			  	} else {
				  	pageLength = $("#epub_content")[0].scrollWidth;
					 
					var pageWidth = parseInt($('#epub_content').css('width'), 10);
					var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);
				    currentPosition = Math.ceil(pageLength / (pageWidth + gap));
				    show_content_for_prev().done(function(){
				    	dfd.resolve();
				    });
				    imageAlterSize();
				   
				    var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage',1);
			  	}
		  });
		
	  }else{
		  currentPosition=-1;
		  update_button_state();
		  dfd.resolve("end");
	  }
	  return dfd.promise();
};

var show_content_for_prev = function() {
	var dfd= $.Deferred();
	var shiftPosition = calc_page_shift_for_prev(currentPosition);
	pageLength = $("#epub_content")[0].scrollWidth;
	////console.log('Page Length:'+pageLength +'show content:'+shiftPosition + ' currentPosition :'+currentPosition);

	if(currentPosition!=0 && shiftPosition >= 0 && pageLength > shiftPosition) {
		if( pageLength <= $(document).width()) {
			//TODO Remove the hardcoding
			//do nothing
		} else {
			$("#epub_content").css("right", shiftPosition+"px");
			$("#epub_content").css("opacity", "1");
			//var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage',1);
			//check
//			findStartingWords(spine[chapterkey], chapterkey, "wordsForNextNPrev").done(function(chapterHTML){
//			getNodeName(chapterHTML,'first');
//			});
			//check
		}
		//userobj = createEbookMetadata(username, epubFileName);
		//writeEbookMetaToLocal(userobj).done(function (){
			//addChapterMetadata(currentPage);
		    //addChapterMetadataForNotes(currentPage);
		   // writeEbookMetaToLocal(userobj);
		    var temp=null;
		    for(temp in spine) {
				if(temp!='toc' && temp!='cover' && temp!='pagenav' && temp!='pageindex'){
					  fPage = spine[temp];
					  break;
				}
			}
		    //console.log('first page:'+fPage);
		    //console.log('current Page:'+currentPage);
		    if(fPage==currentPage)
		    	{imageAlterSize();
		    	//console.log('aligning first page');
		    setTimeout(alignFirstPage,000);
		    	}
		    //commented out on Jan24
		    //setTimeout(placeAllNoteIcon,100);
		    //placeAllNoteIcon();
		    dfd.resolve();
	//	});
	}else {
		////console.log('Inside else part for load prev chapters');
		currentPosition = 1;
		load_prev_chapter().done(function (){
			//userobj = createEbookMetadata(username, epubFileName);
			//writeEbookMetaToLocal(userobj).done(function (){
				//addChapterMetadata(currentPage);
			    //addChapterMetadataForNotes(currentPage);
			   // writeEbookMetaToLocal(userobj);
			    var temp=null;
			    for(temp in spine) {
					if(temp!='toc' && temp!='cover' && temp!='pagenav' && temp!='pageindex'){
						  fPage = spine[temp];
						  break;
					}
				}
			    //console.log('first page:'+fPage);
			    //console.log('current Page:'+currentPage);
			    if(fPage==currentPage)
			    	{imageAlterSize();
			    	//console.log('aligning first page');
			    setTimeout(alignFirstPage,000);
			    	}
			  //commented out on Jan24
			    //setTimeout(placeAllNoteIcon,100);
			    //placeAllNoteIcon();
			    dfd.resolve();
			});
		//});
	}

	return dfd.promise();
};


var prevPageFunc = function(){
	var dfd = $.Deferred();
	 var nextPosition = 0;
	 var currentRight = parseInt($('#epub_content').css('right'), 10);
	 //for avoid blank page issue when navigate from chapters to cover page
	 if(currentRight === 0 || currentRight<0){
			currentPosition = 1;
	 }
	 nextPosition = currentPosition - 1;

	 if(nextPosition <= 0) {
		load_prev_chapter().done(function (startOfchap){
			//check
			if(startOfchap!="end"){
				update_button_state();
			}
			dfd.resolve();		
			//check
			return;
		});

	 }
	//check
	 else{
	currentPosition = nextPosition;
	update_button_state();
	//setTimeout(show_content_for_prev, 500);
	show_content_for_prev().done(function(){
		//userobj = createEbookMetadata(username, epubFileName);
		//writeEbookMetaToLocal(userobj).done(function (){
			dfd.resolve();
	});
	}
	//check
	//});
	//addChapterMetadata(currentPage);
    //addChapterMetadataForNotes(currentPage);
    //writeEbookMetaToLocal(userobj);
	 return dfd.promise();
};

var load_prev_chapter = function(){
	var dfd = $.Deferred();
	 var container = $("#epub_content");
	 var containerName = container.attr("name");
	 var spineIndex = [];
	 for (var x in spine) {
		 if(x!='toc' && x!='cover' && x!='pagenav' && x!='pageindex')
		    spineIndex.push(x);
	 }
	  n = $.inArray(containerName, spineIndex);
	  n = n -1;
	  if(n >= 0) {
		  var key = spineIndex[n];
		  currentPage = spine[key];
		  loadChapters(currentPage, key, pageLength).done(function (){
			  //addChapterMetadata(currentPage);
				 // setTimeout(function() {
					   pageLength = $("#epub_content")[0].scrollWidth;
					  ////console.log('Page length @ load_prev_chapter: ' + pageLength);
						var pageWidth = parseInt($('#epub_content').css('width'), 10);
						var gap = parseInt($('#epub_content').css(COLUMN_GAP), 10);

						////console.log('Before floor : current Position ' + (pageLength / (pageWidth + gap)));
					    currentPosition = Math.ceil(pageLength / (pageWidth + gap));
					    //currentPosition = Math.round(pageLength / (pageWidth + gap));

						//currentPosition = pageLength / (pageWidth + gap);
					    ////console.log('After Floor : current Position ' + currentPosition);
					    imageAlterSize();
				       // //console.log('calling chapter meta data 1 load_prev_chapter');
					  //added for highlighting
				      //  readEbookMetaFromLocal(userName,ebook)
					   // userobj = createEbookMetadata(username, epubFileName);
					    show_content_for_prev().done(function(){
							   // writeEbookMetaToLocal(userobj).done(function (){
							    	dfd.resolve();
					    });

					  //  addChapterMetadata(currentPage);
					  //  addChapterMetadataForNotes(currentPage);


				//  },50);
					    //var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage',1);
					  //check
//						findStartingWords(spine[chapterkey], chapterkey, "wordsForNextNPrev").done(function(chapterHTML){
//						getNodeName(chapterHTML,'first');
//						});
					  //check
		  });

	  }else{
		  currentPosition = -1;
		  update_button_state();
		  //var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage',1);
		//check
		  dfd.resolve("end");
//			findStartingWords(spine[chapterkey], chapterkey, "wordsForNextNPrev").done(function(chapterHTML){
//			getNodeName(chapterHTML,'first');
//
//
		//check
		};
	//
		return dfd.promise();
};


var load_next_chapter = function(){
	var dfd = $.Deferred();
	 var container = $("#epub_content");
	 var containerName = container.attr("name");
	 var spineIndex = [];
	 for (var x in spine) {
		 if(x!='toc' && x!='cover'&& x!='pagenav' && x!='pageindex')
		    spineIndex.push(x);
	 }
	  n = $.inArray(containerName, spineIndex);
	  n++;
	  if(spineIndex[n]!=null)
	  {
		  var key = spineIndex[n];
		  currentPage = spine[key];
		  loadChapters(currentPage, key, pageLength).done(function (){
			  // addChapterMetadata(currentPage);
				 // setTimeout(function() {
					  currentPosition = 1;
					  pageLength = $("#epub_content")[0].scrollWidth;
					  ////console.log('Page length @ load_next_chapter: ' + pageLength);
					  imageAlterSize();

					//  //console.log('calling chapter meta data 2 load_next_chapter');
					  //added for highlighting
					//  userobj = createEbookMetadata(username, epubFileName);
					 // writeEbookMetaToLocal(userobj).done(function (){
					//
					//  });
					//	addChapterMetadata(currentPage);
					//    addChapterMetadataForNotes(currentPage);

				 // },50);
					 // var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage',1);
					//check
					  dfd.resolve();
						/*findStartingWords(spine[chapterkey], chapterkey, "wordsForNextNPrev").done(function(chapterHTML){
						getNodeName(chapterHTML,'first');

						});*/
					//check
		  });

	  }else{
		  update_button_state();
		  //var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage',1);
		  dfd.resolve("end");
		//check
			/*findStartingWords(spine[chapterkey], chapterkey, "wordsForNextNPrev").done(function(chapterHTML){
			getNodeName(chapterHTML,'first');
		  dfd.resolve();
			});*/
		//check
	  }
	  return dfd.promise();
};

var imageAlterSize = function(){
	//   Image Alteration
	//var windowHeight = parseInt($("#epub_content").height());
    $('#epub_content div img').load(function() {
		if($(this).height() > windowHeight) {
			$(this).height(windowHeight);
	    } else if($(this).width() > 420) {
			$(this).width(420);
	    }
    });
};

var update_button_state = function() {
	$("#next").attr("disabled", null);
	$("#prev").attr("disabled", null);
	$("#next").show();
	$("#prev").show();

	if(currentPosition === -1) {
		$("#prev").attr("disabled", "true");
		$("#prev").hide();
	}

	 var container1 = $("#epub_content");
	 var containerName1 = container1.attr("name");
	 var spineIndex1 = [];
	 for (var x1 in spine) {
		 if(x1!='toc' && x1!='cover'&& x1!='pagenav' && x1!='pageindex')
		    spineIndex1.push(x1);
	 }
	  var no1 = $.inArray(containerName1, spineIndex1);
	  no1++;
	  if(spineIndex1[no1]==null) {
		if(currentPosition === calc_num_pages() ||
				(twoPage && currentPosition === (calc_num_pages()) ) ) {
				$("#next").attr("disabled",true);
			}
		else{
			if(lastfile==GetFromLocalStorage(bookName+"#"+'currentPage',1)){ 
                if(currentPosition >= calc_num_last()|| currentPosition==0){              
                        //setting current pos 
                        currentPosition=calc_num_last(); 
                         boolast= true; 
                         $("#next").hide(); 
                //} 
                } 
        }

			
		}
	  }
};

nextPageFunc = function (){
	var dfd = $.Deferred();
	if(currentPosition==-1){
		currentPosition=1;
	}
	var nextPosition = 0;

		nextPosition = currentPosition + 1;

	////console.log('currentPosition:' +currentPosition +' nextPosition:' + nextPosition);
	var noOfPages = calc_num_pages()/ 2;
	////console.log('No of Pages in next page func: ' + noOfPages);
	 if(nextPosition > noOfPages) {
		 load_next_chapter().done(function (){
			 dfd.resolve();
			 update_button_state();
			/*check removed*/
		//	return dfd.promise();
			/*check removed*/
		 });

	 }
	 ////console.log('nextPosition:' +nextPosition);
	 else{
		 if(currentPosition<=calc_num_last()){
	       currentPosition = nextPosition;
		 }
	     update_button_state();

	if(twoPage && currentPosition === (calc_num_pages() - 1)) {
		load_next_chapter().done(function (){
			//setTimeout(show_content_for_next, 50);
			//check
			show_content_for_next().done(function(){
//			userobj = createEbookMetadata(username, epubFileName);
			//writeEbookMetaToLocal(userobj).done(function (){
				dfd.resolve();
			});
			//check
			//});
		});
	}else{
		//setTimeout(show_content_for_next, 50);
		//check
		show_content_for_next().done(function(){
//		userobj = createEbookMetadata(username, epubFileName);
		//writeEbookMetaToLocal(userobj).done(function (){
			dfd.resolve();
		});
		//check
		//});
	}
	 }
//	addChapterMetadata(currentPage);
//    addChapterMetadataForNotes(currentPage);
   // writeEbookMetaToLocal(userobj);
	return dfd.promise();
};

function isChildInsideParentLeftBoundary(node, ogirinalOffset) {

	var childNodes =node.getElementsByTagName("*");

	for (var i=0, max=childNodes.length; i < max; i++) {
		if(childNodes[i].offsetLeft < ogirinalOffset) {
			return true;
		}

		if(i==10) return false;
	}
	return false;
}

function previousNode(curentNode) {
    var $element = $(curentNode);

    return $element
        .prev().find("*:last")
        .add($element.parent())
        .add($element.prev())
        .last();
}
/*function nextNode(curentNode) {
    var $element = $(curentNode);

    return $element
        .children(":eq(0)")
        .add($element.next())
        .add($element.parents().filter(function() {
            return $(this).next().length > 0;
        }).next()).first();
}*/

function getExactOffset(previousNode, increment, startingPosition, dummyNode, scrollWidth) {  // Code Updated - 02/24
	var previousNodeText = previousNode.innerHTML;
	var nodeTextIndex = startingPosition - increment;
	var offsetChanged = false;
	while(nodeTextIndex > 0) {
		offsetChanged = true;
		var text1 = previousNodeText.substring(0, nodeTextIndex);
		var text2 = previousNodeText.substring(nodeTextIndex);
		previousNode.innerHTML = "";
		// Put the new text in
		previousNode.appendChild(document.createTextNode(text1));
		previousNode.appendChild(dummyNode);
		previousNode.appendChild(document.createTextNode(text2));
		nodeTextIndex = nodeTextIndex - increment;
		if(dummyNode.offsetLeft < scrollWidth) {
			addIncrementedValue = true;
			break;
		}
	}
	if(increment != accuracy) {
		var newStartingPosition = startingPosition;
		if(offsetChanged) {
			newStartingPosition = startingPosition+increment;
		}
		increment = increment/10;
		getExactOffset(previousNode, increment, newStartingPosition, dummyNode, scrollWidth);
	} else {
		return;
	}

}

function getChapterWords(chapter, chapterkey, action) { // Code Updated - 02/24

	if (chapter != null && chapter != "null") {
		boolPrinted=globalFlagForPrintedVersionAvailability;

		var elem = document.getElementById('epub_content');

		var scrollWidth = elem.style.right;

		if (scrollWidth.indexOf("px") != -1) {
			scrollWidth = scrollWidth.substring(0, scrollWidth.length - 2);
		}

		var htmlStr = elem.innerHTML;
		var offset = 0;
		var hiddenContent = "";
		if(currentPosition == 1) {
			if(boolPrinted){
				offset = htmlStr.indexOf("pagebreak");
			} else {
				offset=200;
			}
			hiddenContent = htmlStr.substring(0, offset);
		} else {
			var childNodes =elem.getElementsByTagName("*");

			var pageTopNode = null;
			var pageTopNodeIndex = 0;

			var totalWidth = elem.scrollWidth;
			var approximatePosition = Math.floor(childNodes.length*(scrollWidth/totalWidth));
			var max=childNodes.length;
			if(childNodes[approximatePosition].offsetLeft > scrollWidth) {
				while(childNodes[approximatePosition].offsetLeft > scrollWidth && approximatePosition > 0) {
					approximatePosition--;
				}
				approximatePosition++;
			} else {
				while(childNodes[approximatePosition].offsetLeft < scrollWidth && approximatePosition < max) {
					approximatePosition++;
				}
			}

			pageTopNodeIndex = approximatePosition;
			pageTopNode = childNodes[approximatePosition];

			var dummyNode = document.createElement('a');
			dummyNode.setAttribute('id', 'DUMMYID');
			pageTopNode.parentNode.insertBefore(dummyNode, pageTopNode);
			offset = elem.innerHTML.indexOf("<a id=\"DUMMYID\"");
			hiddenContent = htmlStr.substring(0, offset);

			pageTopNode.parentNode.removeChild(dummyNode);

			//var addIncrementedValue = false;
			//var offsetChanged = false;

			var increment = 1000000;
			if(pageTopNode.offsetLeft > scrollWidth && pageTopNode.offsetTop > 29) {
				var previousNode = childNodes[pageTopNodeIndex - 1];
				var previousNodeText = previousNode.innerHTML;
				var startingPosition = previousNodeText.length;
				if(startingPosition > 1000000) {
					increment = 1000000;
					accuracy = 1000;
				} else if(startingPosition> 100000) {
					increment = 100000;
				} else if(startingPosition > 10000) {
					increment = 10000;
				} else if(startingPosition> 1000) {
					increment = 1000;
				}
				getExactOffset(previousNode, increment, startingPosition, dummyNode, scrollWidth);
				var newoffset = elem.innerHTML.indexOf("<a id=\"DUMMYID\"");
				if(newoffset > -1) {
					hiddenContent = htmlStr.substring(0, newoffset);
					offset = newoffset;
				}
				previousNode.innerHTML = previousNodeText;
			}
		}
		//console.log("offset for the page top is " + offset);
		// note: we need lastoffset calculation only for showing page number in the current view - called from placeAllPrintedPageNo() for this.

		if (action == 'highlight' || action == 'note') {
			return offset;
		} else if (action == 'justWords' && !boolPrinted ) {
			var endLoc = offset;
			var startOff=0;
			if(offset>=4000) {
				startOff= offset-4000;
			} else {
				startOff=0;
			}
			if (endLoc > hiddenContent.length) {
				endLoc = hiddenContent.length;
			} else if(currentPosition==1) {
				endLoc= 1000;
				offset=0;
			}
			return htmlStr.substring(startOff, endLoc) + "~~" + offset+ "~~" +boolPrinted;
		}else if(action == 'justWords' && boolPrinted){
			var endoffsetforPageno = offset+3000;
			if (endoffsetforPageno > hiddenContent.length) {
				endoffsetforPageno = hiddenContent.length;
			}
			startoffset= offset;
			if(startoffset!=0 && startoffset>1000){
				startoffset= startoffset-1000;
			}
			  strforpageno= hiddenContent.substring(startoffset, endoffsetforPageno);
			var endLoc = offset;
			if (endLoc > hiddenContent.length) {
				endLoc = hiddenContent.length;
			}
			// TODO: What we have to do if it is the 1st page of any chapter
			else if (currentPosition==1){
				/*if(pagenopresentatstart){
				endLoc=1000;
				offset=0;
				}
				else{
					endLoc=200;
					offset=0;
				}*/
			}
			//console.log("print-books: "+hiddenContent.substring(0, endLoc));
			return hiddenContent.substring(0, endLoc) + "~~" + offset+ "~~" +boolPrinted+"~~"+strforpageno;
		}
		else if (action == 'wordsForNextNPrev') {
			var endLoc = offset + 2000;

			if (endLoc > htmlStr.length) {
				endLoc = htmlStr.length;
			}
			return hiddenContent.substring(offset, endLoc);
		} else if (action == 'wordsForPrintedbook'){
			var endLoc = lastOffset+3000;
			if (endLoc > hiddenContent.length) {
				endLoc = hiddenContent.length;
			}if(offset!=0 && offset>1000){
				offset= offset-1000;
			}

			//console.log("wordsForPrintedbook :"+hiddenContent.substring(offset, endLoc));
			return hiddenContent.substring(offset, endLoc);
	}

		else {
			if (currentPosition==1){
				offset=0;
			}
			var bookmarkId = "bookmarkId" + (Math.floor(Math.random() * 90000) + 10000);
			return chapterkey + "~~" + bookmarkId + "~~" + offset + "~~" + hiddenContent.substring(offset, offset + 50);
		}
		$('#hidden_content').html("");
	}
}

function CheckforChild(prevNode) {
	var  chkFornode;
	var finalnode;
	 for(var i = 0; i < prevNode.childNodes.length; i++){
	        if (prevNode.childNodes[i].nodeType == 1){
	        	if(prevNode.childNodes[i].className=='startNodefound'){
	        		chkFornode=prevNode.childNodes[i];
					break;
				}
	        	else{
	        		chkFornode=  findChildNodeRecursively(prevNode.childNodes[i],finalnode);
	        	}
	        }
	        if (chkFornode!=undefined){
	        	break;
	        }

	 }
	 return chkFornode;
}

function findChildNodeRecursively(childnode,finalnode) {

      var children= childnode.childNodes;
	 for(var j=0;j<children.length;j++){
			var child= children[j];
			if(child.className=='startNodefound'){
				finalnode=child;
				break;
			}
			else if(child.nodeType==1 && child.className!='startNodefound'){
				finalnode= findChildNodeRecursively(child,finalnode);
			}
		 }
	return finalnode;
}
function iterateChildNodeRecursively(childnode,pagenopresentatstart){

	 var children= childnode.childNodes;
	 for(var j=0;j<children.length;j++){
			var child= children[j];
			if($(child).attr("epub:type")=='pagebreak'){
				pagenopresentatstart=true;
				break;
				}
			else if(child.nodeType==1){
				pagenopresentatstart= iterateChildNodeRecursively(child,pagenopresentatstart);
			}
		 }
	 return pagenopresentatstart;
}

/*function getChapterWords(chapter,chapterkey, action){
	if(chapter!=null && chapter!="null") {
		chapter  = JSON.parse(chapter);
	    var htmlStr = chapter.content;

	    var scrollWidth = $("#epub_content").css("right");

	    if(scrollWidth.indexOf("px") != -1) {
	    	scrollWidth = scrollWidth.substring(0, scrollWidth.length-2);
	    }

	    var contentLenToScroll = 0;
	    if(chapterkey=='coverpage'){
	    	contentLenToScrollNew=0;
	    }
	    if(currentPosition != 0 && scrollWidth != 0) {

			$("#hidden_content").css('font-size', $("#epub_content").css('font-size'));
			$("#hidden_content").css('line-height', $("#epub_content").css('line-height'));
			$("#hidden_content").css('height', $("#epub_content").css('height'));
			$("#hidden_content").css('width', $("#epub_content").css('width'));

			var width = parseInt($('#epub_content').css('width'), 10);
			var padding = parseInt($('#hidden_content').css("padding-left"), 10) + parseInt($('#hidden_content').css("padding-right"), 10);

			var screenWidth = padding + width;

			var contentWidth = $("#epub_content")[0].scrollWidth;

			var percentageText = scrollWidth / contentWidth;

			contentLenToScroll =  Math.floor(htmlStr.length*percentageText);
			if(chapterkey=='coverpage'){
				contentLenToScroll=contentLenToScrollNew;
		    }

			$("#hidden_content").html(htmlStr.substring(0, contentLenToScroll));

		    var increment = 10;

		    var hiddenDivWidth = document.getElementById("hidden_content").scrollWidth;

		    if(hiddenDivWidth != screenWidth && hiddenDivWidth < scrollWidth) {
			    while(hiddenDivWidth < scrollWidth && contentLenToScroll < htmlStr.length) {
			    	var strtoappend = htmlStr.substring(contentLenToScroll, contentLenToScroll + increment);

			    	if(htmlStr.substring(contentLenToScroll-1309, contentLenToScroll).indexOf('src=')!= -1){
			    		//$("#hidden_content").append(strtoappend);
				    	//contentLenToScroll +=increment;
				    	hiddenDivWidth = document.getElementById("hidden_content").scrollWidth;
				    	counter = contentLenToScroll;

					    if(action=='highlight' || action=='note'){
					    	 return counter;
					    }else if(action=='justWords') {
					    	//This will return the previous page 100 chars also
					    	//check
					    	var startLoc;
					    	var offset= counter;
					    	if(counter!=0){
					    		 startLoc = counter+400;
					    	}
					    	else{
					    		 startLoc = counter;
					    	}
					    	var startLoc = counter+300;
					    	var endLoc = counter +2000;
					    	// alert("first  :"+countForPage+"startLoc :"+startLoc+"endLoc :"+endLoc);
					    	 if(countForPage !=undefined){
					    		  startLoc=  counter ;
				            	  endLoc= counter+countForPage*2000;
				              }
					    	 if(endLoc > htmlStr.length) {
						    		endLoc = htmlStr.length;
						    	}
					    	//var stringtoreturn = htmlStr.substring(startLoc, endLoc);
					    	//alert(stringtoreturn.substring(0,1000));
					    	 //this also return the offset for the page
					    	return htmlStr.substring(startLoc, endLoc+2000)+"~~"+offset;
					    	//check
					    } else if(action=='wordsForNextNPrev'){
					    	var startLoc = counter;
					    	var endLoc = counter + 2000;

					    	if(endLoc > htmlStr.length) {
					    		endLoc = htmlStr.length;
					    	}
					    	return htmlStr.substring(startLoc, endLoc+2000);
					    }
					    else {
					    	var bookmarkId = "bookmarkId" + (Math.floor(Math.random() * 90000) + 10000);
					    	////console.log("hidden string-----------------::" +htmlStr.substring(0,counter));
					    	return chapterkey+"~~"+bookmarkId+"~~"+counter+"~~"+htmlStr.substring(counter, counter+50);
					    }



			    	}
			    	else{
			    	$("#hidden_content").append(strtoappend);
			    	contentLenToScroll +=increment;
			    	hiddenDivWidth = document.getElementById("hidden_content").scrollWidth;
			    	}
			    }
		    } else if(hiddenDivWidth != screenWidth && hiddenDivWidth > scrollWidth) {
			    var decrement = 100;

			    while(hiddenDivWidth > scrollWidth && contentLenToScroll > 0) {
			    	var strtoappend = htmlStr.substring(0, contentLenToScroll - decrement);
			    	$("#hidden_content").html(strtoappend);
			    	contentLenToScroll -=decrement;
			    	hiddenDivWidth = document.getElementById("hidden_content").scrollWidth;
			    }

			    if(hiddenDivWidth != screenWidth && hiddenDivWidth < scrollWidth) {
				    while(hiddenDivWidth < scrollWidth && contentLenToScroll < htmlStr.length) {
				    	var strtoappend = htmlStr.substring(contentLenToScroll, contentLenToScroll + increment);
				    	$("#hidden_content").append(strtoappend);
				    	contentLenToScroll +=increment;
				    	hiddenDivWidth = document.getElementById("hidden_content").scrollWidth;
				    }
			    }
		    }

	    }

	    counter = contentLenToScroll;

	    if(action=='highlight' || action=='note'){
	    	 return counter;
	    } else if(action=='justWords') {
	    	//This will return the previous page 100 chars also
	    	//check
	    	var offset= counter;
	    	if(counter!=0){
	    		 startLoc = counter+400;
	    	}
	    	else{
	    		 startLoc = counter;
	    	}
	    	var endLoc = counter + 2000;
	    	// alert("second :"+countForPage);
	    	// alert("first  :"+countForPage+"startLoc :"+startLoc+"endLoc :"+endLoc);
	    	 if(countForPage !=undefined){
	    		  startLoc=  counter ;
           	  endLoc= counter+countForPage*2000;
             }
	    	if(endLoc > htmlStr.length) {
	    		endLoc = htmlStr.length;
	    	}
	    	//var stringtoreturn = htmlStr.substring(startLoc, endLoc);
	    	//alert(stringtoreturn.substring(0,1000));
	    	return htmlStr.substring(startLoc, endLoc+2000)+"~~"+offset;
	    	//check
	    }
	    else if(action=='wordsForNextNPrev'){
	    	var startLoc = counter;
	    	var endLoc = counter + 2000;

	    	if(endLoc > htmlStr.length) {
	    		endLoc = htmlStr.length;
	    	}
	    	return htmlStr.substring(startLoc, endLoc+2000);
	    }else {
	    	var bookmarkId = "bookmarkId" + (Math.floor(Math.random() * 90000) + 10000);
	    	////console.log("counter------------:"+ counter +"::"+htmlStr.substring(0,counter));
	    	return chapterkey+"~~"+bookmarkId+"~~"+counter+"~~"+htmlStr.substring(counter, counter+50);
	    }
	}
}
*/
var findSWpage;
var findSWchap;
findStartingWords = function(currentPage, chapterkey, action) {
	var dfd = $.Deferred();
	//get value of json key from local storage
	var chapter ;//= JSON.parse(GetFromLocalStorage(bookName+"#"+currentPage));

	if(findSWpage!=currentPage){
		GetFromDataStorage(bookName+"#"+currentPage).done(function (chap){
			findSWpage=currentPage;
			chapter=chap;
			findSWchap=chap;
			//content is take from local storage instead of epub_content div because the div content will have notes and highlights
			//but make sure to add extra spaces that are ed for pagination to calculate the scrollwidth, also subtract that number before saving the bookmark
			dfd.resolve(getChapterWords(chapter,chapterkey, action));
		});
	} else {
		chapter=findSWchap;
		dfd.resolve(getChapterWords(chapter,chapterkey, action));
	}
	return dfd.promise();
};

updateRealPageNum = function() {
	//check
	var dfd = $.Deferred();
	var pageC = null;
	//check
	//get value of json key from local storage
	var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage');
	if(chapterkey!=null) {
		//check

		findStartingWords(spine[chapterkey], chapterkey, "justWords").done(function(pc){

			//CheckForPrintedVersionAvailability().done(function(boolPrinted){
				var strs=pc.split("~~");
				pageC= pc;
			 var pageContent=strs[0];
			 var offset=strs[1];
			 var boolPrinted= strs[2];
			//check
			 if(pageContent.length < 120 || noVisibleContent(pageContent.substring(120, pageContent.length))) {
				    if(prevClicked) {
				    	prevClicked = false;
				    	//prevPageFunc();
				    	if(currentPosition!=-1){
				    	var nextPosition = 0;
				   	 nextPosition = currentPosition - 1;
				   	currentPosition = nextPosition;
				   	update_button_state();
				    	}
				   	//writeEbookMetaToLocal(userobj).done(function (){
				   		if(pageContent!=null) {
							if(pageContent.indexOf("custompage")!=-1){
							var PageNum = parseInt(pageContent.substring(pageContent.lastIndexOf("custompage")+10, pageContent.lastIndexOf("custompage")+14), 10);
							if(PageNum != 'NaN') {
								//store value of realPageNum in local storage
									SaveInLocalStorage(bookName+"#realPageNum",(PageNum));
									$('.page_no_field').val(PageNum);
									pagetojump=(PageNum);
									rePaintSlider((PageNum));
									showBookMarkIcon();
							//	selectPageNumInFooter(PageNum);
								// $('.page_no_field').val(PageNum);
							}
							}
							// if printed page number is present

				else if(boolPrinted=="true"){/*

			 if(pageContent.indexOf("epub:type=\"pagebreak\"")!=-1){
				 if(countForPage==undefined){
				    	var countForPage=1;
					}
				var pageNumber;
				var index= pageContent.indexOf("epub:type=\"pagebreak\"");
				var index2= pageContent.substring(pageContent.indexOf("epub:type=\"pagebreak\""),pageContent.length);
				if(index2.indexOf("<")!=-1){
					pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
				    if(pageNumber==""){
				    	var index3=index2.indexOf("title");
				    	var index4=index2.substring(index3,pageContent.length);
				    	var index5=index4.substring(index4.indexOf("\"")+1,pageContent.length);
				    	pageNumber=index5.substring(0,index5.indexOf("\""));
				    }
					SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
					$('.page_no_field').val(pageNumber);
					pagetojump=(pageNumber);
					rePaintSlider((pageNumber));
				}else{
					var page=GetFromLocalStorage(bookName+"#realPageNum");
					$('.page_no_field').val(page);
					pagetojump=(page);
					rePaintSlider((page));
				}
				//selectPageNumInFooter(pageNumber);
				// $('.page_no_field').val(pageNumber);
				//alert("inside this ");
			//	alert(pageNumber);

			 }
			 else{
				 var page=GetFromLocalStorage(bookName+"#realPageNum");
				 $('.page_no_field').val(page);
				 pagetojump=(page);
					rePaintSlider((page));
				 countForPage++;
				 if(countForPage<=3){
				 updateRealPageNum(countForPage);
				 }
			 }
			*/

					var pageNumber=null;
					 if(pageContent.indexOf("epub:type=\"pagebreak\"")!=-1){
						 var index= pageContent.lastIndexOf("epub:type=\"pagebreak\"");
							var index2= pageContent.substring(pageContent.lastIndexOf("epub:type=\"pagebreak\""),pageContent.length);
							// condition to check If Complete span containing page-break is not found in the pageContent
							if(index2.indexOf("<")!=-1){
						    pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
						    SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
							$('.page_no_field').val(pageNumber);
							pagetojump=(pageNumber);
							rePaintSlider((pageNumber));
							showBookMarkIcon();
							}
							else {
								var index= pageContent.indexOf("epub:type=\"pagebreak\"");
								var index2= pageContent.substring(pageContent.indexOf("epub:type=\"pagebreak\""),pageContent.length);
								if(index2.indexOf("<")!=-1){
								 pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
								 SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
									$('.page_no_field').val(pageNumber);
									pagetojump=(pageNumber);
									rePaintSlider((pageNumber));
									showBookMarkIcon();
								}
								else{
									 findPagenoRecursively(chapterkey).done(function(pageNumber){
			                             SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
			 							$('.page_no_field').val(pageNumber);
			 							pagetojump=(pageNumber);
										rePaintSlider((pageNumber));
										showBookMarkIcon();
			                             });
								}}
				}
				     else{
                          findPagenoRecursively(chapterkey).done(function(pageNumber){
                         SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
							$('.page_no_field').val(pageNumber);
							pagetojump=(pageNumber);
							rePaintSlider((pageNumber));
							showBookMarkIcon();
                         });
				     }
			}
							else{
								//get value of realPageNum from local storage
								var page=GetFromLocalStorage(bookName+"#realPageNum");
								//selectPageNumInFooter(page);
								// $('.page_no_field').val(page);
							}
							//check
							dfd.resolve(pageC);
							//check
						}
				   //	});


				    } else {
					    nextPageFunc().done(function(){
					    	if(pageContent!=null) {
								if(pageContent.indexOf("custompage")!=-1){
								var PageNum = parseInt(pageContent.substring(pageContent.lastIndexOf("custompage")+10, pageContent.lastIndexOf("custompage")+14), 10);
								if(PageNum != 'NaN') {
									//store value of realPageNum in local storage
										SaveInLocalStorage(bookName+"#realPageNum",(PageNum));
										$('.page_no_field').val(PageNum);
										pagetojump=(PageNum);
										rePaintSlider((PageNum));
										showBookMarkIcon();
									//selectPageNumInFooter(PageNum);
									// $('.page_no_field').val(PageNum);
								}
								}
								else if(boolPrinted=="true"){/*

								 if(pageContent.indexOf("epub:type=\"pagebreak\"")!=-1){
									 if(countForPage==undefined){
									    	var countForPage=1;
										}
									var pageNumber;
									var index= pageContent.indexOf("epub:type=\"pagebreak\"");
									var index2= pageContent.substring(pageContent.indexOf("epub:type=\"pagebreak\""),pageContent.length);
									if(index2.indexOf("<")!=-1){
										pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
									    if(pageNumber==""){
									    	var index3=index2.indexOf("title");
									    	var index4=index2.substring(index3,pageContent.length);
									    	var index5=index4.substring(index4.indexOf("\"")+1,pageContent.length);
									    	pageNumber=index5.substring(0,index5.indexOf("\""));
									    }
									   // alert("793 :"+pageNumber);
										SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
										$('.page_no_field').val(pageNumber);
										pagetojump=(pageNumber);
										rePaintSlider((pageNumber));
									}else{
										var page=GetFromLocalStorage(bookName+"#realPageNum");
										$('.page_no_field').val(page);
										pagetojump=(page);
										rePaintSlider((page));
									}
									//selectPageNumInFooter(pageNumber);
									// $('.page_no_field').val(pageNumber);
								 }
								 else{
									 countForPage++;
									 if(countForPage<=3){
									 updateRealPageNum(countForPage);
									 }
									 var page=GetFromLocalStorage(bookName+"#realPageNum");
									 $('.page_no_field').val(page);
									 pagetojump=(page);
										rePaintSlider((page));
								 }
								*/

									var pageNumber=null;
									 if(pageContent.indexOf("epub:type=\"pagebreak\"")!=-1){
										 var index= pageContent.lastIndexOf("epub:type=\"pagebreak\"");
											var index2= pageContent.substring(pageContent.lastIndexOf("epub:type=\"pagebreak\""),pageContent.length);
											// condition to check If Complete span containing page-break is not found in the pageContent
											if(index2.indexOf("<")!=-1){
										    pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
										    SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
											$('.page_no_field').val(pageNumber);
											pagetojump=(pageNumber);
											rePaintSlider((pageNumber));
											showBookMarkIcon();
											}
											else {
												var index= pageContent.indexOf("epub:type=\"pagebreak\"");
												var index2= pageContent.substring(pageContent.indexOf("epub:type=\"pagebreak\""),pageContent.length);
												if(index2.indexOf("<")!=-1){
												 pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
												 SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
													$('.page_no_field').val(pageNumber);
													pagetojump=(pageNumber);
													rePaintSlider((pageNumber));
													showBookMarkIcon();
												}
												else{
													 findPagenoRecursively(chapterkey).done(function(pageNumber){
							                             SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
							 							$('.page_no_field').val(pageNumber);
							 							pagetojump=(pageNumber);
														rePaintSlider((pageNumber));
														showBookMarkIcon();
							                             });
												}}
									}
								     else {
			                              findPagenoRecursively(chapterkey).done(function(pageNumber){
			                             SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
			 							$('.page_no_field').val(pageNumber);
			 							pagetojump=(pageNumber);
										rePaintSlider((pageNumber));
										showBookMarkIcon();
			                             });
								     }

								 /*if(pageContent.indexOf("epub:type=\"pagebreak\"")!=-1){
									 if(countForPage==undefined){
									    	var countForPage=1;
										}
									var pageNumber;
									var index= pageContent.indexOf("epub:type=\"pagebreak\"");
									var index2= pageContent.substring(pageContent.indexOf("epub:type=\"pagebreak\""),pageContent.length);
									if(index2.indexOf("<")!=-1){
								    pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
								    //alert("793 :"+pageNumber);
									SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
									$('.page_no_field').val(pageNumber);
									pagetojump=(pageNumber);
									rePaintSlider((pageNumber));
									}
									else{
										var page=GetFromLocalStorage(bookName+"#realPageNum");
										 $('.page_no_field').val(page);
										 pagetojump=(page);
											rePaintSlider((page));
									}
									//selectPageNumInFooter(pageNumber);
									// $('.page_no_field').val(pageNumber);
								 }
								 else{
									 countForPage++;
									 if(countForPage<=3){
									 updateRealPageNum(countForPage);
									 }
									 var page=GetFromLocalStorage(bookName+"#realPageNum");
									 $('.page_no_field').val(page);
									 pagetojump=(page);
										rePaintSlider((page));
								 }*/


								}
								else{
									//get value of realPageNum from local storage
									var page=GetFromLocalStorage(bookName+"#realPageNum");
									 $('.page_no_field').val(page);
									 pagetojump=(page);
										rePaintSlider((page));
										showBookMarkIcon();
									//selectPageNumInFooter(page);

								}
								//check
								 dfd.resolve(pageC);
							}
					    });
					    dfd.resolve(pageC);
				    }
				    dfd.resolve(pageC);
				}
			//check
			 else{
			 if(pageContent!=null) {
					if(pageContent.indexOf("custompage")!=-1){
					var PageNum = parseInt(pageContent.substring(pageContent.lastIndexOf("custompage")+10, pageContent.lastIndexOf("custompage")+14), 10);
					if(PageNum != 'NaN') {
						//store value of realPageNum in local storage
							SaveInLocalStorage(bookName+"#realPageNum",(PageNum));
							$('.page_no_field').val(PageNum);
							 pagetojump=(PageNum);
								rePaintSlider((PageNum));
								showBookMarkIcon();
						//selectPageNumInFooter(PageNum);
						// $('.page_no_field').val(PageNum);
					}
					}
					else if(boolPrinted=="true"){/*

					 if(pageContent.indexOf("epub:type=\"pagebreak\"")!=-1){
						 if(countForPage==undefined){
						    	var countForPage=1;
							}
						var pageNumber;
						var index= pageContent.indexOf("epub:type=\"pagebreak\"");
						var index2= pageContent.substring(pageContent.indexOf("epub:type=\"pagebreak\""),pageContent.length);
						if(index2.indexOf("<")!=-1){
							pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
						    if(pageNumber==""){
						    	var index3=index2.indexOf("title");
						    	var index4=index2.substring(index3,pageContent.length);
						    	var index5=index4.substring(index4.indexOf("\"")+1,pageContent.length);
						    	pageNumber=index5.substring(0,index5.indexOf("\""));
						    }
						//    alert("841 :"+pageNumber);
							SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
							$('.page_no_field').val(pageNumber);
							 pagetojump=(pageNumber);
								rePaintSlider((pageNumber));
						}else{
							var page=GetFromLocalStorage(bookName+"#realPageNum");
							$('.page_no_field').val(page);
							pagetojump=(page);
							rePaintSlider((page));
						}
						//selectPageNumInFooter(pageNumber);
					 }
					 else{
						 countForPage++;
						 if(countForPage<=3){
						 updateRealPageNum(countForPage);
						 }
						 var page=GetFromLocalStorage(bookName+"#realPageNum");
								 $('.page_no_field').val(page);
								 pagetojump=(page);
									rePaintSlider((page));
					 }
					*/

						var pageNumber=null;
						 if(pageContent.indexOf("epub:type=\"pagebreak\"")!=-1){
							 var index= pageContent.lastIndexOf("epub:type=\"pagebreak\"");
								var index2= pageContent.substring(pageContent.lastIndexOf("epub:type=\"pagebreak\""),pageContent.length);
								// condition to check If Complete span containing page-break is not found in the pageContent
								if(index2.indexOf("<")!=-1){
							    pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
							    SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
								$('.page_no_field').val(pageNumber);
								pagetojump=(pageNumber);
								rePaintSlider((pageNumber));
								showBookMarkIcon();
								}
								else {
									var index= pageContent.indexOf("epub:type=\"pagebreak\"");
									var index2= pageContent.substring(pageContent.indexOf("epub:type=\"pagebreak\""),pageContent.length);
									if(index2.indexOf("<")!=-1){
									 pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
									 SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
										$('.page_no_field').val(pageNumber);
										pagetojump=(pageNumber);
										rePaintSlider((pageNumber));
										showBookMarkIcon();
									}
									else{
										 findPagenoRecursively(chapterkey).done(function(pageNumber){
				                             SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
				 							$('.page_no_field').val(pageNumber);
				 							pagetojump=(pageNumber);
											rePaintSlider((pageNumber));
											showBookMarkIcon();
				                             });
									}}
								}
					         else{
                              findPagenoRecursively(chapterkey).done(function(pageNumber){
                             SaveInLocalStorage(bookName+"#realPageNum",(pageNumber));
 							$('.page_no_field').val(pageNumber);
 							pagetojump=(pageNumber);
							rePaintSlider((pageNumber));
							showBookMarkIcon();
                             });
					     }


					}
					else{
						//get value of realPageNum from local storage
						var page=GetFromLocalStorage(bookName+"#realPageNum");
						 $('.page_no_field').val(page);
						 pagetojump=(page);
							rePaintSlider((page));
							showBookMarkIcon();
					}
				}
			//check
			 dfd.resolve(pageC);
			//check
				}
			 //showBookMarkIcon();
		//});
			//check
		});
	}else{
		 dfd.resolve(pageC);

	}
	return dfd.promise();
	//showBookMarkIcon();
	// alert("end of updateRealPageNum");
	//check
};

function findPagenoRecursively(chapterKey){
	var pageNumber= null;
	 var dfd = $.Deferred();
   // var arrprintedpageNo= new Array();
	var indexOfCurrentChapter= spineIndex.indexOf(chapterKey);
	var previouskey = spineIndex[indexOfCurrentChapter-1];
	 var  currentPage = spine[previouskey];

	 if(indexOfCurrentChapter!=0){
		/*var previouskey = spineIndex[indexOfCurrentChapter-1];
		 var  currentPage = spine[previouskey];*/
		 GetFromDataStorage(bookName+"#"+currentPage).done(function (chapter){

				if(chapter==null || chapter=='null'){
					if(isConnected){
					$.ajax({
						type : 'POST',
						dataType : 'json',
						data : {
							fileName : fileLocation + currentPage,
							fileKey : currentPage,
							fileType : 'html'
						},
						url : baseurl1+'FileRequestServlet',
						async: false,
						success : function(data, textStatus) {
						var dataObj = decodeFileRequest(data);
							try{
								//store value of json key in local storage
								//SaveInDataStorage(bookName+"#"+dataObj.fileKey, JSON.stringify(dataObj)).done(function (){
									chapter = JSON.stringify(dataObj);
			  						//dfd.resolve(getChapterWords(JSON.stringify(dataObj),chapterkey, action));
								//});
								} catch(e) {
									 //console.log('catch error:' + e.name + ' e :' + e);
									  if(e.name === 'QuotaExceededError') {
										  //console.log('inside QuotaExceededError');
				              				try{
				              				//store value of json key in local storage
				              					//SaveInDataStorage(bookName+"#"+dataObj.fileKey, JSON.stringify(dataObj)).done(function (){
				              						chapter =JSON.stringify(dataObj);
				              						//dfd.resolve(getChapterWords(JSON.stringify(dataObj),chapterkey, action));
				            				//	});
				        					} catch(e) {
				    							console.log("UNABLE TO SAVE THE FILE IN LOCAL STORE " +e.name);
						        			}
									  }
								}
								 var chapCont = JSON.parse(chapter);
								 var chap = chapCont.content;
								 if(chap.indexOf("epub:type=\"pagebreak\"")!=-1){
									var index= chap.lastIndexOf("epub:type=\"pagebreak\"");
									var index2= chap.substring(chap.lastIndexOf("epub:type=\"pagebreak\""),chap.length);
								    pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
									//alert("743 :"+pageNumber);
								    if(pageNumber!=null){
								    	 dfd.resolve(pageNumber);
								     }
								    }
								     else{
								    findPagenoRecursively(previouskey).done(function(pageNumber){
								    		  dfd.resolve(pageNumber);
								    	 });
								     }
						}

					});
					}
					else{
						// TODO: in offline mode what needs to be done
						dfd.resolve(pageNumber);
					}
				}
				else{
				 var chapCont = JSON.parse(chapter);
				 var chap = chapCont.content;
				 if(chap.indexOf("epub:type=\"pagebreak\"")!=-1){
					console.log("inside true");
					var index= chap.lastIndexOf("epub:type=\"pagebreak\"");
					var index2= chap.substring(chap.lastIndexOf("epub:type=\"pagebreak\""),chap.length);
				    pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
					//alert("743 :"+pageNumber);
				    if(pageNumber!=null){
				    	 dfd.resolve(pageNumber);
				     }
				 }
				     else{
				    	  findPagenoRecursively(previouskey).done(function(pageNumber){
				    		  dfd.resolve(pageNumber);
				    	 });
				     }
				}
		  });

	 }
	 else{
		 var  currentPage = spine[chapterKey];
		 GetFromDataStorage(bookName+"#"+currentPage).done(function (chapter){
			   var chapCont = JSON.parse(chapter);
			    var chap = chapCont.content;
				 if(chap.indexOf("epub:type=\"pagebreak\"")!=-1){
						console.log("inside true");
						var index= chap.indexOf("epub:type=\"pagebreak\"");
						var index2= chap.substring(chap.indexOf("epub:type=\"pagebreak\""),chap.length);
					    pageNumber= index2.substring(index2.indexOf(">")+1,index2.indexOf("<"));
						//alert("743 :"+pageNumber);
					    if(pageNumber!=null){
					    	 dfd.resolve(pageNumber);
					     }
					 }
				 else{
					 dfd.resolve(pageNumber);
				 }

			  });

					 // TODO NO- page-break present- which page no to display?
	 }
	 return dfd.promise();
}


noVisibleContent = function(content) {
	/* Commented 02/24
	if(content.indexOf(">") < content.indexOf("<")) {
		content = "<dummy" + content;
	}
	$("#hidden_content").html(content);
    var hiddenDivWidth = document.getElementById("hidden_content").scrollWidth;
	var padding = parseInt($('#hidden_content').css("padding-left"), 10) + parseInt($('#hidden_content').css("padding-right"), 10);

    if(hiddenDivWidth == padding) {
    	 $('#hidden_content').html("");
        return true;
    }
    $('#hidden_content').html("");*/
	return false;
} ;

var pagetojump=0;
function rePaintSlider(val){
	if(isNaN(val)){
		var vals=  pagenavigationmap.indexOf(val.toLowerCase());
		if(vals ==-1){
			vals=  pagenavigationmap.indexOf(val.toUpperCase());
		}
		vals+=1;
	}
	else{
		var vals=  pagenavigationmap.indexOf(val.toString());
		vals+=1;
	}
	//console.log("repaintSlider :"+vals);

	if(val==pagetojump || (typeof(val) == "string" && typeof(pagetojump) == "string" && val.toLowerCase() == pagetojump.toLowerCase())){
		$( "#slider" ).slider({
			value: vals
		});
	}
}
//getNavFileList() called to get the counterForNonNumericNo when book loads
//getNavFileList();
/*$("#totalpages").text("/"+(parseInt(fileDetails["noOfPages"])-countPrintedNo));*/
function updateSliders(ui) {
	//$('#slider').slider();
	//$('#slider').val(parseInt(ui));
	//$('#slider').slider('refresh');
	//$('#slider').slider({ value: parseInt(ui) });
	// if ( ! ui) {
	//        return;
	 //   }
	//$('#slider').slider('option','value',ui);
	//ui=0;
	//$("#slider").val(parseInt(ui)).slider("refresh");
};
function jumpToPage(actualpage){ // Code Updated for Performance Issue - 02/24
	//updateSliders(actualpage);
	rePaintSlider((actualpage));
	//maxpage= parseInt(fileDetails["noOfPages"]);
	//maxpage=maxpage-counterForNonNumericNo;
	//alert('success');
	// alert($('.page_no_field').val());
	/*if(maxpage<actualpage){
   //alert("Enter number less than "+ maxpage);
		$('.page_no_field').val(maxpage);
		$(".page_no_field").trigger(e);
	}*/

	var htmlfileName;
	var htmlFileKey;
	var xmlDOM;
	var isEmpty = function(obj) {
		  return Object.keys(obj).length === 0;
		};
	if(pagenavmap == null || isEmpty(pagenavmap) || pagenavmap==undefined ) {
		for(x in spine){
			if(x=='pagenav'){
			htmlfileName=spine[x];
			htmlFileKey=spine[x];
			}
		}

		//get value of json key from local storage
		//var pagenavxml = JSON.parse(GetFromLocalStorage(bookName+"#"+"navfile.xhtml"));
        pagenavmap = new Object();
        try{
        	xmlDOM = gDom;		}
		catch(e){
			GetFromDataStorage(bookName+"#"+"navfile.xhtml").done(function (pagenavxml){
                      xmlDOM = $.parseXML(JSON.parse(pagenavxml).content);
                    });

		}
		$(xmlDOM).find('a').each(function(){
			pagenavmap[$(this).text()] = $(this).attr('href');
	    });
			}
	//var pageNumber = $(this).text();
	if(pagenavmap[actualpage]!=undefined){
		// added to show  blank page till the page navigates to the intended location
		$("#wrapper").css("visibility", "hidden");
		$("#hidden_content").css("visibility", "visible");
		$("#loading").css("visibility", "visible");
	loadChapterWithAnchor(pagenavmap[actualpage]).done(function(){
	//SaveInLocalStorage(bookName+"#realPageNum",actualpage);
	//$('.page_no_field').val(actualpage);
	updateRealPageNum().done(function(pc){
		  var strs= pc.split("~~");
		  var offset= strs[1];
		  offset= parseInt(offset);
		  var chapterHTML= strs[0];
		  getNodeName(chapterHTML,'first');
//	findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
		historyobj.addHistoryItem(userobj.ebook,offset,'pagination');
		writeHistoryToLocal(historyobj);
		//commented out on Jan 24
		//serversynchistorydata();
	//});
		 placeAllNoteIcon(null,pc);
			$("#loading").css("visibility", "hidden");
	  });
/*	findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
		historyobj.addHistoryItem(userobj.ebook,offset,'paginatorNavigation');
		writeHistoryToLocal(historyobj);*/
		//commented out on Jan 24
		//serversynchistorydata();

	//store value of realPageNum in local storage

	//selectPageNumInFooter(actualpage);
	// $('.page_no_field').val(actualpage);
	//showBookMarkIcon();


	});
	/*$("#wrapper").css("visibility", "visible");
	$("#hidden_content").css("visibility", "hidden");*/
	}
	else{
	//26/12
		/*$('.page_no_field').val(maxpage);
		 pagetojump=(maxpage);
			rePaintSlider((maxpage));*/
		var page=GetFromLocalStorage(bookName+"#realPageNum");
		$('.page_no_field').val(page);
		 pagetojump=(page);
			rePaintSlider((page));
	//**
		$(".page_no_field").trigger(e);
	}

}

//$('<p>Text to be added</p>').appendTo('.highlightNote');
$(".page_no_field").keyup(function (e) {
    if (e.keyCode == 13) {
   	 actualpage= $('.page_no_field').val();
 	pagetojump=(actualpage);
   	jumpToPage(actualpage);
   // $("#slider").slider('option', 'value', actualpage);
  //  $("#slider").slider('moveTo',50,true);

   }
});

flag2= false;
function updateSliderLabels(ui, valueLabels) {
    if (!ui.values)
        ui.values = [ui.value];
    // need to be able to determine which of the handles actually changes
    var index = $.inArray(ui.value, ui.values);
    var myAlign = index == 0 ? "right" : "left";
    var atAlign = index == 0 ? "left" : "right";
        $(valueLabels[index])
            .position({
                my: myAlign + " bottom",
                at : atAlign + " top",
                of: ui.handle
                })
            .text(ui.value);
        return;
}
/*$( "#slider" ).slider({
	    range: false,
	    min: 0,
	    max:fileDetails["noOfPages"]-1,
	    slide: function(event, ui) {

	        $('.page_no_field').val(pagenavigationmap[ui.value]);
	            },
	        change : function(event, ui) {
	        	jumpToPage(pagenavigationmap[ui.value]);

	            }

	});*/

/*function paintPaginator(selectedPage) { // Commented - 02/24 Performance Issue
	var bottomRibbon = $("#bottom-ribbon");
	if($(bottomRibbon) && $(bottomRibbon).css("display")!= "none" && $(bottomRibbon).css("visibility") == "visible") {
		//do nothing, just maintain the current status
	} else {
		$("#bottom-ribbon").css("display","none");
		$("#bottom-ribbon").css("visibility","visible");
	}
	$(".paginator_p_bloc").html("");
	$("#pagntn").jPaginator({
        nbPages:fileDetails["noOfPages"],
        selectedPage:selectedPage,
        overBtnLeft:'#pagntn_o_left',
        overBtnRight:'#pagntn_o_right',
        maxBtnLeft:'#pagntn_m_left',
        maxBtnRight:'#pagntn_m_right',
        minSlidesForSlider:10,
        marginPx:3
    });
	$(".paginator_p.selected").removeClass("selected");
	var noOfPagesVisible=$(".paginator_p").length;
	for(var i=0;i<noOfPagesVisible;i++){
		var pageNo=$(".paginator_p").get(i).innerHTML;
		if(pageNo==selectedPage){
			var elem = $(".paginator_p").get(i);
				$(elem).addClass("selected");
				painted=true;
				break;
		}
	}
	var screenWidth = $(document).width();
	$("#paginator_slider").css("width",screenWidth*0.8);

	$('.paginator_p').click(function() {
		var pageNumber = $(this).text();
		//console.log("pageNumber:"+pageNumber);
		findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offvalue){
		historyobj.addHistoryItem(userobj.ebook,offvalue,'paginator');
		writeHistoryToLocal(historyobj);
		//commented out on jan 24
		//serversynchistorydata();
		var htmlfileName;
		var htmlFileKey;
		var xmlDOM;
		var isEmpty = function(obj) {
			  return Object.keys(obj).length === 0;
			};

			//GetFromDataStorage(bookName+"#"+"navfile.xhtml").done(function (pagenavmap){
				////console.log("pagemap:"+pagenavmap);
				//pagenavmap  = $.parseJSON(pagenavmap);
				if(pagenavmap == null  || isEmpty(pagenavmap)|| pagenavmap==undefined ) {
					for(x in spine){
						if(x=='pagenav'){
						htmlfileName=spine[x];
						htmlFileKey=spine[x];
						}
					}

					//get value of json key from local storage
					GetFromDataStorage(bookName+"#navfile.xhtml").done(function (pageXml){
						var pagenavxml = JSON.parse(pageXml);
			            pagenavm = new Object();
			            try{
							xmlDOM = $.parseXML(pagenavxml.content);
							}
							catch(e){
								var dataForNav=ajaxCallForNavFile(fileLocation,htmlfileName,htmlFileKey);
								var data=JSON.parse(dataForNav);
								//pagenavxml = dataForNav;
								 xmlDOM = $.parseXML(data.content);
							}
							$(xmlDOM).find('a').each(function(){
								pagenavm[$(this).text()] = $(this).attr('href');
						    });

							// added to show  blank page till the page navigates to the intended location
							$("#wrapper").css("visibility", "hidden");
							$("#hidden_content").css("visibility", "visible");
							//console.log("pagenavmap[pageNumber]:"+pagenavm[pageNumber])
							loadChapterWithAnchor(pagenavm[pageNumber]).done(function(){
								//store value of realPageNum in local storage
								SaveInLocalStorage(bookName+"#realPageNum",pageNumber);
								$('.page_no_field').val(pageNumber);
								pagetojump=(pageNumber);
								rePaintSlider((pageNumber));
							//	selectPageNumInFooter(pageNumber);
							//	 $('.page_no_field').val(pageNumber);
								showBookMarkIcon();
								updateRealPageNum().done(function(pc){
									 setTimeout(placeAllNoteIcon(null,pc),000);
								});
							    flag2= true;

							});

					});
				}


			});
			});
		}*/

var counterForNonNumericNo=0;
//added for Printed page number  addition  - ashit
function getNavFileList(){
	counterForNonNumericNo=0;
	var xmlDOM = getNavFile();
	 var  pagenav = new Array();
	$(xmlDOM).find('a').each(function(){
		pagenav[$(this).attr('href')] = $(this).text();
		var page = $(this).text();
		//alert(page);
		if(isNaN(page)){
			counterForNonNumericNo++;
		}
		//alert("size :"+getSize(pagenavmapArray));
 });
	return pagenav;
}

//get the navfile.xhtml from local
function getNavFile(){
	var htmlfileName;
	var htmlFileKey;
	var xmlDOM;
	for(x in spine){
		if(x=='pagenav'){
		htmlfileName=spine[x];
		htmlFileKey=spine[x];
		}
	}
	//var pagenavxml = JSON.parse(GetFromLocalStorage(bookName+"#"+"navfile.xhtml",1));
	GetFromDataStorage(bookName+"#"+"navfile.xhtml").done(function (pagenavxml){
	try{
		xmlDOM = $.parseXML(pagenavxml.content);
		}
		catch(e){
			var dataForNav=ajaxCallForNavFile(fileLocation,htmlfileName,htmlFileKey);
			var data=JSON.parse(dataForNav);
			//pagenavxml = dataForNav;
			 xmlDOM = $.parseXML(data.content);
		}
	});

		return xmlDOM;
}
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
			tocmap = new Object();
			var tocxmlDOM = $.parseXML(tocxml.content);
			$(tocxmlDOM).find('nav').each(function() {
				if ($(this).attr('epub:type') == 'page-list') {
					flag= true;
				}
			});
			dfd.resolve(flag);

		});
		return dfd.promise();

	}

/*function selectPageNumInFooter(pageNum) {  // Commented - 02/24
	if(pageNum != 'NaN') {
		var painted=false;
		$(".paginator_p.selected").removeClass("selected");
		var noOfPagesVisible=$(".paginator_p").length;
		for(var i=0;i<noOfPagesVisible;i++){
			var pageNo=$(".paginator_p").get(i).innerHTML;
			if(pageNo==pageNum){
				var elem = $(".paginator_p").get(i);
				if(elem) {
					$(elem).addClass("selected");
					painted=true;
					break;
				} else {
					paintPaginator(pageNum);
					painted=true;
					break;
				}
			}

		}
		if(painted==false){
			paintPaginator(pageNum);
			painted=true;
		}
}
}*/

var prevClicked = false;


$(window).resize(function() {
	 var temp=null;
	    for(temp in spine) {
			if(temp!='toc' && temp!='cover' && temp!='pagenav' && temp!='pageindex'){
				  fPage = spine[temp];
				  break;
			}
		}
	    //console.log('first page:'+fPage);
	    //console.log('current Page:'+currentPage);
	    if(fPage!=currentPage)
	    	{
	    		show_content_for_next();
	    	}
	//console.log($(window).width() +':'+ $(window).height());
	imageAlterSize();
});

function ajaxCallForNavFile(fileLocation,htmlFileName,htmlFileKey){
    if(isConnected){
	$.ajax({
		type : 'POST',
		dataType : 'json',
		data : {
			fileName : fileLocation+htmlFileName,
			fileKey : htmlFileKey,
			fileType : 'html'
		},
		url : baseurl1+ 'FileRequestServlet',
		complete : function(data, textStatus) {
				//if(data.fileKey=='pagenav'){
				var dataObj = decodeFileRequest(data);
				dataFromServer =(dataObj.responseText);
				//}

		}
		,async:false
	});
    }
	return dataFromServer;
}
//Numeric only control handler
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 ||
                key == 9 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

function nextButtonClicked(){ //Added - 02/24 Performance Issue
	//check
	nextPageFunc().done(function(){

	//TODO to be removed : when persistence of user's previously read page detail is added
		  updateRealPageNum().done(function(pc){
			  var strs= pc.split("~~");
			  var offset= strs[1];
			  offset= parseInt(offset);
			  var chapterHTML= strs[0];
			  getNodeName(chapterHTML,'first');
//			  var t1 = new Date();
//		findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
			historyobj.addHistoryItem(epubFileName,offset,'next');
			writeHistoryToLocal(historyobj);
//			  var t2 = new Date();
//			  alert("Time Taken by history " + (t2-t1));
			//commented out on Jan 24
			//serversynchistorydata();
		//});
			 placeAllNoteIcon(null,pc);
		  });
	  //setTimeout(placeAllNoteIcon,100);
	  });

}

var pageNumEvent = new CustomEvent("updatePageNum", {
	detail : {
		message : "sdfsdf",
		time : new Date()
	},
	bubbles : true,
	cancelable : true
});

window.addEventListener("updatePageNum", function() {
	//store value of realPageNum in local storage
	  updateRealPageNum().done(function(pc){
		  var strs= pc.split("~~");
		  var offset= strs[1];
		  offset= parseInt(offset);
		  var chapterHTML= strs[0];
		  getNodeName(chapterHTML,'first');
//	findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
		historyobj.addHistoryItem(userobj.ebook,offset,'next');
		writeHistoryToLocal(historyobj);
		//commented out on Jan 24
		//serversynchistorydata();
	//});
		 placeAllNoteIcon(null,pc);
	  });
}, false);

function prevButtonClicked(){
	//check
	prevPageFunc().done(function(){
	prevClicked = true;

	  updateRealPageNum().done(function(pc){
		  var strs= pc.split("~~");
		  var offset= strs[1];
		  offset= parseInt(offset);
		  var chapterHTML= strs[0];
		  getNodeName(chapterHTML,'first');
//	findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
		historyobj.addHistoryItem(userobj.ebook,offset,'previous');
		writeHistoryToLocal(historyobj);
		//serversynchistorydata();
	//});
		 setTimeout(placeAllNoteIcon(null,pc),100);
	  });
	 // setTimeout(placeAllNoteIcon,100);
	});
	//alignFirstPage();
	//check
}

$(document).ready(function() {
	GetFromDataStorage(epubFileName+'#'+'json').done(function (data){
	update_button_state();
//Changes Related to IPAD Touch Navigation

		if($("#prev").css("visibility") == "hidden"){


		$('#content_pane').swipeleft(function(e, touch) {
				nextButtonClicked();
		});

		$('#content_pane').swiperight(function(e, touch) {
				prevButtonClicked();
		});
		}

//IPAD CHANGES TILL HERE

		$('#next').click(function() {
			nextButtonClicked();

		});

		$('#prev').click(function() {
			prevButtonClicked();
		});
		$("#zoomOut").click(function() {
			fontZoomOut().done(function(){
				updateRealPageNum().done(function(pc){
					 setTimeout(placeAllNoteIcon(null,pc),000);
				});
			});
		});
		$("#zoomIn").click(function() {
			fontZoomIn().done(function(){
				updateRealPageNum().done(function(pc){
					 setTimeout(placeAllNoteIcon(null,pc),000);
				});
			});
		});
		$("#settings_icon").click(function() {
			return false;
		});
		// close button of bookmark popup
		$("#background_overlay").click(function(){

			  $("#popup_container").fadeOut(400);
			  $("#search_container").fadeOut(400);
			  $("#message_container").fadeOut(400);
			  $("#history_container").fadeOut(400); // Prashanth N - Recent History Container
		      $('#historyArrow').fadeOut(400);	  /*UI cust suman*/
			  $(".arrow").fadeOut(400);//UICUST fort information Container:arsha
			  $("#info_container").fadeOut(400); // Prashanth N - Book Information Container
			  $("#background_overlay").fadeOut(400);
			  $("#helpdiv2").fadeOut(400);
			  $("#settings_container").fadeOut(400);
			  $("#indexContainer").fadeOut(400);
			  $("#noIndexMsg").fadeOut(400);
		});

});
});

function getNodeName(chapterHTML,requiredSubtopic){
	//alert(chapterHTML.substring(0,150));
	//check
	//chapterHTML=JSON.stringify(chapterHTML);
	//check
	var arrayOfIds=new Array();
	for(var c=0;;c++){
	arrayOfIds[c]=chapterHTML.match('id="[a-zA-Z0-9\-_#.\.\(\)\/%&\s]+"');
	if(arrayOfIds[c]!=null){
	//alert(arrayOfIds[c]+"is "+c+"th");
	}
	if(arrayOfIds[c]!=undefined){
	chapterHTML=chapterHTML.substring(chapterHTML.indexOf(arrayOfIds[c])+arrayOfIds[c].length);
	//alert(chapterHTML);
	}
	else{
		arrayOfIds.pop();
		break;
	}
	}
	//TODO : Implemented to keep the old nodeName value in local storage in case none is found in the view
	//but change it to  get previous page contents
	//and search for id corresponding to toc href recursively
	//(paginator not setting nodeName properly becoz of this)
	//alert(arrayOfIds[0]);
	if(arrayOfIds[0]==null){
		return null;
	}
	//alert(arrayLength);
	if(requiredSubtopic=='first'){
		index=0;
	}
	else{

		index=arrayOfIds.length-1;
	}
//26/12
	/*objString=String(arrayOfIds[index]);
	objString=objString.substring(objString.indexOf("\"")+1,objString.indexOf("\"",objString.indexOf("\"")+1));
	var value=$.inArray(objString.toUpperCase(), listOfHrefs);*/
	var value=-1;
	for (i=0;i<=arrayOfIds.length-1;i++){
	if(value==-1)
		{
		objString=String(arrayOfIds[index]);
		objString=objString.substring(objString.indexOf("\"")+1,objString.indexOf("\"",objString.indexOf("\"")+1));
		value=$.inArray(objString.toUpperCase(), listOfHrefs);
		if(requiredSubtopic=='first'&& value!=-1){
			break;
		}
		index=index-1;
//		for(j=1;j<objString.length-1;j++)
//			{
//		if(value==-1)
//			{
//			value=$.inArray(objString.toUpperCase().substring(0,objString.length-j), listOfHrefs);
//			}
//
//		else
//			break;}
		}
	else{
		break;
	}
	}
//**
	if(value!=-1){
		//alert("yes it does");
	if(requiredSubtopic=='first'){
	SaveInLocalStorage(bookName+"#"+'subtopic',objString);
	}
	else{
		return objString;
	}
	}
	else{
		//alert("nopes !! :(");
	}
	//alert(GetFromLocalStorage(bookName+"#"+'subtopic',1));

}

function findRecentNode(htmlSelection,annotationId){
	var chapterHTML=$("#epub_content").html();

	var index=chapterHTML.indexOf('id=\"'+annotationId+'\">');
	var htmlBeforeAnn=chapterHTML.substring(0,index);

	return getNodeName(htmlBeforeAnn,'last');

}

function handleChildClick(){
	var s = document.getElementById("pageNumCheck").checked;
	showLocalPageNumber=s.toString();
	SaveInLocalStorage("globalPageCheckBox",showLocalPageNumber);
	//setTimeout(placeAllPrintedPageNo,1000);
	$("#epub_content").contents().find("span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']").each(function(){
		var epub_type = $(this).attr('epub:type');
		if(epub_type=="pagebreak"){
			if(showLocalPageNumber=="true"){
        		$(this).css('display','block');
        		$(this).css('visibility','visible');
        		$(this).addClass('new_page_break');
			}else{
        		$(this).css('display','block');
        		$(this).css('visibility','hidden');
        		$(this).addClass('new_page_break');
        	}

		}

	});



}

