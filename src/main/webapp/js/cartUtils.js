$(document).ready(function() {
	$('#loginButton').css('display', 'block');
	$('#successMsg').css('display', 'none');
	var sucessLoginMsg = $('#hiddenSuccessMsg').val();

	if (sucessLoginMsg != "") {
		$('#loginButton').css('display', 'none');
		$('#successMsg').css('display', 'block');
	} else {
		$('#loginButton').css('display', 'block');
		$('#successMsg').css('display', 'none');
	}
	$('.dropdown').hover(function() {
		$('.dropdown-toggle', this).trigger('click');
	});
	$('.loginDropdown').hover(function() {
		if ("" != sucessLoginMsg)
			$('.dropdown-toggle', this).trigger('click');

	})

	function appendChildren() {
		var allDivs = document.getElementsByTagName("div");
		for (var i = 0; i < allDivs.length; i++) {
			if(allDivs[i].id){
			var newDiv = document.createElement("div");
			//decorateDiv(newDiv);
			allDivs[i].appendChild(newDiv);
			console.log("ahit : "+allDivs[i].id);
			}
		}
	}

	appendChildren();

});
