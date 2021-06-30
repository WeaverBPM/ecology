/* Time difference in hours */
/* Time difference in hours */
/* Time difference in hours */

var beginTimeId = "field8482"; //Begin Time Id
var beginDateId = "field7911"; //Begin Date Id
var endTimeId   = "field8483"; //End Time Id
var endDateId   = "field7912"; //End Date Id

$(document).ready(function(){
	checkCustomize = function(){
		var beginTime = new Date($("#" + beginTimeId).val() + " " + $("#" + beginDateId).val());
		var endTime = new Date($("#" + endTimeId).val() + " " + $("#" + endDateId).val());

		var differTime = endTime - beginTime;            //Time difference in seconds
		var days = Math.floor(differTime / (3600*1000)); //Time difference in hours
		$("#field8170").val(days);
		return true;
	}
});
