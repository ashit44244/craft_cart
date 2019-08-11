var blurred=false;
var stop=0;
function stopSearch()
{
stop=1;	
hideSearchingGif();
}
function showSearchingGif(){
	document.getElementById("searching").style.display = "block";
	document.getElementById("searching").style.zIndex = 999;
	document.getElementById("stopsearch").style.display = "block";
	 $("#search_container").css("width","505px");
}

function hideSearchingGif(){
	document.getElementById("searching").style.display = "none";
	document.getElementById("searching").style.zIndex = 0;
	document.getElementById("stopsearch").style.display = "none";
	 $("#search_container").css("width","488px");
}
$(document).ready(function() {

    $("#searchQuery").on('blur',function() {
    	blurred=true;
    });
    if(isConnected){
		$("#searchButton").css("display","inline");
		 $("#offsearchbuttons").css("display","none");
	}
	else{
		  $("#offsearchbuttons").css("display","block");
			$("#searchButton").css("display","none");
			 disableSearchButton();
			}
});

function locations(substring,string){
  var a=[],i=-1;
  substring= substring.toLowerCase();
  string=string.toLowerCase();
  while((i=string.indexOf(substring,i+1)) >= 0) a.push(i);
  return a;
}

var getElementByXpaths = function (pathdet) {
    return document.evaluate(pathdet, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};
var xpath='//div[@id="epub_content"]';
var keywordobj;
highnode=getElementByXpaths(xpath);
var term;
var offsets=[];
var offsetsWithHtml=[];
var curpos=0;
var extremes;
var valid;


$('#nextsearchoff').click(function() {
		if ($("#offlineSearch").is(':visible')) {
		  $("#offlineSearch").fadeOut(100);
	}
	
	
	if(document.forms[0].search.value!=""){
		if(blurred)
		{
		//load(baseurl1+'js/offlinesearch.js').thenRun(function(){
		removeSearchHighlight();
		blurred=false;
		//alert('Repeated call');
		searchOffline(document.forms[0].search,"next");
		
		//});
		}
	else{
		//alert('inside else');
	curpos=curpos+1;
	if(curpos<offsets.length){
	//alert(curpos);
	$("span.highlightSearchOffline").contents().unwrap();
	
	$("#epub_content").highlight(term, "offlineSearchHighlight", offsets[curpos],offsets[curpos]+term.length,"1","search");

		scrollChapter(null,offsets[curpos],null,null,"offlinesearch").done(function(){
			  updateRealPageNum().done(function(){});
				});

	}
	else{
		loadNextChapOffSearch();
		//alert('line 33:'+curpos);
		if(extremes == "end"){
			var key = spineIndex[0];
			  currentPage = spine[key];
			  loadChapters(currentPage, key, pageLength).done(function (){
				  searchOffline(keywordobj,"next");
			  });
			  extremes="";
		}
	}
	/*else{
		curpos=0;
		$("span.highlightSearchOffline").contents().unwrap();
		scrollChapter(null,offsets[curpos],null);
		$(highnode).highlight(term, "offlineSearchHighlight", offsets[curpos],offsets[curpos]+term.length,"1","search");
	}*/
	}
	}
	else
		{
		 var propertiesMap = getPropertiesMap();
		/*$("#tooltip").html("Please enter valid text to search");
		  $("#tooltip").show();
		  setTimeout(function () {
	          $("#tooltip").hide('slideUp');
	      }, 1000);*/
		var errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri;color: white;\">"+propertiesMap.empty_offline_search+"</div>";
		$("#offlineSearch").html(errorstring);
		$("#search_container").fadeIn(400);
		$("#offlineSearch").fadeIn(400);
		
		
		}
});
$('#prevsearch').click(function() {
	if ($("#offlineSearch").is(':visible')) {
		  $("#offlineSearch").fadeOut(100);
	}
	if(document.forms[0].search.value!=""){
		if(blurred)
		{
		//load(baseurl1+'js/offlinesearch.js').thenRun(function(){
		removeSearchHighlight();
		blurred=false;
		//alert('Repeated call');
		searchOffline(document.forms[0].search,"prev");
		
		//});
		}
	else{
		//alert('inside else');
	curpos=curpos-1;
	if(curpos>=0){
	//alert(curpos);
	$("span.highlightSearchOffline").contents().unwrap();
	
	$("#epub_content").highlight(term, "offlineSearchHighlight", offsets[curpos],offsets[curpos]+term.length,"1","search");

		scrollChapter(null,offsets[curpos],null,null,"offlinesearch").done(function(){
			  updateRealPageNum().done(function(){});
				});

	}
	else{
		loadPreChapOffSearch();
		//alert('line 33:'+curpos);
		if(extremes == "end"){
			var key = spineIndex[spineIndex.length-1];
			  currentPage = spine[key];
			  loadChapters(currentPage, key, pageLength).done(function (){
				  searchOffline(keywordobj,"prev");
			  });
			  extremes="";
		}
	}
	/*else{
		curpos=0;
		$("span.highlightSearchOffline").contents().unwrap();
		scrollChapter(null,offsets[curpos],null);
		$(highnode).highlight(term, "offlineSearchHighlight", offsets[curpos],offsets[curpos]+term.length,"1","search");
	}*/
	}
	}
else
	{
	var propertiesMap = getPropertiesMap();
	var errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri;color: white;\">"+propertiesMap.empty_offline_search+"</div>";
	$("#offlineSearch").html(errorstring);
	$("#search_container").fadeIn(400);
	$("#offlineSearch").fadeIn(400);
	}
});
function searchOffline(keyword,flag)
{/*
	if(!valid)
		{
		validateSearch(keyword.value).done(function(val){
			valid=val;
			alert("result "+ valid);
		});
		}
	if(valid){*/
		//alert("success");
//if(keyword.value!=""){
	keywordobj=keyword;
	curpos=0;
	term=keyword.value;
	
	//alert($( "#epub_content" ).text());
	$("#epub_content").find('title').remove();
	chapterString=$( "#epub_content" ).text();
	offsets=locations(keyword.value,chapterString);
	  var currentPage=GetFromLocalStorage(bookName + "#" + 'currentPage');
	  
	//GetFromDataStorage(bookName+"#"+spine[currentPage]).done(function(chap){
	    //var chapter = JSON.parse(chap);
	  //content is take from local storage instead of epub_content div because the div content will have notes and highlights
	  //but make sure to add extra spaces that are ed for pagination to calculate the scrollwidth, also subtract that number before saving the bookmark
	    /*console.log("chapter1111: "+chapter);
	    if(chapter!=null && chapter!="null") {
	     htmlStrs = chapter.content;
	    } else {
	          htmlStrs = $("#epub_content").html();
	    }*/
	//chaphtml=$( "#epub_content" ).html();
	//offsetsWithHtml=locations(keyword.value,htmlStrs);
	//alert(offsets.length);
	//alert(offsets);
	if(curpos==0 && offsets.length>0){
		$("span.highlightSearchOffline").contents().unwrap();
	
	curpos=0;
	$("#epub_content").highlight(keyword.value, "offlineSearchHighlight", offsets[0],offsets[0]+keyword.value.length,"1","search");
	scrollChapter(null,offsets[0],null,null,"offlinesearch").done(function(){
		  updateRealPageNum().done(function(){});
	});
	

	}
	else if(curpos==0 && offsets.length>0 && flag=="prev"){
		$("span.highlightSearchOffline").contents().unwrap();
	
	curpos=0;
	$("#epub_content").highlight(keyword.value, "offlineSearchHighlight", offsets[offsets.length-1],offsets[offsets.length-1]+keyword.value.length,"1","search");
	scrollChapter(null,offsets[offsets.length-1],null,null,"offlinesearch").done(function(){
		  updateRealPageNum().done(function(){});
	});
	

	}
	else if(offsets.length==0&&flag=="next")
		{
		$( "#nextsearchoff" ).click();
		}
	else if(offsets.length==0&&flag=="prev")
	{
	$( "#prevsearch" ).click();
	}
	//});
	/*}
	else
		{
		alert('no results found !');
		}
	}*/
/*}
else
	{
	$("#tooltip").html("Please enter valid text to search");
	  $("#tooltip").show();
	  setTimeout(function () {
          $("#tooltip").hide('slideUp');
      }, 1000);
	}*/}

function loadPreChapOffSearch(tempkey)
{
	if(stop==0){
		showSearchingGif();
	var ckey = GetFromLocalStorage(bookName + "#" + 'currentPage');
	if (tempkey != undefined && tempkey != "null") {
		ckey = tempkey;
	}
	var spineIndex = [];
	for ( var x in spine) {
		if (x != 'toc' && x != 'cover' && x != 'pagenav')
			spineIndex.push(x);
	}
	n = $.inArray(ckey, spineIndex);
	if (spineIndex[n - 1] != null) {
		ckey = spineIndex[n - 1];
		load_prev_chapter_offline(term, ckey).done(function(end) {
			//alert("result  "+end);
			if (end != "not found") {
				if (end == "end") {
					updateRealPageNum().done(function() {
						$("#tooltip").html("You reached end of the book");
						$("#tooltip").show();
						setTimeout(function() {
							$("#tooltip").hide('slideUp');
						}, 1000);
						// alert('No More search
						// result.. you reached
						// end of the book');
						extremes = "end";
						$("#epub_content").find('title').remove();
						chapterString = $("#epub_content").text();
						offsets = locations(keywordobj.value,chapterString);
						//curpos = offsets.length - 1;
						// return curpos;
					});
				} else {
					$("#epub_content").find('title').remove();
					chapterString = $("#epub_content").text();
					offsets = locations(keywordobj.value,
							chapterString);
					//curpos = offsets.length;
					// alert("prechapnext"+offsets.length);

					if (offsets.length != 0) {
						$("#epub_content").highlight(term,
								"offlineSearchHighlight",
								offsets[offsets.length-1],
								offsets[offsets.length-1] + term.length, "1",
								"search");

						scrollChapter(null, offsets[offsets.length-1], null,null, "offlinesearch").done(
							function() {
								updateRealPageNum().done(function() {curpos = offsets.length-1;});
							});
						hideSearchingGif();
						//return 0;

					} else {
						loadPreChapOffSearch();
					}
					//return curpos;
				}
			} else {
				loadPreChapOffSearch(ckey);
			}
		});
	} else {
		$("#tooltip").html("No more results");
		$("#tooltip").show();
		setTimeout(function() {
			$("#tooltip").hide('slideUp');
		}, 1000);
		hideSearchingGif();
		extremes = "end";

	}
	return curpos;
	}
	else
	{
	stop=0;
	}
}

function loadNextChapOffSearch(tempkey) {
	if(stop==0){
		showSearchingGif();
	var ckey = GetFromLocalStorage(bookName + "#" + 'currentPage');
	if (tempkey != undefined && tempkey != "null") {
		ckey = tempkey;
	}
	var spineIndex = [];
	for ( var x in spine) {
		if (x != 'toc' && x != 'cover' && x != 'pagenav')
			spineIndex.push(x);
	}
	n = $.inArray(ckey, spineIndex);
	if (spineIndex[n + 1] != null) {
		ckey = spineIndex[n + 1];
		load_next_chapter_offline(term, ckey).done(function(end) {
			if (end != "not found") {
				if (end == "end") {
					updateRealPageNum().done(function() {
						$("#tooltip").html("You reached end of the book");
						$("#tooltip").show();
						setTimeout(function() {
							$("#tooltip").hide('slideUp');
						}, 1000);
						// alert('No More search
						// result.. you reached
						// end of the book');
						extremes = "end";
						$("#epub_content").find('title').remove();
						chapterString = $("#epub_content").text();
						offsets = locations(keywordobj.value,chapterString);
						//curpos = offsets.length - 1;
						// return curpos;
					});
				} else {
					$("#epub_content").find('title').remove();
					chapterString = $("#epub_content").text();
					offsets = locations(keywordobj.value,
							chapterString);
					//curpos = offsets.length;
					// / alert("prechapnext"+curpos);

					if (offsets.length != 0) {
						$("#epub_content").highlight(term,
								"offlineSearchHighlight",
								offsets[0],
								offsets[0] + term.length, "1",
								"search");

						scrollChapter(null, offsets[0], null,null, "offlinesearch").done(
							function() {
								updateRealPageNum().done(function() {curpos = 0;});
							});
						//return 0;
						hideSearchingGif();

					} else {
						loadNextChapOffSearch();
					}
					//return curpos;
				}
			} else {
				loadNextChapOffSearch(ckey);
			}
		});
	} else {
		$("#tooltip").html("No more results");
		$("#tooltip").show();
		setTimeout(function() {
			$("#tooltip").hide('slideUp');
		}, 1000);
		hideSearchingGif();

		extremes = "end";

	}
	return curpos;
	}
	else
	{
	stop=0;
	}
}



function validateSearch(phrase)
{
	var dfd = $.Deferred();
	for(var i=0;i<spineIndex.length;i++){
	  subject = spine[spineIndex[i]];
	  console.log(bookName+"#"+subject);
	  GetFromDataStorage(bookName+"#"+subject).done(function (chapCont){
			var chap = JSON.parse(chapCont);
			var finstring=removeElements(chap.content,"title");
			//alert(subject+" finstring");
			if(finstring.toLowerCase().indexOf(phrase.toLowerCase())!=-1)
				{
				alert("inside true");
				valid=true;
				 dfd.resolve(valid);
				}
			else
				{
				//alert("inside false");
				valid=false;
				
				}
	  });
	}
	
	dfd.resolve(valid);
	return dfd.promise();
}

function removeElements(text, selector) {
    var wrapped = $("<div>" + text + "</div>");
    wrapped.find(selector).remove();
    return wrapped.text();
}


$("#searchQuery").on("keydown keyup click",function(){
	if(!isConnected){
    if(!$("#searchQuery").val()){
    	disableSearchButton();
          return;
    }
    enableSearchButton();
	}
});

$("#resetLink").click(function(){
    $("#searchQuery").val("");
    disableSearchButton();
    if ($("#offlineSearch").is(':visible')) {
		  $("#offlineSearch").fadeOut(400);
	}
    $("#searchQuery").focus();
	 
});


function disableSearchButton(){
	$("#prevsearchDisabled").css("display","block");
    $("#nextsearchoffDisabled").css("display","block");
    $("#prevsearch").css("display","none");
    $("#nextsearchoff").css("display","none");
    $("#resetDiv").css("display","none");
    
}

function enableSearchButton(){
	$("#prevsearchDisabled").css("display","none");
    $("#nextsearchoffDisabled").css("display","none");
    $("#prevsearch").css("display","block");
    $("#nextsearchoff").css("display","block");
    $("#resetDiv").css("display","inline");
}
function removeSearchHighlight(){

	$("#epub_content").find('span.highlightSearch').each(function() {
		                
			with (this.parentNode) {
				//with (this.parentNode) {
				var len= this.childNodes.length;
				var childnodes= this.childNodes;																
				//  scenario where single highlight is present	(no overlapping highlight over a highlight))						
				if(len<1){	
					var s="";
					if(this.firstChild.nodeType==1){
						s=s+this.firstChild.innerText;
					}
					else if(this.firstChild.nodeType==3){
						s=s+this.firstChild.data;
					}
					var txtnode=document.createTextNode(s);
				      replaceChild(txtnode, this);
				      normalize();
				}
				// scenario where overlapping highlight is present(higlight over a highlight)
				else{																	
			        var strs= "";
					for(var  i=0;i<len;i++){
						var cnodes = childnodes[i];
						if(cnodes.nodeType==3){
					 	strs= strs+cnodes.data;
						}
						else if (cnodes.nodeType==1){
							// adding the child highlights to an array used for deleting later 
							arr.push(cnodes);
							//strs= strs+cnodes.innerText;
							if(cnodes.nodeName=='A'){                                                           
								strs= strs+cnodes;
                                
                            }else{
                            	strs= strs+cnodes.innerText;
                            }
							
						}																			
					}
					// getting a textnode from the childnodes 
					for(var  i=0;i<len;i++){
						var node = childnodes[i];
						if(node.nodeType==3){
							textnode= node;
							break;
						}
						else if(node.nodeType==1){
							textnode= node;
							break;
						}
					}
					textnode.data= strs;
					replaceChild(textnode, this);
					normalize();																																		    									
				}
			}
		//}
		
	});

}