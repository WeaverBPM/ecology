/* Change tips text base on dropdown*/
/* Change tips text base on dropdown */
/* Change tips text base on dropdown */

/// If the dropdown is 0, then hide tips
/// If the dropdown is 1, then change tips text as [Note: This is a testing tips, please double check]
/// Note: need to set the tips region class as promptText
jQuery(document).ready(function(){
	var _selectId = "field8581";
	if($("#" + _selectId).val() == 0){
		$(".promptText").parents("tr").eq(0).hide();
	} else {
		$(".promptText").text("[Note: This is a testing tips, please double check]");
	}
});
