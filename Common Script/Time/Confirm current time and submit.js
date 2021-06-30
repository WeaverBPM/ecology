/* Confirm current time and submit */
/* Confirm current time and submit  */
/* Confirm current time and submit  */

/// Main table with time, provide two button, confirm current time and submit, Get current time
/// Make Confirm current time and submit class as changeButton, add user define attribite submitNow as true
/// Make Get current Time field class as changeButton

var needWriteDateId = "7912"; //Date ID
var needWriteTimeId = "8483"; //Time ID

$(".changeButton").click(function(){
	//Change date value
	var time = new Date();
	$("#field" + needWriteDateId).val(getDateYMD(time));
	$("#field" + needWriteDateId + "span").text(getDateYMD(time));
	$("#field" + needWriteTimeId).val(getTimeHM(time));
	$("#field" + needWriteTimeId + "span").text(getTimeHM(time));

	//Trigger submit button
	if($(this).attr("submitNow")){
		setTimeout(function(){
			parent.bodyiframe.doSubmitBack(this);
			parent.hideRightClickMenu();
		}, 1000);
	}
});

///Convert _time as yyyy-mm-dd format
function getDateYMD(_time){
	var year = _time.getFullYear();
	var month = _time.getMonth()+1;
	var date = _time.getDate();

	return year + "-" + ((month < 10) ? ("0" + month): month) + "-" + ((date < 10) ? ("0" + date): date);
}

///Convert _time as hh:mm format
function getTimeHM(_time){
	var hours = _time.getHours();
	var minutes = _time.getMinutes();

	return ((hours < 10) ? ("0" + hours): hours) + ":" + ((minutes < 10) ? ("0" + minutes): minutes);
}
