/* Check whether time 1 is within time 2, change the reminder text */

/// Note: change the tips reggion class as "prompText"
/// If time 1 is within time2, then hide the tips text
/// Else, change the tips text as [Note: Leave application date & time is different with real date & time]
jQuery(document).ready(function(){
	var _beginDateId1 = "field8566", _beginDateId2 = "field8586";
	var _beginTimeId1 = "field8567", _beginTimeId2 = "field8587";
	var _endDateId1   = "field8568", _endDateId2   = "field8588";
	var _endTimeId1   = "field8569", _endTimeId2   = "field8589";

	var isError = checkDate($("#" + _beginDateId1).val(), $("#" + _beginDateId2).val(), $("#" + _beginTimeId1).val(), $("#" + _beginTimeId2).val(), $("#" + _endDateId1).val(), $("#" + _endDateId2).val(), $("#" + _endTimeId1).val(), $("#" + _endTimeId2).val());
	if(!isError){
		$(".promptText").parents("tr").eq(0).hide();
	} else {
		$(".promptText").text("[Note: Leave application date & time is different with real date & time]");
	}
});

/// Check time 2 is within time 1
/// _beginDate1 _beginTime1 Time1 Begin Date & Time
/// _beginDate2 _beginTime2 Time2 Begin Date & Time
/// _endDate1 _endTime1 Time1 End Date & Time
/// _endDate2 _endTime2 Time1 End Date & Time
/// within the range, then return false, else return true
function checkDate(_beginDate1, _beginDate2, _beginTime1, _beginTime2, _endDate1, _endDate2, _endTime1, _endTime2){
	console.log(_beginDate1, _beginDate2, _beginTime1, _beginTime2, _endDate1, _endDate2, _endTime1, _endTime2);
	var isError = false;

	//Check start time
	if(_beginDate1 > _beginDate2) { isError = true;console.log(1); }
	else if(_beginDate1 == _beginDate2){
		if(_beginTime1 > _beginTime2) { isError = true;console.log(2); }
		console.log(3);
	}

	//Check End time
	if(_endDate1 < _endDate2) { isError = true; console.log(4); }
	else if(_endDate1 == _endDate2){
		if(_endTime1 < _endTime2) { isError = true; console.log(5); }
		console.log(6);
	}

	return isError;
}
