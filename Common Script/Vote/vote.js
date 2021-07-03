//Get main table field id
var fieldid1 = WfForm.convertFieldNameToId("bfb");//percentage
var fieldid2 = WfForm.convertFieldNameToId("fjqry");//Disagree person
var fieldid3 = WfForm.convertFieldNameToId("lztj");//Condition
var fieldid6 = WfForm.convertFieldNameToId("mxbh");//Detail table
var mx=WfForm.getFieldValue(fieldid6);;//Details table field it
var fieldid4 = WfForm.convertFieldNameToId("tpr", "detail_"+mx);//Vote person
var fieldid5 = WfForm.convertFieldNameToId("yj", "detail_"+mx);//Comments

var userid=WfForm.getBaseInfo().f_weaver_belongto_userid;

//WfForm.controlDetailRowDisplay("detail_"+mx, "all", true);
setTimeout(function(){
    $(".vote").show()
},1000);
//Check all detail table, hide non-current user's line
var rowArr1 = WfForm.getDetailAllRowIndexStr("detail_"+mx).split(",");

for(var i=0; i<rowArr1.length; i++){
    var rowIndex1 = rowArr1[i];
    if(rowIndex1 !== ""){
        var fieldvalue4=WfForm.getFieldValue(fieldid4+"_"+rowIndex1);//Get vote person's value

        if(userid!=fieldvalue4){
            WfForm.controlDetailRowDisplay("detail_"+mx, rowIndex1, true);
        }else{
            WfForm.controlDetailRowDisplay("detail_"+mx, rowIndex1, false);
            WfForm.changeFieldAttr(fieldid5+"_"+rowIndex1, 3);//Change vote comments as required
        }
    }
}
//Submit for verification and result calculation
WfForm.registerCheckEvent(WfForm.OPER_SUBMIT, function(callback){
    var fieldvalue1 = WfForm.getFieldValue(fieldid1);//Get percentage
    var fieldvalue2 = WfForm.getFieldValue(fieldid2);//Get vote person
    if(fieldvalue1==null || fieldvalue1==""){
        alert("投票通过率未设定，请联系管理员设定！")
    }else{
        var rowArr = WfForm.getDetailAllRowIndexStr("detail_"+mx).split(",");//Check details table
        var coun=rowArr.length;
        var countfieldid5=0;
        var check=false;
        for(var i=0; i<rowArr.length; i++){
            var rowIndex = rowArr[i];
            if(rowIndex !== ""){
                var fieldMark = "field111_"+rowIndex;    //Check details table
                var fieldvalue4=WfForm.getFieldValue(fieldid4+"_"+rowIndex);//Get vote person value
                var fieldvalue5=WfForm.getFieldValue(fieldid5+"_"+rowIndex);//Get vote comments
                if(fieldvalue5=="0"){
                    countfieldid5=parseInt(countfieldid5)+parseInt("1");
                }

                if(fieldvalue4==fieldvalue2 && fieldvalue5=="1"){
                    check=true;
                }
            }
            var tgl=(countfieldid5*1.00)/(coun*1.00);
            // console.log(countfieldid5)
            // console.log(coun)
            // console.log(tgl)
            var checktgl=false;
            if(tgl>=fieldvalue1){//Vote rate > Pass rate
                checktgl=true;
            }
            if(!check && checktgl){
                WfForm.changeFieldValue(fieldid3, {value:"0"});//Vote passed

            }else{
                WfForm.changeFieldValue(fieldid3, {value:"1"});//Vote failed
            }
        }
    }

    callback();
});
