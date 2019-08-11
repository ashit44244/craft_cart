/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var selection = '';
var selObj;
var currentNote;
var currentFile;
var selection = false;
var touchCount = 0;
var tempsel;
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
var leftCoordinate;
var topCoordinate;
var historyobj;
//UI-Cust - Pravin
var currentTime= new Date();
//var annoMap = new Object();
//var arrayOfAnnotations=[]; 
//var chapterNameMap=new Object();
var windowResizeInfo=false;
var windowResizepopup=false;
var windowHistorypoup=false;
var hightlightMenuStopPropagation = false;
var historyobj;
var firstSearchResult="";


function createEbookHistoryMeta(userName,ebook) {
    var dfd = $.Deferred();
	historyMeta=readHistoryFromLocal(userName,ebook);
	// console.log('ebookmetadata :' + ebookmetadata);
	historyobj = new userHistoryEbook(userName, ebook);
	if (historyMeta != "NOT FOUND") {
		historyobj.History=historyMeta;

		
	}
	dfd.resolve();
	return dfd.promise();
}

function readHistoryFromLocal(userName, ebook) {
	historyMeta = GetFromLocalStorage(userName+'#history');
	if (historyMeta == null || historyMeta=="null") {
		return 'NOT FOUND';
	}
	if (typeof historyMeta == 'undefined' || historyMeta == 'undefined') {
		return 'NOT FOUND';
	} else {
		return JSON.parse(historyMeta);
	}
}   

function userHistoryEbook(userName, ebook) {
     this.History=new Object();
}

function writeHistoryToLocal(historymeta){
	var user = userobj.username;
	var book=userobj.ebook;
	SaveInLocalStorage(user+"#history",JSON.stringify(historymeta.History));
}

GetFromDataStorage(epubFileName+'#'+'json').done(function (json){
	json = json;
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
	toc = spine.toc;
});
// Added below for IPAD Simulator //

$("#epub_content").bind("touchstart", function(event) {
	endCoords = event.originalEvent.targetTouches[0];
	/* check */
	//Give Info That EPUB content page is being touched And to Show Highlight and Note Option
	//IPAD case
	if($(prev).css("visibility") == "hidden"){
	window.location  = 'ios:webToNativeCall';
	}
	/**/
});

$(function() {
	var iii = 0;
	document.addEventListener("selectionchange", function() {
		if (iii == 0) {
			// $("#epub_content").css("background-color", "red");
			selObj = window.getSelection();

			iii = 1;
		} else {
			// $("#epub_content").css("background-color", "green");
			iii = 0;
			selObj = window.getSelection();
		}

	}, false);

	$("#epub_content")
			.bind(
					"touchend",
					function(e) {

						if (selObj != '') {
							touchCount++;
							if (touchCount == 2 && selObj != '') {
								// alert(touchCount+selObj);
								if (window.getSelection) {

									if (selObj != '') {

										// alert('1');
										var range = document.createRange();
										range.setStart(selObj.anchorNode,
												selObj.anchorOffset);
										range.setEnd(selObj.focusNode,
												selObj.focusOffset);
										// selection start from an alphanumeric
										// & end
										// with alphanumeric (Both from middle
										// of word &
										// start of word)
										if (window.getSelection().toString()
												.charAt(0).match('[A-Za-z0-9]')
												&& (window
														.getSelection()
														.toString()
														.charAt(
																window
																		.getSelection()
																		.toString().length - 1)
														.match('[A-Za-z0-9]'))) {
											var backwards = range.collapsed;
											if (backwards) {
												window.getSelection()
														.removeAllRanges();
												// range.detach();
												return false;
											}
											range.detach();
											var endNode = selObj.focusNode, endOffset = selObj.focusOffset;
											selObj.collapse(selObj.anchorNode,
													selObj.anchorOffset);
											var direction = [];
											if (backwards) {
												direction = [ 'backward',
														'forward' ];
											} else {
												direction = [ 'forward',
														'backward' ];
											}
											selObj.modify("move", direction[0],
													"character");
											selObj.modify("move", direction[1],
													"word");
											selObj.extend(endNode, endOffset);
											selObj.modify("extend",
													direction[1], "character");
											selObj.modify("extend",
													direction[0], "word");
										} else {
											// selection start from an
											// alphanumeric &
											// end with non-alphanumeric (Both
											// from
											// middle of word & start of word)
											if ((window.getSelection()
													.toString().charAt(0)
													.match('[A-Za-z0-9]') && !(window
													.getSelection()
													.toString()
													.charAt(
															window
																	.getSelection()
																	.toString().length - 1)
													.match('[A-Za-z0-9]')))) {
												var backwards = range.collapsed;
												range.detach();
												if (backwards) {
													window.getSelection()
															.removeAllRanges();
													// range.detach();
													return false;
												}
												var endNode = selObj.focusNode, endOffset = selObj.focusOffset;
												selObj.collapse(
														selObj.anchorNode,
														selObj.anchorOffset);

												var direction = [];
												if (backwards) {
													direction = [ 'backward',
															'forward' ];
												} else {
													direction = [ 'forward',
															'backward' ];
												}
												selObj.modify("move",
														direction[0],
														"character");
												selObj.modify("move",
														direction[1], "word");
												selObj.extend(endNode,
														endOffset);
												selObj.modify("extend",
														direction[1], "word");
												selObj.modify("extend",
														direction[0], "word");
											}
											// selection start from an
											// non-alphanumeric
											// & end with alphanumeric (Both
											// from middle
											// of word & start of word)
											else if ((window
													.getSelection()
													.toString()
													.charAt(
															window
																	.getSelection()
																	.toString().length - 1)
													.match('[A-Za-z0-9]'))
													&& !(window.getSelection()
															.toString().charAt(
																	0)
															.match('[A-Za-z0-9]'))) {
												var backwards = range.collapsed;
												if (backwards) {
													window.getSelection()
															.removeAllRanges();
													// range.detach();
													return false;
												}
												range.detach();
												var endNode = selObj.focusNode, endOffset = selObj.focusOffset;
												selObj.collapse(
														selObj.anchorNode,
														selObj.anchorOffset);
												var direction = [];
												if (backwards) {
													direction = [ 'backward',
															'forward' ];
												} else {
													direction = [ 'forward',
															'backward' ];
												}
												selObj.modify("move",
														direction[1],
														"character");
												selObj.modify("move",
														direction[0], "word");
												selObj.extend(endNode,
														endOffset);
												selObj.modify("extend",
														direction[1], "word");
												selObj.modify("extend",
														direction[0], "word");
											}
										}
									}
									selection = window.getSelection()
											.toString();
									if (selObj.rangeCount) {
										var container = document
												.createElement("div");
										for ( var i = 0, len = selObj.rangeCount; i < len; ++i) {
											container.appendChild(selObj
													.getRangeAt(i)
													.cloneContents());
										}
										html = container.innerHTML;

									}
								} else if ((selObj = document.selection)
										&& selObj.type != "Control") {
									var textRange = selObj.createRange();
									if (range.collapsed) {
										// range.detach();
										window.getSelection().removeAllRanges();
										return false;
									}
									if (textRange.text) {
										textRange.expand("word");
										while (/\s$/.test(textRange.text)) {
											textRange.moveEnd("character", -1);
										}
										textRange.select();
									}
									selection = document.selection
											.createRange().text;
									html = document.selection.createRange().htmlText;
								}

							}
							var anchorOffset = selObj.anchorOffset;
							var focusOffset = selObj.focusOffset;

							if ((anchorOffset != focusOffset)
									&& touchCount == 2) {
								tempsel = $.extend(true, {}, selObj);
								/*For LN Menu */
								constructAndShowNotesHighlightCopyMenu();
								/*$('.context-menu-one').contextMenu({
									x : endCoords.pageX,
									y : endCoords.pageY + 50
								});*/
								touchCount = 0;
								//return false;
							}
						}
					});
	/*For LN Menu */
	/*var Highlight=document.getElementById("highlight").value;
	var Note=document.getElementById("note").value;

	$.contextMenu({
		selector : '.context-menu-one',
		trigger : 'none',
		autoHide : true,
		callback : function(key, options) {
			if (key == 'highlight') {
				// alert(selObj);
				processSelectedText(selection, tempsel, key, html);
			} else if (key == 'note') {
				// alert("found"+selObj.anchorOffset);
				// var newObject = $.extend(true, {}, selObj);
				// alert(newObject.anchorOffset);
				showDialog(selection, tempsel, key);
			}

		},
		items : {
			"highlight" : {
				name : Highlight,
				icon : "cut"
			},
			"seperator1" : "-----",
			"note" : {
				name : Note,
				icon : "edit"
			}
		}
	});*/

	return false;
});

// Added above for IPAD Simulator //

$(function() {

	$('#epub_content')
			.mouseup(
					function(e) {
						hightlightMenuStopPropagation = true;
						if($("#hMenu").length>0){
							$("#hMenu").remove();
							$(".hMenuafter").remove();
							document.getSelection().removeAllRanges();
						}
						
						if (window.getSelection) {
							selObj = window.getSelection();
							if (!selObj.isCollapsed) {
								var range = document.createRange();
								range.setStart(selObj.anchorNode,
										selObj.anchorOffset);
								range.setEnd(selObj.focusNode,
										selObj.focusOffset);
								// selection start from an alphanumeric & end
								// with alphanumeric (Both from middle of word &
								// start of word)
								if (window.getSelection().toString().charAt(0)
										.match('[A-Za-z0-9]')
										&& (window
												.getSelection()
												.toString()
												.charAt(
														window.getSelection()
																.toString().length - 1)
												.match('[A-Za-z0-9]'))) {
									var backwards = range.collapsed;
									if (backwards) {
										window.getSelection().removeAllRanges();
										// range.detach();
										return false;
									}
									range.detach();
									var endNode = selObj.focusNode, endOffset = selObj.focusOffset;
									//26/12
									var startnode= selObj.anchorNode;
									selObj.collapse(selObj.anchorNode,
											selObj.anchorOffset);
									var direction = [];
									if (backwards) {
										direction = [ 'backward', 'forward' ];
									} else {
										direction = [ 'forward', 'backward' ];
									}
									selObj.modify("move", direction[0],
											"character");
									selObj.modify("move", direction[1], "word");
									selObj.extend(endNode, endOffset);
									selObj.modify("extend", direction[1],
											"character");
									selObj.modify("extend", direction[0],
											"character");
						//26/12
									// - 1/8
									// added for setting the focusNode correctly which was being set incorrectly while selecting text having startnode==endNode
									if(startnode==endNode){                                    
                                        selObj.focusNode=endNode;  
                                        // remove addition space from the content including &nbsp and enter spaces
                                        var data= endNode.data;
                                    	var len= data.length;
                                        var leftString= data.substring(endOffset,len);
                                        var l= leftString.indexOf(" ");
                                        // finallen will select all char of that word(extend till the end of word)
                                        var finalLen= endOffset+l+1;
                                        // if it is the last word of the node then l==-1
                                        if(l==-1){
                                              finalLen=len;
                                        }
                                        selObj.extend(endNode, finalLen);
                                        }	
									else{                                    
                                        selObj.focusNode=endNode;  
                                        // remove addition space from the content including &nbsp and enter spaces
                                        var data= endNode.data;
                                    	var len= data.length;
                                        var leftString= data.substring(endOffset,len);
                                        var l= leftString.indexOf(" ");
                                        // finallen will select all char of that word(extend till the end of word)
                                        var finalLen= endOffset+l+1;
                                        // if it is the last word of the node then l==-1
                                        if(l==-1){
                                              finalLen=len;
                                        }
                                        selObj.extend(endNode, finalLen);
                                        }		

								} else {
									// selection start from an alphanumeric &
									// end with non-alphanumeric (Both from
									// middle of word & start of word)
									if ((window.getSelection().toString()
											.charAt(0).match('[A-Za-z0-9]') && !(window
											.getSelection()
											.toString()
											.charAt(
													window.getSelection()
															.toString().length - 1)
											.match('[A-Za-z0-9]')))) {
										var backwards = range.collapsed;
										range.detach();
										if (backwards) {
											window.getSelection()
													.removeAllRanges();
											// range.detach();
											return false;
										}
										var endNode = selObj.focusNode, endOffset = selObj.focusOffset;
										selObj.collapse(selObj.anchorNode,
												selObj.anchorOffset);

										var direction = [];
										if (backwards) {
											direction = [ 'backward', 'forward' ];
										} else {
											direction = [ 'forward', 'backward' ];
										}
										selObj.modify("move", direction[0],
												"character");
										selObj.modify("move", direction[1],
												"word");
										selObj.extend(endNode, endOffset);
										selObj.modify("extend", direction[1],
												"word");
										selObj.modify("extend", direction[0],
												"character");
										selObj.focusNode=endNode;  
                                        // remove addition space from the content including &nbsp and enter spaces
                                        var data= endNode.data;
                                    	var len= data.length;
                                        var leftString= data.substring(endOffset,len);
                                        var l= leftString.indexOf(" ");
                                        // finallen will select all char of that word(extend till the end of word)
                                        var finalLen= endOffset+l+1;
                                        // if it is the last word of the node then l==-1
                                        if(l==-1){
                                              finalLen=len;
                                        }
                                        selObj.extend(endNode, finalLen);
										
									}
									// selection start from an non-alphanumeric
									// & end with alphanumeric (Both from middle
									// of word & start of word)
									else if ((window
											.getSelection()
											.toString()
											.charAt(
													window.getSelection()
															.toString().length - 1)
											.match('[A-Za-z0-9]'))
											&& !(window.getSelection()
													.toString().charAt(0)
													.match('[A-Za-z0-9]'))) {
										var backwards = range.collapsed;
										if (backwards) {
											window.getSelection()
													.removeAllRanges();
											// range.detach();
											return false;
										}
										range.detach();
										var endNode = selObj.focusNode, endOffset = selObj.focusOffset;
										selObj.collapse(selObj.anchorNode,
												selObj.anchorOffset);
										var direction = [];
										if (backwards) {
											direction = [ 'backward', 'forward' ];
										} else {
											direction = [ 'forward', 'backward' ];
										}
										selObj.modify("move", direction[1],
												"character");
										selObj.modify("move", direction[0],
												"word");
										selObj.extend(endNode, endOffset);
										selObj.modify("extend", direction[1],
												"word");
										selObj.modify("extend", direction[0],
												"character");
									}
								}
							}
							selection = window.getSelection().toString();
							if (selObj.rangeCount) {
								var container = document.createElement("div");
								for ( var i = 0, len = selObj.rangeCount; i < len; ++i) {
									container.appendChild(selObj.getRangeAt(i)
											.cloneContents());
								}
								html = container.innerHTML;
															
								/*For LN Menu */
								 range = selObj.getRangeAt(0).cloneRange();
						            if (range.getClientRects) {
						                range.collapse(true);
						                var rect = range.getClientRects()[0];
						                if(rect){
						                leftCoordinate = rect.left;
						                topCoordinate = rect.top;
						                }
						            }
							}
						} else if ((selObj = document.selection)
								&& selObj.type != "Control") {
							var textRange = selObj.createRange();
							if (range.collapsed) {
								// range.detach();
								window.getSelection().removeAllRanges();
								return false;
							}
							if (textRange.text) {
								textRange.expand("word");
								while (/\s$/.test(textRange.text)) {
									textRange.moveEnd("character", -1);
								}
								textRange.select();
							}
							selection = document.selection.createRange().text;
							html = document.selection.createRange().htmlText;
						}
						var anchorOffset = selObj.anchorOffset;
						var focusOffset = selObj.focusOffset;
/*check */
						if (anchorOffset != focusOffset || (anchorOffset == focusOffset && (selection!="") )) {	
/*check */
							e.preventDefault();
							tempsel = $.extend(true, {}, selObj);

							// alert('before menu');
							/*$('.context-menu-one').contextMenu({
								x : e.pageX,
								y : e.pageY
							});*/
							/*For LN Menu */
							
							constructAndShowNotesHighlightCopyMenu();
						}
					});
	/*$.contextMenu({
		selector : '.context-menu-one',
		trigger : 'none',
		autoHide : true,
		callback : function(key, options) {
			if (key == 'highlight') {
				processSelectedText(selection, tempsel, key, html);
			} else if (key == 'note') {
				// alert("found"+selObj.anchorOffset);
				// var newObject = $.extend(true, {}, selObj);
				// alert(newObject.anchorOffset);
				showDialog(selection, tempsel, key);
			}

		},
		items : {
			"highlight" : {
				name : "Highlight",
				icon : "cut"
			},
			"seperator1" : "-----",
			"note" : {
				name : "Note",
				icon : "edit"
			}
		}
	});*/

	return false;
});
//For LN Menu
var selectedRange;
function constructAndShowNotesHighlightCopyMenu(highlightOrDeleteHighlight, delHighlightId){
	selectedRange = window.getSelection().getRangeAt(0);
	//console.log("highlightOrDeleteHighlight = " + highlightOrDeleteHighlight + " delHighlightId = " + delHighlightId);
	//close the previous menu before opening a new menu
	$("#hMenu").remove();
	var bookName = window.location.pathname.split('/')[2];
	/*Remove highlight changes*/
	var highlightKey = 'removeHighlight';
	width = "160px";
	var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	if(highlightOrDeleteHighlight==undefined){		
		highlightOrDeleteHighlight = propertiesMap.highlight_text_menu;//document.getElementById("highlight").value;
		highlightKey = 'highlight';
		width = "130px";
	}
	var note = propertiesMap.note_text_menu;//document.getElementById("note").value;
	var copy = propertiesMap.copy_text_menu;//document.getElementById("copy").value;
	//var define = propertiesMap.define_text_menu;//document.getElementById("define").value;
	/*Horizontal menu */
	if(isiPhone()){
		var div = $("<div class ='horizontalMenu' id='hMenu'></div>");
		if (highlightKey == 'removeHighlight') {
			div.append("<div class ='horizontalMenuDiv' onclick='performHighlightOrShowNoteDialog(\""+highlightKey+"\",\""+delHighlightId+"\");'>"+highlightOrDeleteHighlight+"</div>");
		} else {
		//div.append("<div class ='horizontalMenuDiv' onclick='performHighlightOrShowNoteDialog(\"note\");'>"+note+"</div>");
		//div.append("<div class ='horizontalMenuDiv' onclick='performHighlightOrShowNoteDialog(\""+highlightKey+"\",\""+delHighlightId+"\");'>"+highlightOrDeleteHighlight+"</div>");
		//div.append("<div class ='horizontalMenuDiv' onclick='performHighlightOrShowNoteDialog(\"copy\");'>"+copy+"</div>");
		//div.append("<div class ='horizontalMenuDiv' >"+define+"</div>");
		}
		div.append('<span class="hMenuafter"></span>');
		$("#wrapper").append(div);
		//set the position based on window and content width()
		var winWidth = $(window).width();
		var contentWidth = $("#epub_content").width();
		var hMenuWidth = $("#hMenu").outerWidth();
		div.css('top', topCoordinate-$("#hMenu").outerHeight()-10);
		var hMenuHeight = $("#hMenu").height();
		if($("#top-ribbon").height() > topCoordinate-hMenuHeight){
			div.css('top', topCoordinate + hMenuHeight+5);
			$('.hMenuafter').css('top', -6);
			$('.hMenuafter').addClass('rotate');
		}
		if(winWidth>700){
			div.css('left', leftCoordinate);
			$('.hMenuafter').css('left', "6%");
			if((contentWidth-leftCoordinate) < hMenuWidth - 100){
				div.css('left', leftCoordinate - (hMenuWidth - (contentWidth - leftCoordinate ))) ;
				$('.hMenuafter').css('left', leftCoordinate-$("#hMenu").offset().left);
	
				if($('.hMenuafter').offset().left >= $('#hMenu').offset().left){
					div.css('left', $("#hMenu").offset().left + 100) ;
				}else if ($('.hMenuafter').offset().left < $('#hMenu').offset().left){
					div.css('left', $("#hMenu").offset().left - 25) ;
				}
				if(leftCoordinate-$("#hMenu").offset().left>0){
					$('.hMenuafter').css('left', leftCoordinate-$("#hMenu").offset().left);
				}
			}
		}
	}else{
		/*Vertical menu*/
		var div = $("<div class ='verticalMenu' id='hMenu'></div>");
		
		if (highlightKey == 'removeHighlight') {
			div.append("<div class ='verticalMenuDiv' onclick='performHighlightOrShowNoteDialog(\""+highlightKey+"\",\""+delHighlightId+"\");'><img src='/ePubReader/" + bookName + "/epubimages/Highlight-Icon_Grey.png'/>"+highlightOrDeleteHighlight+"</div>");
		} else {
			div.append("<div class ='verticalMenuDiv' onclick= 'performHighlightOrShowNoteDialog(\"note\");'><img src='/ePubReader/" + bookName + "/epubimages/Note-Icon-Grey.png'/>"+note+"</div>");
			div.append("<div class ='verticalMenuDiv' onclick= 'performHighlightOrShowNoteDialog(\""+highlightKey+"\",\""+delHighlightId+"\");'><img src='/ePubReader/" + bookName + "/epubimages/Highlight-Icon_Grey.png'/>"+highlightOrDeleteHighlight+"</div>");
			div.append("<div class ='verticalMenuDiv' onclick='performHighlightOrShowNoteDialog(\"copy\");'><img src='/ePubReader/" + bookName + "/epubimages/CopyIcon-Grey.png'/>"+copy+"</div>");
		}
		$("#wrapper").append(div);
		div.css('width', width);
		div.css('top', topCoordinate+30);
		div.css('left', leftCoordinate-30);
		var contentHeight = $("#epub_content").height();
		var hMenuHeight = $("#hMenu").height();
		if((contentHeight-(topCoordinate-$("#top-ribbon").height())) < hMenuHeight){
			div.css('top', topCoordinate-hMenuHeight-30);
		}
	}
	
	setTimeout(function (){
		hightlightMenuStopPropagation=false;
		}, 100);
}

function closeContextMenu(){
	$("#hMenu").remove();
	$("span.hMenuafter").remove();
}

function setContextMenuPosition(){
	$("#epub_content").trigger("mouseup");
}

//For LN Menu
function performHighlightOrShowNoteDialog(key, delHighlightId){
	//console.log("performHighlightOrShowNoteDialog = " + key + " delHighlightId = " + delHighlightId);
	var highlighttype = "highlight";
	if (key == 'highlight') {
		processSelectedText(selection, tempsel, key, html);
	} else if (key == 'note') {
		showDialog(selection, tempsel, key, html);
	} else if(key == 'removeHighlight') {
		userobj.deleteHighlight(delHighlightId + "~~" + highlighttype);
	} else if(key == 'copy'){
		var currentSelection = window.getSelection();
		currentSelection.removeAllRanges();
		currentSelection.addRange(selectedRange);
		processSelectedText(selection, tempsel, key, html);
	}
	closeContextMenu();
}

function showDialog(selection, selObj, key,html) {
	// alert("inside show dialog");
	// #dialogdiv needs to be created in the html wherever #epub_content is
	// created
	/*	$("#bottom-ribbon").css("visibility","hidden");
		$("#bottom-ribbon-invisible").css("visibility","hidden");
		var title=document.getElementById("notes").value;	
		var Save=document.getElementById("Save").value;
	*/
	/*Add note Changes*/
	var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	$("#mycontent").remove();	
	var dialogdiv = $("#dialogdiv");
	dialogdiv
			.dialog({
				width : 400,
				height : 180,
				autoOpen : false,
				modal : true,
				resizable: false,
				dialogClass: 'customPopup',
				buttons : [
						{
							text : propertiesMap.save_note,//$("#saveNote").val(),
							className : 'saveButtonClass',
							click : function() {
								var text = $('#note-body').val().trim();
								if (text == "") {
									$('.ui-dialog-buttonpane').append(
											"<div id='mycontent'></div>");
									$('#mycontent').css({
										"paddingLeft" : '7px',
										"paddingTop" : "4px"
									});
									$('#mycontent').text(
											propertiesMap.note_popup_placeholder)
											.css({
												"color" : "red",
												"font-size" : "14px"
											});
								}
								else if (!(text.indexOf('&') == -1 && text.indexOf('|') == -1 && text.indexOf(';') == -1 && text.indexOf('%') == -1 && text.indexOf('$') == -1 && 
										text.indexOf('@') == -1 && text.indexOf('"') == -1 && text.indexOf('\'') == -1 && text.indexOf('\\') == -1 && text.indexOf('\\\\') == -1)) {
									$('.ui-dialog-buttonpane').append(
											"<div id='mycontent'></div>");
									$('#mycontent').css({
										"paddingLeft" : '7px',
										"paddingTop" : "4px"
									});
									$('#mycontent').text(
											"Special characters not allowed")
											.css({
												"color" : "red",
												"font-size" : "14px"
											});
								} 
								else {
									window.parent.currentNote = text;
									// alert("selection::"+selection);
									// alert("selObj::"+window.parent.getSelection().anchorOffset);
									processSelectedText(selection, selObj, key,
											html);
									$("#mycontent").remove();
									// alert('closing');
									dialogdiv.dialog('close');
									if($("#hMenu").length > 0){
										document.getSelection().removeAllRanges();
									}
									/*Add note changes
									 * $("#bottom-ribbon").css("visibility","visible");
									$("#bottom-ribbon-invisible").css("visibility","visible");*/
								}
							}
						}, {
				 text: propertiesMap.cancel_note,//$("#cancel").val(),
				 className: 'cancelButtonClass',
				 click: function () {
				 dialogdiv.dialog('close');
				 }
				 }
				],

				open : function(event, ui) {
					var noteHtml = $('<div id ="noteContent"> <textarea id="note-body" cols="42" rows="8"></textarea></div>');
					$(this).html(noteHtml);
					$('#note-body').focus();
				}
			});
	 $("#dialogdiv").addClass('noteDialog');
	dialogdiv.dialog('open');
	return false;
}

var path = window.location.pathname;


var NODE_START_TEXT = "START";
var NODE_END_TEXT = "END";

var ebookmetadata;

// THis function should be called when user clicks on any ebook to read
function createEbookMetadata(userName, ebook) {
	var dfd = $.Deferred();
	// userobj = new userEbook(userName, ebook);
	// - 1/8
	readEbookMetaFromLocal(userName, ebook).done(function(ebookmdata){
		 ebookmetadata=(ebookmdata);
		 //historyMeta=readHistoryFromLocal(userName,ebook);
			// //console.log('ebookmetadata :' + ebookmetadata);
			// alert(JSON.stringify(ebookmetadata));
			if (ebookmetadata != "NOT FOUND") {
				userobj = new userEbook(userName, ebook);
				userobj.HighLights = ebookmetadata.HighLights;
				userobj.Notes = ebookmetadata.Notes;
				userobj.bookmarks = ebookmetadata.bookmarks;
				userobj.orphanHighLights = ebookmetadata.orphanHighLights;
				userobj.orphanNotes = ebookmetadata.orphanNotes;
				userobj.orphanBookmarks = ebookmetadata.orphanBookmarks;
			//26/12
				userobj.lastmodified = ebookmetadata.lastmodified;
				userobj.lastsynched = ebookmetadata.lastsynched;

				//userobj.History=historyMeta.History;
				dfd.resolve();
			}	
			else{
				GetFromDataStorage(userName + "#" + ebook).done(function(ebookmdata){
					ebookmetadata=JSON.parse(ebookmdata);
					//console.log('ebook meta data'+ebookmetadata);
					if (ebookmetadata != "NOT FOUND" && ebookmetadata != null) {
						userobj = new userEbook(userName, ebook);
						userobj.HighLights = ebookmetadata.HighLights;
						userobj.Notes = ebookmetadata.Notes;
						userobj.bookmarks = ebookmetadata.bookmarks;
						userobj.orphanHighLights = ebookmetadata.orphanHighLights;
						userobj.orphanNotes = ebookmetadata.orphanNotes;
						userobj.orphanBookmarks = ebookmetadata.orphanBookmarks;
				//26/12
						userobj.lastmodified = ebookmetadata.lastmodified;
						userobj.lastsynched = ebookmetadata.lastsynched;

						//userobj.History=historyMeta.History;
						dfd.resolve();
					}	
					//- 1/8
					else if(ebookmetadata == null){
						callServerData().done(function(){
							 readEbookMetaFromLocal(userName, ebook).done(function(ebookmdata){						
								 ebookmetadata=(ebookmdata);
								if(ebookmetadata != "NOT FOUND"){												
									userobj = new userEbook(userName, ebook);
									userobj.HighLights = ebookmetadata.HighLights;
									userobj.Notes = ebookmetadata.Notes;
									userobj.bookmarks = ebookmetadata.bookmarks;
									userobj.orphanHighLights = ebookmetadata.orphanHighLights;
									userobj.orphanNotes = ebookmetadata.orphanNotes;
									userobj.orphanBookmarks = ebookmetadata.orphanBookmarks;
									userobj.lastmodified = ebookmetadata.lastmodified;
									userobj.lastsynched = ebookmetadata.lastsynched;
							}
								else{
									GetFromDataStorage(userName + "#" + ebook).done(function(ebookmdata){
											ebookmetadata=JSON.parse(ebookmdata);								
										 if (ebookmetadata !=null){
											 userobj = new userEbook(userName, ebook);
												userobj.HighLights = ebookmetadata.HighLights;
												userobj.Notes = ebookmetadata.Notes;
												userobj.bookmarks = ebookmetadata.bookmarks;
												userobj.orphanHighLights = ebookmetadata.orphanHighLights;
												userobj.orphanNotes = ebookmetadata.orphanNotes;
												userobj.orphanBookmarks = ebookmetadata.orphanBookmarks;
												userobj.lastmodified = ebookmetadata.lastmodified;
												userobj.lastsynched = ebookmetadata.lastsynched;
												//userobj.History=historyMeta.History;
												dfd.resolve();
										 }
										 
									 });
								}
								dfd.resolve();
								});

			
						});						
						
					}

				});
			
			}
	 
	 });
	 return dfd.promise();
}

function getSpineValue(value) {
	if (spine != null) {
		for (key in spine) {
			if (spine[key] == value)
				return key;
		}
	}
	return null;
}

// Call this method whenever a new file is loaded in div
function addChapterMetadataForNotes(fileName) {
	//xpath fix for note display icon when pagebreak occurs in note selection region
	//placeAllPrintedPageNo();
	var container = $("#epub_content");
	var containerName = container.attr("name");

	if (containerName != null)
		currentFile = containerName;
	else
		currentFile = getSpineValue(fileName);
	var action = 'note';
	
	var metadata = ebookmetadata.Notes;
	for ( var file in metadata) {
		if (currentFile == file || file.indexOf(currentFile) != -1) {
			var xpathMeta = metadata[file];
			for ( var xpath in xpathMeta) {
				var selNodes = $.xpath(xpath);
				var offsetArr = xpathMeta[xpath];

				for ( var i = 0; i < offsetArr.length; i++) {
					//26/12
					/*if (selNodes.length > 0) {*/
					if (selNodes.length > 0 && offsetArr[i].deleteFlag=='F' ) {
						$(selNodes[0]).highlight(offsetArr[i].text, action,
								offsetArr[i].start, offsetArr[i].end,
								offsetArr[i].id);
					} else {
						if( offsetArr[i].deleteFlag=='F'){
						$(selNodes).highlight(offsetArr[i].text, action,
								offsetArr[i].start, offsetArr[i].end,
								offsetArr[i].id);
					}}
				}
			}
		}
	}
}

// Call this method whenever a new file is loaded in div
function addChapterMetadata(fileName) {
	var dfd = $.Deferred();
	var action = 'highlight';
	var container = $("#epub_content");
	var containerName = container.attr("name");

	if (containerName != null)
		currentFile = containerName;
	else
		currentFile = getSpineValue(fileName);

	// console.log('addChapterMetadata checking current file :' + currentFile);
	 readEbookMetaFromLocal(username, bookName).done(function (ebookmdata){
		 ebookmetadata=ebookmdata;
			var metadata = ebookmetadata.HighLights;
			// console.log("HighLights::"+JSON.stringify(metadata));

			for ( var file in metadata) {
				if (currentFile == file || file.indexOf(currentFile) != -1) {
					var xpathMeta = metadata[file];
					for ( var xpath in xpathMeta) {
						var selNodes = $.xpath(xpath);

						// console.log('xpath1:::::' + xpath);
						// console.log("addChapterMetadata Checking xpath js"+
						// $.xpath(xpath).text());
						var offsetArr = xpathMeta[xpath];
						for ( var i = 0; i < offsetArr.length; i++) {
					//26/12
							/*if (selNodes.length > 0) {*/
							if (selNodes.length > 0&&offsetArr[i].deleteFlag=='F') {
								$(selNodes[0]).highlight(offsetArr[i].text, action,
										offsetArr[i].start, offsetArr[i].end,
										offsetArr[i].id);
							} else {
						//26/12
								if(offsetArr[i].deleteFlag=='F'){
								$(selNodes).highlight(offsetArr[i].text, action,
										offsetArr[i].start, offsetArr[i].end,
										offsetArr[i].id);
							}}
						}
					}
				}
			}
			dfd.resolve(); 
	});
	 return dfd.promise();
}

// Ui-Cust - Pravin
userEbook.prototype.addHighLight = function(file, xpath, anchorOffset,
		focusOffset, highlightId, selection,selectedSubtopic) {
	// alert("Adding xpath:text"+xpath);
	
	/*var currentTime = new Date();
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	var month = month[currentTime.getMonth()];
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();*/
	var currentTime = new Date();
	var fullDate =currentTime.getTime();
	
	//get values of json keys from local storage
	var chapterkey = GetFromLocalStorage(bookName + "#" + 'currentPage');
	//10/2
	//var pageNumber = GetFromLocalStorage(bookName + "#realPageNum");
	findAnnotatedPage(xpath,anchorOffset).done(function(temp){
		pageNumber=temp;
		//alert(pageNumber);
	
	
	if(pageNumber==""||pageNumber==null||pageNumber==undefined||pageNumber=="null")
		{
		pageNumber=GetFromLocalStorage(bookName + "#" + 'realPageNum');
		}
	
	var subtopic = selectedSubtopic;
	var offset = 0;
	var fileMeta = userobj.HighLights;
	if (!(chapterkey in fileMeta)) {
		fileMeta[chapterkey] = new Object();
	}
	var xPathMeta = fileMeta[chapterkey];
	if (!(xpath in xPathMeta)) {
		xPathMeta[xpath] = new Array();
	}
	var chapName= getChapterName(chapterkey, subtopic);
	var value = new Object();
	value.id = highlightId;
	value.start = anchorOffset;
	value.end = focusOffset;
	value.text = selection;
	value.date = fullDate;
	value.offset = offset;
	value.pageNo = pageNumber;
	value.subtopic = subtopic;
      //26/12
  	value.deleteFlag= "F";
  	value.chapName=chapName;
     xPathMeta[xpath].push(value);
      //26/12
  	userobj.lastmodified=currentTime.getTime();
	});
};


/*userEbook.prototype.addHighLight = function(file, xpath, anchorOffset,
            focusOffset, highlightId, selection,selectedSubtopic) {
      // alert("Adding xpath:text"+xpath);
      //get values of json keys from local storage
      var chapterkey = GetFromLocalStorage(bookName + "#" + 'currentPage');
      var pageNumber = GetFromLocalStorage(bookName + "#realPageNum");
      var subtopic = selectedSubtopic;
    //var subtopic = GetFromLocalStorage(bookName + "#" + 'subtopic');
      var offset = 0;
      var fileMeta = userobj.HighLights;
      // alert("fileMeta::::"+fileMeta);
      if (!(chapterkey in fileMeta)) {
            // alert("inside if");
            fileMeta[chapterkey] = new Object();
      }
      var xPathMeta = fileMeta[chapterkey];
      if (!(xpath in xPathMeta)) {
            xPathMeta[xpath] = new Array();
      }
      var value = new Object();
      value.id = highlightId;
      value.start = anchorOffset;
      value.end = focusOffset;
      value.text = selection;
      value.date =new Date().getTime();
      value.offset = offset;
      value.pageNo = pageNumber;
      value.subtopic = subtopic;
      xPathMeta[xpath].push(value);
      
};*/
 
//UI-Cust -Pravin
userEbook.prototype.addNote = function(file, xpath, anchorOffset, focusOffset,
		currentNote, noteId, selection,selectedSubtopic) {
	/*var currentTime = new Date();
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	var month = month[currentTime.getMonth()];
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();*/
	var currentTime = new Date();
	var fullDate = currentTime.getTime();
	
	//get values of json keys from local storage
	var chapterkey = GetFromLocalStorage(bookName + "#" + 'currentPage');//localStorage.getItem(bookName + "#" + 'currentPage');
	//var subtopic = GetFromLocalStorage(bookName + "#" + 'subtopic');//localStorage.getItem(bookName + "#" + 'subtopic');
	var subtopic =selectedSubtopic;
	//10/2
	//var pageNumber = GetFromLocalStorage(bookName + "#realPageNum");//localStorage.getItem(bookName + "#realPageNum");

	findAnnotatedPage(xpath,anchorOffset).done(function(temp){
		pageNumber=temp;
		//alert(pageNumber);
	
	
	if(pageNumber==""||pageNumber==null||pageNumber==undefined||pageNumber=="null")
		{
		pageNumber=GetFromLocalStorage(bookName + "#" + 'realPageNum');
		}
	var chapName= getChapterName(chapterkey, subtopic);
	var offset = 0;
	//var fileMeta = this.Notes;
	var fileMeta = userobj.Notes;//10/2
	// alert("fileMeta::::"+fileMeta);
	if (!(chapterkey in fileMeta)) {
		// alert("inside if");
		fileMeta[chapterkey] = new Object();
	}
	var xPathMeta = fileMeta[chapterkey];
	if (!(xpath in xPathMeta)) {
		xPathMeta[xpath] = new Array();
	}
	var value = new Object();
	value.id = noteId;
	value.currentText = currentNote;
	value.start = anchorOffset;
	value.end = focusOffset;
	value.text = selection;
	value.date = fullDate;
	value.offset = offset;
	value.pageNo = pageNumber;
	value.subtopic = subtopic;
  //26/12
	value.deleteFlag= "F";
   value.chapName=chapName;
  xPathMeta[xpath].push(value);
  //26/12
	userobj.lastmodified=currentTime.getTime();

  // alert(JSON.stringify(fileMeta));
	});

};

/*userEbook.prototype.addNote = function(file, xpath, anchorOffset, focusOffset,
        currentNote, noteId, selection,selectedSubtopic) {

  //get values of json keys from local storage
  var chapterkey = GetFromLocalStorage(bookName + "#" + 'currentPage');//localStorage.getItem(bookName + "#" + 'currentPage');
  //var subtopic = GetFromLocalStorage(bookName + "#" + 'subtopic');//localStorage.getItem(bookName + "#" + 'subtopic');
  var subtopic =selectedSubtopic;
  var pageNumber = GetFromLocalStorage(bookName + "#realPageNum");//localStorage.getItem(bookName + "#realPageNum");
  var offset = 0;
  var fileMeta = this.Notes;
  // alert("fileMeta::::"+fileMeta);
  if (!(chapterkey in fileMeta)) {
        // alert("inside if");
        fileMeta[chapterkey] = new Object();
  }
  var xPathMeta = fileMeta[chapterkey];
  if (!(xpath in xPathMeta)) {
        xPathMeta[xpath] = new Array();
  }
  var value = new Object();
  value.id = noteId;
  value.currentText = currentNote;
  value.start = anchorOffset;
  value.end = focusOffset;
  value.text = selection;
  value.date =new Date().getTime();
  value.offset = offset;
  value.pageNo = pageNumber;
  value.subtopic = subtopic;
  xPathMeta[xpath].push(value);
  // alert(JSON.stringify(fileMeta));
};*/

/*
 * purpose of method - To add or Remove Bookmark where and what condition it
 * should get called - Whenever the user click the Add Bookmark button present
 * on the top Slider if any conditions inside then comment for that - if the
 * chaptername is not null or undefined it should Add Bookmark argument details -
 * null return types - null
 */
$("#bookMark").click(
	
		function() {
			var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
			//var remove_bookmark=propertiesMap.remove_bookmark_tooltip;//document.getElementById("removeBookmark").value;
			//var add_bookmark=propertiesMap.add_bookmark_tooltip;//document.getElementById("add_bookmark").value;
			var status = userobj.bookMarkChecker();
			//get values of json keys from local storage
			var chapterkey = GetFromLocalStorage(bookName + "#"+ 'currentPage');
			var subTopic = GetFromLocalStorage(bookName + "#" + 'subtopic');
			chapname = getChapterName(chapterkey, subTopic);
			if (chapname != null || chapname != undefined) {
				if (status == "Bookmarked") {
					userobj.removeBookmark();
					/* UI Cust suman */
					/*
					$('#bookMark img').attr('src',baseurl+'epubimages/icon_bookmark.png');
					*/
					$('#bookMark img').attr('src',baseurl+'epubimages/bookReadViewImagesNew/Bookmark-Off-Image.png');
					$('#bookMark img').attr('title', propertiesMap.add_bookmark_tooltip);
				} else {
					userobj.saveBookmark();
					/*UI Cust suman*/
					/*
					$('#bookMark img').attr('src',baseurl+'epubimages/icon_bookmark_active.png');
					*/
					$('#bookMark img').attr('src',baseurl+'epubimages/bookReadViewImagesNew/Bookmark-Image.png');
					$('#bookMark img').attr('title', propertiesMap.remove_bookmark_tooltip);

				}
			}
			writeEbookMetaToLocal(userobj).done(function (){
				//console.log('before updating bookmarks to server');
	//26/12
				/*serversynclocaldata().done(function (){
				//console.log('after updating bookmarks to server');	
				});	*/
			});
			
			
		});
/*
 * purpose of method - to get the size of an array where and what condition it
 * should get called - it is called in bookMarkChecker() method just to check
 * the if the size of array is not null if any conditions inside then comment
 * for that - argument details - Array whose size has to be calculated. return
 * types - Size of array
 */
function getSize(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
};
/*
 * purpose of method - To check if the Page is Bookmarked or not. where and what
 * condition it should get called - It is called when the user clicks on the Add
 * Bookmark button. if any conditions inside then comment for that - It will
 * check if the current page is already present in the bookmark list . argument
 * details - null. return types - Status of the current page.
 */
userEbook.prototype.bookMarkChecker = function() {
	var status;
	//get values of json key from local storage
	var currentPageno = GetFromLocalStorage(bookName + "#" + 'realPageNum');
	// alert("bookmarkchecker :"+currentPageno);
	var bookmarkMeta = userobj.bookmarks;
	var size = getSize(bookmarkMeta);
	// alert("bookMarkChecker()size :"+size);
	if (size != 0) {
		for ( var chapter in bookmarkMeta) {
			var chapterMeta = bookmarkMeta[chapter];
			for ( var index in chapterMeta) {
				var bookmark = chapterMeta[index];
				Pageno = bookmark.pageNo;
				// alert("checkerpgno"+Pageno);
				if (currentPageno == Pageno && bookmark.deleteFlag=='F') {
					// alert("inside if");
					status = "Bookmarked";

				}

			}

		}
	}
	// alert("status when checker called :"+status);
	return status;
};
/*
 * purpose of method - To Remove already bookmarked page from the list of
 * bookmark. where and what condition it should get called - If the user clicks
 * on Remove Bookmark (will appear only if the page is bookmarked)ie if the
 * Status="Bookmarked". if any conditions inside then comment for that - if
 * current page present in the bookmark list of current user argument details -
 * Null. return types - Null.
 */
userEbook.prototype.removeBookmark = function() {
	var indexremove;
	var pgno;
	//get values of json keys from local storage
	var chapterkey = GetFromLocalStorage(bookName + "#" + 'currentPage');
	var currentPageno = GetFromLocalStorage(bookName + "#" + 'realPageNum');
	// alert("inside removeBookmark():"+chapterkey+"--"+currentPageno);
	var bookmarkMeta = userobj.bookmarks;
	var size = getSize(bookmarkMeta);
	// alert("removeBookmark():size"+size);
	for ( var chapter in bookmarkMeta) {
		var chapterMeta = bookmarkMeta[chapter];
		for ( var index in chapterMeta) {
			var bookmark = chapterMeta[index];
			pgno = bookmark.pageNo;
			// alert("pageno: "+pgno);
			if (pgno == currentPageno) {
				indexremove = chapter;
					bookmark.deleteFlag= "T";
				bookmark.date=currentTime.getTime();
				// deleting with respect to the page no selected
				//var removeddata = bookmarkMeta[indexremove].splice(index, 1);
				// checking if no bookmark is present in the chap delete the
				// chapter also
			//	if (bookmarkMeta[indexremove].length == 0) {
			//		delete bookmarkMeta[indexremove];
			//	}
			}
		}
	}
	/*
	 * indexV = 0; var size = getSize(bookmarkMeta); for (i = 0; i < size; i++) {
	 * for ( var removechap in bookmarkMeta) { if (removechap == indexremove) {
	 * indexV = i; var removeddata = bookmarkMeta[indexremove].splice(indexV,
	 * 1); if (bookmarkMeta[indexremove].length == 0) { delete
	 * bookmarkMeta[indexremove]; } } } }
	 */
	// alert("bookmark removed successfully from Page");
	userobj.lastmodified=currentTime.getTime();
};
userEbook.prototype.removeBookmarkFromList = function(currPageno) {
	var resultPar=currPageno.split('~~');
	var indexremove;
	var pgno;
	var bookmarktype=resultPar[1];
	var bookmarkMeta;
	var currentPageno = resultPar[0];
	if(bookmarktype=='bookmark'){
	bookmarkMeta = userobj.bookmarks;
	}else{
		bookmarkMeta = userobj.orphanBookmarks;	
	}
	var size = getSize(bookmarkMeta);
	for ( var chapter in bookmarkMeta) {
		var chapterMeta = bookmarkMeta[chapter];
		for ( var index in chapterMeta) {
			var bookmark = chapterMeta[index];
			pgno = bookmark.pageNo;

			if (pgno == currentPageno) {
				indexremove = chapter;
				bookmark.deleteFlag= "T";
				bookmark.date=currentTime.getTime();
				// deleting with respect to the page no selected
			//	var removeddata = bookmarkMeta[indexremove].splice(index, 1);
				// checking if no bookmark is present in the chap delete the
				// chapter also
				//if (bookmarkMeta[indexremove].length == 0) {
				//	delete bookmarkMeta[indexremove];
				//}
			}
		}
	}
	userobj.lastmodified=currentTime.getTime();	
	/*
	 * indexV = 0; var size = getSize(bookmarkMeta); for (i = 0; i < size; i++) {
	 * for ( var removechap in bookmarkMeta) { if (removechap == indexremove) {
	 * indexV = i; var removeddata = bookmarkMeta[indexremove].splice(indexV,
	 * 1); if (bookmarkMeta[indexremove].length == 0) { delete
	 * bookmarkMeta[indexremove]; } } } }
	 */
	writeEbookMetaToLocal(userobj).done(function (){
		//serversynclocaldata().done(function (){
			//showBookMarks();
			showBookMarkIcon();
			refreshBookMarkView();
		//});	
	});
	
};
/*
 * purpose of method - Show Highlighted Bookmark Icon while Navigating by Next,
 * Previous , Paginaotor,TOC or List of Bookmark. where and what condition it
 * should get called - on click of next, previous, toc chapters, paginator and
 * List of Bookmark. if any conditions inside then comment for that - check if
 * the page is bookmarked or not. argument details - Null. return types - Null.
 */
function showBookMarkIcon() {
	var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	var status = userobj.bookMarkChecker();
	if (status == "Bookmarked") {
		/*UI Cust suman */
		/*
		$('#bookMark img').attr('src',
				baseurl+'epubimages/icon_bookmark_active.png');
		*/
		$('#bookMark img').attr('src',
				baseurl+'epubimages/bookReadViewImagesNew/Bookmark-Image.png');
		$('#bookMark img').attr('title', propertiesMap.remove_bookmark);
	}

	else {
		/*UI Cust suman */
		/*
		$('#bookMark img').attr('src',
				baseurl+'epubimages/icon_bookmark.png');
		*/
		$('#bookMark img').attr('src',
				baseurl+'epubimages/bookReadViewImagesNew/Bookmark-Off-Image.png');
		$('#bookMark img').attr('title', propertiesMap.add_bookmark);
	}
}
/*
 * purpose of method - To display pop up. where and what condition it should get
 * called - When User clicks on Show Bookmark. if any conditions inside then
 * comment for that - NA argument details - Null. return types - Null.
 */

// UI-Cust -Pravin
$("#show_bookmark").click(function() {
	$("#background_overlay").css('opacity', '0');
	$("#background_overlay").css('z-index', '0');
	//10/2
	/*if(Object.keys(tocmap).length==0){
		var tocxmlDOM = $.parseXML(topic.content);
		$(tocxmlDOM).find('nav').each(function() {
			if ($(this).attr('epub:type') == 'toc') {
				$(this).find('a').each(function() {
					tocmap[$(this).attr('href')] = $(this).text();

				});
			}
		//});
		});
		tocxmlDOM=$();
	}*/
	//showBookMarks();
	//showNotesInList();
	//showHighlightsInList();
	if ($("#popup_container").css('display') != 'none') {
		 $("#popup_container").fadeOut(400);
	 } else {
		 showAllAnnotations();
    }
	//showAllAnnotations();
});



/*function displayAnnotationList() {
	 //$("#background_overlay").css('opacity', '0');
	    showBookMarks();
	    showNotesInList();
	    showHighlightsInList();
	    arrayOfAnnotations=[];
	    for(key in annoMap){
	          arrayOfAnnotations.push(annoMap[key]);
	          console.log(x);
	    }
	    arrayOfAnnotations.sort(function(a,b) {
	        return b.date - a.date;
	    });
	    showAnnotationsInList();
	    positionPopup();
}*/

/**
 * functioanlity to hide Search container - if clicked outside.
 */
$(document).mouseup(function (e){
	
        var container = $("#popup_container");
if(!windowResizepopup){
        if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
           {
              container.fadeOut(400);
           }
}else{
	windowResizepopup=false;
}
});

$(document).mouseup(function (e){
    var container = $("#ann_search_container");
if(!windowResizepopup){
    if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
       {
          container.fadeOut(400);
       }
}else{
windowResizepopup=false;
}
});
/*
 * purpose of method - To Populate all Bookmarks Content . where and what $("#ann_search_container");
 * condition it should get called - When User clicks on Show Bookmark. if any
 * conditions inside then comment for that - argument details - Null. return
 * types - Null.
 */
/*showBookMarks = function() {

/*	$("#bookmarkcontent").html('');
	var bookmarkMap = {};
	bookmarkMap=userobj.populateAllBookMarkContent(bookmarkMap);
	bookmarkMap=userobj.populateAllOrphanBookMarkContent(bookmarkMap);
	console.log("map************"+JSON.stringify(bookmarkMap));
	var keys = Object.keys(bookmarkMap).sort();
	keys=keys.reverse();
	for(var key in keys){
	var keyvalue=keys[key];
	var keyobject=unescape(bookmarkMap[keyvalue]);
	$("#bookmarkcontent").append(keyobject);
	}*/
	/*userobj.populateBookMarkContent();
	userobj.populateOrphanBookMarkContent();
	$("#popup_container").fadeIn(400);
	//$("#background_overlay").fadeIn(1000);
	//$("#background_overlay").css('display', 'block');

	positionPopup();
	// showBookMarkedPage();
	return false;
};*/
showBookMarks = function() {

	$("#bookmarkcontent").html('');
	var bookmarkMap = {};
	bookmarkMap=userobj.populateAllBookMarkContent(bookmarkMap);
	bookmarkMap=userobj.populateAllOrphanBookMarkContent(bookmarkMap);
	
	var keys = Object.keys(bookmarkMap).sort();
	keys=keys.reverse();
	for(var key in keys){
	var keyvalue=keys[key];
	var keyobject=unescape(bookmarkMap[keyvalue]);
	$("#bookmarkcontent").append(keyobject);
	}
	/*userobj.populateBookMarkContent();
	userobj.populateOrphanBookMarkContent();
	$("#popup_container").fadeIn(1000);
	$("#background_overlay").fadeIn(1000);
	$("#background_overlay").css('display', 'block');

	positionPopup();*/
	// showBookMarkedPage();
	return false;
};

/*showHighlightsInList = function() {

	/*$("#highlightsContent").html('');
	var highlightMap = {};
	highlightMap=userobj.populateAllHighlightContent(highlightMap);
	highlightMap=userobj.populateAllOrphanHighlightContent(highlightMap);
	console.log("map************"+JSON.stringify(highlightMap));
	var keys = Object.keys(highlightMap).sort();
	keys=keys.reverse();
	for(var key in keys){
	var keyvalue=keys[key];
	var keyobject=unescape(highlightMap[keyvalue]);
	$("#highlightsContent").append(keyobject);
	}*/
	
	
	/*userobj.populateHighlightContent();
	//userobj.populateOrphanHighlightContent();
	
	// $("#popup_container").fadeIn(1000);
	// $("#background_overlay").fadeIn(1000);
	// $("#background_overlay").css('display','block');

	// positionPopup();
	//return false;
};*/
showHighlightsInList = function() {
	$("#highlightsContent").html('');
	var highlightMap = {};
	highlightMap=userobj.populateAllHighlightContent(highlightMap);
	highlightMap=userobj.populateAllOrphanHighlightContent(highlightMap);
	
	var keys = Object.keys(highlightMap).sort();
	keys=keys.reverse();
	for(var key in keys){
	var keyvalue=keys[key];
	var keyobject=unescape(highlightMap[keyvalue]);
	$("#highlightsContent").append(keyobject);
	}
	
	
	/*userobj.populateHighlightContent();
	userobj.populateOrphanHighlightContent();*/
	// $("#popup_container").fadeIn(1000);
	// $("#background_overlay").fadeIn(1000);
	// $("#background_overlay").css('display','block');

	// positionPopup();
	return false;
};
/*showNotesInList = function() {
/*check */
	/*$("#notesContent").html('');
	var notesMap = {};
	notesMap=userobj.populateNotesContent(notesMap);
	notesMap=userobj.populateAllOrphanNotesContent(notesMap);
	console.log("map************"+JSON.stringify(notesMap));
	var keys = Object.keys(notesMap).sort();
	keys=keys.reverse();
	for(var key in keys){
	var keyvalue=keys[key];
	var keyobject=unescape(notesMap[keyvalue]);
	$("#notesContent").append(keyobject);
	}*/
	
	/*userobj.populateNotesContent();
	userobj.populateOrphanNotesContent();

	// $("#popup_container").fadeIn(1000);
	// $("#background_overlay").fadeIn(1000);
	// $("#background_overlay").css('display','block');

	// positionPopup();
	return false;
};*/
showNotesInList = function() {
	$("#notesContent").html('');
	var notesMap = {};
	notesMap=userobj.populateAllNotesContent(notesMap);
	notesMap=userobj.populateAllOrphanNotesContent(notesMap);
	
	var keys = Object.keys(notesMap).sort();
	keys=keys.reverse();
	for(var key in keys){
	var keyvalue=keys[key];
	var keyobject=unescape(notesMap[keyvalue]);
	$("#notesContent").append(keyobject);
	}
	
	/*userobj.populateNotesContent();
	userobj.populateOrphanNotesContent();*/
	// $("#popup_container").fadeIn(1000);
	// $("#background_overlay").fadeIn(1000);
	// $("#background_overlay").css('display','block');

	// positionPopup();
	return false;
};
/*
 * purpose of method - To position the popup at the center of the page. where
 * and what condition it should get called - When User clicks on Show Bookmark.
 * if any conditions inside then comment for that - It checks if the popup is
 * hidden or displayed argument details - Null. return types - Null.
 */
function positionPopup() {
	/* UI-cust:arsha dynamic vertical resizing starts */

	if (!$("#popup_container").is(':visible')) {
		return;
	}
	
	if(!isiPhone()){/* resize only if its desktop */

		var windowHeight=$(window).height();
		var bottomRibbonHeight=$("bottom-ribbon").height();
		var topRibbonHeight=$("top-ribbon").height();
		var heightOfBook=windowHeight-bottomRibbonHeight-topRibbonHeight;
		var popupheight=(heightOfBook)/1.6-$("#popup_arrow").height();
		var maxHeight=$("#popup_container").css("max-height");
		var maxHeightAnnotationContent=$("#allannotationscontent").css("max-height");
		var  maxH=maxHeight.split("px");
		var popupMaxHeight=maxH[0];
		var paddingbottom=15;

		var calculatedPopupHeight=popupheight+paddingbottom;
		if(!((calculatedPopupHeight)>=popupMaxHeight)){			
			$("#popup_container").height(calculatedPopupHeight);
			var contentHeight=popupheight-$("#tabsHeading").height()-paddingbottom;
			// $("#tabsContent").height(contentHeight);
			$("#allannotationscontent").height(contentHeight);
		}
		else{// reataining the default properties
			$("#popup_container").height(maxHeight);
			$("#allannotationscontent").height(maxHeightAnnotationContent);			
			$("#tabsContent").css("margin-top","24px");
		}
	}

	/*UI-cust :vertical dynamic resizing ends-- arsha*/

	$("#popup_container").css({
		left : ($(window).width() - $('#popup_container').width()) / 2,
		// Ui-Cust -Pravin
		//top : ($(window).width() - $('#popup_container').width()) / 7,
		top : '101px',
		position : 'absolute'
	});
	$("#popup_arrow").css('left', $("#show_bookmark").offset().left - $("#popup_container").offset().left+$("#show_bookmark").width()/2-10);
	$("#tabsHeading").css({
		'width':parseInt($('#popup_container').width())-(parseInt($('#tabsHeading').css("margin-left"))+parseInt($('#tabsHeading').css("margin-right")))
		
	});


	$("#popup_arrow").css('left', $("#show_bookmark").offset().left - $("#popup_container").offset().left+$("#show_bookmark").width()/2-10);
	$("#tabsHeading").css({
		'width':parseInt($('#popup_container').width())-(parseInt($('#tabsHeading').css("margin-left"))+parseInt($('#tabsHeading').css("margin-right")))
		
	});
}

/* Maintain the popup at center of the page and avoid fadeout when browser resized*/

$( window ).resize(function() {
	if ($("#popup_container").is(':visible')) {
		windowResizepopup=true;
		positionPopup();
	}
	if ($("#info_container").is(':visible')) {
		windowResizeInfo = true;
		infoPositionPopup();
	}
	if ($("#history_container").is(':visible')) {
		windowHistorypoup=true;
		historyPositionPopup();
	}
});

showBookMarkedPage = function(bookMark) {
	//findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offsethistory){
		//historyobj.addHistoryItem(userobj.ebook,offsethistory,'popUpNavigation');
		//writeHistoryToLocal(historyobj);
		//serversynchistorydata();
	

	var strs = bookMark.split("~~");
	currentPage = strs[0];
	offset = strs[1];
	pgno = strs[2];
	subtopic = strs[3];
	//get value of json key from local storage
	var pageAlreadyLoaded = GetFromLocalStorage(bookName + "#" + 'currentPage');
	if (pageAlreadyLoaded != currentPage) {
		//store value of currentPage into local storage
		SaveInLocalStorage(bookName + "#" + 'currentPage', currentPage);
	}
	loadChapters(spine[currentPage], currentPage, offset).done(function(){
	
	//store value of subtopic into local storage
	SaveInLocalStorage(bookName + "#" + 'subtopic', subtopic);
	readEbookMetaFromLocal(username, epubFileName).done(function (ebookmdata){
	ebookmetadata=ebookmdata;
	scrollChapter(null, offset).done(function(){ // added for scroll to particular bookmark 14/2
	$("#popup_container").fadeOut(400);
	$("#background_overlay").css('display', 'none');
	//store value of realPageNum into local storage
	/*SaveInLocalStorage(bookName + "#realPageNum", (pgno));
	$('.page_no_field').val(pgno);
	pagetojump=(pgno);
	rePaintSlider((pgno));*/
	//selectPageNumInFooter(pgno);
	 //$('.page_no_field').val(pgno);
	//showBookMarkIcon();
    updateRealPageNum().done(function(pc){	
		 setTimeout(placeAllNoteIcon(null,pc),000);
		 var valuesReturned=pc.split('~~');
		 var offset=valuesReturned[1];
		 historyobj.addHistoryItem(userobj.ebook,parseInt(offset),'popUpNavigation');
		 writeHistoryToLocal(historyobj);
	});
   // findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offsethistory2){
		//historyobj.addHistoryItem(userobj.ebook,offsethistory2,'popUpNavigation');
		//writeHistoryToLocal(historyobj);
		//serversynchistorydata();
    //});
	});
	});
	//return false;
	});
	//});
};

userEbook.prototype.showHighlight = function(highlightId) {
   	 //findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
		//historyobj.addHistoryItem(userobj.ebook,offset,'popUpNavigation');
	//	writeHistoryToLocal(historyobj);
		//serversynchistorydata();
	
	var xpath;
	var id = highlightId;
	var highlightMeta = userobj.HighLights;
	var found = false;
	for ( var chapter in highlightMeta) {
		var chapterMeta = highlightMeta[chapter];
		for ( var index in chapterMeta) {
			var highlight = chapterMeta[index];
			for ( var count in highlight) {
				if (highlight[count].id == id) {
					selection = highlight[count].text;
					subtopic = highlight[count].subtopic;
					// displaychapter = getChapterName(chapter, subtopic);
					offset = highlight[count].offset;
					xpath = index;
					currentPage = chapter;
					pageNo = highlight[count].pageNo;
					anchorOffset = highlight[count].start;
					found = true;
				}
				if (found == true) {
					break;
				}

			}
			if (found == true) {
				break;
			}
		}
	}
	//Changes added for page flickering, if present in same page
	//if($('.page_no_field').val()==pageNo){
	//		$("#popup_container").fadeOut(400);
	//		$("#wrapper").css("visibility", "visible");
	//	}else{
	//get value of json key from local storage
	//var pageAlreadyLoaded = GetFromLocalStorage(bookName + "#" + 'currentPage');
	// if (pageAlreadyLoaded != currentPage) {
	//localStorage.setItem(bookName + "#" + 'currentPage', currentPage);
	
	//store value of currentPage into local storage
	SaveInLocalStorage(bookName + "#" + 'currentPage', currentPage);
	$("#wrapper").css("visibility", "hidden");
	$("#hidden_content").css("visibility", "visible");
	loadChapters(spine[currentPage], currentPage).done(function(){
	// }
	//store value of subtopic into local storage
	SaveInLocalStorage(bookName + "#" + 'subtopic', subtopic);
	 readEbookMetaFromLocal(username, epubFileName).done(function (ebookmdata){
		 ebookmetadata=ebookmdata;
	setTimeout(function() {
		scrollChapterForOffset(null, offset, xpath, selection, anchorOffset,currentFile, id).done(function(){
		//findStartingWords(spine[GetFromLocalStorage(bookName + "#" + 'currentPage')],GetFromLocalStorage(bookName + "#" + 'currentPage'),'highlight').done(function(offset){
			//historyobj.addHistoryItem(userobj.ebook,offset,'popUpNavigation');
			//writeHistoryToLocal(historyobj);
			//serversynchistorydata();
		//
		// added for
	//}, 10); // scroll to
	// particular
	// highlight
	//store value of realPageNum in local storage
	/*SaveInLocalStorage(bookName + "#realPageNum", pageNo);
	$('.page_no_field').val(pageNo);
	pagetojump=(pageNo);
	rePaintSlider((pageNo));*/
	//selectPageNumInFooter(pageNo);
	// $('.page_no_field').val(pageNo);
	//showBookMarkIcon();
	$("#popup_container").fadeOut(400);
	$("#background_overlay").css('display', 'none');
	updateRealPageNum().done(function(pc){	
		//openNotesPopover(noteId); Commented 02/24	
		 setTimeout(placeAllNoteIcon(null,pc),000);
		 var valuesReturned=pc.split('~~');
		 var offset=valuesReturned[1];
		 historyobj.addHistoryItem(userobj.ebook,parseInt(offset),'popUpNavigation');
		 writeHistoryToLocal(historyobj);
	});

	//return false;
		//});
	 });}, 100);
      });
	});
	//}
	//});
};

/**
 * Close the Notes Popup if clicked outside.
 */
$(document).mouseup(function (e){
    var container = $("#notesDiv");
    if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
       {
          container.fadeOut(400);
          $("span.divBefore:not(.tocDivBefore)").fadeOut(400);
          $("#notesDiv").remove();
		  $("span.divBefore:not(.tocDivBefore)").remove();
		  $('span.highlightNote').css('text-decoration', 'none');
       }
});

function getNotePageNo(id) {
	var pageNo;
	var notesMeta = userobj.Notes;
	var found = false;
	for ( var chapter in notesMeta) {
		var chapterMeta = notesMeta[chapter];
		for ( var index in chapterMeta) {
			var notes = chapterMeta[index];
			for ( var count in notes) {
				if (notes[count].id == id) {
					selection = notes[count].text;
					offset = notes[count].offset;
					subtopic = notes[count].subtopic;
					currentPage = chapter;
					xpath = index;
					anchorOffset = notes[count].start;
					// displaychapter = getChapterName(chapter, subtopic);
					pageNo = notes[count].pageNo;
					found = true;
				}
				if (found == true) {
					break;
				}
			}
			if (found == true) {
				break;
			}
		}
	}
	return pageNo;
}

userEbook.prototype.showNote = function(noteId) {
	
	var pageNo = getNotePageNo(noteId);
//	console.log("pageNo =  " + pageNo);
	$("#popup_container").fadeOut(400);
	if($('#'+noteId + " img").css("visibility")=='visible'){
		$($('#'+noteId + " img")[0]).trigger("click");
	}
	else{
		//decode value of json key from local storage
		//var pageAlreadyLoaded = GetFromLocalStorage(bookName + "#" + 'currentPage');
		// if (pageAlreadyLoaded != currentPage) {
		
		//store value of currentPage in local storage
		//SaveInLocalStorage(bookName + "#" + 'currentPage', currentPage);
		$("#wrapper").css("visibility", "hidden");
		$("#hidden_content").css("visibility", "visible");
		loadChapters(spine[currentPage], currentPage).done(function(){
			 readEbookMetaFromLocal(username, epubFileName).done (function (ebookmdata){
			 ebookmetadata=ebookmdata;
			//store value of subtopic in local storage
				SaveInLocalStorage(bookName + "#" + 'subtopic', subtopic);
				setTimeout(function() {
					scrollChapterForOffset(null, offset, xpath, selection, anchorOffset,currentPage, noteId).done(function(){
					// added for
					// scroll to
					// particular note
					//var curPage = GetFromLocalStorage(bookName + "#" + 'currentPage');
						//findStartingWords(spine[curPage],curPage,'highlight').done(function(offset){
							//historyobj.addHistoryItem(userobj.ebook,offset,'popUpNavigation');
							//writeHistoryToLocal(historyobj);
						//	serversynchistorydata();
						
							//store value of realPageNum in local storage
							/*SaveInLocalStorage(bookName + "#realPageNum", pageNo);
							$('.page_no_field').val(pageNo);
							pagetojump=(pageNo);
							rePaintSlider((pageNo));*/
							//selectPageNumInFooter(pageNo);
							// $('.page_no_field').val(pageNo);
							//showBookMarkIcon();
							$("#popup_container").fadeOut(400);
							$("#background_overlay").css('display', 'none');
							updateRealPageNum().done(function(pc){
								placeAllNoteIcon(null, pc);
								openNotesPopover(noteId);
								var valuesReturned=pc.split('~~');
								var offset=valuesReturned[1];
								historyobj.addHistoryItem(userobj.ebook,parseInt(offset),'popUpNavigation');
								writeHistoryToLocal(historyobj);
							});
							//return false;
						//});
					});}, 100);
		 		});
		 });
	}
};

function openNotesPopover(noteId) {
	if ($('#' + noteId + " img").css("visibility") == 'visible') {
		$($('#' + noteId + " img")[0]).trigger("click");
	} else {
		setTimeout(function() {
			openNotesPopover(noteId);
		}, 100);
	}
}

/*
 * purpose of method - To Save Bookmark. where and what condition it should get
 * called - When User clicks on Add Bookmark. if any conditions inside then
 * comment for that - It checks if the page is already Bookmaked or not.
 * argument details - Null. return types - Null.
 */

// Ui-Cust -Pravin
userEbook.prototype.saveBookmark = function() {
	
	/*var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	var month = month[currentTime.getMonth()];
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();*/
	//var fullDate = +day + " " + month + " " + year;
	var currentTime = new Date();
	var fullDate = currentTime.getTime();
	//get value of json key from local storage
	var chapterkey = GetFromLocalStorage(bookName + "#" + 'currentPage');
	var subTopic = GetFromLocalStorage(bookName + "#" + 'subtopic');
	findStartingWords(spine[chapterkey], chapterkey,
			'bookmark').done(function (pc){
				//offset+"~~"+chapterkey+"~~"+hiddenContent+"~~"+bookmarkId
				var bookMarkData=pc.split("~~");
				var chapter = bookMarkData[0];
				var id = bookMarkData[1];
				var offset = bookMarkData[2];
				var startingStr = bookMarkData[3];

				/*var offset = bookMarkData[0];
				var chapter = bookMarkData[1];
				var startingStr = bookMarkData[2];
				var id = "bookmarkId" + (Math.floor(Math.random() * 90000) + 10000);*/
				var fileMeta = userobj.bookmarks;
				if (!(chapter in fileMeta)) {
					fileMeta[chapter] = new Array();
				}
	var chapName= getChapterName(chapter, subtopic);
	var value = new Object();
	value.id = id;
	value.offset = offset;
	value.startingStr = startingStr.substring(0, 70);
	value.date = fullDate;
	
	//get values of json keys from local storage
	value.pageNo = GetFromLocalStorage(bookName + "#" + 'realPageNum');
	//value.subTopic = GetFromLocalStorage(bookName + "#" + 'subtopic');
	value.subTopic =subTopic;
    value.deleteFlag= "F";
    value.chapName=chapName;
	fileMeta[chapter].push(value);
	userobj.lastmodified=currentTime.getTime();
	});
};

/*userEbook.prototype.saveBookmark = function() {
	
	//get value of json key from local storage
	var chapterkey = GetFromLocalStorage(bookName + "#" + 'currentPage');
	// var subTopic = localStorage.getItem(bookName+"#"+'subtopic');
	findStartingWords(spine[chapterkey], chapterkey,
			'bookmark').done(function (pc){
				var bookMarkData=pc.split("~~");
				var chapter = bookMarkData[0];
				var id = bookMarkData[1];
				var offset = bookMarkData[2];
				var startingStr = bookMarkData[3];

				var fileMeta = userobj.bookmarks;
				if (!(chapter in fileMeta)) {
					fileMeta[chapter] = new Array();
				}
	var value = new Object();
	value.id = id;
	value.offset = offset;
	value.startingStr = startingStr.substring(0, 70);
	value.date = new Date().getTime();;
	
	//get values of json keys from local storage
	value.pageno = GetFromLocalStorage(bookName + "#" + 'realPageNum');
	value.subTopic = GetFromLocalStorage(bookName + "#" + 'subtopic');
	fileMeta[chapter].push(value);
	});
};*/

/*
 * purpose of method - To get the Chapter name of the current opened page from
 * TOC. where and what condition it should get called - It is called in
 * populateBookMarkContent(),populateNotesContent(),populateHighlightContent()
 * when the user clicks on Show Bookmark. if any conditions inside then comment
 * for that - It checks if the current page(currentkey) is present in the spine
 * and displays the corresponding Chaptername as present in Spine argument
 * details - chapterkey from the Annotations Metadata. return types -
 * corresponding chaptername.
 */
//Commented 02/24 Performance Issue
/*function getChapterName(chapterkey, subTopic) {
	var subTopicNew = subTopic;
	var tocfilename;
	for (key in spine) {
		if (key == 'toc') {
			tocfilename = spine[key];
			break;
		}
	}
 
	//get value of json key from local storage
	
	//GetFromDataStorage(bookName + "#" + tocfilename).done(function (tocxml){
	//var tocxml = JSON.parse(GetFromLocalStorage(bookName + "#" + tocfilename));
	//commented out 10/2
	tocmap = new Object();
	var tocxmlDOM = $.parseXML(topic.content);
	$(tocxmlDOM).find('nav').each(function() {
		if ($(this).attr('epub:type') == 'toc') {
			$(this).find('a').each(function() {
				tocmap[$(this).attr('href')] = $(this).text();

			});
		}
	//});
	});
	
	 * $(tocxmlDOM).find('a').each(function(){ tocmap[$(this).attr('href')] =
	 * $(this).text();
	 * 
	 * });
	 

	var currentvalue;
	for ( var key in spine) {

		if (key == chapterkey) {
			currentvalue = spine[key];
			break;
		}
	}
	if(currentvalue!==undefined){
	currentvalueNew = currentvalue;
	if (subTopicNew != "null" && subTopicNew != "undefined" && subTopicNew != undefined) {

		currentvalueNew = currentvalueNew.concat("#" + subTopicNew);
	}
	var currentchapname;
	// alert("currentchap: "+currentvalue);
	for ( var key in tocmap) {
		// alert("key :"+key);
		if (key == currentvalueNew) {
			currentchapname = tocmap[key];
			break;
		}
	}
	if (currentchapname == undefined) {
		for ( var key in tocmap) {
			// alert("key :"+key);
			if (key == currentvalue) {
				currentchapname = tocmap[key];
				break;
			}

		}

		if (currentchapname == undefined) {
			if (subTopicNew != "null" && subTopicNew != "undefined" && subTopicNew != undefined) {
				currentvalueParent = currentvalue;
				var length = subTopic.length;
				var parentSubtopic = subTopic.substring(0, length - 3);
				currentvalueParent = currentvalueParent.concat("#"
						+ parentSubtopic);

				for ( var key in tocmap) {
					// alert("key :"+key);
					if (key == currentvalueParent) {
						currentchapname = tocmap[key];
						break;
					}
				}
			}
			var flag = 0;
			var flag1 = 0;
			if (currentchapname == undefined) {
				check 
				for ( var key in tocmap) {
					// alert("key :"+key);
					var str = key.split("#");
					if (str[0] == currentvalue) {
						currentchapname = tocmap[key];
						flag = 1;
						break;
					}
				}
			}
		}
		
		
	}
	if(currentchapname==undefined){
		currentchapname = "                ";
	}
	return currentchapname;
	}
	else{
		return "                  ";
	}
	check 
}*/
function getChapterName(chapterkey, subTopic) {
	var subTopicNew = subTopic;
	var tocfilename = spine['toc'];
 
	//get value of json key from local storage
	
	//GetFromDataStorage(bookName + "#" + tocfilename).done(function (tocxml){
	//var tocxml = JSON.parse(GetFromLocalStorage(bookName + "#" + tocfilename));
	//commented out 10/2
	/*if(tocmap == null) {
		tocmap = new Object();
		var tocxmlDOM = $.parseXML(topic.content);
		$(tocxmlDOM).find('nav').each(function() {
			if ($(this).attr('epub:type') == 'toc') {
				$(this).find('a').each(function() {
					tocmap[$(this).attr('href')] = $(this).text();
				});
			}
		});
	}	*/
	var currentvalue = spine[chapterkey];

	if(currentvalue !== undefined && currentvalue != null) {
		currentvalueNew = currentvalue;
		if (subTopicNew != "null" && subTopicNew != "undefined" && subTopicNew != undefined) {
		currentvalueNew = currentvalueNew.concat("#" + subTopicNew);
	}
	var currentchapname = tocmap[currentvalueNew];

	if (currentchapname == undefined || currentchapname == null) {
		currentchapname = tocmap[currentvalue];
		if (currentchapname == undefined || currentchapname == null) {
			if (subTopicNew != "null" && subTopicNew != "undefined" && subTopicNew != undefined) {
				currentvalueParent = currentvalue;
				var length = subTopic.length;
				var parentSubtopic = subTopic.substring(0, length - 3);
				currentvalueParent = currentvalueParent.concat("#"
						+ parentSubtopic);
				currentchapname = tocmap[currentvalueParent];

			}
			if (currentchapname == undefined || currentchapname == null) {
				/*check */
				for ( var key in tocmap) {
					// alert("key :"+key);
					var str = key.split("#");
					if (str[0] == currentvalue) {
						currentchapname = tocmap[key];
						flag = 1;
						break;
					}
				}
			}
		}
		
		
	}
	if(currentchapname==undefined){
		currentchapname = "                ";
	}
	return currentchapname;
	}
	else{
		return "                  ";
	}
	/*check */
}

/*
 * purpose of method - To fetch value of saved bookmark from the
 * BookmarkMetadata and and populate it to the UI. where and what condition it
 * should get called - when the user clicks on Show Bookmark. if any conditions
 * inside then comment for that - If chapter name corresponding to the spine key
 * is present in toc then only Populate content. argument details - Null. return
 * types - html tags as string to the UI containing chaptername date and page
 * number.
 */
userEbook.prototype.sortData=function(bookmarkList){

	var arraySorted=[];
	for ( var book in bookmarkList) {						
			arraySorted=bookmarkList.sort(function(a,b)
			{  var d1 = new Date(a.date);
			var d2 = new Date(b.date); 
			return d2-d1;
			});
		}
	
	return arraySorted;
};

userEbook.prototype.deleteHighlight = function(id) {
	var resultPar=id.split('~~');
	var xpathremove;
	var actlen;
	var id = resultPar[0];
	var chapRemove;
	var highlightMeta;
	var highlighttype=resultPar[1];
	var highlightOption=resultPar[2];
	var arr= new Array();
	if(highlighttype=='highlight'){
		highlightMeta	= userobj.HighLights;
	}else{
		highlightMeta	= userobj.orphanHighLights;
	}
 
	for ( var chapter in highlightMeta) {
		var chapterMeta = highlightMeta[chapter];
		for ( var index in chapterMeta) {
			var highlight = chapterMeta[index];
			actlen=highlight.length;
			for ( var count in highlight) {
				currrentid = highlight[count].id;
				if (currrentid == id) {
					// for deleting span id injected for highlight
					// $("span" + "#" + id).removeClass('highlight');
					$("#epub_content").find('span.highlight').each(function() {
						if (this.id == id) {
							with (this.parentNode) {
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
										}else if(node.nodeType==1){
											textnode= node;
											break;
										}
									}
									textnode.data= strs;
									replaceChild(textnode, this);
									normalize();																																		    									
								}

							}
						}
					});
					// $span.replaceWith($span.html());
					//sync					
					highlight[count].deleteFlag = "T";
					highlight[count].date = currentTime.getTime();
					//xpathremove = index;
					//chapRemove = chapter;
					// removing he given highlight
				//	var removeddata = highlight.splice(count, 1);
					// for deleting xpath
					
				//	if (highlight.length == 0 ||highlight.length <actlen ) {

					//	delete chapterMeta[xpathremove];
				//	}
					// for deleting chapter when no highlight is present
				//	if (getSize(highlightMeta[chapRemove]) == 0) {
				//		delete highlightMeta[chapRemove];
				//	}
				}
			}
		}
	}
	userobj.lastmodified=currentTime.getTime();
writeEbookMetaToLocal(userobj).done(function (){
		//serversynclocaldata().done(function (){
			//showHighlightsInList();
			if(highlightOption=='view'){
			refreshBookMarkView();
			}
		//});	
	});
//used for deleting the child or inner highlight (already span removed from the book, just for making the deleteflag true)
if (arr.length!=0)  {
  	deletechildannotation(arr);
       }
};

//used for deleting the child/dependent highlight/note 
//later can be used to preserve the inner note or highlight based on the requirement
function deletechildannotation(arrchild){
	var newarr=arrchild;	
	      for(var i=0;i<newarr.length;i++){
	    	  var node= newarr[i];
	    	  var className= node.className;
	    	  if(className=='highlight'){
	    		  var id = node.id;
	    		  id= id+'~~'+'highlight'+'~~'+'option';
	    		  var resultPar=id.split('~~');
	    			var xpathremove;
	    			var actlen;
	    			var id = resultPar[0];
	    			var chapRemove;
	    			var highlightMeta;
	    			var highlighttype=resultPar[1];
	    			var highlightOption=resultPar[2];	    			
	    			if(highlighttype=='highlight'){
	    				highlightMeta	= userobj.HighLights;
	    			}else{
	    				highlightMeta	= userobj.orphanHighLights;
	    			}	    		 
	    			for ( var chapter in highlightMeta) {
	    				var chapterMeta = highlightMeta[chapter];
	    				for ( var index in chapterMeta) {
	    					var highlight = chapterMeta[index];
	    					actlen=highlight.length;
	    					for ( var count in highlight) {
	    						currrentid = highlight[count].id;
	    						if (currrentid == id) {	    							    							    											
	    							highlight[count].deleteFlag = "T";
	    							highlight[count].date = currentTime.getTime();    							
	    						}
	    					}
	    				}
	    			}
	    			userobj.lastmodified=currentTime.getTime();
	    		writeEbookMetaToLocal(userobj).done(function (){	    				
	    					showHighlightsInList();
	    					if(highlightOption=='view'){
	    					refreshBookMarkView();
	    					}	    				
	    			});
	    	  }
	    	 else if (className=='highlightNote'){ 
	    		 var id = node.id;
	    		 id= id+'~~'+'notes'+'~~'+'option';
	    		 var resultPar=id.split('~~');
	    			var id = resultPar[0];
	    			var notestype=resultPar[1];
	    			var notesOption=resultPar[2];
	    			var notesMeta;
	    			var xpathremove;
	    			var chapRemove;

	    			if(notestype=='notes'){
	    				notesMeta	=  userobj.Notes;
	    			}else{
	    				notesMeta	=  userobj.orphanNotes;
	    			}
	    			
	    			for ( var chapter in notesMeta) {
	    				var chapterMeta = notesMeta[chapter];
	    				for ( var index in chapterMeta) {
	    					var notes = chapterMeta[index];
	    					for ( var count in notes) {
	    						currrentid = notes[count].id;
	    						if (currrentid == id) {	    								    							
	    							notes[count].deleteFlag = "T";
	    							notes[count].date = currentTime.getTime();	    							
	    						}
	    					}
	    				}
	    			}
	    			userobj.lastmodified=currentTime.getTime();
	    			writeEbookMetaToLocal(userobj).done(function (){	    			
	    					showNotesInList();
	    					if(notesOption=='view')
	    					refreshBookMarkView();	    					    					
	    			});
	    	  }
	      }
}

//UI-Cust -Pravin

/*userEbook.prototype.populateNotesContent = function() {
	var notesMeta = userobj.Notes;
	var id;
	var offset;
	var fullDate;
	var selection = "";
	var outputStr = "";
	var pageNo;
	var listOfSelectedIds = [];
	var deleteData=document.getElementById("delete").value;
	for ( var chapter in notesMeta) {
		var chapterMeta = notesMeta[chapter];
		for ( var index in chapterMeta) {

			var notes = chapterMeta[index];
			for ( var count in notes) {
				var present = false;
				id = notes[count].id;
				for ( var i in listOfSelectedIds) {
					// if this id is not in list ..continue..
					if (id == listOfSelectedIds[i]) {
						present = true;
						break;
					}
				}

				if (present == false) {
					selection = notes[count].text;
					fullDate = notes[count].date;
					subtopic = notes[count].subtopic;
					displaychapter = getChapterName(chapter, subtopic);
					pageNo = notes[count].pageNo;
					if (selection != undefined && displaychapter != undefined) {
						if (selection.length < 50) {
							outputStr += "<div id=\"note\"><div id=\"bold\">"
									+ displaychapter
									+ "</div>"
									+ "<a href='javascript:userobj.showNote(\""
									+ notes[count].id
									+ "\")'>"
									+ (selection)
									+ "..."
									+ "</a><div id=\"datedisplay\">"
									+ fullDate
									+ ""
									+ "<div id='pageNumber'>"
									+ pageNo
									+ "</div><div id='deletebutton'><button  onclick='javascript:userobj.deleteNotes(\""
									+ id + "\")'>" + deleteData
									+ "</button></div></div></div>";
						} else {
							outputStr += "<div id=\"note\"><div id=\"bold\">"
									+ displaychapter
									+ "</div><a href='javascript:userobj.showNote(\""
									+ notes[count].id
									+ "\")'>"
									+ (selection).substring(0, 50)
									+ "..."
									+ "</a><div id=\"datedisplay\">"
									+ fullDate
									+ "<div id='pageNumber'>"
									+ pageNo
									+ "</div><div id='deletebutton'><button  onclick='javascript:userobj.deleteNotes(\""
									+ id + "\")'>" + deleteData
									+ "</button></div></div></div>";
						}
						listOfSelectedIds.push(id);
					}
				}
			}
		}
	}
	$("#notesContent").html(outputStr);
};*/

/*userEbook.prototype.populateNotesContent = function() {
    var notesMeta = userobj.Notes;
    var id;
    var offset;
    var fullDate;
    var selection = "";
    var outputStr = "";
    var pageNo;
    var listOfSelectedIds = [];
    //var deleteData=document.getElementById("delete").value;
    for ( var chapter in notesMeta) {
          var chapterMeta = notesMeta[chapter];
          for ( var index in chapterMeta) {

                var notes = chapterMeta[index];
                for ( var count in notes) {
                      var present = false;
                      id = notes[count].id;
                      for ( var i in listOfSelectedIds) {
                            // if this id is not in list ..continue..
                            if (id == listOfSelectedIds[i]) {
                                  present = true;
                                  break;
                            }
                      }

                      if (present == false) {
                    	    selection = notes[count].text;
                            fullDate = notes[count].date;
                            annoMap[fullDate]=notes[count];
                            subtopic = notes[count].subtopic;
                            displaychapter = getChapterName(chapter, subtopic);
                            console.log("selection = " + selection + " fullDate = " + fullDate + " subtopic =" + subtopic + " displaychapter = " + displaychapter);
                            if (selection != undefined && displaychapter != undefined) {
                            	listOfSelectedIds.push(id);
                            }
                            chapterNameMap[id]=displaychapter+'*'+chapter;                    
                      }
                }
          }
    }
    
};


userEbook.prototype.populateOrphanNotesContent = function() {
	var orphanNotesMeta = userobj.orphanNotes;
	var id;
	var offset;
	var fullDate;
	var selection = "";
	var outputStr = "";
	var pageNo;
	var listOfSelectedIds = [];
	var orphans = false;
	for ( var chapter in orphanNotesMeta) {
		var chapterMeta = orphanNotesMeta[chapter];
		for ( var index in chapterMeta) {

			var notes = chapterMeta[index];
			for ( var count in notes) {
				var present = false;
				id = notes[count].id;
				for ( var i in listOfSelectedIds) {
					// if this id is not in list ..continue..
					if (id == listOfSelectedIds[i]) {
						present = true;
						break;
					}
				}

				if (present == false) {
					selection = notes[count].text;
					fullDate = notes[count].date;
					subtopic = notes[count].subtopic;
					displaychapter = getChapterName(chapter, subtopic);
					pageNo = notes[count].pageNo;
					if (selection != undefined && displaychapter != undefined) {
						if (selection.length < 50) {
							outputStr += "<div id=\"note\"><div id=\"bold\">"
									+ displaychapter
									+ "</div>"
									+ "<a href='javascript:userobj.searchOrphanNote(\""
									+ notes[count].id
									+ "\")'>"
									+ (selection)
									+ "..."
									+ "</a>"
									+ "<div id=\"datedisplay\">"
									+ fullDate
									+ ""
									+ "<div id='pageNumber'>"
									+ pageNo
									+ "</div>"
									+ "<div id='deletebutton'><button onclick='searchAndRetrieve(\""
									+ selection + "\")'>" + "Search"
									+ "</button></div></div></div>";
						} else {
							outputStr += "<div id=\"note\"><div id=\"bold\">"
									+ displaychapter
									+ "</div><a href='javascript:userobj.searchOrphanNote(\""
									+ notes[count].id
									+ "\")'>"
									+ (selection).substring(0, 50)
									+ "..."
									+ "</a>"
									+ "<div id=\"datedisplay\">"
									+ fullDate
									+ "<div id='pageNumber'>"
									+ pageNo
									+ "</div><div id='deletebutton'><button onclick='searchAndRetrieve(\""
									+ selection + "\")'>" + "Search"
									+ "</button></div></div></div>";
						}
						listOfSelectedIds.push(id);
					}
				}
			}
		}
		orphans = true;
	}
	if (orphans == true) {
		outputStr = "<div id=\"orphan\"><div id=\"bold\">" + "Orphaned Notes"
				+ "</div></div>" + outputStr;
	}
	$("#notesContent").append(outputStr);
};*/

userEbook.prototype.deleteNotes = function(id) {
	var resultPar=id.split('~~');
	var id = resultPar[0];
	var notestype=resultPar[1];
	var notesOption=resultPar[2];
	var notesMeta;
	var xpathremove;
	var chapRemove;
	var arrchild= new Array();
	if(notestype=='notes'){
		notesMeta	=  userobj.Notes;
	}else{
		notesMeta	=  userobj.orphanNotes;
	}
	
	for ( var chapter in notesMeta) {
		var chapterMeta = notesMeta[chapter];
		for ( var index in chapterMeta) {
			var notes = chapterMeta[index];
			for ( var count in notes) {
				currrentid = notes[count].id;
				if (currrentid == id) {
					// $("span" + "#" + id).removeClass('highlightNote');
					$("#epub_content").find('span.highlightNote').each(
							function() {
								if (this.id == id) {
									with (this.parentNode) {
										//replaceChild(this.firstChild, this);
										//normalize();										//replaceChild(this.firstChild, this);
										with (this.parentNode) {
											var len= this.childNodes.length;
											var childnodes= this.childNodes;																
											//  scenario where single note is present	(no overlapping note over a note))						
											if(len<=2){	
												var s="";
												if(this.lastChild.nodeType==1){
													s=s+this.lastChild.innerText;
												}
												else if(this.lastChild.nodeType==3){
													s=s+this.lastChild.data;
												}
												var txtnode=document.createTextNode(s);
											      replaceChild(txtnode, this);
											      normalize();
											}
											// scenario where overlapping note is present(higlight over a note)
											else{																	
										        var strs= "";
												for(var  i=0;i<len;i++){
													var cnodes = childnodes[i];
													if(cnodes.nodeType==3){
												 	strs= strs+cnodes.data;
													}
													else if (cnodes.nodeType==1){
														// adding the child note to an array used for deleting later 
														arrchild.push(cnodes);
														if(cnodes.nodeName=='A'){                                                           
															strs= strs+cnodes;
                                                            
                                                        } else if(cnodes.nodeName == 'IMG'){
                                                        	//do nothing
                                                        }
														else{
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
													} else if(node.nodeName == 'IMG'){
                                                    	//do nothing
                                                    } else if(node.nodeType==1){
														textnode= node;
														break;
													}
												}
												textnode.data= strs;
												replaceChild(textnode, this);
												normalize();																																		    									
											}
										}

									}
								}
							});
					notes[count].deleteFlag = "T";
					notes[count].date = currentTime.getTime();
					//xpathremove = index;
					//chapRemove = chapter;
					//var removeddata = chapterMeta[index].splice(count, 1);
					//if (chapterMeta[xpathremove].length == 0) {
					//	delete chapterMeta[xpathremove];
					//}
					//if (getSize(notesMeta[chapRemove]) == 0) {
					//	delete notesMeta[chapRemove];
				//	}
				}
			}
		}
	}
	userobj.lastmodified=currentTime.getTime();
	writeEbookMetaToLocal(userobj).done(function (){
		//serversynclocaldata().done(function (){
			//showNotesInList();
			if(notesOption=='view')
			refreshBookMarkView();
		//});
			
	});
	
	// used for deleting the child or inner note (already span removed from the book, just for making the deleteflag true)
    if (arrchild.length!=0)  {
      	deletechildannotation(arrchild);
           }

};

function getNextNode(node, end) {
	if (node.firstChild)
		return node.firstChild;
	while (node) {
		if (node.nextSibling)
			return node.nextSibling;
		node = node.parentNode;
	}
}

function getNodesInRange(range) {
	var start = range.startContainer;
	var end = range.endContainer;
	var commonAncestor = range.commonAncestorContainer;
	var nodes = [];
	var node;

	// walk parent nodes from start to common ancestor
	for (node = start.parentNode; node; node = node.parentNode) {
		if (node.nodeType == 3) {
			nodes.push(node.parentNode);
		}
		if (node == commonAncestor)
			break;
	}
	nodes.reverse();
	// walk children and siblings from start until end is found
	for (node = start; node; node = getNextNode(node)) {
		// alert("here>>>>>>>>>>>>>>>");
		if (node.nodeType == 3 && node.nodeValue.trim() != "") {
			// alert("Value:::"+node.nodeValue);
			nodes.push(node.parentNode);
		}
		if (node == end)
			break;
	}

	return nodes;

}

function getRangeObject(selectionObject) {
		var range = document.createRange();
		range
				.setStart(selectionObject.anchorNode,
						selectionObject.anchorOffset);
		range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
		return range;
}

/*
 * added for making highlight and notes
 *includes Ablity to do Highlight inside Highlight -DTUS19.4.1
 * Ablity to do Note inside Note -DTUS19.4.3
 */ 
function processSelectedText(selection, selObj, action, htmlSelection) {
	closeContextMenu();
	
	if(action == 'copy') {
		document.execCommand("Copy");
		return;
	}
	htmlSelection=htmlSelection.replace('&nbsp;',' ');
	var multiXpathSelect = false;
	var path = currentFile;
	var startNode = selObj.anchorNode.parentNode;
	var endNode = selObj.focusNode.parentNode;
	var anchorOffset = 0;
	var focusOffset = 0;
	if (action == 'highlight') {
		hid = "highlightId" + (Math.floor(Math.random() * 900000) + 100000);
	} else if (action == 'note') {
		hid = "noteId" + (Math.floor(Math.random() * 900000) + 100000);
	}

// cases for calculating the correct anchor & focus offsets
// with respect to the respective parent nodes ( both Single & Multiple node
// highlight)-Sumedha :

// case 1: anchorNode = focusNode : Single node selection
if (selObj.anchorNode == selObj.focusNode) {

	//var xpath1 = getXPath(selObj.anchorNode.parentNode);
	var commonParentNode = startNode = endNode;
	var start = 0;
	var end = 0;
	// changing the offsets according to parentNode which is the common
	// ancestor
	for ( var count = 0; count < commonParentNode.childNodes.length; count++) {
		if (commonParentNode.childNodes[count] == selObj.anchorNode) {
			start = count;
		}
	}
	var nodesBeforeAnchor = start;
	var lengthBefore = 0;
	if (nodesBeforeAnchor > 0) {

		// adding the length of node before to get the offsets w.r.t. to
		// common ancestor
		lengthBefore = findChildrenLengthRecursively(commonParentNode,
				0, nodesBeforeAnchor, lengthBefore);
	}
	// change anchorOffset
	anchorOffset = lengthBefore + selObj.anchorOffset;
	var xpath1 = getXPath(commonParentNode);
	//anchorOffset = selObj.anchorOffset;
	focusOffset =lengthBefore + selObj.focusOffset;
	var noHTMLString = replaceAll(htmlSelection, "\\<.*?>", "");
	noHTMLString = $("<div />").html(noHTMLString).text();
	$(commonParentNode).highlight(noHTMLString, action, anchorOffset,
			focusOffset, hid);

	if (action == 'highlight') {
		userobj.addHighLight(path, xpath1, anchorOffset, focusOffset, hid,
				noHTMLString);
	} else if (action == 'note') {
		userobj.addNote(path, xpath1, anchorOffset, focusOffset,
				currentNote, hid, noHTMLString);
	}
}

else if (selObj.anchorNode != selObj.focusNode) {
	if (startNode == endNode) {

		var commonParentNode = startNode = endNode;
		var start = 0;
		var end = 0;
		// changing the offsets according to parentNode which is the common
		// ancestor
		var childNodesTotal=commonParentNode.childNodes;
		for ( var count = 0; count < childNodesTotal.length; count++) {
			if (childNodesTotal[count] == selObj.anchorNode) {
				start = count;
			}
			if (childNodesTotal[count] == selObj.focusNode) {
				end = count;
			}
		}
		var nodesBeforeAnchor = start;
		var lengthBefore = 0;
		if (nodesBeforeAnchor > 0) {

			// adding the length of node before to get the offsets w.r.t. to
			// common ancestor
			lengthBefore = findChildrenLengthRecursively(commonParentNode,
					0, nodesBeforeAnchor, lengthBefore);
		}
		// change anchorOffset
		anchorOffset = lengthBefore + selObj.anchorOffset;
		var xpath1 = getXPath(commonParentNode);
		var nodesInBtwn = end - start - 1;
		var lengthInBtwn = 0;
		if (nodesInBtwn > 0) {
			lengthInBtwn = findChildrenLengthRecursively(commonParentNode,
					start + 1, end, lengthInBtwn);
		}
		var noHTMLString = replaceAll(htmlSelection, "\\<.*?>", "");
		noHTMLString = $("<div />").html(noHTMLString).text();
		var anchorLength = selObj.anchorNode.length;
		focusOffset = lengthBefore + anchorLength + lengthInBtwn
				+ selObj.focusOffset;
		$(commonParentNode).highlight(noHTMLString, action, anchorOffset,
				focusOffset, hid);
		if (action == 'highlight') {
			userobj.addHighLight(path, xpath1, anchorOffset, focusOffset,
					hid, noHTMLString);
		} else if (action == 'note') {
			userobj.addNote(path, xpath1, anchorOffset, focusOffset,
					currentNote, hid, noHTMLString);
		}
	} else if (startNode != endNode) {

		var range = getRangeObject(selObj, action);
		var commonAncestor = range.commonAncestorContainer;
		if (startNode == commonAncestor) {

		}
		var start = -1;
		var end = -1;
		// changing the offsets according to parentNode which is the common
		// ancestor

		var flag = false;
		var flag2 = false;
		start=(findStartRecur(commonAncestor, selObj,
				start, flag));
		end=(findEndRecur(commonAncestor, selObj,
				end, flag2));
		// }
		// calculating the index of selected start node within the "start"
		// parentnode
		var relativelength = 0;
		var flag = 'false';
		relativelength = findStartNodeFromStart(
				commonAncestor.childNodes[start], selObj, flag,
				relativelength, 'start').split('#')[0];

		anchorOffset = parseInt(relativelength) + selObj.anchorOffset;
		var noHTMLString = replaceAll(htmlSelection, "\\<.*?>", "");
		noHTMLString = $("<div />").html(noHTMLString).text();
		noHTMLString=replaceAll(noHTMLString,'&nbsp;',' ');
		// alert(noHTMLString);
		var relativelengths = 0;
		var flag = 'false';
		relativelengths = findStartNodeFromStart(
				commonAncestor.childNodes[end], selObj, flag,
				relativelengths, 'end').split('#')[0];
		focusOffset = parseInt(relativelengths) + selObj.focusOffset;
		var left;
		var xpath1;
		for ( var c = start; c <= end; c++) {
			if (c == start) {
				if(commonAncestor.childNodes[start].nodeType==3){
					xpath1 = getXPath(commonAncestor.childNodes[start].parentNode);
					
				}
				else{
					xpath1 = getXPath(commonAncestor.childNodes[start]);
				}
				selected = noHTMLString.substring(0, $(
						commonAncestor.childNodes[start]).text().length
						- anchorOffset);
				$(commonAncestor.childNodes[start]).highlight(selected,
						action, anchorOffset,
						$(commonAncestor.childNodes[start]).text().length,
						hid);
				if(commonAncestor.childNodes[start].nodeType==3){
				c=c+1;
				end=end+1;
				}
				left = noHTMLString.substring(selected.length,
						noHTMLString.length);
				if (action == 'highlight') {
					userobj
							.addHighLight(path, xpath1, anchorOffset, $(
									commonAncestor.childNodes[start])
									.text().length, hid, selected);
				} else if (action == 'note') {
					userobj
							.addNote(path, xpath1, anchorOffset, $(
									commonAncestor.childNodes[start])
									.text().length, currentNote, hid,
									selected);
				}
			} else if (c == end) {
				if(commonAncestor.childNodes[end].nodeType==3){
					xpath1 = getXPath(commonAncestor.childNodes[end].parentNode);
				}
				else{
					xpath1 = getXPath(commonAncestor.childNodes[end]);
				}
				
				// alert(left+'in end left');
				selected = left.substring(0, focusOffset);
				$(commonAncestor.childNodes[end]).highlight(selected,
						action, 0, focusOffset, hid);
				if (action == 'highlight') {
					userobj.addHighLight(path, xpath1, 0, focusOffset, hid,
							selected);
				} else if (action == 'note') {
					userobj.addNote(path, xpath1, 0, focusOffset,
							currentNote, hid, selected);
				}
			} else {
				if(commonAncestor.childNodes[c].nodeType==3){
					xpath1 = getXPath(commonAncestor.childNodes[c].parentNode);
				}
				else{
					xpath1 = getXPath(commonAncestor.childNodes[c]);
				}
				
				selected = left.substring(0,
						$(commonAncestor.childNodes[c]).text().length);
				if (stripSpaces(selected) != '') {
					$(commonAncestor.childNodes[c]).highlight(selected,
							action, 0,
							$(commonAncestor.childNodes[c]).text().length,
							hid);
					if (action == 'highlight') {
						userobj
								.addHighLight(path, xpath1, 0, $(
										commonAncestor.childNodes[c])
										.text().length, hid, selected);
					} else if (action == 'note') {
						userobj
								.addNote(path, xpath1, 0, $(
										commonAncestor.childNodes[c])
										.text().length, currentNote, hid,
										selected);
					}
					if(commonAncestor.childNodes[c].nodeType==3){
						c=c+1;
						end=end+1;
						}
				}
				left = left.substring(selected.length, left.length);
				
			}
		}
	}
}
if(action == "note") {
	placeAllNoteIcon();
}
writeEbookMetaToLocal(userobj);
console.log('before updating notes or highlights to server');
serversynclocaldata();
console.log('after updating notes or highlights to server');
}



function processSelectedText11(selection, selObj, action, htmlSelection) {
	
	closeContextMenu();
	
	if(action == 'copy') {
		document.execCommand("Copy");
		return;
	}
	
	//26/12
	htmlSelection=replaceAll(htmlSelection,"&nbsp;"," ");
	
	
	// added for handling  printed version book to fetch the page no present in the selectionString
	var  pageBreakflag= false;
	var  snodestr="";
	var  s2="";
	var mnodestr="";	
	var tempDiv = document.createElement('div');
	tempDiv.innerHTML = htmlSelection;
	$(tempDiv).find("span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']").each(function(){					
		snodestr= $(this).html();
		s4= snodestr;
		// sending the the printed page no along with the selection text with "~~" in case of startNode == endNode .
		snodestr= "~~"+snodestr;	
		 pageBreakflag= true;
		}) ;
	$(tempDiv).find("#displayPage").each(function(){									
			 s2= $(this).html();
			 mnodestr= s4+s2;
			// sending the the printed page no along with the selection text with "~~" startNode != endNode.
			 mnodestr= "~~"+mnodestr;							
		}) ;

	// alert('selObj'+'::::'+selObj);
	var multiXpathSelect = false;
	var path = currentFile;
	var startNode = selObj.anchorNode.parentNode;
	var endNode = selObj.focusNode.parentNode;
	// alert('1'+startNode+'::::'+endNode);
	var anchorOffset = 0;
	var focusOffset = 0;
	// alert($(startNode).text());
	// alert($(endNode).text());
	if (action == 'highlight') {
		hid = "highlightId" + (Math.floor(Math.random() * 900000) + 100000);
		// alert("if"+hid);
	} else if (action == 'note') {
		hid = "noteId" + (Math.floor(Math.random() * 900000) + 100000);
		// alert("else"+hid);
	}

	// cases for calculating the correct anchor & focus offsets
	// with respect to the respective parent nodes ( both Single & Multiple node
	// highlight)-Sumedha :

	// case 1: anchorNode = focusNode : Single node selection
		if (selObj.anchorNode == selObj.focusNode) {

		// var xpath1 = getXPath(selObj.anchorNode.parentNode);
		var commonParentNode = startNode = endNode;
		var start = 0;
		var end = 0;
		// changing the offsets according to parentNode which is the common
		// ancestor
		for ( var count = 0; count < commonParentNode.childNodes.length; count++) {
			if (commonParentNode.childNodes[count] == selObj.anchorNode) {
				start = count;
			}
		}
		var nodesBeforeAnchor = start;
		var lengthBefore = 0;
		if (nodesBeforeAnchor > 0) {

			// adding the length of node before to get the offsets w.r.t. to
			// common ancestor
			lengthBefore = findChildrenLengthRecursively(commonParentNode, 0,
					nodesBeforeAnchor, lengthBefore);
		}
		// change anchorOffset
		anchorOffset = lengthBefore + selObj.anchorOffset;
		var xpath1 = getXPath(commonParentNode);
		// anchorOffset = selObj.anchorOffset;
		focusOffset = lengthBefore + selObj.focusOffset;
		$(commonParentNode).highlight(selection, action, anchorOffset,
				focusOffset, hid);
        var selectedSubtopic=findRecentNode(htmlSelection,hid);
		if (action == 'highlight') {
			userobj.addHighLight(path, xpath1, anchorOffset, focusOffset, hid,
					selection,selectedSubtopic);
		} else if (action == 'note') {
				userobj.addNote(path, xpath1, anchorOffset, focusOffset,
					currentNote, hid, selection,selectedSubtopic);
		}
	}

	else if (selObj.anchorNode != selObj.focusNode) {
		if (startNode == endNode) {

			var commonParentNode = startNode = endNode;
			var start = 0;
			var end = 0;
			// changing the offsets according to parentNode which is the common
			// ancestor
			for ( var count = 0; count < commonParentNode.childNodes.length; count++) {
				if (commonParentNode.childNodes[count] == selObj.anchorNode) {
					start = count;
				}
				if (commonParentNode.childNodes[count] == selObj.focusNode) {
					end = count;
				}
			}
			var nodesBeforeAnchor = start;
			var lengthBefore = 0;
			if (nodesBeforeAnchor > 0) {

				// adding the length of node before to get the offsets w.r.t. to
				// common ancestor
				lengthBefore = findChildrenLengthRecursively(commonParentNode,
						0, nodesBeforeAnchor, lengthBefore);
			}
			// change anchorOffset
			anchorOffset = lengthBefore + selObj.anchorOffset;
			var xpath1 = getXPath(commonParentNode);
			var nodesInBtwn = end - start - 1;
			var lengthInBtwn = 0;
			if (nodesInBtwn > 0) {
				lengthInBtwn = findChildrenLengthRecursively(commonParentNode,
						start + 1, end, lengthInBtwn);
			}
			var anchorLength = selObj.anchorNode.length;
			focusOffset = lengthBefore + anchorLength + lengthInBtwn
					+ selObj.focusOffset;
			$(commonParentNode).highlight(selection, action, anchorOffset,
					focusOffset, hid,"",pageBreakflag);
			var selectedSubtopic= findRecentNode(htmlSelection,hid);
			if (action == 'highlight') {
				userobj.addHighLight(path, xpath1, anchorOffset, focusOffset,
						hid, selection+snodestr,selectedSubtopic);
			} else if (action == 'note') {
				userobj.addNote(path, xpath1, anchorOffset, focusOffset,
						currentNote, hid, selection+snodestr,selectedSubtopic);
			}
		} else if (startNode != endNode) {

			var range = getRangeObject(selObj);
			var commonAncestor = range.commonAncestorContainer;
			if (startNode == commonAncestor) {

			}
			var start = -1;
			var end = -1;
			// changing the offsets according to parentNode which is the common
			// ancestor

			var flag = false;
			var flag2 = false;
			start = (findStartRecur(commonAncestor, selObj, start, flag));
			end = (findEndRecur(commonAncestor, selObj, end, flag2));
			// }
			// calculating the index of selected start node within the "start"
			// parentnode
			var relativelength = 0;
			var flag = 'false';
			relativelength = findStartNodeFromStart(
					commonAncestor.childNodes[start], selObj, flag,
					relativelength, 'start').split('#')[0];

			anchorOffset = parseInt(relativelength) + selObj.anchorOffset;
			var noHTMLString = replaceAll(htmlSelection, "\\<.*?>", "");
			// alert(noHTMLString);
			var relativelengths = 0;
			var flag = 'false';
			relativelengths = findStartNodeFromStart(
					commonAncestor.childNodes[end], selObj, flag,
					relativelengths, 'end').split('#')[0];
			focusOffset = parseInt(relativelengths) + selObj.focusOffset;
			var left;
			var xpath1;
			for ( var c = start; c <= end; c++) {
				if (c == start) {
					if (commonAncestor.childNodes[start].nodeType == 3) {
						xpath1 = getXPath(commonAncestor.childNodes[start].parentNode);

					} else {
						xpath1 = getXPath(commonAncestor.childNodes[start]);
					}
					selected = noHTMLString.substring(0, $(
							commonAncestor.childNodes[start]).text().length
							- anchorOffset);
					$(commonAncestor.childNodes[start]).highlight(selected,
							action, anchorOffset,
							$(commonAncestor.childNodes[start]).text().length,
							hid);
					if (commonAncestor.childNodes[start].nodeType == 3) {
						c = c + 1;
						end = end + 1;
					}
					left = noHTMLString.substring(selected.length,
							noHTMLString.length);
					var selectedSubtopic= findRecentNode(htmlSelection,hid);
					if (action == 'highlight') {
						userobj
								.addHighLight(path, xpath1, anchorOffset, $(
										commonAncestor.childNodes[start])
										.text().length, hid, selected+mnodestr,selectedSubtopic);
					} else if (action == 'note') {
						userobj
								.addNote(path, xpath1, anchorOffset, $(
										commonAncestor.childNodes[start])
										.text().length, currentNote, hid,
										selected+mnodestr,selectedSubtopic);
					}
				} else if (c == end) {
					if (commonAncestor.childNodes[end].nodeType == 3) {
						xpath1 = getXPath(commonAncestor.childNodes[end].parentNode);
					} else {
						xpath1 = getXPath(commonAncestor.childNodes[end]);
					}

					// alert(left+'in end left');
					selected = left.substring(0, focusOffset);
					$(commonAncestor.childNodes[end]).highlight(selected,
							action, 0, focusOffset, hid);
					var selectedSubtopic= findRecentNode(htmlSelection,hid);
					if (action == 'highlight') {
						userobj.addHighLight(path, xpath1, 0, focusOffset, hid,
								selected+mnodestr,selectedSubtopic);
					} else if (action == 'note') {
						userobj.addNote(path, xpath1, 0, focusOffset,
								currentNote, hid, selected+mnodestr,selectedSubtopic);
					}
				} else {
					if (commonAncestor.childNodes[c].nodeType == 3) {
						xpath1 = getXPath(commonAncestor.childNodes[c].parentNode);
					} else {
						xpath1 = getXPath(commonAncestor.childNodes[c]);
					}

					selected = left.substring(0,
							$(commonAncestor.childNodes[c]).text().length);
					if (stripSpaces(selected) != '') {
						$(commonAncestor.childNodes[c]).highlight(selected,
								action, 0,
								$(commonAncestor.childNodes[c]).text().length,
								hid);
						var selectedSubtopic= findRecentNode(htmlSelection,hid);
						if (action == 'highlight') {
							userobj
									.addHighLight(path, xpath1, 0, $(
											commonAncestor.childNodes[c])
											.text().length, hid, selected+mnodestr,selectedSubtopic);
						} else if (action == 'note') {
							userobj
									.addNote(path, xpath1, 0, $(
											commonAncestor.childNodes[c])
											.text().length, currentNote, hid,
											selected+mnodestr,selectedSubtopic);
						}
						if (commonAncestor.childNodes[c].nodeType == 3) {
							c = c + 1;
							end = end + 1;
						}
					}
					left = left.substring(selected.length, left.length);

				}
			}
		}
	}
		  if(action == "note") {
				
			    setTimeout(placeAllNoteIcon(hid),0);

		  }
writeEbookMetaToLocal(userobj).done(function (){
	//	console.log('before updating notes or highlights to server');
		//serversynclocaldata().done(function (){
		//console.log('after updating notes or highlights to server');	
		//});	
	});
	
	
}
function replaceAll(txt, replace, with_this) {
	return txt.replace(new RegExp(replace, 'g'), with_this);

}

// This method needs to be called every 5 minutes in order to persist the
// annotations
// Use setTimeOut to accomplish this when the book is initially loaded
function writeEbookMetaToLocal(ebookmeta) {
	// alert("Writing to local storage");
	var dfd = $.Deferred();
	var user = ebookmeta.username;
	var ebook = ebookmeta.ebook;
	//alert(ebook);
	//store value of annotations in local storage
	
	if(typeof ebookmeta === 'object') {
		ebookmeta = JSON.stringify(ebookmeta);
	}
	
	SaveInDataStorage(user + "#" + ebook,(ebookmeta)).done(function (){
		dfd.resolve();	
	});
	
	//console.log('encoded 4');
	return dfd.promise();
}
function readEbookMetaFromLocal(userName, ebook) {
	// var ebookmetadata = localStorage[userName+"#"+ebook];
	//decode value of json key from local storage
	//console.log(localStorage.getItem(userName + "#" + ebook));
	
	//get value of json key from local storage
	//ebookmetadata = GetFromLocalStorage(userName + "#" + ebook);
	var dfd = $.Deferred();
	GetFromDataStorage(userName + "#" + ebook).done(function (emdata){
		if(emdata=="null"){
			
			dfd.resolve('NOT FOUND');
		}
		else{
		//console.log("meta data********"+emdata);
		//ebookmetadata=JSON.stringify(eval("(" + emdata + ")"));
//			alert("line 2501 ::: "+typeof(emdata));
	//26/12
			if(typeof emdata === 'object'){
				
				ebookmetadata=JSON.stringify(emdata);
			}

			else{
			ebookmetadata=eval("(" + emdata + ")");
			}
	//console.log('ebookmetadata: '+ebookmetadata.Notes);
	
	//console.log("correct  :"+ebookmetadata);
	//console.log('decoded 3');
	// alert('first comes here: ' + typeof ebookmetadata);
	if (ebookmetadata == null) {
		// alert("here");
		dfd.resolve('NOT FOUND');
	}
	if (typeof ebookmetadata == 'undefined' || ebookmetadata == 'undefined') {
		// alert("here");
		dfd.resolve('NOT FOUND');
	} else {
		//alert(userName+ebook+ebookmetadata);
		//dfd.resolve(JSON.parse(ebookmetadata));
		dfd.resolve(ebookmetadata);
	}
		}
	});
	return dfd.promise();
}


function readHistoryFromLocal(userName, ebook) {
	// var ebookmetadata = localStorage[userName+"#"+ebook];
	//decode value of json key from local storage
	//console.log(localStorage.getItem(userName + "#" + ebook));
	historyMeta = GetFromLocalStorage(userName+'#history');
	//console.log("correct  :"+ebookmetadata);
	//console.log('decoded 3');
	// alert('first comes here: ' + typeof ebookmetadata);
	if (historyMeta == null) {
		// alert("here");
		return 'NOT FOUND';
	}
	if (typeof historyMeta == 'undefined' || historyMeta == 'undefined') {
		// alert("here");
		return 'NOT FOUND';
	} else {
		return JSON.parse(historyMeta);
	}
}    

function getXPath(element) {
	/*
	 * var flag; //get the xpath of the text node if (element.nodeType == 3) {
	 * var count = 0; flag = true; var childNodes =
	 * element.parentNode.childNodes; for ( var c = 0; c < childNodes.length;
	 * c++) {
	 * 
	 * if(childNodes[c].nodeName=='#text'){ //alert('here'); count++; if
	 * (childNodes[c] == element) { break; } } } var path='/text()['+count+']';
	 * //alert(path); element = element.parentNode; }
	 */
	var xpath = '';
	for (; element && element.nodeType == 1; element = element.parentNode) {
		var id = '';
		if ($(element.parentNode).children(element.tagName).length > 1) {
			id = $(element.parentNode).children(element.tagName).index(element) + 1;
			// console.log('ID:' + id);
			id >= 1 ? (id = '[' + id + ']') : (id = '');
		}
		xpath = '/' + element.tagName.toLowerCase() + id + xpath;
	}
	// console.log('xpath return:' + xpath);
	// if (!flag)
	return xpath;
	// else{
	// alert(xpath+path);
	// return xpath+path;
	// }
}

/*
 * Purpose of method : By clicking on the span class "highlightNote" ,it should
 * read the id of that span. Where and what condition it should get called : On
 * click of the span class "highlightNote". Argument details : click event,name
 * of the span class,and function call. Return types : None
 * 
 */

function stripSpaces(str) {
	var reg = new RegExp("[\\s]+", "g");
	return str.replace(reg, "");
};
/*Note Display Changes*/
$(document).on("click", "span.highlightNote img", function() {
		$("#notesDiv, .divBefore").remove();
		$('span.highlightNote').css('text-decoration', 'none');
	var selectedIds = getElsAt($(this).offset().top, $(this).offset().left);
	for (var i = 0; i < selectedIds.length; i++){
		var id = $(selectedIds[i]).attr('parentId');
		reshowNotes(id);
	}
	
	$('.notesText').dotdotdot({
		height : '4em',		
		after  : 'a.more',
		callback : function( isTruncated, orgContent ) {
			if(!isTruncated){
				$('a.more', this).hide();
			}
		}
		 
	});
	
	$('.notesContentDiv span img').click(function(event){
		event.stopPropagation();
		var notesSpan = $(this).parent().next();
		var notesText = $(this).parent().next().triggerHandler("originalContent")[0];
		$("#notesDiv").remove();
		$("span.divBefore:not(.tocDivBefore)").remove();
		reShowDialog(notesText, $(notesSpan).attr('noteId'));
	});
	$('#notesDiv').click(function(event){
		event.stopPropagation();
	});	
});

function showMore(event){
	event.stopPropagation();
	var span = $(event.target).parent();
	$(span).trigger("originalContent", function( content ) {
		$(span).empty().append( content );
	});
	$(span).append(" <a class='less' onclick='showLess(event)'>less</a>");
	$(span).parent().css('height', 'auto');
	$(span).css('height', 'auto');
	$(span).css('max-height', '');
	$(span).find('a.more').remove();
}

function showLess(event){
	event.stopPropagation();
	$(event.target).parent().dotdotdot({
		height : '4em',		
		after  : 'a.more',
		callback : function( isTruncated, orgContent ) {
			if(!isTruncated){
				$('a.more', this).hide();
			}
		}
		 
	});
}

function getElsAt(top, left){
	return $("body").find("span.highlightNote img").filter(function(){
		return ($(this).css("visibility") == "visible" && $(this).offset().top == top && $(this).offset().left == left);
	});
}
	/*Note Display Changes End*/
// for deleting highlight from the context menu
$(function() {
	$(document).on("click", "span.highlight img.noteiconclass", function(e) {
		e.stopPropagation();
	});
	var delHighlightId;
	$(document).on("click", "span.highlight", function(e) {
		if (window.getSelection) {
			selection = window.getSelection().toString();
			selObj = window.getSelection();
		} else if (document.selection) {
			selection = document.selection.createRange().text;
			selObj = document.selection;
		}
		var anchorOffset = selObj.anchorOffset;
		var focusOffset = selObj.focusOffset;

		// alert("anchorOffset 1:"+anchorOffset);
		// alert("focusOffset 1 :"+focusOffset);

		if (anchorOffset == focusOffset) {
			e.preventDefault();
			var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
			//var deleteHighlight=propertiesMap.delete_highlight;//document.getElementById("deleteHighlight").value;
			delHighlightId = $(e.target).closest('span.highlight').attr('id');
			leftCoordinate =  e.pageX;
            topCoordinate =  e.pageY;
            
			constructAndShowNotesHighlightCopyMenu(propertiesMap.delete_highlight, delHighlightId);
			/*Remove highlight changes
			$('span.highlight').contextMenu({
				x : e.pageX + 10,
				y : e.pageY + 10
			});*/
		}
		
	});
	/*Remove highlight changes*/
	/*
	$.contextMenu({
		selector : 'span.highlight',
		trigger : 'none',
		autoHide : false,
		callback : function(key, options) {
			if (key == 'highlight') {
			//check 
				userobj.deleteHighlight(delHighlightId+'~~'+'highlight'+'~~'+'option');
				//check 
			} else if (key == 'note') {
				var newObject = $.extend(true, {}, selObj);
				showDialog(selection, newObject, key);
			}
		},
		items : {
			"highlight" : {
				name : deleteHighlight,
				icon : "deleteHighlight"
			}
		}
	});*/
});
/*
 * Purpose of method : This method would match the passed id to the id's
 * available in the userobj ,and call the reShowDialog() method by passing id
 * and the notes available for that particular id. Where and what condition it
 * should get called : On click of the span class "highlightNote". Argument
 * details : clicked span id. Return types : None
 * 
 */

function reshowNotes(selectedNoteId) {
	var notesMeta = userobj.Notes;
	var note;
	var selectedId;
	for ( var chapter in notesMeta) {
		var chapterMeta = notesMeta[chapter];
		for ( var index in chapterMeta) {
			var notes = chapterMeta[index];
			for ( var count in notes) {
				note = notes[count].currentText;
				selectedId = notes[count].id;
				if (selectedId == selectedNoteId) {
					showNotesInPopover(notes[count].text, note, selectedNoteId);
				}
			}
		}
	}
}


/*
 * Purpose of method : This method would match the passed id to the id's
 * available in the userobj ,and save back the modified notes text for that very
 * span. Where and what condition it should get called : On click of the span
 * class "highlightNote". Argument details : clicked span id, previously saved
 * note texts. Return types : None
 * 
 */

function updatereshowNotes(text, selectedNoteId) {
	var notesMeta = userobj.Notes;
	var note;
	var selectedId;
	for ( var chapter in notesMeta) {
		var chapterMeta = notesMeta[chapter];
		for ( var index in chapterMeta) {
			var notes = chapterMeta[index];
			for ( var count in notes) {
				note = notes[count].currentText;
				selectedId = notes[count].id;
				if (selectedId == selectedNoteId) {
					notes[count].currentText = text;
					notes[count].date = currentTime.getTime();
					writeEbookMetaToLocal(userobj).done(function (){
						/*serversynclocaldata().done(function (){
							
						})*/;	
					});
					
				}
			}
		}
	}
}

/*
 * Purpose of method : This method would reopen the pop up dialouge box for
 * notes editing and saving it back. Where and what condition it should get
 * called : On click of the span class "highlightNote". Argument details :
 * clicked span id, previously saved note texts. Return types : boolean
 * 
 */
function reShowDialog(current, noteId) {
	/*$("#bottom-ribbon").css("visibility","hidden");
	$("#bottom-ribbon-invisible").css("visibility","hidden");
	$("#mycontent").remove();
	var title=document.getElementById("notes").value;	
	var Save=document.getElementById("Save").value;
	var deleteData=document.getElementById("delete").value;
	*/
	var propertiesMap = getPropertiesMap();
	var dialogdiv = $("#dialogdiv");
	dialogdiv
			.dialog({
				width : 400,
				height : 180,
				autoOpen : false,
				modal : true,
				resizable: false,
				dialogClass: 'customPopup',
				buttons : [
						 {
							text : propertiesMap.delete_note,
							className : 'cancelButtonClass',
							click : function() {
							//check
								userobj.deleteNotes(noteId+'~~'+'notes');
								//check
								dialogdiv.dialog('close');
								/*Edit Note Changes
								$("#bottom-ribbon").css("visibility","visible");
								$("#bottom-ribbon-invisible").css("visibility","visible");
								*/
							}
						},{
							text : propertiesMap.save_note,
							className : 'saveButtonClass',
							click : function() {
								var text = $('#note-body').val();
								if (text == "") {
									$('.ui-dialog-buttonpane').append(
											"<div id='mycontent'></div>");
									$('#mycontent').css({
										"paddingLeft" : '7px',
										"paddingTop" : "4px"
									});
									$('#mycontent').text(
											propertiesMap.note_popup_placeholder)
											.css({
												"color" : "red",
												"font-size" : "14px"
											});
								} 
								else if (!(text.indexOf('&') == -1 && text.indexOf('|') == -1 && text.indexOf(';') == -1 && text.indexOf('%') == -1 && text.indexOf('$') == -1 && 
									text.indexOf('@') == -1 && text.indexOf('"') == -1 && text.indexOf('\'') == -1 && text.indexOf('\\') == -1 && text.indexOf('\\\\') == -1)) {
									$('.ui-dialog-buttonpane').append(
											"<div id='mycontent'></div>");
									$('#mycontent').css({
										paddingLeft : '7px',
										"paddingTop" : "4px"
									});
									$('#mycontent').text(
											"Special characters not allowed")
											.css({
												"color" : "red",
												"font-size" : "14px"
											});
								} 
								else {
									updatereshowNotes(text, noteId);
									$("#mycontent").remove();
									dialogdiv.dialog('close');
									/*Edit note changes
									$("#bottom-ribbon").css("visibility","visible");
									$("#bottom-ribbon-invisible").css("visibility","visible");
									*/
								}
							}
						}, {
							text : propertiesMap.cancel_note,
							className : 'cancelButtonClass',
							click : function() {
								dialogdiv.dialog('close');
							}
						}],

				open : function(event, ui) {

					var noteHtml = $('<div id ="noteContent"> <textarea id="note-body" cols="42" rows="8"></textarea></div>');

					$(this).html(noteHtml);
					$('#note-body').focus();
				}
			});
	$("#dialogdiv").addClass('noteDialog');
	dialogdiv.dialog('open');
	$("#note-body").val(current.data);
		
}

function showNotesInPopover(text, current, noteId){
	/*Note Display Changes*/
	var spanId = "span" + Math.floor((Math.random() * 10) + 1);
	var bookName = window.location.pathname.split('/')[2];
	var content = current
			+ "<a class='more' onclick='showMore(event)'>more</a>";

	if ($("#notesDiv").length == 0) {   
		var div = $("<div id='notesDiv' noteId ='"+noteId+"'></div>");
		var scrollWrapper = $("<div class='notesDivScrollWrapper'></div>");
		var innerDiv = $("<div id='notesContainer' class='notesContentContainer'></div>");
		div.append(scrollWrapper);
		scrollWrapper.append(innerDiv);
		
		var winWidth = $(window).width();
		
		div.css('height', '30%');
				
		if(winWidth>1024){
			div.css('width', '38%');
		}else{
			div.css('width', '384px');
		}
		
		$("#wrapper").append("<span class='divBefore'></span>");
		$("#wrapper").append(div);
	
		div.css('left', $("#" + noteId + " img").filter(':visible').offset().left - div.width() + 10);

		if (div.height() > ($("#epub_content").height() - parseInt($("#epub_content").css('padding-bottom')) - ($(
				"#" + noteId + " img").filter(':visible').offset().top - $("#top-ribbon").outerHeight()))) {
			div.css('top', $("#" + noteId + " img").filter(':visible').offset().top - div.height()-30);
			$('span.divBefore').css('top', $("#" + noteId + " img").filter(':visible').offset().top - 15);
			$('span.divBefore').css('left', $("#" + noteId + " img").filter(':visible').offset().left);
			$('#notesDiv').css('border-bottom', '2px solid red');
			$('span.divBefore').addClass('rotate');
		} else {
			div.css('top', $("#" + noteId + " img").filter(':visible').offset().top + 25);
			$('span.divBefore').css('top', $("#" + noteId + " img").filter(':visible').offset().top + 20);
			$('span.divBefore').css('left', $("#" + noteId + " img").filter(':visible').offset().left);
			$('#notesDiv').css('border-top', '2px solid red');
		}

	}
	if($(".notesText[noteId='" + noteId +"']").length == 0) {
		if($("#notesContainer .notesContentDiv").length>0){
			$("#notesContainer").append("<hr>");
		}
		
		$("#notesContainer").append(
				"<div class='notesContentDiv'><span class='notesHeading' title = '"+text+"'>"+text+"</span><span><img  src='/ePubReader/"
						+ bookName
						+ "/epubimages/Edit-Icon.png'/></span><span  id="
						+ spanId
						+ " class='notesText' noteId='"+noteId+"' style='max-height:5em;'>"
						+ content
						+ "</span>"
						+"</div>");
		$('span.highlightNote').filter("#" + noteId).css('text-decoration', 'underline');
	}
}

function setNotesPopoverPosition(){
	var noteId = $("#notesDiv").attr('noteId');
	$("#"+noteId +" img").trigger("click");
}

function findChildrenLengthRecursively(commonParent, start, nodesBefore,
		lengthBefore) {

	for ( var counter = start; counter < nodesBefore; counter++) {
		if (commonParent.childNodes[counter].nodeType == 1) {

			if (commonParent.childNodes[counter].childNodes.length > 0) {
				nodes = commonParent.childNodes[counter].childNodes.length;
				lengthBefore = findChildrenLengthRecursively(
						commonParent.childNodes[counter], 0, nodes,
						lengthBefore);
			}

		} else if (commonParent.childNodes[counter].nodeType == 3) {
			lengthBefore += $(commonParent.childNodes[counter]).text().length;
		}
	}
	return lengthBefore;
}

// this function returns the start sibling of the common ancestor
function findStartRecur(commonAncestor, selObj, start, flag) {
	for ( var count = 0; count < commonAncestor.childNodes.length; count++) {
		if (commonAncestor.childNodes[count] == selObj.anchorNode) {
			start = count;
			break;
		} else {
			if (commonAncestor.childNodes[count].childNodes.length > 0) {
				startBefore = start;
				startAfter = findStartRecur(commonAncestor.childNodes[count],
						selObj, start, flag);
				if (startAfter != startBefore) {
					start = count;
					break;
				}
			}
		}
	}
	return start;
}

// this function returns the end sibling of the common ancestor
function findEndRecur(commonAncestor, selObj, end, flag) {
	for ( var count = 0; count < commonAncestor.childNodes.length; count++) {
		if (commonAncestor.childNodes[count] == selObj.focusNode) {
			end = count;
			break;
		} else {
			if (commonAncestor.childNodes[count].childNodes.length > 0) {
				endBefore = end;
				endAfter = findEndRecur(commonAncestor.childNodes[count],
						selObj, end, flag);
				if (endAfter != endBefore) {
					end = count;
					break;
				}
			}
		}
	}
	return end;
}

// finding the offsets w.r.t. the selected node(start or end)
function findStartNodeFromStart(startNode, selObj, flag, length, startOrEnd) {

	for ( var c = 0; c < startNode.childNodes.length; c++) {

		if (startNode.childNodes[c].nodeType == 1) {
			data = findStartNodeFromStart(startNode.childNodes[c], selObj,
					flag, length, startOrEnd).split('#');
			flag = data[1];
			length = parseInt(data[0]);
			if (flag == 'true') {
				break;
			}
		} else if (startNode.childNodes[c].nodeType == 3) {
			if (startOrEnd == 'start') {
				if (startNode.childNodes[c] == selObj.anchorNode) {
					flag = 'true';
					break;
				}
			} else {
				if (startNode.childNodes[c] == selObj.focusNode) {
					flag = 'true';
					break;
				}
			}
			if (flag != 'true') {
				length += $(startNode.childNodes[c]).text().length;

			}
		}

	}

	return length + '#' + flag;
}

function isiPhone() {
	return (
	// Detect iPhone
	(navigator.platform.indexOf("iPhone") != -1) ||
	// Detect iPod
	(navigator.platform.indexOf("iPad") != -1));
}

/* UI cust - Darshan
/*function searchPositionPopup() {
	// alert(isiPhone());
	if (!isiPhone()) {
		if (!$("#search_container").is(':visible')) {
			return;
		}
		$("#search_container").css({
			left : ($(window).width() - $('#search_container').width()) / 1.15,
			top : ($(window).width() - $('#search_container').width()) / 17,
			position : 'absolute'
		});
	}
	if (isiPhone() && ($(window).width() > $(window).height())) {
		if (!$("#search_container").is(':visible')) {
			return;
		}
		$("#search_container").css({
			left : ($(window).width() - $('#search_container').width()) / 1.15,
			top : ($(window).width() - $('#search_container').width()) / 11.5,
			position : 'absolute'
		});
	}
	if ($(window).width() < $(window).height()) {
		if (!$("#search_container").is(':visible')) {
			return;
		}
		$("#search_container").css({
			width : '35%',
			left : ($(window).width() - $('#search_container').width()) / 1.3,
			top : ($(window).width() - $('#search_container').width()) / 8.5,
			position : 'absolute'
		});
	}
}*/
function searchPositionPopup(){
	// alert(isiPhone());
	//if (!isiPhone()) {
		if (!$("#search_container").is(':visible')) {
			return;
		}
		/*$("#search_container").css({
			left : ($(window).width() - $('#search_container').width()) / 1.15,
			top : ($(window).width() - $('#search_container').width()) / 17,
			position : 'absolute'
		});*/
		/*$("#search_field2").css({
			height: '10%'
		});*/
		
		
		/*UI:CUST: arsha.................*/


/*alert(popupheight);*/

		
		if(!isiPhone())	{	//resize only if its desktop .
			var windowHeight=$(window).height();
			var bottomRibbonHeight=$("bottom-ribbon").height();
			var topRibbonHeight=$("top-ribbon").height();
			var heightOfBook=windowHeight-bottomRibbonHeight-topRibbonHeight;
			var popupheight=(heightOfBook)/1.6-$("search_arrow").height();
			if(!$('#searchcontent').is(':empty')){//condition to prevent blank div from showing up.

				var maxHeight=$("#search_container").css("max-height");
				var  maxH=maxHeight.split("px");
				var popupMaxHeight=maxH[0];
				var contentMaxHeight=$("#searchcontent").css("max-height");
				/*default settings retained so that  resize happens only if required*/
				$("#search_container").css({
					position: 'absolute',
					background: 'black',
					///width:'40%', 
					//height: '320px'
					height: '320px'
				});

				$("#searchcontent").height(contentMaxHeight);
				if(!(popupheight>=popupMaxHeight)){		
					var bottompadding=$("#dummyDiv2").height()/4;
					$("#search_container").height(popupheight);
					var searchContentHeight=$("#search_container").height()-$("#search_field2").height()-$("#search_hrDivider").height()-bottompadding;
					$("#searchcontent").height(searchContentHeight);

				}

			}
		}/*desktop resizing code  ends here*/
		else{// if its ipad then   deafault settings
			if(!$('#searchcontent').is(':empty')){//condition to prevent blank div from showing up.
				$("#search_container").css({
					position: 'absolute',
					background: 'black',
					///width:'40%', 
					height: '320px'

				});
			}
		}


		
     
		$("#search_container").css({
			left : ($(window).width() - $('#search_container').width()) / 2,
			//top : ($(window).width() - $('#search_container').width()) / 6, //value changed from 7 to 6 to match new requirement.
			position : 'absolute'
		});
		$("#arrowID").css('left', $("#search_field").offset().left - $("#search_field2").offset().left+$("#search_field").width()/2-10);
	//}
/*	if (isiPhone() && ($(window).width() > $(window).height())) {
		if (!$("#search_container").is(':visible')) {
			return;
		}
		$("#search_container").css({
			left : ($(window).width() - $('#search_container').width()) / 1.15,
			top : ($(window).width() - $('#search_container').width()) / 11.5,
			position : 'absolute'
		});
	}
	if ($(window).width() < $(window).height()) {
		if (!$("#search_container").is(':visible')) {
			return;
		}
		$("#search_container").css({
			width : '35%',
			left : ($(window).width() - $('#search_container').width()) / 1.3,
			top : ($(window).width() - $('#search_container').width()) / 8.5,
			position : 'absolute'
		});
	}*/
}

//Changes Related to Highlight and Note  

function checkHighlight(){

      tempsel = $.extend(true, {}, selObj);
      selection=window.getSelection()
      .toString();
      var range = window.getSelection().getRangeAt(0),
        content = range.cloneContents(),
           span = document.createElement('SPAN');

      span.appendChild(content);
      //range.insertNode(span);

      var htmlContent = span.innerHTML;
      
      html=htmlContent;
      
      var key='highlight';
      
            
      processSelectedText(selection, tempsel, key, html);
      
      }


/*function getNote(){
	
	
	tempsel = $.extend(true, {}, selObj);
	var key='note';
	selection=window.getSelection()
	.toString();
	showDialog(selection, tempsel, key);
}*/
function getNote(){
    tempsel = $.extend(true, {}, selObj);
    var key='note';
    selection=window.getSelection()
    .toString();
    var range = window.getSelection().getRangeAt(0),
      content = range.cloneContents(),
         span = document.createElement('SPAN');
    span.appendChild(content);
    var htmlContent = span.innerHTML;
    html=htmlContent;
    showDialog(selection, tempsel, key,html);
}


/**
 * functioanlity to hide Info container - if clicked outside.
 */
$(document).mouseup(function (e){
        var container = $("#info_container");
if(!windowResizeInfo){
        if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
           {
              container.fadeOut(400);
              $(".arrow").fadeOut(400);
           }
}else{
	windowResizeInfo=false;
}
});

/**
 * functioanlity to history container - if clicked outside.
 */
$(document).mouseup(function (e){
        var container = $("#history_container");
        if(!windowHistorypoup){
        if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
           {
              container.fadeOut(400);
              $('#historyArrow').fadeOut(400);
           }
        }else{
        	windowHistorypoup=false;
        }
});

function getBookInfo(booksList, bookId) {
	var bookInfo;
	for ( var i in booksList) {
		if(booksList[i].bookId == bookId) {
			bookInfo = booksList[i];
			break;
		}
	}
	return bookInfo;
}

$("#show_info").click(function() {
	/*$("#background_overlay").css('opacity', '0.0');*/ //Important: commented out by Darshan for responsive implementation
	if (!$("#info_container").is(':visible')){
	
	
	epubMetaDetails = spineDetail.metaDetails;
	var title = epubMetaDetails["title"];
	var date = epubMetaDetails["date"];
	var epubsize = GetFromLocalStorage(bookName+'#size');
	var propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	var infoDetails = GetFromLocalStorage("allListDetails", obfuscation);
	var infoDetails = JSON.parse(infoDetails);
	var bookInfo = getBookInfo(infoDetails.books, bookId);

	outputStr = "<table id=\"infotable\" border=\"1\" width=\"100%\">"+
	//"<tr><td id=\"graycol\">Title:</td><td id=\"whitecol\">"+(title ? title : "NA")+"</td></tr>"+
	  "<tr><td id=\"graycol\">"+propertiesMap.label_published_date+":</td><td id=\"whitecol\">"+(bookInfo.purchaseDate ? bookInfo.purchaseDate : "NA")+"</td></tr>" +
	  "<tr><td id=\"graycol\">"+propertiesMap.label_size+":</td><td id=\"whitecol\">"+(bookInfo.epubSize ? bookInfo.epubSize : "NA")+"</td></tr></table>"; 
	
	$("#info_container").html(outputStr);
	
	$("#info_container").fadeIn(400);
	$(".arrow").fadeIn(400);
	/*$("#background_overlay").fadeIn(1000);
	$("#background_overlay").css('display', 'block');*/  //Important: commented out by Darshan for responsive implementation
}else{
	
	$("#info_container").fadeOut(400);
	$(".arrow").fadeOut(400);
}
	infoPositionPopup();
});

function infoPositionPopup() {
	if (!$("#info_container").is(':visible')) {
		return;
	}
	$("#info_container").css({
		left : ($(window).width() - $('#info_container').width()) / 2,
		//top : ($(window).width() - $('#info_container').width()) / 7,
		position : 'absolute'
	});
	$("#arrowPointer").css('left',$("#show_info").offset().left+$("#show_info").width()/2-7);
}

/* Recent History code added by Prashanth N. */
$("#show_history").click(function() {
	/*$("#background_overlay").css('opacity', '0.0');*/
	showHistory();
});




showHistory = function(){
	callfunction(username,bookName);
	$("#history_container").css('display', 'block');
	$("#historyArrow").css('display', 'block');
	$("#history_wrapper").css('display', 'block');
	/*$("#background_overlay").fadeIn(1000);
	$("#background_overlay").css('display', 'block');*/
	historyPositionPopup();
	
	return false;
};

function historyPositionPopup() {
	if (!$("#history_container").is(':visible')) {
		return;
	}
	
	/*Ui-cust:Arsha:- dynamic  resizing of window vertically*/
	/*Ui-cust:Arsha:- dynamic  resizing of window vertically*/
	if(!isiPhone()){
		var windowHeight=$(window).height();
		var bottomRibbonHeight=$("bottom-ribbon").height();
		var topRibbonHeight=$("top-ribbon").height();
		var heightOfBook=windowHeight-bottomRibbonHeight-topRibbonHeight;
		var popupheight=(heightOfBook)/1.6-$("#historyArrow").height();
		var headingHeight=$("#topborder").height();
		var top=$("#topborder").css('padding-top');
		ptop=top.split("px");
		var maxHeight=$("#history_container").css("max-height");
		var  maxH=maxHeight.split("px");
		var popupMaxHeight=maxH[0];
		if(!(popupheight>=popupMaxHeight)){
			
			$("#history_container").height(popupheight);
			var history_container1Height=$("#history_container").height()-headingHeight-ptop[0]-14+"px";
			$("#history_container1").height(history_container1Height);;
		}
		else{
			$("#history_container").height(maxHeight);
			$("#history_container1").css("height","80%");
		}    	
	
	}


	/* UI cust Suman */
	$("#history_container").css({
		//left : ($(window).width() - $('#history_container').width()) / 2,
		//top : ($(window).width() - $('#history_container').width()) / 8,
        'left': ($(window).width() - $('#history_container').width()) / 2,
		position : 'absolute'
	});
	$('#historyArrow').css('left',  $("#show_history").offset().left + $("#show_history").width() - 20);
	
}




function callfunction(user,bookfilename){
	
	var isHistory = "no";
	var outputNoStr = "";
	
/*	var outputStr = "<div id=\"topborder\">History</div>"*/;
	var outputStr = " ";
	var historyDetailsString = GetFromLocalStorage(user+"#history",obfuscation);
	historyDetails = JSON.parse(historyDetailsString);
	
	BookData=GetFromLocalStorage("allListDetails",obfuscation);
	var bookDetails = JSON.parse(BookData);
	booksList = bookDetails.books;

	for ( var i in booksList) {
		if (bookName== booksList[i].title){

			var bookName = booksList[i].title;
			var imagePath = booksList[i].bookImage;
			var shortDescription = booksList[i].shortDescription;
			var fileName = booksList[i].fileName;
			var bookDownlaodId = booksList[i].bookId;
			var updateVersion = booksList[i].updatedCount;
			var author= booksList[i].author;
			var shortDescription =booksList[i].shortDescription;

		}
	}
	
	var count=0;
	for(var history in historyDetails){
		if(history==bookfilename){
			isHistory = "yes";
			var list = historyDetails[history];
			for(row in list){
				count++;
				if(count>10){
					break;
				}
				var timestamp = list[row].timestamp;
				var now = new Date(timestamp);
				now = $.format.toBrowserTimeZone(now,"dd MMMM yyyy hh:mm a");
				
				var timeArray=now.split(" ");
				var nodeNameValue=list[row].nodeNameValue;
				var htmlName = list[row].htmlName;
				var nodeName = list[row].nodeName;
				var pageNo = list[row].pageNo;
				var offsets = list[row].offsets;

				var page_prefix="p";
				
				var chapter = htmlName;
				var offset = offsets;
				var displayPgno = page_prefix.concat(pageNo);
				var subTopic = nodeName;
				
				
				var displaychapter = getChapterName(chapter, subTopic);
					
				outputStr += "<div id=\"historymark\"><div id=\"bold\"><a style='color:#FFFFFF;' href='javascript:showHistoryPage(\""
						+ chapter
						+ "~~"
						+ offset
						+ "~~"
						+ pageNo
						+ "~~"
						+ subTopic
						+ "\")'>"
						+ displaychapter
						+ "</div></a><div id=\"datedisplay\">"
						+ timeArray[0]+" "+timeArray[1]+" "+timeArray[2]/*+" "+timeArray[3]+" "+timeArray[4]*/
						+ "<div id='pageNumber'>"
						+ displayPgno
						+ "</div></div></div>";
			}
		}		
	}

	if(isHistory=="no"){	
		outputNoStr = "<div  style=\"color: #bcbec0;font-family: Helvetica;font-size: 14px;font-weight: lighter;text-align: center;padding-top: 20px;padding-bottom: 20px;\">No  history found</div>";
		$("#history_container1").css('height','56px');
		$("#history_container").css('height','117px');
		$("#history_container1").html(outputNoStr);
	}
	
	else{
		outputStr += "<div id=\"bottomborder\"></div>";
		$("#history_container").css('height','425px');
		$("#history_container1").html(outputStr);	
	}

}

showHistoryPage = function(bookMark) {
		
			showClickedPage(bookMark).done(function(){
		
			$("#history_container").fadeOut(400);
			/*UI cust Suman */
			$("#historyArrow").fadeOut(400);
			
			return false;
			});
};
/* Prashanth N. - end of Recent History code */
/* merge code added check */
/*check add*/
//Remove Highlight and Note Option  from jumpTOPage Feature
$("#pageField").bind("touchstart", function(event) {
	//IPAD case
	if($(prev).css("visibility") == "hidden"){
	window.location  = 'not:webToNativeCall';
	}
	
});
//Remove Highlight and Note Option  from Search Box
$("#searchQuery").bind("touchstart", function(event) {
	//IPAD case
	if($(prev).css("visibility") == "hidden"){
	window.location  = 'not:webToNativeCall';
	}
	
});


userEbook.prototype.searchForOrphanAnnotation = function(searchDetails) {
	  $("#popup_container").fadeOut(400);
	//console.log("searchDetails"+searchDetails);
	var searchPar=searchDetails.split('~~');
	var deleteKey=searchPar[1];
	var annotationType=searchPar[2];
	//26/12
	//var q=searchPar[0];
	var q=unescape(searchPar[0]);
	var notesText;
	var s="";
	var bookname=epubFileName;
	if(annotationType=='Notes'){
		notesText=	searchPar[3];
	}
	
	//console.log("inside searchAndRetrieve");
	
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
			   
			//	console.log("index Status:"+res);
				data=res;
				
			},
			error : function(xhr, textStatus, errorThrown) {
				for(n in xhr) {
					//console.log('Error xhr:' + xhr[n]);
					}
				//console.log('textStatus :' + textStatus);
				//console.log('errorThrown :' + errorThrown);
			}
		});
    	}
    	
	    	
	    	var checkIndexing=JSON.stringify(data);
	    	var checkstring = jQuery.parseJSON(checkIndexing);
	 
    	if(checkstring.indexStatus!=true)
		{
		errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri;font-size:110%\"><b>Info: Indexing is on Progress...</b><br/><br/>" +
				"Your Book <b>"+epubFileName+"</b> is currently being indexed... <br/><br/>Kindly try after some time.</div>";
	$("#annsearchresults").html(errorstring);
	showAnnSearchResults();
		}
    	else{
    		if (isConnected) {
   $.ajax({
		type : 'POST',
		async: false,
		data : {
			q : s,
			bname : bookname,
			job:'annotsearch'
		},
		url : baseurl1+ 'dtsearch',
		
		success : function(response) {
		   	var responseObj=decodeSearchRequest(response.content);
			//console.log('inside success');
			searchJson=JSON.stringify(responseObj);
			populateAnnSearchResults(deleteKey,annotationType,notesText);
			showAnnSearchResults();
			//console.log('searchJson :' + searchJson);
		},
		error : function(xhr, textStatus, errorThrown) {
			//var getI18nMap = JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
			var propertiesMap = getPropertiesMap();
			errorstring = "<div style=\"padding-top:2%;padding-left:2%;padding-right:2%;font-family: calibri\">"
					+propertiesMap["couldnot_find_search"] +"<p><br>"+propertiesMap["suggestions"]+"</p><br> <ul style=\"padding-left:8%\"><li>"+propertiesMap["make_sure"]+"</li><li>"+propertiesMap["try_different_keywords"]+"</li><li>"+propertiesMap["try_more_general_keywords"]+"</li><li>"+propertiesMap["try_fewer_keywords"]+"</li></ul> </div>";
						$("#annsearchresults").html(errorstring);
						showAnnSearchResults();
			for(n in xhr) {
				//console.log('Error xhr:' + xhr[n]);
				}
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
			}
	});}
    		
	
    }

	
};

function populateAnnSearchResults(deleteKey,annotationType,notesText) {
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
	//console.log(resultfound);
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
//						//console.log("start[y]:"+start[y]);
//					});
//					var end=offset[x].end;
//					$(end).each(function(z) {
//						en[z-1]=end[z];
//						//console.log("end[z]:"+end[z]);
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
			var id='button'+'_'+j+'_'+i;
			var searchResults=escape(texttobeshown)+'~~'+deleteKey+'~~'+annotationType+'~~'+escape(book)+"~~"+escape(filename)+"~~"+escape(keyword)+"~~"+arrayPosition+"~~"+escape(curtoken)+"~~"+escape(prevtoken)+"~~"+haswildchar+'~~'+notesText+'~~'+id;
			//	searchResults=searchResults+'"result_text"'+':'+'"'+texttobeshown+'"'+',';
			if(i==0 && j==0){
			firstSearchResult=searchResults;
			}
				
			//	searchResults=searchResults+'"result_text"'+':'+'"'+texttobeshown+'"'+',';
				//console.log("search result object"+searchResults);
				/*outputStr += "<div><div id=\"annshowtext\">"+chapname+"   "+"</div><div id=\"showtextbutton\" ><button style=\"background:transparent;border:none;\" onclick='javascript:loadsearchdata(\""+searchResults+"\")'>"                                
                    + "<img src="+baseurl+"epubimages/right_arrow.png\" width=\"20\" height=\"20\">"                                
                    + "</img></button></div></div><br><br><div id=\"annsearchresultsdiv\">"+"</div>";*/
				//id=\"preButtondiv\"
				// Pravin Changes LN --- 2 lines in place of above 3 lines.
				
				outputStr += "<div id=\""+id+"\" style=\"height:78px;\"><button style=\"background:transparent;border:none;width:100%\" onclick='javascript:loadsearchdata(\""+searchResults+"\")'><div id=\"annshowtext\">"+chapname+"   "+"</div>"                                
                +"</button>"+"<div style=\"color:white;border:none;width:96%;height:43px;padding-left: 15px;\" >"+texttobeshown.substring(0,110)+'...'+"</div>"+"</div><div id=\"annsearchresultsdiv\">"+"</div>";
				
				
				
			
			//	+"<a class=\"searchlink\" href='javascript:getXpath(\""+book+"~~"+filename+"~~"+keyword+"~~"+arrayPosition+"~~"+curtoken+"~~"+prevtoken+"~~"+haswildchar+"\");'>..."+texttobeshown+"...</a></div><hr />";
				
			
		});
		//$("#annsearchcontent").append($('</div>').html(outputStr));
		//$('</div').html(outputStr);
		$("#annsearchresults").html(outputStr);
		
		//loadsearchdata(firstSearchResult);
	});
	if(firstSearchResult!=undefined){
	loadsearchdata(firstSearchResult);
	}
	if(jsonstring.searchResult.resultFound==0)
	{
		//var getI18nMap = JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
		var propertiesMap = getPropertiesMap();
		errorstring="<div id=\"errordiv\" align=\"left\">" +
		propertiesMap["couldnot_find_search"]+"<p><br>"+propertiesMap["suggestions"]+"</p><br> <ul style=\"padding-left:8%\"><li>"+propertiesMap["make_sure"]+"</li><li>"+propertiesMap["try_different_keywords"]+"</li><li>"+propertiesMap["try_more_general_keywords"]+"</li><li>"+propertiesMap["try_fewer_keywords"]+"</li></ul> </div>";
		$("#annsearchresults").html(errorstring);
	showAnnSearchResults();
	}
	
}

function showAnnSearchResults(){
	$("#ann_search_container").fadeIn(400);
	 // $("#ann_search_container").slideDown(500);
	  $("#background_overlay").css('display','block');
	  $("#background_overlay").css('opacity','0');
	  searchAnnPositionPopup();
}

function searchAnnPositionPopup() {
	// alert(isiPhone());
	if (!isiPhone()) {
		if (!$("#ann_search_container").is(':visible')) {
			return;
		}
		$("#ann_search_container").css({
			left : ($(window).width() - $('#ann_search_container').width()) / 1-250,
			top : ($(window).width() - $('#ann_search_container').width()) / 8+40,
			position : 'absolute'
		});
	}
	if (isiPhone() && ($(window).width() > $(window).height())) {
		if (!$("#ann_search_container").is(':visible')) {
			return;
		}
		$("#ann_search_container").css({
			left : ($(window).width() - $('#ann_search_container').width()) / 1.15-250,
			top : ($(window).width() - $('#ann_search_container').width()) / 11.5+40,
			position : 'absolute'
		});
	}
	if ($(window).width() < $(window).height()) {
		if (!$("#ann_search_container").is(':visible')) {
			return;
		}
		$("#ann_search_container").css({
			width : '35%',
			left : ($(window).width() - $('#ann_search_container').width()) / 1.3-250,
			top : ($(window).width() - $('#ann_search_container').width()) / 8.5+40,
			position : 'absolute'
		});
	}
}

/*
 * purpose of method - To Populate all annotaions Content . where and what
 * condition it should get called - When User clicks on All option. if any
 * conditions inside then comment for that - argument details - Null. return
 * types - Null.
 */
showAllAnnotations = function() {
	$("#allannotationscontent").html('');
	var map = {};
	var orphanMap = {};
	readEbookMetaFromLocal(username, epubFileName).done (function (ebookmdata){	
	ebookmetadata=ebookmdata;
	orphanMap=userobj.populateAllOrphanBookMarkContent(orphanMap,ebookmetadata);
	orphanMap=userobj.populateAllOrphanHighlightContent(orphanMap,ebookmetadata);
	orphanMap=userobj.populateAllOrphanNotesContent(orphanMap,ebookmetadata);
	map=userobj.populateAllBookMarkContent(map,ebookmetadata);
	map=userobj.populateAllHighlightContent(map,ebookmetadata);
	map=userobj.populateAllNotesContent(map,ebookmetadata);
	
	var keysOrphan = Object.keys(orphanMap).sort();
	keysOrphan=keysOrphan.reverse();
	for(var key in keysOrphan){
	var keyvalue=keysOrphan[key];
	var keyobject=unescape(orphanMap[keyvalue]);
	$("#allannotationscontent").append(keyobject);
	}
	
	var keys = Object.keys(map).sort();
	keys=keys.reverse();
	for(var key in keys){
	var keyvalue=keys[key];
	var keyobject=unescape(map[keyvalue]);
	$("#allannotationscontent").append(keyobject);
	}
	
	$("#popup_container").fadeIn(1000);
	/*$("#background_overlay").fadeIn(1000);
	$("#background_overlay").css('display', 'block');*/

	positionPopup();
	// showBookMarkedPage();
	return false;
	});
};


userEbook.prototype.populateAllBookMarkContent = function(map,ebookmetadata) {

	var bookmarkMeta = ebookmetadata.bookmarks;
	var chapName= new Array();
	var bookmarkList= new Array();
	var id;
	var offset;
	var startingStr;
	var outputStr = "";
	var deleteData=document.getElementById("delete").value;

	for ( var chapter in bookmarkMeta) {
		var chapterMeta = bookmarkMeta[chapter];
		for ( var index in chapterMeta) {
			var bookmark = chapterMeta[index];
			//id = bookmark.id;
			//offset = bookmark.offset;
			//startingStr = bookmark.startingStr;
			//subTopic = bookmark.subTopic;
			//displaychapter = getChapterName(chapter, subTopic);
			//displayPgno = bookmark.pageNo;
			//fullDate = bookmark.date;		
			if(bookmark.deleteFlag!="T"){
			bookmarkList.push(chapterMeta[index]);
			chapName[bookmark.id]=chapter;
			}
			
		}
	}
	bookmarkList=  userobj.sortData(bookmarkList);
	   for(index in bookmarkList ){
		   var bookmark = bookmarkList[index];
		    id = bookmark.id;
			offset = bookmark.offset;
			startingStr = bookmark.startingStr;
			subTopic = bookmark.subTopic;
			chapter= chapName[id];
			//displaychapter = getChapterName(chapter, subTopic);
			displaychapter=bookmark.chapName;
			displayPgno = bookmark.pageNo;
			timestamp = bookmark.date;
			var  fullDate= new Date(parseInt(timestamp));
			fullDate = $.format.toBrowserTimeZone(fullDate,"dd MMMM yyyy hh:mm a");
			var timeArray=fullDate.split(" ");
			if (displaychapter != undefined) {
				var imageString="";
                imageString ="<span id=\"bookmarkIcon\">" 
                      +"</span>";
                
				outputStr =imageString
				    +"<div id=\"bookmark\"><div id=\"bold\"><a href='javascript:showBookMarkedPage(\""
				    + chapter
				    + "~~"
				    + offset
				    + "~~"
				    + displayPgno
				    + "~~"
				    + subTopic
				    + "\")'>"
				    + displaychapter
				    + "</a>"
                    +"<div id=\"datedisplay\">"
                    + timeArray[0]+" "+ timeArray[1].substring(0,3)+" "+timeArray[2]
				    
                    +"<div id='annotationpagenumber'>" + 'p'+displayPgno + "</div>"
                    +"<div id='annotationEditSearchButton'><a  href='' style=\"pointer-events: none;\">"+"<img src="+baseurl+"epubimages/Search-Icon.png style=\"visibility: hidden;pointer-events: none;\" alt=\"edit\">"                                
                    + "</img></a></div>"
                    +"<div id='annotationdeleteButton'><a href='javascript:userobj.removeBookmarkFromList(\""
                    + displayPgno+'~~'+'bookmark'+"\")'>"+"<img src="+baseurl+"epubimages/RubbishCan-Icon.png alt=\"delete\">"                                
                    + "</img></a></div></div></div></div>";
				map[timestamp]=escape(outputStr);

		}
		
	   }
	   return map;
//	$("#allannotationscontent").html(outputStr);
};

userEbook.prototype.populateAllOrphanBookMarkContent = function(map,ebookmetadata) {

	var orphanBookmarkMeta = ebookmetadata.orphanBookmarks;
	var id;
	var offset;
	var startingStr;
	var outputStr = "";
	var orphans = false;
	for ( var chapter in orphanBookmarkMeta) {
		var chapterMeta = orphanBookmarkMeta[chapter];
		for ( var index in chapterMeta) {
			var orphanBookmark = chapterMeta[index];
			id = orphanBookmark.id;
			offset = orphanBookmark.offset;
			startingStr = orphanBookmark.startingStr;
			subTopic = orphanBookmark.subTopic;
			//displaychapter = getChapterName(chapter, subTopic);
			displaychapter=orphanBookmark.chapName;
			displayPgno = orphanBookmark.pageno;
			timestamp = orphanBookmark.date;
			var  fullDate= new Date(parseInt(timestamp));
			fullDate = $.format.toBrowserTimeZone(fullDate,"dd MMMM yyyy hh:mm a");
			var timeArray=fullDate.split(" ");
			if (displaychapter != undefined) {
				var imageString="";
                imageString ="<span id=\"bookmarkIcon\">" 
                      +"</span>";
                
				outputStr = imageString
				
					+"<div id=\"bookmark\"><div id=\"bold\"><span id=\"orphanHLB\" style=\"color: #999999;\">"
					+ displaychapter
					+"</span>"
					+"<div id=\"datedisplay\" style=\"color: #999999;\">"
                    + timeArray[0]+" "+ timeArray[1].substring(0,3)+" "+timeArray[2]
				    +"<div id='annotationpagenumber' style=\"color: #999999;\">" + 'p'+displayPgno + "</div>"
                    +"<div id='annotationEditSearchButton'><a  href='javascript:userobj.searchForOrphanAnnotation(\""
                    + escape(displaychapter)+'~~'+displayPgno+'~~'+'BookMark'+"\")'>"+ "<img src="+baseurl+"epubimages/Search-Icon.png alt=\"search\">"                                
                    + "</img></a></div>"
                    +"<div id='annotationdeleteButton'><a href='javascript:userobj.removeBookmarkFromList(\""
                    + displayPgno+'~~'+'orphanbookmark'+"\")'>"+ "<img src="+baseurl+"epubimages/RubbishCan-Icon.png alt=\"delete\">"                                
                    + "</img></a></div></div></div></div>";
				map[timestamp]=escape(outputStr);
				
			}
		}
		
	}
	return map;
//	$("#allannotationscontent").append(outputStr);
};

userEbook.prototype.populateAllHighlightContent = function(map,ebookmetadata) {
	var highlightMeta = ebookmetadata.HighLights;
	var highlightArray= new Array();
	var chapName= new Array();
	
	
	// console.log("highlightMeta" + JSON.stringify(highlightMeta, null, 4));
	var id;
	var offset;
	var fullDate;
	var selection = "";
	var outputStr = "";
	var pageNo;
	var listOfSelectedIds = [];
	var deleteData=document.getElementById("delete").value;
	for ( var chapter in highlightMeta) {
		var chapterMeta = highlightMeta[chapter];
		for ( var index in chapterMeta) {

			var highlight = chapterMeta[index];
			for ( var count in highlight) {
				var present = false;
				id = highlight[count].id;
				for ( var i in listOfSelectedIds) {
					// if this id is not in list ..continue..
					if (id == listOfSelectedIds[i]) {
						present = true;
						break;
					}
				}
				if (present == false && highlight[count].deleteFlag!="T") {
					listOfSelectedIds.push(id);
					highlightArray.push(highlight[count]);
					chapName[highlight[count].id]= chapter;
					
				}
			}
		}
	} 
	highlightArray= userobj.sortData(highlightArray);
	          for(index in highlightArray){
	        	  var highlight= highlightArray[index];
	        	  id= highlight.id;
					selection = highlight.text;
					if(selection.indexOf("~~")!=-1){
						strs= selection.split("~~");
						printno= strs[1];
						selection= strs[0];
					}
					else{
						printno=null;
					}
					if(printno!=null){	
						if(selection.indexOf(printno)!=-1){
						str = selection.split(printno);
						selection= str[0]+str[1];
						}
					}
					subtopic = highlight.subtopic;
					var chapter= chapName[id];
					//displaychapter = getChapterName(chapter, subtopic);
					displaychapter=highlight.chapName;
					timestamp = highlight.date;
					var  fullDate= new Date(parseInt(timestamp));
					fullDate = $.format.toBrowserTimeZone(fullDate,"dd MMMM yyyy hh:mm a");
					var timeArray=fullDate.split(" ");
					pageNo = highlight.pageNo;
					//if (selection.length < 50) {
					if (selection != undefined && displaychapter != undefined) {
					var imageString="";
	                imageString ="<span id=\"highlightIcon\">" 
	                      +"</span>";
	                outputStr = imageString
                            +"<div id=\"highlight\"><div id=\"bold\">"
							+"<a href='javascript:userobj.showHighlight(\""
							+ id
							+ "\");'>"
							+displaychapter
							+"</a>"
		                    +"<div id=\"datedisplay\">"+ timeArray[0]+" "+ timeArray[1].substring(0,3)+" "+timeArray[2]
		                    +"<div id='annotationpagenumber'>" + 'P'+pageNo + "</div>"
		                    +"<div id='annotationEditSearchButton'><a  href='' style=\"pointer-events: none;\">" + "<img src="+baseurl+"epubimages/Search-Icon.png style=\"visibility: hidden;pointer-events: none;\" alt=\"edit\">"                                
		                    + "</img></a></div>"
		                    +"<div id='annotationdeleteButton'><a href='javascript:userobj.deleteHighlight(\""
							+ id +'~~'+'highlight'+'~~'+'view'+ "\")'>"+"<img src="+baseurl+"epubimages/RubbishCan-Icon.png alt=\"delete\" >"                                
		                    + "</img></a></div></div>"
		                    + "<div id=\"text\">"
                            +  selection
                            + "</div>"
							+"</div></div>";
						map[timestamp]=escape(outputStr);		
					}
					/*} else {
						
						outputStr = "<div id=\"hl\"><div><img id=\"i\" style=\"margin-top: 30px;margin-left: 10px;\" src="+baseurl+"epubimages/icon_hilight_green.png position: absolute;></img>"
							+"<div id=\"bold\" style=\" margin-top: -30px; margin-left: 50px;width:100%;\" position: relative;>"+ displaychapter+"</div>"
							+"<a style=\" text-decoration: bold; margin-left: 50px; color: black !important;\" href='javascript:userobj.showHighlight(\""+ id+ "\");'>"+selection.substring(0, 50)+ "..."+ "</a>"
	                    +"<div id=\"annotationdatetime\">"+ timeArray[0]+" "+ timeArray[1]+" "+timeArray[2]+" "+timeArray[3]+" "+timeArray[4]+ "</div>"
	                    +"<div id='annotationpagenumber'>" + pageNo+ "</div>"
	                    +"<div id='annotationEditSearchButton'><a  href=''>" + "<img src="+baseurl+"epubimages/icon_edit.png style=\"visibility: hidden;\" alt=\"edit\" >"                                
	                    + "</img></a></div>"
	                    +"<div id='annotationdeleteButton'><a  href='javascript:userobj.deleteHighlight(\""
						+ id + '~~'+'highlight'+'~~'+'view'+"\")'>" + "<img src="+baseurl+"epubimages/icon_delete.png alt=\"delete\" >"                                
	                    + "</img></a></div>" +
						"</div></div>";
						map[timestamp]=escape(outputStr);							
					}*/
	          }
					//listOfSelectedIds.push(id);
				//}
		//	}
		//}
	//}
//	$("#allannotationscontent").append(outputStr);
	          return map;
};
userEbook.prototype.populateAllOrphanHighlightContent = function(map,ebookmetadata) {
	var orphanHighlightMeta = ebookmetadata.orphanHighLights;
	// console.log("highlightMeta" + JSON.stringify(highlightMeta, null, 4));
	var id;
	var offset;
	var timestamp;
	var selection = "";
	var outputStr = "";
	var pageNo;
	var listOfSelectedIds = [];
	var orphans = false;
	var deleteData=document.getElementById("delete").value;
	for ( var chapter in orphanHighlightMeta) {
		var chapterMeta = orphanHighlightMeta[chapter];
		for ( var index in chapterMeta) {

			var highlight = chapterMeta[index];
			for ( var count in highlight) {
				var present = false;
				id = highlight[count].id;
				for ( var i in listOfSelectedIds) {
					// if this id is not in list ..continue..
					if (id == listOfSelectedIds[i]) {
						present = true;
						break;
					}
				}
				if (present == false && highlight[count].deleteFlag!="T") {
					selection = highlight[count].text;
					subtopic = highlight[count].subtopic;
					//displaychapter = getChapterName(chapter, subtopic);
					displaychapter=highlight[count].chapName;
					timestamp = highlight[count].date;
					var  fullDate= new Date(+timestamp);
					fullDate = $.format.toBrowserTimeZone(fullDate,"dd MMMM yyyy hh:mm a");
					var timeArray=fullDate.split(" ");
					pageNo = highlight[count].pageNo;
				/*	if (selection.length < 50) {*/
					if (selection != undefined && displaychapter != undefined) {
						var imageString="";
		                imageString ="<span id=\"highlightIcon\">" 
		                      +"</span>";
						outputStr =imageString
						    +"<div id=\"highlight\"><div id=\"bold\"><span id=\"orphanHLB\" style=\"color: #999999;\">"
						    +displaychapter
						    +"</span>"
							
	                    +"<div id=\"datedisplay\" style=\"color: #999999;\">"
	                    + timeArray[0]+" "+ timeArray[1].substring(0,3)+" "+timeArray[2]
						
	                    +"<div id='annotationpagenumber' style=\"color: #999999;\">" + 'p'+pageNo + "</div>"
	                    +"<div id='annotationEditSearchButton'><a  href='javascript:userobj.searchForOrphanAnnotation(\""
	                    + escape(selection)+'~~'+id+'~~'+'Highlights' + "\")'>" + "<img src="+baseurl+"epubimages/Search-Icon.png alt=\"search\" >"                                
	                    + "</img></a></div>"
	                    +"<div id='annotationdeleteButton'><a href='javascript:userobj.deleteHighlight(\""
						+ id +'~~'+'orphanhighlight'+'~~'+'view'+ "\")'>" + "<img src="+baseurl+"epubimages/RubbishCan-Icon.png alt=\"delete\" >"                                
	                    + "</img></a></div></div>"
	                    + "<div id=\"text\" style=\"color: #999999;\">"
                        +  selection
                        + "</div>"
						+ "</div></div>";
						map[timestamp]=escape(outputStr);	
					}
					/*} else {
						
						outputStr += "<div id=\"hl\" style=\"text-decoration: none; color: grey !important;\"><div><img id=\"i\" style=\"margin-top: 30px;margin-left: 10px;\" src=\"./epubimages/arrow_first.png;\" position: absolute;></img></div>"
							+"<div id=\"bold\" style=\" margin-top: -20px; margin-left: 50px;\" position: relative;>"+displaychapter+(selection).substring(0, 50)+ "..." + "</div>"
	                    +"<div id=\"annotationdatetime\">" + fullDate + "</div>"
	                    +"<div id='annotationpagenumber'>"+ pageNo + "</div>"
	                    +"<div id='annotationEditSearchButton'><button  onclick='javascript:userobj.searchForOrphanAnnotation(\""
	                    + (selection).substring(0, 50)+'~~'+id+'~~'+'Highlights'+ "\")'>"+ "Search" + "</button></div>"
	                    +"<div id='annotationdeleteButton'><button  onclick='javascript:userobj.deleteOrphanHighlight(\""
						+ id + "\")'>" + deleteData	+ "</button></div>"
						+"</div>";
												
					}*/

					listOfSelectedIds.push(id);
				}
			}
		}
		
	}
return map;
//	$("#allannotationscontent").append(outputStr);
};

userEbook.prototype.populateAllNotesContent = function(map,ebookmetadata) {
	var notesMeta = ebookmetadata.Notes;
	var notesArray= new Array();
	var chapName= new Array();
	var id;
	var offset;
	var fullDate;
	var selection = "";
	var outputStr = "";
	var pageNo;
	var listOfSelectedIds = [];
	var deleteData=document.getElementById("delete").value;
	for ( var chapter in notesMeta) {
		var chapterMeta = notesMeta[chapter];
		for ( var index in chapterMeta) {

			var notes = chapterMeta[index];
			for ( var count in notes) {
				var present = false;
				id = notes[count].id;
				for ( var i in listOfSelectedIds) {
					// if this id is not in list ..continue..
					if (id == listOfSelectedIds[i]) {
						present = true;
						break;
					}
				}

				if (present == false && notes[count].deleteFlag!="T") {
					listOfSelectedIds.push(id);
					notesArray.push(notes[count]);
					chapName[notes[count].id]= chapter;
				}
			}
		}
	}
	notesArray= userobj.sortData(notesArray);
	for(index in notesArray){
		            var notes= notesArray[index];
		            id= notes.id;
					selection = notes.text;
					if(selection.indexOf("~~")!=-1){
						strs= selection.split("~~");
						printno= strs[1];
						selection= strs[0];
					}
					else{
						printno=null;
					}
					if(printno!=null){	
						if(selection.indexOf(printno)!=-1){
						str = selection.split(printno);
						selection= str[0]+str[1];
						}
					}
					timestamp = notes.date;
					var fullDate= new Date(parseInt(timestamp));
					fullDate = $.format.toBrowserTimeZone(fullDate,"dd MMMM yyyy hh:mm a");
					var timeArray=fullDate.split(" ");
					subtopic = notes.subtopic;
					var chapter= chapName[id];
					//displaychapter = getChapterName(chapter, subtopic);
					displaychapter=notes.chapName;
					pageNo = notes.pageNo;
					var noteText=notes.currentText;
					if (selection != undefined && displaychapter != undefined) {
						//if (selection.length < 50) {
						var imageString="";
		                imageString ="<span id=\"noteIcon\">" 
		                      +"</span>";
		                outputStr =imageString
                            +"<div id=\"note\"><div id=\"bold\">"
                            +"<a  href='javascript:userobj.showNote(\""
                            + id
                            + "\");'>"
                            +displaychapter
                            +"</a>"
		                    +"<div id=\"datedisplay\">"
		                    + timeArray[0]+" "+ timeArray[1].substring(0,3)+" "+timeArray[2]
		                    +"<div id='annotationpagenumber'>" + 'p'+pageNo + "</div>"
		                    +"<div id='annotationEditSearchButton'><a  href='' style=\"pointer-events: none;\">" + "<img src="+baseurl+"epubimages/Search-Icon.png style=\"visibility: hidden;pointer-events: none;\" alt=\"edit\" >"                                
		                    + "</img></a></div>"
		                    +"<div id='annotationdeleteButton'><a href='javascript:userobj.deleteNotes(\""
							+ id +'~~'+'notes'+'~~'+'view'+ "\")'>" + "<img src="+baseurl+"epubimages/RubbishCan-Icon.png alt=\"delete\" >"                                
		                    + "</img></a></div></div>"
		                    + "<div id=\"text\">"
	                        +  noteText
	                        + "</div>"
							+"</div></div>";
							map[timestamp]=escape(outputStr);
														
					/*	} else {
							outputStr = "<div id=\"nt\"><div><img id=\"i\" style=\"margin-top: 30px;margin-left: 10px;\" src="+baseurl+"epubimages/icon_note_pink.png position: absolute;></img>"
								+"<div id=\"bold\" style=\" margin-top: -30px; margin-left: 50px;width:100%;\" position: relative;>"+ displaychapter+"</div>"
								+"<a style=\" text-decoration: bold; color: black !important;margin-left: 50px;\" href='javascript:userobj.showNote(\""+ id+ "\");'>"+selection.substring(0, 50)+ "..." + "</a>"
		                    +"<div id=\"annotationdatetime\">"+ timeArray[0]+" "+ timeArray[1]+" "+timeArray[2]+" "+timeArray[3]+" "+timeArray[4]+ "</div>"
		                    +"<div id='annotationpagenumber'>"+ pageNo+ "</div>"
		                    +"<div id='annotationEditSearchButton'><a  href=''>" + "<img src="+baseurl+"epubimages/icon_edit.png alt=\"edit\" >"                                
		                    + "</img></a></div>"
		                    +"<div id='annotationdeleteButton'><a  href='javascript:userobj.deleteNotes(\""
							+ id +'~~'+'notes'+'~~'+'view'+ "\")'>" + "<img src="+baseurl+"epubimages/icon_delete.png alt=\"delete\" >"                                
		                    + "</img></a></div>"
							+"</div></div>";
							map[timestamp]=escape(outputStr);							
						}*/
					
					}
	}
	return map;
//	$("#allannotationscontent").append(outputStr);
};

userEbook.prototype.populateAllOrphanNotesContent = function(map,ebookmetadata) {
	var orphanNotesMeta = ebookmetadata.orphanNotes;
	var id;
	var offset;
	var timestamp;
	var selection = "";
	var outputStr = "";
	var pageNo;
	var listOfSelectedIds = [];
	var orphans = false;
	var deleteData=document.getElementById("delete").value;
	for ( var chapter in orphanNotesMeta) {
		var chapterMeta = orphanNotesMeta[chapter];
		for ( var index in chapterMeta) {

			var notes = chapterMeta[index];
			for ( var count in notes) {
				var present = false;
				id = notes[count].id;
				for ( var i in listOfSelectedIds) {
					// if this id is not in list ..continue..
					if (id == listOfSelectedIds[i]) {
						present = true;
						break;
					}
				}

				if (present == false && notes[count].deleteFlag!="T") {
					selection = notes[count].text;
					timestamp = notes[count].date;
					var fullDate= new Date(+timestamp);
					fullDate = $.format.toBrowserTimeZone(fullDate,"dd MMMM yyyy hh:mm a");
					var timeArray=fullDate.split(" ");
					subtopic = notes[count].subtopic;
					//displaychapter = getChapterName(chapter, subtopic);
					displaychapter=notes[count].chapName;
					pageNo = notes[count].pageNo;
					var notesText=notes[count].currentText;
					if (selection != undefined && displaychapter != undefined) {
					/*	if (selection.length < 50) {*/
						var imageString="";
		                imageString ="<span id=\"noteIcon\">" 
		                      +"</span>";
							outputStr =imageString
								+"<div id=\"note\"><div id=\"bold\"><span id=\"orphanHLB\" style=\"color: #999999;\">"
								+displaychapter
								+"</span>"
		                    +"<div id=\"datedisplay\" style=\"color: #999999;\">"
		                    + timeArray[0]+" "+ timeArray[1].substring(0,3)+" "+timeArray[2]
		                    
		                    +"<div id='annotationpagenumber' style=\"color: #999999;\">"+ 'p'+pageNo + "</div>"
		                    +"<div id='annotationEditSearchButton'><a  href='javascript:userobj.searchForOrphanAnnotation(\""
		                    + escape(selection)+'~~'+id+'~~'+'Notes'+'~~'+notesText + "\")'>" + "<img src="+baseurl+"epubimages/Search-Icon.png alt=\"search\" >"                                
		                    + "</img></a></div>"
		                    +"<div id='annotationdeleteButton'><a href='javascript:userobj.deleteNotes(\""
							+ id +'~~'+'orphannotes'+'~~'+'view'+ "\")'>" + "<img src="+baseurl+"epubimages/RubbishCan-Icon.png alt=\"delete\" >"                                
		                    + "</img></a></div></div>"
		                    + "<div id=\"text\" style=\"color: #999999;\">"
	                        +  notesText
	                        + "</div>"
							+ "</div></div>";
							
							map[timestamp]=escape(outputStr);
							/*	} else {
							outputStr += "<div id=\"nt\" style=\"text-decoration: none; color: grey !important;\"><div><img id=\"i\" style=\"margin-top: 30px;margin-left: 10px;\" src=\"./epubimages/arrow_first.png;\" position: absolute;></img></div>"
								+"<div id=\"bold\" style=\" margin-top: -20px; margin-left: 50px;\" position: relative;>"+displaychapter+(selection).substring(0, 50)+ "..." + "</div>"
		                    +"<div id=\"annotationdatetime\">" + fullDate + "</div>"
		                    +"<div id='annotationpagenumber'>" + pageNo + "</div>"
		                    +"<div id='annotationEditSearchButton'><button  onclick='javascript:userobj.searchForOrphanAnnotation(\""
		                    + (selection)+'~~'+id+'~~'+'Notes' + "\")'>"+ "Search" + "</button></div>"
		                    +"<div id='annotationdeleteButton'><button  onclick='javascript:userobj.deleteOrphanNotes(\""
							+ id + "\")'>" + deleteData	+ "</button></div>" 
							+"</div>";
													
						}*/
						listOfSelectedIds.push(id);
					}
				}
			}
		}
		
	}
	return map;
	//$("#allannotationscontent").append(outputStr);
};



function closeannsearch(){
	firstSearchResult="";
	$("#annsearchcontent").html('');
	 $("#ann_search_container").fadeOut(400);
	  $("#ann_search_container").fadeOut();
	 
}

function loadsearchdata(searchResultText){
	$('[id^=button]').each(function()
			{
			     $(this).css('background','none');
			});
	var resultPar=searchResultText.split('~~');
	var textTobeDisplayed=unescape(resultPar[0]);
	var id=resultPar[resultPar.length-1];
	$("#annsearchcontent").html('');
	$("#linkannotation").remove();
	/*$("#annsearchcontent").append("<div id='textpagecontent'>"+ textTobeDisplayed +"</div>"+"<div id='linkannotation' ><button id='link' style=\"padding-bottom: 5px;\" onclick='javascript:linkorphanannotation(\""+searchResultText+"\")'>"+"<img src=\"./epubimages/icon_link.png\" style=\"vertical-align:middle;\" width=\"20\" height=\"17\">"*/                                
	/*$("#annsearchcontent").append("<div id='textpagecontent'>"+ textTobeDisplayed +"</div>"+"<div id='linkannotation' ><button id='link' style=\"padding-bottom: 5px;\" onclick='javascript:linkorphanannotation(\""+searchResultText+"\")'>"+"<img src="+baseurl+"epubimages/icon_link.png style=\"vertical-align:middle;\" width=\"20\" height=\"17\">"                                   
	+ "</img>"+" Link"+"</button></div>");*/
	$("#annsearchcontent").append("<div id='textpagecontent'>"+ textTobeDisplayed +"</div>");
	$("#tabsAnnHeading").append("<div id='linkannotation' ><button id='link' style=\"padding-bottom: 5px;border:none;background:transparent;\" onclick='javascript:linkorphanannotation(\""+searchResultText+"\")'>"+"<img src="+baseurl+"epubimages/LinkOrphan-Icon.png style=\"vertical-align:middle;\" width=\"100%\" height=\"100%\">"                                   
			+ "</img></button></div>");
	$('#textpagecontent').find('b').css('background','deepskyblue');
	$('#'+id).css('background','deepskyblue');
}

function linkorphanannotation(linkResult){
	closeannsearch();
	var resultPar=linkResult.split('~~');
	var linkedText=resultPar[5];
	var deleteKey=resultPar[1];
	var annotationType=resultPar[2];
	var xpathLink=resultPar[3]+"~~"+resultPar[4]+"~~"+resultPar[5]+"~~"+resultPar[6]+"~~"+resultPar[7]+"~~"+resultPar[8]+"~~"+resultPar[9];
	var notesText=resultPar[10];
	getSearchXpath(xpathLink,annotationType,deleteKey,notesText);
	
	
}

userEbook.prototype.linkorphanBookMark=function(){
	
	var dfd = $.Deferred();
	var currentTime = new Date();
	var fullDate = currentTime.getTime();
	//get value of json key from local storage
	var chapterkey = GetFromLocalStorage(bookName + "#" + 'currentPage');
	var subTopic = GetFromLocalStorage(bookName + "#" + 'subtopic');
	findStartingWords(spine[chapterkey], chapterkey,
			'bookmark').done(function (pc){
				var bookMarkData=pc.split("~~");
				var chapter = bookMarkData[0];
				var id = bookMarkData[1];
				var offset = bookMarkData[2];
				var startingStr = bookMarkData[3];

				var fileMeta = userobj.bookmarks;
				if (!(chapter in fileMeta)) {
					fileMeta[chapter] = new Array();
				}
	var chapName= getChapterName(chapter, subtopic);
	var value = new Object();
	value.id = id;
	value.offset = offset;
	value.startingStr = startingStr.substring(0, 50);
	value.date = fullDate;
	value.chapName=chapName;
	//get values of json keys from local storage
	//value.pageno = GetFromLocalStorage(bookName + "#" + 'realPageNum');
	value.pageNo = GetFromLocalStorage(bookName + "#" + 'realPageNum');
	//value.subTopic = GetFromLocalStorage(bookName + "#" + 'subtopic');
	value.subTopic = subTopic;
	fileMeta[chapter].push(value);
	writeEbookMetaToLocal(userobj).done(function (){
		//console.log('before updating bookmarks to server');
		//serversynclocaldata().done(function (){
		//console.log('after updating bookmarks to server');	
		dfd.resolve();
		//});	
	});
	});
	return dfd.promise();
};

userEbook.prototype.linkorphanHighLightNotes=function(type,result,notesText){
	var dfd = $.Deferred();
		
	if (type == 'highlight') {
	    userobj.addHighLight(GetFromLocalStorage(bookName + "#" + 'currentPage'), result['xpath'], result['start'], result['end'], result['id'], result['text']);
		// alert("if"+hid);
	} else if (type == 'note') {
		userobj.addNote(GetFromLocalStorage(bookName + "#" + 'currentPage'), result['xpath'], result['start'], result['end'],notesText,result['id'], result['text']);
	}
	
	dfd.resolve();
	
	return dfd.promise();
};

function getSearchXpath(paramString,annotationType,deleteKey,noteText){ 
	var strsval = paramString.split("~~");
	var bookname=strsval[0];
	var file = strsval[1];
	var keyword = unescape(strsval[2]);
	var location=strsval[3];
	var currentTokenCount=unescape(strsval[4]);
	var prevTokenCount=unescape(strsval[5]);
	var haswildchar=strsval[6];
//	alert(bookname+','+file+','+keyword+','+location+','+currentTokenCount+','+prevTokenCount+','+haswildchar);
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
			goToSearchPage(responseObj,annotationType,deleteKey,noteText);
			//alert(JSON.stringify(response));
		},
		error : function(xhr, textStatus, errorThrown) {
			for(n in xhr) {
				//console.log('Error xhr:' + xhr[n]);
				}
			//console.log('textStatus :' + textStatus);
			//console.log('errorThrown :' + errorThrown);
		}
	}); }
    
}

function goToSearchPage(params,annotationType,deleteKey,noteText)
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
	$("#wrapper").css("visibility", "hidden");
	$("#hidden_content").css("visibility", "visible");
	  loadChapters(spine[currentPage], currentPage).done(function (){
		  readEbookMetaFromLocal(username, epubFileName).done (function (ebookmdata){	
			  ebookmetadata=ebookmdata;
			  //addChapterMetadata(currentPage);
		  //addChapterMetadataForNotes(currentPage);
		  //scrollChapter(null, offset);
		var result= scrollChapterForSearchResult(currentPage,paraText,selectedText,resp,true,annotationType); //added for scroll to particular highlight
		 
		  updateRealPageNum().done(function(){
		  if(annotationType=='BookMark'){
				
				//console.log("BookMark linked"+path);
				userobj.removeBookmarkFromList(deleteKey+'~~'+'orphanbookmark');
				userobj.linkorphanBookMark().done(function (){
					showAllAnnotations();	
				});
			
				
			}else if(annotationType=='Highlights'){
				//console.log("Highlight linked");
				userobj.deleteHighlight(deleteKey+'~~'+'orphanhighlight'+'~~'+'view');
				userobj.linkorphanHighLightNotes('highlight',result,noteText).done(function (){
					showAllAnnotations();	
				});
			}else if(annotationType=='Notes'){
				//console.log("Notes linked");
				userobj.deleteNotes(deleteKey+'~~'+'orphannotes'+'~~'+'view');
				userobj.linkorphanHighLightNotes('note',result,noteText).done(function (){
					showAllAnnotations();	
				});
			}
			//console.log("annotation linked");
			$("#annsearchcontent").html('');
			
		  });
		 // localStorage.setItem(bookName+"#realPageNum",selection);
		 // selectPageNumInFooter(selection);	
		  return false;  
		  });
	  });
	 
}

function refreshBookMarkView(){
	//showBookMarks();
	//showNotesInList();
	//showHighlightsInList();
	showAllAnnotations();
}

// - 1/8 
//IPAD Modification for testing unneccessary highlight and note option are coming in some places

$(document).on("click", "div", function() {
	
	
	var selectedNoteId = $(this).attr('id');
	
	if(selectedNoteId =="epub_content"){
		if($(prev).css("visibility") == "hidden"){
		window.location  = 'ios:webToNativeCall';
		}
	}
	/*else{
		if($(prev).css("visibility") == "hidden"){
		window.location  = 'not:webToNativeCall';
		}
	}*/
	
	
});

//Till here
//10/2
var getElementByXpathann = function (pathdet) {
    return document.evaluate(pathdet, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};
function findAnnotatedPage(selobj,offset){
	 var dfd = $.Deferred();
	var tex=getElementByXpathann(selobj).innerHTML;
	var chaptex=$( "#epub_content" ).html();
	var launch=chaptex.indexOf(tex)+offset;
	var tempstring= chaptex.substring(0,launch);
	var page=GetFromLocalStorage(bookName + "#realPageNum");

	//	alert(flag);
		if(!globalFlagForPrintedVersionAvailability){
			page=tempstring.substring(tempstring.lastIndexOf("custompage")+10,tempstring.lastIndexOf("custompage")+14);
			page=parseInt(page).toString();
		//alert(page);
			//alert(page);
			dfd.resolve(page);
		}
		else
			{
			var a=tempstring.lastIndexOf("epub:type=\"pagebreak\"");
			var b=tempstring.indexOf(">",a);
			var c=tempstring.indexOf("<",b);
			if(c!=-1){
				page=tempstring.substring(b+1,c);
			}
			//alert(page);
			if(!(page==""||page==null||page==undefined)){
			//alert(page);
				dfd.resolve(page);
			}
			
			}
		if(page==""||page==null||page==undefined)
			{
			var curkey=GetFromLocalStorage(bookName + "#currentPage");
			findPrevPageNo(curkey).done(function(pagefound){
			//alert("exceptional:"+pagefound);
			page=pagefound;
			
			//alert(page);
			dfd.resolve(page);
		
			});
			}
	
	return dfd.promise();
}


function findPrevPageNo(curkey){ 
	var pageNumber= null;
	 var dfd = $.Deferred();
    var arrprintedpageNo= new Array();
	var indexOfCurrentChapter= spineIndex.indexOf(curkey);
	
	 if(indexOfCurrentChapter!=0){
		var previouskey = spineIndex[indexOfCurrentChapter-1];		
		 var  currentPage = spine[previouskey];
		 GetFromDataStorage(bookName+"#"+currentPage).done(function (chapter){
			var chapter= JSON.parse(chapter).content;
			 var a=chapter.lastIndexOf("epub:type=\"pagebreak\"");
				var b=chapter.indexOf(">",a);
				var c=chapter.indexOf("<",b);
				page=chapter.substring(b+1,c);
				dfd.resolve(page);
		 });
		
	 }
	
	 return dfd.promise();
}
