/* Check mobile phone number */
/* Check mobile phone number */
/* Check mobile phone number */

jQuery(document).ready(function(){
	checkCustomize = function(){
		var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;//Chinese Mobile Phone Number
		var isMob= /^0?1[3|4|5|8][0-9]\d{8}$/;// Chinese Telephone Number
		var isSingaporeNumber = /^\+65(6|8|9)\d{7}$/;
		var _val = $("#field7915").val();
		if(_val == "") return true;
		else if(isMob.test(_val) || isPhone.test(_val) || isSingaporeNumber(_val)) return true;
		else {
			alert("Please fill in the correct number");
			return false;
		}
	};
});
