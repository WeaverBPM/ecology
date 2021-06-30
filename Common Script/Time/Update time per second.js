/* Update time per second */
/* Update time per second */
/* Update time per second */

$(document).ready(function(){
	showtime();
	setInterval("showtime()",1000);
});
function showtime() {
	var date = new Date();
	var _text = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	document.getElementById("field6321span").innerText = _text
	document.getElementById("field6321").value = _text
}
