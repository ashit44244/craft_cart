
var propertiesMap;// = getPropertiesMap();

jQuery(document).ready(function() {

	langSet = GetFromLocalStorage("language", obfuscation);
	if (langSet == null) {
		SaveInLocalStorage("language", 'en', obfuscation);
		langSet = 'en';
	}

	propertiesMap = getPropertiesMap();//JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
	if (propertiesMap != null) {
		loadValues(propertiesMap);
	} else {
		loadBundles(langSet);
	}

});

function getPropertiesMap() {
	if(!propertiesMap) {
		propertiesMap = JSON.parse(GetFromLocalStorage("i18nMap", obfuscation));
		if(!propertiesMap) {
			loadBundles('en');
		}
	}
	return propertiesMap;
}

function loadBundles(lang1) {

	jQuery.i18n.properties({
		name : 'readerlibrarymessages',
		path : "../locale/",
		mode : 'both',
		language : lang1,
		callback : function() {
			propertiesMap = jQuery.i18n.map;
			saveData(propertiesMap);
			loadValues(propertiesMap);
			
		}
	});
}

function loadValues(propertiesMap) {
	//values for readerview
	document.title = propertiesMap.document_title;
	
	var page = getPageName();
	//console.log(">>>>>>>>page = " + page);
	if(page == "index.html") {
		$("#Save").val(propertiesMap.Save);
		//$("#highlight").val(propertiesMap.highlight);
		$("#note").val(propertiesMap.note);
		$("#numofresults").val(propertiesMap.num_of_results);
		//$("#delete").val(propertiesMap.delete_annotations);
		$("#deleteHighlight").val(propertiesMap.deleteHighlight);
		
		$("#emptysearch").val(propertiesMap.empty_search);
		
		$("#notes").val(propertiesMap.notes);
		$("#cancel_button").val(propertiesMap.cancel);
		$("#signed_in_text").val(propertiesMap.userText);
		$("#help_text").val(propertiesMap.help);
		
		$("#copy").val(propertiesMap.copy_text);
		$("#define_text").val(propertiesMap.help);
		$("#show_info").attr('title', propertiesMap.info_tooltip);	
		$("#show_bookmark").attr('title', propertiesMap.annotations_tooltip);
		$("#show_history").attr('title', propertiesMap.history_tooltip);
		$("#indexImages").attr('title', propertiesMap.index_tooltip);
		$("#tocAnchor").attr('title', propertiesMap.toc_tooltip);
		$("#show_toc").attr('title', propertiesMap.toc_tooltip);
		$("#mylibrary_link").attr('title', propertiesMap.my_library_tooltip);
		//$("#add_bookmark").attr('title',propertiesMap.add_bookmark_tooltip);
		//$("#remove_bookmark").val(propertiesMap.remove_bookmark_tooltip);
		$("#closeIndexTag").attr('title', propertiesMap.index_title);
		$("#notes").val(propertiesMap.notes_text);
		$("#annotationList").text(propertiesMap.annotation_title);
		
		
		//$("#saveNote").val(propertiesMap.save_note);
		//$("#cancel").val(propertiesMap.cancel_note);
		
		$("#searchQuery").attr('placeholder', propertiesMap.search_text_placeholder);
		$("#searchButton").val(propertiesMap.search_button);
		
		$("#no_index").text(propertiesMap.no_index_available);
		$("#next").attr('title', propertiesMap.next_page);
		$("#prev").attr('title', propertiesMap.previous_page);
		
		$("#helplabel").text(propertiesMap.show_help_text);	
		$("#signout_button").val(propertiesMap.show_signout_text);
		$("#resetDiv").attr('title',propertiesMap.show_reset_search);
		$("#prevsearch").attr('title',propertiesMap.find_previous);	
		$("#nextsearchoff").attr('title',propertiesMap.find_next);	
		$("#prevsearchDisabled").attr('title',propertiesMap.find_previous);	
		$("#nextsearchoffDisabled").attr('title',propertiesMap.find_next);	
		$("#previoussearch").text(propertiesMap.previous_title);
		$("#nextsearch").text(propertiesMap.next_title);
		$("#stopsearch").attr('title',propertiesMap.stop_search);
		/*$("#next").attr('title', next_page);
		$("#note").attr('title', note);
		$("#zoomOut").attr('title', zoom_out);
		$("#zoomIn").attr('title', zoom_in);
		$("#bookMark").attr('title', add_bookmark);
		$("#show_bookmark").attr('title', show_annotations);
		$("#mylibrary_link").attr('title', my_library_tooltip);
		$("#prev").attr('title', previous_page);
		$("#next").attr('title', next_page);
		$("#closeAnchorTag").attr('title', close);
		$("#closeImage").attr('title', close);
		$("#toggle-toc-btn").attr('title', table_of_contents);
		$("#forward").attr('title', forward);
		$("#back").attr('title', backward);
	
		$("#highlights").html(highlights);
		$("#notes").html(notes);
		$("#bookmarks").html(bookmarks);
		
		i18nMap["couldnot_find_search"] = couldnot_find_search;
		i18nMap["make_sure"] = make_sure;
		i18nMap["suggestions"] = suggestions;
		i18nMap["try_different_keywords"] = try_different_keywords;
		i18nMap["try_more_general_keywords"] = try_more_general_keywords;
		i18nMap["try_fewer_keywords"] = try_fewer_keywords;
		i18nMap["not_allowed_to_open_book"] = not_allowed_to_open_book;
		i18nMap["book_not_available"] = book_not_available;
	
		*/
	
	} else if(page == 'myLibrary.html') {
		$("#heading").text(propertiesMap["mylib.Title"]);
		$("#libSettings").attr("title", propertiesMap.settings);
		$("#refresh_link").attr("title", propertiesMap.refresh);
	} else if(page == 'login.html') {
		//values for login &library view
		$("#uname").text(propertiesMap.login_username);
		$("#passwd").text(propertiesMap.login_password);
		$("#signin_button").val(propertiesMap.login_sign_in);
		//$("#language").val(lang);
		$("#forgot_passwd").text(propertiesMap.forgot_password);
		//$("#termsAndConditionsHead").text(propertiesMap.termsAndConditionsHead);
		//$("#privacyPolicyHead").text(propertiesMap.privacyPolicyHead);
		$("#terms_Condition").text(propertiesMap.terms_Condition);
		$("#Privacy_Policy").text(propertiesMap.Privacy_Policy);
		$("#terms_Condition").attr('href', propertiesMap.terms_ConditionLink);
		$("#Privacy_Policy").attr('href',propertiesMap.Privacy_PolicyLink);
		//$("#terms_privacyPolicy").text(propertiesMap.terms_privacyPolicy);
		//$("#policyContent").text(propertiesMap.policyContent);
		//$("#termsContent").text(propertiesMap.termsContent);
		$("#countryId").text(propertiesMap.country_Id);
		$("#canada_text").text(propertiesMap.canadatext);
		$("#uk_text").text(propertiesMap.uktext);
		$("#copyright").text(propertiesMap.copyrightText);
	}
}

function saveData(propertiesMap) {
	SaveInLocalStorage("i18nMap", JSON.stringify(propertiesMap), obfuscation);
}

function getPageName() {
	return document.location.pathname.match(/[^\/]+$/)[0];
}