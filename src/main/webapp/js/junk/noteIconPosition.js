/*
*© 2012-2013 Infosys Technologies Limited, Bangalore, India. All rights reserved
*Except for any open source software components or any third party intellectual property embedded in this Infosys proprietary software program ("Program"), this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
function placeNoteIcon(id){
	var divs = document.getElementById(id);
	var ryt=document.getElementById('epub_content').style.right;
    var wWidth = $(window).width();
     var x= divs.getBoundingClientRect();
     var xtop=parseInt(x.top);
     var xleft=parseInt(x.left);
     var pagelevel;
     var finalleft=parseInt(ryt);
     var displacementLeft=Math.round((wWidth*52)/100);
     if(xleft>(wWidth/2)){
   // alert("right side");
    finalleft=parseInt(ryt)+parseInt(displacementLeft);
    document.getElementById(id).getElementsByTagName("img")[0].style.left=finalleft+"px";
    if(wWidth<675)
	{
	finalleft=parseInt(ryt)+parseInt(65);
	document.getElementById(id).getElementsByTagName("img")[0].style.left=finalleft+"px";
	}
 
     }
     else{
    	// alert("left side");
    	 finalleft=parseInt(ryt)+parseInt(65);
    	 document.getElementById(id).getElementsByTagName("img")[0].style.left=finalleft+"px";	 
     }
    //alert("shift:"+ryt  +"left:"+ x.left +"width:"+wWidth+"page num:"+globalpageinchap+"pagelevel:"+pagelevel+"id:"+id);
  //  document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.top=top+"px";
   // document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.left=left+"px";
   // var finalleft=parseInt(xleft)+parseInt(ryt);
//	alert(xleft+" "+finalleft);
	//document.getElementById(id).getElementsByTagName("img")[0].style.left=finalleft+"px";
	 document.getElementById(id).getElementsByTagName("img")[0].style.top=xtop+"px";
}
function placeAllNoteIcon(id, pc){
	
	var divs = $('#epub_content .highlightNote').has("img");
	var ryt= parseInt(document.getElementById('epub_content').style.right);
    var wWidth = $(window).width();
    for(var i=0; i<divs.length; i++) { 
    	var x = divs[i].getBoundingClientRect();
    	
    	if (divs[i - 1] != undefined && divs[i].id == divs[i - 1].id ) {
    		var previousNoteImg = divs[i-1].getBoundingClientRect();
    		if(!(previousNoteImg.left==0 && previousNoteImg.top==0)) {
    			continue;
    		}
		}
    	
        var left=x.left;

        /*Note Display Changes*/
        var displacementLeft=Math.round((wWidth*52)/100);
        //alert(displacement);
     //  document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.top=top+"px";
      // document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.left=left+"px";
        
        if(left > (wWidth/2)){
          //alert("right side");
        	 finalleft=parseInt(ryt) + parseInt(Math.round((wWidth*46.7)/100))*2;
        	 $("#"+divs[i].id +" img").css('left',finalleft+"px");
            if(wWidth<=768)
            	{/*yet to test as the resolution is not in scope now*/
            	finalleft=parseInt(ryt)+parseInt(wWidth -69);
            	 $("#"+divs[i].id +" img").css('left',finalleft+"px");
            	}
             }
             else{
            	// alert("left side");
            	 finalleft=parseInt(ryt)+parseInt(displacementLeft)- 55;
            	 $("#"+divs[i].id +" img").css('left',finalleft+"px");
            	 if(wWidth<=768)
             	{/*yet to test as the resolution is not in scope now*/
             	finalleft=parseInt(ryt)+parseInt(wWidth -69);
             	$("#"+divs[i].id +" img").css('left',finalleft+"px");
             	}
             }
            //alert("shift:"+ryt  +"left:"+ x.left +"width:"+wWidth+"page num:"+globalpageinchap+"pagelevel:"+pagelevel+"id:"+id);
          //  document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.top=top+"px";
           // document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.left=left+"px";
           // var finalleft=parseInt(xleft)+parseInt(ryt);
        	//alert(xleft+" "+finalleft);
        	//document.getElementById(id).getElementsByTagName("img")[0].style.left=finalleft+"px";
        		$("#"+divs[i].id +" img").css('top',$(divs[i]).position().top+"px");
      // alert(parseInt(left) +" "+parseInt(ryt) );
            //alert(parseInt(left)>=0 +" "+parseInt(left)<=parseInt(ryt));
        	//var shiftWidth=$("#epub_content").width()+123;
        	//alert(shiftWidth);
        	
        	if(parseInt(left)>=0 && parseInt(left)<=parseInt(ryt) ){
        		
                
        		 $("#"+divs[i].id +" img").css('visibility',"visible");
              	  if(parseInt(left) >= wWidth)
              		  {
              		$("#"+divs[i].id +" img").css('visibility',"hidden");
              		  }
              	 
        	}
        else
        	{
        	$("#"+divs[i].id +" img").css('visibility',"hidden");
        	}
        	if(parseInt(left)<=wWidth && parseInt(ryt)==0 ){
        		
                
        		 $("#"+divs[i].id +" img").css('visibility',"visible");
            	 
      	}
        	if( parseInt(ryt)<0 ){
        		
        		 $("#"+divs[i].id +" img").css('visibility',"visible");
          	 
    	}
       }
	
	 // if  print paginated book is present else : do nothing \
    //10/2
   /* CheckForPrintedVersionAvailability().done(function(bool){
    if(bool){*/
   /* if(globalFlagForPrintedVersionAvailability){
    	 placeAllPrintedPageNo(pc);
    }*/
   // });
}

function placeAllNoteIconFromBookMarkTab(){
	var divs = document.getElementsByClassName('highlightNote');
	var ryt=document.getElementById('epub_content').style.right;
    var wWidth = $(window).width();
    for(var i=0; i<divs.length; i++) { 
        var x= divs[i].getBoundingClientRect();
        var top=x.top;
        var left=x.left;
        //alert((parseInt(left)%wWidth));
        //  document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.top=top+"px";
        // document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.left=left+"px";
        if((parseInt(left)%wWidth)>(wWidth/2)){
       //     alert("right side");
            finalleft=parseInt(710);
            document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.left=finalleft+"px";
             }
             else{
          //  	alert("left side");
            	 finalleft=parseInt(65);
            	 document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.left=finalleft+"px";	 
             }
            //alert("shift:"+ryt  +"left:"+ x.left +"width:"+wWidth+"page num:"+globalpageinchap+"pagelevel:"+pagelevel+"id:"+id);
          //  document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.top=top+"px";
           // document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.left=left+"px";
           // var finalleft=parseInt(xleft)+parseInt(ryt);
        	//alert(xleft+" "+finalleft);
        	//document.getElementById(id).getElementsByTagName("img")[0].style.left=finalleft+"px";
        	document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.top=top+"px";
            document.getElementById(divs[i].id).getElementsByTagName("img")[0].style.position="fixed";

        
       }
   
}

function placeAllPrintedPageNo(pc){
	if(pc!=null || pc!=undefined){
		var strs= pc.split("~~");
		var chaps= strs[3];	
	var pagecontent= null;
	var chapterHTML= null;
	var strs= null;
	var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage');
	//10/2
	/*var currentPage= spine[chapterkey];
	GetFromDataStorage(bookName+"#"+currentPage).done(function (chap){
		chapter=chap;	 
	pagecontent = getChapterWords(chapter, chapterkey, "wordsForPrintedbook");
	   if(pagecontent!=null){
	     strs= pagecontent.split("~~");
		  chapterHTML= strs[0];	*/	 
		 //console.log("chaphtml in placeAllPrintedPageNo "+chapterHTML);
	/*14/2findStartingWords(spine[chapterkey], chapterkey, "wordsForPrintedbook").done(function(pagecontent){
		   if(pagecontent!=null){	     
			  chapterHTML= pagecontent;	 
	   }*/
	
	var  temp = document.createElement('div');
    $(temp).attr("id", "tempdiv");
    temp.innerHTML = chaps;
   // console.log("temp value : "+temp.innerHTML);
    var arrayforprintId= new Array();
    $(temp).contents().find("span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']").each(function(){ 
		var epub_type = $(this).attr('epub:type');
		if(epub_type=="pagebreak"){	
			//$(this).addClass('page_break_revisited');
			//console.log("epub_type :"+epub_type);
			//$(this).before("<hr class='horizontal_pageBreak'>");
			//$('span[epub\\:type="pagebreak"]').addClass('page_break_revisited');
			arrayforprintId.push(this.id);	
			
		}
		
	});
    // if(arrayforprintId.length==0){
    	 $(temp).find("span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']").each(function(){ 
    			var epub_type = $(this).attr('epub:type');
    			if(epub_type=="pagebreak"){	
    				//$(this).addClass('page_break_revisited');
    				//console.log("epub_type :"+epub_type);
    				//$(this).before("<hr class='horizontal_pageBreak'>");
    				//$('span[epub\\:type="pagebreak"]').addClass('page_break_revisited');
    				if( $.inArray( this.id, arrayforprintId )==-1 ){
    				arrayforprintId.push(this.id);	
    				}
    				
    			}
    			
    		}); 
    // }
   	
	$(temp).empty();	
	  var printePage= $("#epub_content span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']");
	  var ryt=document.getElementById('epub_content').style.right;
	  var width = parseInt($('#epub_content').css('width'), 10);   
      var paddingLeft=	parseInt($('#hidden_content').css("padding-left"), 10);
	  var injectedPageno = document.getElementsByClassName('page_break_revisited');
	  
	 // printed page will be added only once when the new chapter loads 
	// if(injectedPageno.length==0){
	  for(var j=0; j<printePage.length; j++) { 
		  var pageNo = document.createElement('div');
	        pageNo.className = "page_break_revisited";	
	        pageNo.setAttribute("visibility","hidden");
	        pageNo.id="displayPage";
	        pageNo.innerHTML=printePage[j].innerHTML;
	        if(printePage[j].nextSibling!=null){
	        if(printePage[j].nextSibling.className!='page_break_revisited'){	      
	        	  printePage[j].parentNode.insertBefore(pageNo,  printePage[j].nextSibling);
	        }
	        }
	        else{
	        	  printePage[j].parentNode.insertBefore(pageNo,  printePage[j].nextSibling);
	        }
	  }
	 //}
	   $(".page_break_revisited").css("visibility","hidden");
	    var wWidth = $(window).width();
	    console.log("wWidth :"+wWidth);
	    var divs=printePage;
	    
	   setTimeout(function(){
	    for(var i=0; i<divs.length; i++) { 
	    	if( $.inArray( divs[i].id, arrayforprintId )!=-1 ){	    		
	    	   $(divs[i]).css('display','block');
	    	   var displacementLeft=width+paddingLeft-19;	//19    
	           var forRight= (width/2)+30;//30
	           var forLeft= width+paddingLeft-22;	//22   
	        var x= divs[i].getBoundingClientRect();	    
	        var top=x.top;
	        var left=x.left;
	     // console.log("divs[i].id :"+divs[i].id+ "  top : "+top+"  left : "+left);
	        var position= $(divs[i]).position();
	        var postop= position.top;
	        var posleft= position.left;
	        console.log("divs[i].id :"+divs[i].id+"postop "+postop+"posleft :"+posleft +"ryt :"+ryt );
	        if(top==0){
	        	top= postop;
	        }
	      // page no added for the current view only   
	        if(left>-1 && left<wWidth){
	        	if(left>(wWidth/2)){
	        		//alert("right side");
	        		finalleft=parseInt(ryt)+parseInt(displacementLeft);         
	        		document.getElementById(divs[i].id).nextSibling.style.left=finalleft+"px";
	        		if(wWidth<675)
	        		{
	        			finalleft=parseInt(ryt)+parseInt(forLeft);
	        			document.getElementById(divs[i].id).nextSibling.style.left=finalleft+"px";
	        		}
	        	}
	        	else {
	        		// alert("left side");
	        		finalleft=parseInt(ryt)+parseInt(forRight);
	        		document.getElementById(divs[i].id).nextSibling.style.left=finalleft+"px";	 
	        		if(wWidth<675)
	        		{
	        			finalleft=parseInt(ryt)+parseInt(forLeft);
	        			document.getElementById(divs[i].id).nextSibling.style.left=finalleft+"px";
	        		}
	        	}
	        	document.getElementById(divs[i].id).nextSibling.style.top=top+"px";
	        	if(pageNumberCheckBox=="true"){
	        		if(showLocalPageNumber=="true"){
	        			if(parseInt(left)>=0 && parseInt(left)<=parseInt(ryt) ){	        			                
	        				document.getElementById(divs[i].id).nextSibling.style.visibility="visible";
	        				if(parseInt(left)>=wWidth)
	        				{
	        					document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	        				}	              	 
	        			}
	        			else
	        			{
	        				document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	        			}
	        			if(parseInt(left)<=wWidth && parseInt(ryt)==0 ){	        			                
	        				document.getElementById(divs[i].id).nextSibling.style.visibility="visible";

	        			}
	        			if( parseInt(ryt)<0 ){	        			                
	        				document.getElementById(divs[i].id).nextSibling.style.visibility="visible";	          	 
	        			}
	        		}else{
	        			document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	        		}
	        	}else{
	        		if(showLocalPageNumber=="true"){
	        			if(parseInt(left)>=0 && parseInt(left)<=parseInt(ryt) ){	        			                
	        				document.getElementById(divs[i].id).nextSibling.style.visibility="visible";
	        				if(parseInt(left)>=wWidth)
	        				{
	        					document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	        				}	              	 
	        			}
	        			else
	        			{
	        				document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	        			}
	        			if(parseInt(left)<=wWidth && parseInt(ryt)==0 ){	        			                
	        				document.getElementById(divs[i].id).nextSibling.style.visibility="visible";

	        			}
	        			if( parseInt(ryt)<0 ){	        			                
	        				document.getElementById(divs[i].id).nextSibling.style.visibility="visible";	          	 
	        			}
	        		}else{
	        			document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	        		}
	        	}
	        	
	        }
	        else{
	        	document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	        }
	        // required
	        $(divs[i]).css('display','none');
	        	// $(divs[i]).css('display','none');
	       }	
	}
	   },10);
		
	}
	//14/2
	else{
		
		var pagecontent= null;
		var chapterHTML= null;
		var strs= null;
		var chapterkey = GetFromLocalStorage(bookName+"#"+'currentPage');	
		findStartingWords(spine[chapterkey], chapterkey, "wordsForPrintedbook").done(function(pagecontent){
		   if(pagecontent!=null){	     
			  chapterHTML= pagecontent;	 
			// console.log("chaphtml in placeAllPrintedPageNo "+chapterHTML);
		   }
		
		var  temp = document.createElement('div');
	    $(temp).attr("id", "tempdiv");
	    temp.innerHTML = chapterHTML;
	   // console.log("temp value : "+temp.innerHTML);
	    var arrayforprintId= new Array();
	    $(temp).contents().find("span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']").each(function(){ 
			var epub_type = $(this).attr('epub:type');
			if(epub_type=="pagebreak"){				
				arrayforprintId.push(this.id);			
			}		
		});
	  
	    	 $(temp).find("span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']").each(function(){ 
	    			var epub_type = $(this).attr('epub:type');
	    			if(epub_type=="pagebreak"){	 
	    				if( $.inArray( this.id, arrayforprintId )==-1 ){
	    				arrayforprintId.push(this.id);	 
	    				}
	    			}    			
	    		});       	
		$(temp).empty();	
		  var printePage= $("#epub_content span[epub\\:type='pagebreak'],div[epub\\:type='pagebreak']");
		  var ryt=document.getElementById('epub_content').style.right;
		  var width = parseInt($('#epub_content').css('width'), 10);   
	      var paddingLeft=	parseInt($('#hidden_content').css("padding-left"), 10);
		  var injectedPageno = document.getElementsByClassName('page_break_revisited');
		  
		 // printed page will be added only once when the new chapter loads 
		// if(injectedPageno.length==0){
		  for(var j=0; j<printePage.length; j++) { 
			  var pageNo = document.createElement('div');
		        pageNo.className = "page_break_revisited";	
		        pageNo.setAttribute("visibility","hidden");
		        pageNo.id="displayPage";
		        pageNo.innerHTML=printePage[j].innerHTML;
		        if(printePage[j].nextSibling!=null){
		        if(printePage[j].nextSibling.className!='page_break_revisited'){	      
		        	  printePage[j].parentNode.insertBefore(pageNo,  printePage[j].nextSibling);
		        }
		        }
		        else{
		        	  printePage[j].parentNode.insertBefore(pageNo,  printePage[j].nextSibling);
		        }
		  }
		// }
		   $(".page_break_revisited").css("visibility","hidden");
		    var wWidth = $(window).width();
		    console.log("wWidth :"+wWidth);
		    var divs=printePage;
		    
		   setTimeout(function(){
		    for(var i=0; i<divs.length; i++) { 
		    	if( $.inArray( divs[i].id, arrayforprintId )!=-1 ){	    		
		    	   $(divs[i]).css('display','block');
		    	   var displacementLeft=width+paddingLeft-19;	//19    
		           var forRight= (width/2)+30;//30
		           var forLeft= width+paddingLeft-22;	//22   
		        var x= divs[i].getBoundingClientRect();	    
		        var top=x.top;
		        var left=x.left;
		  //    console.log("divs[i].id :"+divs[i].id+ "  top : "+top+"  left : "+left);
		        var position= $(divs[i]).position();
		        var postop= position.top;
		        var posleft= position.left;
		      //  console.log("divs[i].id :"+divs[i].id+"postop "+postop+"posleft :"+posleft +"ryt :"+ryt );
		        if(top==0){
		        	top= postop;
		        }
		      // page no added for the current view only   
		        if(left>-1 && left<wWidth){
		        if(left>(wWidth/2)){
		          //alert("right side");
		        	
		            finalleft=parseInt(ryt)+parseInt(displacementLeft);         
		            document.getElementById(divs[i].id).nextSibling.style.left=finalleft+"px";
		            if(wWidth<675)
		            	{
		            	finalleft=parseInt(ryt)+parseInt(forLeft);
		            	 document.getElementById(divs[i].id).nextSibling.style.left=finalleft+"px";
		            	}
		             }
		             else {
		            	// alert("left side");
		            	 finalleft=parseInt(ryt)+parseInt(forRight);
		            	 document.getElementById(divs[i].id).nextSibling.style.left=finalleft+"px";	 
		            	 if(wWidth<675)
		             	{
		             	finalleft=parseInt(ryt)+parseInt(forLeft);
		             	 document.getElementById(divs[i].id).nextSibling.style.left=finalleft+"px";
		             	}
		             }
		        document.getElementById(divs[i].id).nextSibling.style.top=top+"px";
		       
	        	if(parseInt(left)>=0 && parseInt(left)<=parseInt(ryt) ){	        			                
	        		 document.getElementById(divs[i].id).nextSibling.style.visibility="visible";
	              	  if(parseInt(left)>=wWidth)
	              		  {
	              		 document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	              		  }	              	 
	        	}
	        else
	        	{
	        	 document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
	        	}
	        	if(parseInt(left)<=wWidth && parseInt(ryt)==0 ){	        			                
	        		 document.getElementById(divs[i].id).nextSibling.style.visibility="visible";
	            	 
	      	    }
	        	if( parseInt(ryt)<0 ){	        			                
	        		 document.getElementById(divs[i].id).nextSibling.style.visibility="visible";	          	 
	    	}
		        }
		        else{
		        	 document.getElementById(divs[i].id).nextSibling.style.visibility="hidden";
		        }
		        // required
		        $(divs[i]).css('display','none');
		        	// $(divs[i]).css('display','none');
		       }	
		}
		   },10);
		   
		});
	}

}

