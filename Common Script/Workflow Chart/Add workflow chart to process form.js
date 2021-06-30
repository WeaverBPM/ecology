///Simulate the click action to show workflow chart
var baseFrame = $(window.parent.document).find(".tab_menu");
baseFrame.children().eq(1).children().eq(0).click(); //Show workflow chart
$(window.parent.document).find("#divWfPic").hide();  //Hide workflow chart
$(window.parent.document).find("#divWfBill").show();

///Set the workflow chart image field id as overflowPic
$(document).ready(function(){
	//Becuase take some time to generate the workflow chart, then need to extend the time
	setTimeout(function(){
		//find canvas
		var pic = $(window.parent.document.getElementById("piciframe")).contents().find("#mainArea");
		//generate the image
		var _img = document.createElement("img");
		_img.src = pic[0].toDataURL("image/png");
		$('#overflowPic').append(_img);
	}, 500);
});
