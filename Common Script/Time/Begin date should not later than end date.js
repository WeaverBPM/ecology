/* Begin date should not later than End date */

var beginTimeId = {id: "field7911", name: "Begin Date"}; //Begin Id
var endTimeId   = {id: "field7912", name: "End Date"}; //End Id

$(document).ready(function(){
	checkCustomize = checkChangeFunction; // Submit for check
	$("#" + beginTimeId.id).bindPropertyChange(function(){ checkChangeFunction(); });// Check begin date
	$("#" + endTimeId.id).bindPropertyChange(checkChangeFunction);  // Check end date
});

/// Check function
function checkChangeFunction(){
	var beginTime = new Date($("#" + beginTimeId.id).val()); //Convert to date type
	var endTime = new Date($("#" + endTimeId.id).val());     //Convert to date type
	return (beginTime > endTime) ?
		( alert(beginTimeId.name + " could not later than " + endTimeId.name), false ): ( true );
}


//---------------------------------------------------------------------------------------------------
/* Begin date should not later than End date */


var beginTimeId = {date: "field7911", time: "field8482"}; //Begin
var endTimeId   = {date: "field7912", time: "field8483"}; //End

$(document).ready(function(){
	checkCustomize = function (){
		var beginTime = new Date($("#" + beginTimeId.date).val() + " " +$("#" + beginTimeId.time).val()); //Convert to date type
		var endTime = new Date($("#" + endTimeId.date).val() + " " +$("#" + endTimeId.time).val());     //Convert to date type
		return (beginTime > endTime) ?
			( alert("Begin date should not later than end date"), false ): ( true );
	}; // Submit for check
});
