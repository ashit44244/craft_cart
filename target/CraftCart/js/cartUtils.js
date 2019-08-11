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

});
