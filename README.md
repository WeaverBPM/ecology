# Weaver ECOA 9.0 Process Engine Form API
Confidential | Copyright &copy; Weaver Network International Pte. Ltd. 2020

Author: Weaver Singapore Technical Delivery Team
Date: 1-Jan-2020

## 1. Instruction
### 1.1 Description
> All interfaces are encapsulated in a global object window.WfForm
> 
> Some interfaces have scope of use, minimum KB version and whether the mobile / PC end is unique. General purpose without special indication
> 
> Form field related operations, do not recommend the use of jQuery, prohibit native JS direct operation DOM structure
> 
> We recommend to use ECOA 9.0 API interface, unified operation and maintenance by the product R&D team, at the same time, only API could complete compatible mobile terminals

### 1.2 Mobile compatible
> WfForm object interface, compatible with new mobile EM7
> 
> Since the API interface has been unified on the PC side and the mobile side, in order to reduce the development workload and later maintenance costs;
> 
> Therefore EM7 the form no longer introduces *workflow_base* table *custompage4emoble* columns as custom pages in mobile terminals, and directly introduces *custompage* columns (consistent with PC templates) as custom pages
> 
> Front end (JS method) distinguishing terminal:

WfForm.isMobile() could be used to determine whether is mobile

```javascript
var isMobile =WfForm.isMobile() //true means eMobile、 WeChat, Dingtalk and other mobile device, false means PC
```

Backend requests (custom pages, etc.) detemien terminals:

```javascript 
boolean isMobile = "true". equals (request.getParameter ("_ec_ismobile "); //true means eMobile、 WeChat, Dingtalk and other mobile device, false means PC
```

### 1.3 Front-end Development
> Mode 1: code blocks in each layout tempalte, individually configured on display/print/mobile templates for individual nodes
> 
> Mode 2: workflow_base table custompage, for all nodes in the current path, display and print and mobile<br>Note that the process may have values if associated with budgets, attendance, vehicles, etc.
> 
> Mode 3: *Workflow management->Application settings->Process Form User-defined Page* for all non-template scenarios (PC and movement). Note that this page is global custompage, avoid writing global functions such as ready、checkCustomize, and define only some function bodies
> 
> Special note: For Mode 2, Mode 3, prohibits use init_wev8.js.; 
> 
> When the configuration does not take effect, please write the code block / custompage only alert confirmation method to check whether it takes effect, and then debug the cause of the error step by step.

### 1.4 PC way to open the form
> New request: system auto get the  active workflow version base on the workflow id

```javascript
window.open("/workflow/request/CreateRequestForward.jsp?workflowid=747");
```
> View request: user must have this request view permission, the primary and secondary account acccount must be in link. The parameter is request ID

```javascript
window.open("/workflow/request/ViewRequestForwardSPA.jsp?requestid=5963690");
```

### 1.5 Open form link on mobile device 

> Mobile form link

```javascript
// New link, the workflow id
var createUrl = "spa/workflow/forwardMobileForm.html?/ iscreate=1& workflowidiscreate=747";
// View links,  Request id
var viewUrl = "spa/workflow/forwardMobileForm.html?/ requestid=4503066";
```
>**First method** (recommended): Call the package method
>If the module is packaged with mobile framework, it can be called directly
>When it's a self-developed interface, you need to call / spa/coms/openLink.js a 
> minimum support system version: KB900190601
> openLink.openWorkflow (url, callbackFun, returnUrl)

| Parameters | Parameter type | Remarks |
| :------------ | :------------ | :------------ |
|url | String | Links to open forms|
|callbackFun | Function	 | EM client only, callback function when returned
|returnUrl | String | EM client, return/submit to specified link|

```javascript
window.openLink.openWorkflow (createUrl,function(){
 alert (" E-mobile opens the form link and triggers this callback function after return/submit ");
});
// Non- EM open, return/submit then back to the process center
window.openLink.openWorkflow (createUrl,null,"/spa/workflow/static4mobile/index.html#/center/doing");
```
> **Second Method**: EM client only, open the form and control the return/submission event callback<br>Use of EM-SDK, call webview to realize

```javascript
// Two steps, first call SDK webview, thenn call SDK control callback refresh
window.em.openLink ({
 url：viewUrl,
 openType：2
});
window.em.ready (function(){
 window.em.registerBroadcast ({
 name："_closeWfFormCallBack",
 action：function (argument){
 alert (" E-mobile opens the form link and triggers this callback function after return/submit ");
      }
    });
});
```
> **Third Method**: window.open / window.location.href redirect <br>This way url you need to pass parameters returnUrl and transcode to specify the return / submit address.<br>If it is EM client to use mode one or mode two!

```javascript
window.open (viewUrl +"& returnUrl="+window.encodeURIComponent "/test.jsp?param1=test11&param2=test22"));
```

## 2. Register user-define event 
### 2.1 Register intercept event, specify action pre-execution trigger, and block/release follow-up actions 
> support multiple registrations, execute in order of registration; support asynchronous ajax, avoid request jam
> Scenario 1: perform custom logic and block/release before submi, save, returnn, forward, withdraw, etc
> Scenario 2: execute custom logic and block/allow follow-up action before add/detele detail row

|Type of action	|Note	|Minimum Version |
| ------------ | ------------ | ------------ |
|WfForm.OPER_SAVE	|Save	||
|WfForm.OPER_SUBMIT	|Submission/approval/submission feedback/no feedback	||
|WfForm.OPER_SUBMITCONFIRM	|Submit to the confirmation page, if it is the confirmation interface, the click confirmation triggers the SUBMIT	||
|WfForm.OPER_REJECT	|Return	||
|WfForm.OPER_REMARK	|Note submission	||
|WfForm.OPER_INTERVENE	|Intervention	||
|WfForm.OPER_FORWARD	|Forwarding	||
|WfForm.OPER_TAKEBACK	|Compulsory recovery	||
|WfForm.OPER_DELETE|	Delete	||
|WfForm.OPER_ADDROW	|Add a line of detail and spell the serial number of the list	||
|WfForm.OPER_DELROW	|Delete the line and spell the list number	||
|WfForm.OPER_PRINTPREVIEW	|Print Preview	|KB900190501|
|WfForm.OPER_EDITDETAILROW|	Mobile - Edit Details	|KB900191101|
|WfForm.OPER_BEFOREVERIFY	|Check pre-fill trigger event	|KB900191201|

Interface name and parameter description 
> registerCheckEvent：function (type, fun)

|Parameters	|Parameter type|Required|Remarks|
| ------------ | ------------ | ------------ |------------ |
|type	|String	|Yes	|Action type (see table above for details), separated by  commas|
|fun	|Function	|Yes	|The custom function is entered into the body of the success function that performs callback, custom logic completion or asynchronous ajax, and the release needs to be called callback, does not call to block subsequent operations|

Example 
```javascript
jQuery(). ready (function (){
 WfForm.registerCheckEvent (Wform.OPER_SAVE, function (callback){
 jQuery ("# field 27495"). val(" Save automatic assign value");
 callback()// continue to submit to callback, no callbacck means break
    });
 WfForm.registerCheckEvent (Wform.OPER_SAVE +,"+WfForm.OPER_SUBMIT,function (callback){
 //... Execute user-defined logic
 callback();
    });
 WfForm.registerCheckEvent (Wform.OPER_ADDROW +"1", function (callback){
 alert (" execute logic before adding detail 1, detail 1 is OPER_ADDROW+1, and so on ");
 callback()// Allows you to continue adding row calls callback, else break
    });
 WfForm.registerCheckEvent (Wform.Oper_DELROW +"2", function (callback){
 alert(" Execution logic before deleting detail 2");
 callback();// Allows continued deletion of line calls callback, else break
    });
 WfForm.registerCheckEvent (Wform.OPER_PRINTPREVIEW, function (callback){
 alert(" Control default print preview window ");
 alert(" this interface needs to be executed before the jump route, the component library provides this mechanism when the component library provides this mechanism ");
 window.WfForm.printTimeout =3000;// product is the default delay 1s to pop-up, can control the delay time here
callback();// Allows continued pop-up calls callback, else break
    });
 WfForm.registerCheckEvent (Wform.Oper_EDITDETAILROW, function (callback, params){
 alert (JSON.stringify (params);/ parameter contains which list and which line is currently clicked
 callback();// Allow jump detail edit window without calling block jump
    });
});
```
### 2.2 Register hook event, trigger after specific  action completed
>  support multiple call registration  and execute in order of registration

|Type	|Note	|Minimum Version |
| ------------ | ------------ | ------------ |
|WfForm.ACTION_ADDROW	|Add a line of detail and spell the serial number of the list	|KB900190407|
|WfForm.ACTION_DELROW	|Delete the line and spell the list number	|KB900190407|
|WfForm.ACTION_EDITDETAILROW	|Mobile-edit line, list number	|KB900190501|
|WfForm.ACTION_SWITCHDETAILPAGING	|Switching detail pages	|KB900191201|
|WfForm.ACTION_SWITCHTABLAYOUT	|Switch template layout tab	|KB900191201|

Interface name and parameter description 
> registerAction：function (actionname, fn)

|Parameters	 |type	|Required	|Remarks|
| ------------ | ------------ | ------------ |------------ |
|actionname	|String	|Yes	|Action type, see table above|
|fn	|Function	|Yes	|Trigger event|
Example
```javascript
WfForm.registerAction (Wform.ACTION_ADDROW +"1", function (index){
 alert (" Add line subscript" +index);
// subscript from 1, detail 1 add line trigger event, register function entry parameter is new line subscript
WfForm.registerAction (Wform.ACTION_DELROW +"2", function (arg){
 alert (" Delete row subscript set is "+arg.join(","");
});// subscript from 1, detail 2 delete line trigger event
WfForm.registerAction (Wform.ACTION_SWITCHDETAILPAGING, function (groupid){
 Page number trigger event alert (" Switching detail table page "+(groupid+1) +"trigger event");
});
WfForm.registerAction (Wform.ACTION_SWITCHTABLAYOUT, function (tabid){
 alert (" Switch to tag item "+tabid+" Trigger event ");
});
```
## 3. Field basical operation interface (Apply for all field types)
### 3.1 Convert field name to field id 
> This method support to achieve multi-form, multi-environment, code block commonly using; decoupling code block specified fieldid
> convertFieldNameToId：function (fieldname, symbol, prefix)

Parameter Description	

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
| fieldname	|String	|Yes	|Field name|
| symbol	|String	|No	|Form label, main table (main)/ specific schedule (detail_1), default main|
| prefix	|Boolean	|No	|Returns whether the value needs to field a string prefix, default to true|

Example
```javascript
var fieldid =WfForm.convertFieldNameToId (" zs ");
var fieldid =WfForm.convertFieldNameToId (" zs_mx "," detail_1");
var fieldid =WfForm.convertFieldNameToId (" zs_mx "," detail_1", false);
```

### 3.2 Gets a single field value 
> getFieldValue：function (fieldMark)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark	|String	|Yes	|field designation, format field${ field ID}_field${ line number}|

Example 
```javascript
var fieldvalue =WfForm.getFieldValue (" field110");
```

3.3 Modify a single field value 
> This method modifies fields that, if they involve trigger linkage, cell formatting, etc., automatically trigger linkage/format 
> change values in a format similar to other scenarios
> changeFieldValue:(fieldmark, valueInfo)

Parameter Description	

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark|	String	|Yes	|field designation, format field${ field ID}_field${ line number}|
|valueInfo|	JSON	|Yes	|The field value information, the non-browsing button field format is {value：" modified value "}; the specialobj is browsing button information, array format; the showhtml property is only valid for single line text type and read-only;|

Example 
```javascript
// Modify field types such as text boxes, multi-line text, selection boxes, etc
WfForm.changeFieldValue (" field123",{ value :"1.234"});
// Modify the value of the browse field to have specialobj array structure objects
WfForm.changeFieldValue (" field 11_2"),{
 value："2,3",
 specialobj：[
 	{id："2",name：" Zhang San},
 	{id："3",name：" Li Si}
    ]
});     
// Modify the check box field (0 unchecked ,1 checked)
 WfForm.changeFieldValue (" field123",{ value :"1"});
// For single-line text-box type, read-only, support display values that are inconsistent with library values
WfForm.changeFieldValue (" field123"),{
 value："  actual value of storage ",
 specialobj：{
 showhtml：" interface display value "
    }
});
```
### 3.4 Change the single field display properties (read-only/required, etc.) 
> changeFieldAttr：function (fieldMark, viewAttr)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark	|String|	Yes	|field designation, format field${ field ID}_field${ line number}|
|viewAttr	|int	|Yes	|Change the status of the field ,1: Read Only ,2: Edit ,3: Required ,4: Hide the field label and content|
```javascript
Example WfForm.changeFieldAttr (" field 110",1);// field changed to read-only
WfForm.changeFieldAttr (" field 110",4);// field label and content are hidden, the effect is consistent with the display attribute hidden, only support the main table field
```

### 3.5 Modify field values and display propert
> changeSingleField：function simultaneously (fieldMark, valueInfo, variableInfo)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark	|String|	Yes	|field designation, format field${ field ID}_field${ line number}|
|valueInfo	|JSON	|No|Field value information, consistent with interface 2 format, example :{ value：" modified value "}|
|variableInfo	|JSON	|No	|Change property, example :{ viewAttr：3}|

Example
```javascript
WfForm.changeSingleField (" field110",{ value :" modified value "},{ viewAttr："1"});// modified value and set it to read-only
```
### 3.6 Batch modification of field values or display propoerties
> changeMoreField：function (changeDatas, changeVariable)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|changeMoreField	|JSON	|Yes	|Modified field value information set|
|changeVariable	J|SON	|No	|Modified field display property collection|

Example 
```javascript
WfForm.changeMoreField ({
 	field110：{value：" the modified value "},
 	field111：{value："2,3",specialobj：[
 {id："2",name：" Zhang San "}{ id："3",name：" Li Si "}
    ]},
    ...
},{
 	field110：{viewAttr：2},
 	field111：{viewAttr：3},
    ...
});
```
### 3.7 Trigger specific field and all related linkage

> Note: Manually triggering all linkage involved in a single field, including field linkage, SQL linkage, date-time calculation, field assignment, formula, row rules, display attribute linkage, selection box linkage, bindPropertyChange event binding, etc.
>
>Scenario: triggered subprocesses open default non-execution field linkage, archive node view form non-execution linkage
>
>triggerFieldAllLinkage: (fieldmark)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark	|String	|Yes	|field designation, format field${ field ID}_field${ line number}|

```javascript
// form opens the linkage to enforce a field linkage
jQuery (document). ready (function (){
 WfForm.triggerFieldAllLinkage (" field110");// execute all linkage involved in the  field
});
```

### 3.8 Obtain field information base on field ID
> Note: obtain field information according to field ID, JSON format, including name, type, read-only properties, etc. 
>
> getFieldInfo：function (fieldid)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldid	|String	|Yes	|Field ID, without any indication|

Return value propoeties description

|Parameter |Remarks|
| ------------ | ------------ | 
|htmltype| field large type (text/multiline text...)|
|detailtype| field small type (integer/float...)|
|fieldname| field database name|
|fieldlabel| field display name|
|viewattr| field attribute (1: read-only 2: editable 3: required) |

```javascript
WfForm.getFieldInfo("111");
```

### 3.9 Get field current read-only/required properties

> This method is to obtain field display properties in real time, including possible changes such as display property linkage, code interface change, done, detail existing fields can not be modified, not only field properties of background configuration;
>
> if you only want to obtain field properties of background configuration, call interface 3.8 return value viewattr property 
> 
> getFieldCurViewAttr：function (fieldMark)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark	|String|	Yes	|field designation, format field${ field ID}_field${ line number}|

```javascript
 WfForm.getFieldCurViewAttr (" field 110_2");// Get detail field properties ,1: read-only ,2: editable ,3: required; all done read-only;
```





## 4. Form field event binding, user-defined rendering 
### 4.1 Field value change trigger event 
> Field value change will trigger the bound function, can be bound multiple times
> BindFieldChangeEvent：function (fieldMarkStr, funobj)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMarkStr	|String	|Yes	|The binding field is marked, separated by multiple spliced commas, such as: field110( main field), field111_2( fine field )……)|
|funobj|	Function|	Yes|	The function passes the following three parameters by default, parameter 1: the DOM object of the trigger field, parameter 2: the mark of the trigger field (field27555, etc.), parameter 3: the modified value|

```javascript
WfForm.bindFieldChangeEvent (" field 27555, field 27556", function (obj, id, value){
 console.log (" Wform.bindFieldChange Event --", obj, id, value);
});
```

### 4.2 Detail table field values trigger event
> Binding for newly added detail line fields and loaded fine line fields, and value changes trigger bound event 
> bindDetailFieldChangeEvent：function (fieldMarkStr, funobj)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMarkStr	|String|	Yes|	Binding detail fields, can not be underlined, can be separated by multiple splicing commas, for example: field110,field111|
|funobj	|Function	|Yes	|Field value changes trigger custom functions, which by default pass the following three parameters, parameter 1: field mark (field27583), parameter 2: line mark, parameter 3: modified value|

```javascript
jQuery (document). ready (function (){
 WfForm.bindDetailFieldChangeEvent (" field 27583, field 27584", function (id, rowIndex, value){
 console.log (" Wform.bindDetailFieldChangeEvent --", id, rowIndex, value);
    });
});
```

4.3 Ffield area binding action event
> Recommend to use this method to develop, because this interface click, double-click and other actions are not bound to the field element, the interface bound to the cell
> All functions can be implemented in a formula

|Type	|Remarks|
| ------------ | ------------ |
|onblur	|Gets focus events that support only single-line text field types|
|onfocus	|Lost focus events, single-line text type only supported|
|onclick	|Click the event, where the field is in the cell area click trigger|
|ondbclick	|Double-click event, where field cell area double-click trigger|
|mouseover	|Mouse move event, mouse move field cell area trigger|
|mouseout	|Mouse out of the event, mouse out of the field where the cell area triggered|

> bindFieldAction：function (type, fieldids, fn)



Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|type	|String	|Yes	|Action types, see table above|
|fieldids	|String|	Yes	|Fields id collections, separated by multiple commas, and detail fields are not underlined for all lines|
|fn	|Function|	Yes	|Trigger function, which enters the parameter to receive two parameters, fieldid and rowIndex line numbers|

Example 

```javascript
WfForm.bindFieldAction (" onfocus "," field111, field222", function (fieldid, rowIndex){
     Gets the focus trigger event alert(" single-line text field 111");
     alert (get focus trigger event in line 222 of the "detail +rowIndex+");
});


WfForm.bindFieldAction (" onclick "," field333", function (){
     Click the trigger event alert(" the browse button field, not the magnifying glass selection, but the entire field in the cell area click will trigger "(");
});
```

### 4.4 User-defined proxy single-line textbox field rendering
> Minimum version requirements :KB900190407 
>
> this interface is effective only for single-line text-box field types, Database field type is varchar 
>
> Display effect, events, field value could be controlled by each other, The editable field values modified through interface 3.3 will also be recorded.
>
> System will pass in relevant props, React Developer Tools could used to grab data, Call on demand

> proxyFieldComp：function (fieldMark, el, range)


Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark	|String	|Yes	|field designation, format field${ field ID}_field${ line number}|
|el	|React Comp|	Yes|	Components rendered|
|range	|String	|No	|Scope of action, default all ,(1: read-only ,2: editable ,3: required), comma separated after combination|



Example 

```javascript
WfForm.proxyFieldComp (" field111", React.createElement (" div "),{
     style：{background："red"}, 
     children：" sub-items "
}));
// Custom rendering when Field 111 is read-only, editable, and required

WfForm.proxyFieldComp (" field222_1","<div> custom rendering field </div>","2,3");
// Custom rendering when Detail table field 222 is editable/required
```

### 4.5 User-defined Additional Render Form Field

> Minimum Version Requirements : KB900190407 
>
> Add addtional user-defined rendering for *after* Method Based on Standard Fields Display Content 
>
> This interface parameter description and usage is similar to interface 4.4 
>
> afterFieldComp：function (field Mark, el, range)

Example 

```javascript
WfForm.afterFieldComp (" field111"),
React.createElement (" a "),{
     href："/test.jsp? userid="+WfForm.getFieldValue "(" field222"),
     children：" Custom link "
}));
// Field 111 Appends and renders a custom link with read-only, editable, and required
```
### 4.6 User-defined form rendering with functions
> Minimum version: KB900190701
>
> Customize render form fields with function return values, support all field types, implement add/override/relayout based on original components, etc.
>
> It is recommended to combine **ecode** together, to call before module loading, use JSX, to customization
>
> This interface related to form field rendering with a higher priority than 4.4,4.5, that is, fields using this interface proxy, such as 4.4,4.5 will be invalid immediately
> 
> proxyFieldContentComp：function (fieldid, FN)


Inteface Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|field	|String	|Yes	|Format $fieldid$ ID, main table/detail fields|
|fn	|Function	|Yes	|Proxy function, which must have a return value that returns a custom rendered component|


Function Parameters of Proxy

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|info	|JSON	|Yes	|Field base information including field values, field properties, etc|
|compFn	|Function	|Yes	|Proxy former field component function through which the original component can be obtained |

Example 

```javascript
WfForm.proxyFieldContentComp ("111", function (info, compFn){
     console.log (" field id：",info.fieldid);
     console.log (" line number :", info.rowIndex);
     console.log (" field-only required attribute :", info.viewAttr);
     console.log (" field value :", info.fieldValue);
    // Returns custom rendered components 
     return React.createElement (" div ",{},[" play as you want ");
     // Return the original component 
     return compFn();
     // Returns a copy component based on the original component 
     return React.createElement (" div ",{},[" pre-component ", compFn()," post-component "]);
});
// If this interface call is made in blocks of code, custompage, etc .(non-module before loading), render fields once
WfForm.forceRenderField (" field111");
```


### 4.7 Get field component by field id
> Minimum Version: KB900190701 
>
> Get the field component according to the field identification, that is, the field component can be extracted separately and rendered anywhere. Note that the read-only editable properties of the field still need to be set up in the background in advance
>
> It is recommended to work with the ecode, using the JSX, and then combined with the designer custom properties or interface 4.6, can achieve a certain area custom typesetting layout rendering multiple form field 
>
> generateFieldContentComp:function(fieldMark)

Interface Parameters Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark	|String	|Yes	|field designation, format <button>field${ field ID}_field${Detail Row ID}</button>|

Example
```javascript
// Examples of detailed multi-field, sub-specific requirements
Step 1: Template cells give custom class：area_1
Step 2: Custom typesetting rendering area_1 area
ReactDOM.render <div>
     <table>
         <tr>
             <td>{ WfForm.generateFieldContentComp (" field111_1")}</td>
             <td>{ WfForm.generateFieldContentComp (" field112_1")}</td>
         </tr>
         <tr>
             <td>{ WfForm.generateFieldContentComp (" field113_1")}</td>
             <td>{ WfForm.generateFieldContentComp (" field114_1")}</td>
         </tr>
     </table>
</div>, document.getElementByclassName (" area_1");//for reference only, parameter 2 is to distinguish row numbers from specific cells
```

## 5. Detail table operation interface
### 5.1 Add detail table row and set initial value
> addDetailRow：function (detailMark, initAddRowData ={})

Parameters Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|detailMark	|String	|Yes	|A list indicates that detail 1 is detail_1, incremental analogy|
|initAddRowData	|JSON	|No	|Set the initial value after adding, in {field110：{value："11"},field112：{value："22"},…}, note key without underlining|

Example 
```javascript
// Detail 2 Add a line and assign field111 to the newly added line field
 WfForm.addDetailRow (" detail_2",{ field111:{ value :" initial value "});    
// Dynamic field assignment, detail 1 adds a line and assigns a begindate field name
var begindatefield =WfForm.convertFieldNameToId (" beginate "," detail_1");
var addObj ={};
addObj[begindatefield]={ value："2019-03-01"};}
WfForm.addDetailRow (" detail_1", addObj);
// Don't recommend this dynamic key writing, IE do n' t support it, avoid it
WfForm.addDetailRow (" detail_1",{[ beginfield ]:{ value :"2019-03-01"}})
```
### 5.2 Delete the detail list indicating line/all line 
> delDetailRow：function (deleteMark, rowIndexMark)
>
> Note: This method empties the details selected and there is no confirmation box indicating whether to delete

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
| detailMark|String|Yes|A list indicates that detail 1 is detail_1, incremental analogy|
|rowIndexMark|String|Yes|Delete all lines: all, delete some lines :"1,2,3"|

Example

```javascript
WfForm.delDetailRow (" detail_1"," all ");// Delete all lines in detail 1
WfForm.delDetailRow (" detail_1","3,6");// Delete line 3,6 in detail 1
```

### 5.3 Select sepecified row or all row 
> checkDetailRow: function(detailMark, rowIndexMark,needClearBeforeChecked)
>
> Note: This method is flexible and can be used to clear selected logic by needClearBeforeChecked parameters
Parameter Description	

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|detailMark	| String |Yes|A list indicates that detail 1 is detail_1, incremental analogy|
|rowIndexMark|	String |No|	All rows to be selected: all, Central Branch :"1,2,3"|
|needClearBeforeChecked |	Boolean|No|Need to clear selected|

Example

```javascript
WfForm.checkDetailRow (" detail_2"," all ");// tick all lines in detail 2
WfForm.checkDetailRow (" detail_2"," true ";// Clear detail 2 All selected
WfForm.checkDetailRow (" detail_2","3,6", true);// Clear detail 2 All selected, then tick the row marked 3,6
 WfForm.checkDetailRow (" detail_2","7", false); 
// Keep the selected record and append the selected row marked 7
```

### 5.4 Get all Row Index of detail table
> getDetailAllRowIndexStr：function (detailMark)
Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|detailMark|String|Yes|A list indicates that detail 1 is detail_1, incremental analogy|

Example

```javascript
console.log (Wform.getDetailAllRowIndexStr (" detail_2");// Output 1.3.etc
```
### 5.5 Get selected row index of detail table
> Minimum Version: KB900190501
>
> getDetailCheckedRowIndexStr：function (detail Mark)

Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|detailMark|String|Yes|A list indicates that detail 1 is detail_1, incremental analogy|

Example 
```javascript
console.log (Wform.getDetailCheckedRowIndexStr (" detail_2");// output select line 1.3.etc
```

### 5.6 Controls whether the detail line check box disables the tick
> note: background configuration of the gray line (not allowed to delete), does not support through this API control 
>
> controlDetailRowDisableCheck：function (detailMark, rowIndexMark, disabledCheck)

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|detailMark|String|true|A list indicates that detail 1 is detail_1, incremental analogy|
|rowIndexMark|String|Yes|All rows to be selected: all, Central Branch :"1,2,3"|
|disableCheck|boolean|true|true： not allow; false： allowed|

```javascript
WfForm.controlDetailRowDisableCheck (" detail_1"," all ", true);// Detail 1 All rows check boxes are not checked
WfForm.controlDetailRowDisableCheck (" detail_1","1,2", false);
// Detail 1 row marked 1,2 row release ash, allow tick
```

### 5.7 Control the display and hide of detail data rows
> Note: only the interface effect is hidden, the serial number will not change, that is, the front and rear row serial number of the hidden row will be fault discontinuous 
>
> controlDetailRowDisplay：function (detail Mark, rowIndex Mark, need Hide)

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|detailMark|String|true|A list indicates that detail 1 is detail_1, incremental analogy|
|rowIndexMark|String|Yes|All rows to be selected: all, Central Branch :"1,2,3"|
|needHide|boolean|true|Hide rows, true： hide, false： display|

```javascript
WfForm.controlDetailRowDisplay (" detail_1","3,5", true);/The hidden display of line 1 marked 3,5 is not shown
WfForm.controlDetailRowDisplay (" detail_1"," all ", false);
// Detail 1 All lines are not hidden
```

### 5.8 Get database primary key of exisitng field
> getDetailRowKey：function (fieldMark) for the detail existing rows.
>
> This method takes effect only for the detail existing rows, with newly added rows/non-existent rows returning to -1
Parameter Description

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|fieldMark|String|Yes|field designation, format field${ field ID}_field${ line number} for locating which list belongs|

```javascript
WfForm.getDetailRowKey (" field 112_3");// Gets the primary key in the fourth line of detail 
``` 

### 5.9 Get count of row lines

> getDetailRowCount：function (detail Mark)

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|detailMark|String|Yes|A list indicates that detail 1 is detail_1, incremental analogy|

Example
```javascript
console.log (Wform.getDetailRowCount (" detail_2");// output detail head office number, note that this result only represents detail head office number, can not be used as loop line
```

### 5.10 Add lines, delete line pre-action(logic or block event)
> minimum version requirements: KB900190501 
>
> scenario: implement custom logic before adding lines, limit how many lines to add invalid, do not allow deletion, etc. 
>
> Use registration function mechanism, check details at section 2.1 

### 5.11 Add lines, delete lines post-actions
> Trigger events using hook mechanism, check detials at section 2.2

### 5.12 Mobile client jump to detail edit line page execution event
> minimum version requirements: KB900190501
>
> only for mobile client edit detail line, hook mechanism, check detials at section 2.2

### 5.13 Add new detail row, copy last line data by default
> setDetailAddUseCopy：function (detailMark, needCopy)
>
> When adding detail: this method is called at ready, the last line field content is automatically assigned when the manual add new row, the settings before the node and the default value are overwritten, and the attachment upload field is not copied.
>
>Note: E9 is the asynchronous ready after the execution of the point to add details to take effect, such as the default new empty details invalid;
Parameter

Description	Parameter

|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|detailMark|String|Yes|A list indicates that detail 1 is detail_1, incremental analogy|
|needCopy|Boolean|Yes|true： enable, false： disable|

```javascript
jQuery (document). ready (function (){
     WfForm.setDetailAddUseCopy (" detail_1", true);
});
```

### 5.14 Get S/N base on row index
> Minimum version requirements: KB900190601
>
> scenario: according to the subscript of the line, obtain the current line details, can be used to prompt such a line exception 
>
> getDetailRowSerailNum：function (mark, rowIndex)

Description	Parameter
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ |------------ |
|mark|String|Yes|The list indicates that two formats detail_${ dindex} or fielddetail_${}{ rowIndex} are supported|
|rowIndex|Int|Yes|Line identification, the first format detail_${ dindex} to pass this parameter|

Example 
```javascript
WfForm.getDetailRowSerailNum (" detail_1",3);// Gets a row number marked 3 in detail 1
WfForm.getDetailRowSerailNum (" field222_3");// Gets the row number marked 3 under the corresponding list of fields 222
```

## 6. common global interface

### 6.1 get the basic information of the current open request
> Description: including workflow id、 node id、 form id, primary and secondary account information
>
> getBaseInfo：function()

```javascript
console.log (Wform.getBaseInfo ();// Returns the underlying information for the current request 
// Output description:
{
     f_weaver_belongto_userid："5240"//user information 
     f_weaver_belongto_usertype："0"
     formid：-2010// form id
     isbill："1"// new/old form 
     nodeid：19275// node id 
     id requestid：4487931// request id
     workflowid：16084// workflow id 
}
```

### 6.2 Contorl message display duration

> showMessage：function controlling display time (msg, type, duration)

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ | ------------ |
|msg|String|true|Information content|
|type|int|false|Prompt type ,1(warning),2(error),3(success),4(general), default is 1, different types of prompt messages have different effects|
|duration|Float|false|How long automatically disappears, per second, default is 1.5 seconds|

```javascript
WfForm.showMessage(" end time should be greater than start time ")// warning information should disappear automatically after 1.5 s "); and
WfForm.showMessage(" operation error ",2,10);// error message disappeared after 10s
```

### 6.3 System style Confirm message box description
> Note: compatible with mobile, custom confirmation content and button name
>
> showConfirm：function (content, okEvent, cancelEvent, otherInfo ={})

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ | ------------ |
|content|String|Yes|Confirmation of information|
|okEvent|Function|Yes|Click Confirm Event|
|cancelEvent|Function|No|Click Cancel Event|
|otherInfo|Object|No|Custom information (button name)|

```javascript
WfForm.showConfirm (" confirm to delete? ", function(){
     alert(" Delete successfully "); 
});
WfForm.showConfirm (" Do you need any technical support? ", function(){
     alert("Click confirm to call some functions or trigger some event");
}, function(){
     alert(Click Cancel to call some functions or trigger some event);
},{
     title："Confirmation "// The title, valid on PC only
     okText："Need "// custom confirmation button name 
     cancelText："No need" // custom cancel button name 
});
```

### 6.4 Form Top Button, Right-click Menu set disable
> Description: Set Form Top Button, Right-click Menu disable and restore to enable
>
> isDisabledcontrolBtnDisabled：function (isDisabled)

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ | ------------ |
|isDisabled|boolean|Yes|true：button all disable can not be operated, false： recovery button can be operated|

```javascript
     function subimtForm (params){
         WfForm.controlBtnDisabled (true);// action button ash 
        ...
         WfForm.controlBtnDisabled (false);
    }
```
	
### 6.5 Right click event
> Description: call right-click event logic, call only, do not allow override
>
> doRightBtnEvent：function (type)

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ | ------------ |
|type|String|Yes|Button|type (console can be mobx.toJS (Wform.getGlobalStore (). rightMenu.rightMenus) type)|

```javascript
WfForm.doRightBtnEvent (" BTN_SUBBACKNAME ");// Feedback required to trigger submission
WfForm.doRightBtnEvent (" BTN_SUBMIT ");// no feedback required to trigger submission
WfForm.doRightBtnEvent (" BTN_WFSAVE ");// Trigger save
WfForm.doRightBtnEvent (" BTN_REJECTNAME ");// trigger return
WfForm.doRightBtnEvent (" BTN_FORWARD ");// Trigger forwarding
WfForm.doRightBtnEvent (" BTN_REMARKADVICE ");// Trigger Consultation
WfForm.doRightBtnEvent (" BTN_TURNTODO ");// Trigger transfer
WfForm.doRightBtnEvent (" BTN_DORETRACT ");// Trigger forced recovery
WfForm.doRightBtnEvent (" BTN_PRINT ");// Trigger print
```

### 6.6 Refresh the form page 
> force refresh the form page, default to current requestid
>
> reloadPage：function (params ={})

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ | ------------ |
|params|Object|No|Custom parameters, overrides default parameters|

```javascript
WfForm.reloadPage();
WfForm.reloadPage ({requestid :"11"});// coverage parameters
```

### 6.7 Mobile app open link method
> Only supports the mobile side, especially the non-main form user interface (for example: detail editing) needs to open the link in this way. By opening the link this way, the return does not refresh the form 
>
> window.showHoverWindow：function (url, baseRoute)

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ | ------------ |
|url|String|Yes|Open link address|
|baseRoute|String|Yes|The current routing address is specified in the url address, and the detail edit opens the req/editDetailRow'/ pass|

Example 

```javascript
window.showHoverWindow ('/workflow/test.jsp','/req');// main interface opens the link
window.showHoverWindow (' https://www.baidu.com','/req/editDetailRow'');// The detail line edit interface opens the link
```

### 6.8 Extend parameters send to server
> Minimum version:KB900190801
>
> Custom extension parameters sent to the server, the server can take the corresponding parameter value recommendation by request.getParameter
>
>Suggest: the extended custom parameters start with cus_, Avoid affecting / covering the parameters necessary for standard products, resulting function abnormal
>
> appendSubmitParam：function (obj ={})

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ | ------------ |
|obj|Object|No|JSON Format Custom Parameters|

```javascript
WfForm.appendSubmitParam ({cus_param1:"11", cus_param2:" Test "});// The server can take parameter value request.getParameter through the request object (" cus_param1"):
```

### 6.9 Get the first required field
> Minimum version: KB900191201
>
> scenario: call the required verification logic of the product to obtain the first field that may not be filled in;<br>
> For example, work with WfForm.OPER_BEOPER_BEFOREVERIFY in section 2.1 to control custom control prompts
>
> getFirstRequiredEmptyField：function()

```javascript
var emptyField =WfForm.getFirstRequiredEmptyField()// Gets the first field not necessarily filled in at the call time, and the return value format is `field${ fieldid}_$}{}{}}}{ 
```

### 6.10 Trigger one time required verification
> minimum version: KB900191201 
>
> manually trigger one time required field verification and prompt, optional control check must add empty detail / check field required 
>
> verifyFormRequired：function (mustAddDetail =true,fieldRequired=true)

Parameter Description
|Parameter |type	|Required|	Remarks|
| ------------ | ------------ | ------------ | ------------ |
|mustAddDetail|Boolean|No|Check whether you must add an empty detail by default|
|fieldRequired|Boolean|No|Check fields must be filled in by default|

```javascript
WfForm.verifyFormRequired();/ trigger must fill in verification and prompt, check must add empty details first, then check field must fill in
var result =WfForm.verifyFormRequired (false, true);// Check fields only must be filled in and prompted
if (! result)
alert(' there is a situation where it may not be filled in');
```
