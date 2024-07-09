# ECOA-Common-Script
Common script for ECOA

**Website:** www.weaverintl.com <br>
**Technical support:** support@weaverintl.com <br>

### 1. Enable sql log
Configuration file：ecology\WEB-INF\prop\weaver_isSqlLog.properties<br>

### 2. Get file path on server with doc id

```sql
select  filerealpath from  imagefile t1,docimagefile t2 
where t1.imagefileid=t2imagefileid  and t2.docid= Docment ID
```

### 3. Get month in the date

```
doFieldSQL("select RIGHT(SUBSTRING('Field id',0,8),2)  ")

```

### 4. Query workflow where operator is matrix

```sql
select a.workflowname Workflow,a.version Version,c.nodename Node,d.groupname Group,g.name Matrix
from workflow_base a
inner join workflow_flownode b on a.id=b.workflowid  and b.NODETYPE<>0 --Not creator
inner join workflow_nodebase c on b.nodeid = c.id --and  c.IsFreeNode is null
inner join workflow_nodegroup d on c.id=d.nodeid
inner join workflow_groupdetail e on d.id=e.groupid
inner join workflow_groupdetail_matrix f on f.groupdetailid = e.id
inner join matrixinfo g on g.id = f.matrix
where e.type=99  --Matrix type
and a.isvalid = '1' --Valid workflow
and f.matrix in (6)  --id
order by a.workflowname,c.nodename,d.groupname
```

### 5. Get last month
```sql
select  MONTH(DATEADD(MONTH,-1,GETDATE()))
```

### 6. Query all workflow and corresponding nodes that have a detailed horizontal scroll bar enabled
```sql
select workflowid,workflowname,b.nodeid,nodename from workflow_base a,
workflow_flownode b,workflow_nodebase c,workflow_nodeformgroup d 
where a.id=b.workflowid and b.nodeid=c.id and d.nodeid=b.nodeid and d.allowscroll='1'
```

### 7. Query which workflow with detail table (only for new forms)

```sql
select * from workflow_base a where isbill=1 and not exists 
(select 1 from workflow_billfield where billid=a.formid and viewtype=1)
```

### 8. Change website icon

Change favicon.ico in e-cology root directory

### 9. Get all workflow configure with Overtime

```sql
select * from workflow_base where id in(select distinct workflowid from workflow_nodeOverTime)
```

### 10. Query all completed workflow

```sql
select workflowtype,
       workflowid,
       viewtype,
       count(distinct requestid) workflowcount
  from workflow_currentoperator
 where isremark in ('2', '4')
   and iscomplete = 1
   and islasttimes = 1
   and userid = 1
   and usertype = 0
   and exists
 (select 1
          from workflow_requestbase c
         where (c.deleted <> 1 or c.deleted is null or c.deleted = '')
           and c.workflowid = workflow_currentoperator.workflowid
           and c.currentnodetype = '3'
           and c.requestid = workflow_currentoperator.requestid
           and (isnull(c.currentstatus, -1) = -1 or
               (isnull(c.currentstatus, -1) = 0 and c.creater = 1)))
 group by workflowtype, workflowid, viewtype
 order by workflowtype, workflowid
```

### 11. Show node submit time on the form

```sql
select top 1 operatedate+' '+operatetime from workflow_requestLog 
where requestid = $requestid$ and nodeid = 377 order by operatedate desc,operatetime desc -- 377 is node id
```

How to get node id base on workflow id

```sql
select * from workflow_nodebase where id in (
select nodeid from workflow_flownode where workflowid = 73)  
```

### 12. Query all delete workflow but message not deleted

```sql
select * from ECOLOGY_MESSAGE_INFO_READ 
where targetid in (select requestid  from workflow_requestbase_dellog)
```

### 13. Export organization structure

```sql
select a.id as Department_ID,
       a.departmentcode as Department_code,
       a.departmentmark as Department_name,
       (select b.departmentmark from hrmdepartment b where b.id = a.supdepid) as Supior_Department,
       (select c.subcompanyname from hrmsubcompany c where c.id = a.subcompanyid1) as Divison,
  from hrmdepartment a
 where 1 = 1
 order by id asc;
```

### 14. Query the time consumption of all nodes
```sql
select b.lastname Name,
c.workflowname Workflow_type,
e.requestname Request_Title,
d.nodename Node,
a.receivedate Receive_Date,
a.receivetime Receive_Time,
a.operatedate Operate_Date,
a.operatetime Operate_Time,
DATEDIFF(mi,receivedate + ' ' + receivetime,operatedate + ' ' + operatetime) as 'Time/Mins'
from workflow_currentoperator a
left JOIN hrmresource b
on a.userid = b.id
left join workflow_base c
on a.workflowid = c.id
left join workflow_nodebase d
on a.nodeid = d.id
left join workflow_requestbase e
on a.requestid = e.requestid
where a.operatedate is not null and a.operatetime is not null and a.isremark in (2,4)
and a.receivedate >= '2019-01-01' and a.receivedate <= '2019-08-29' --Time Range Control
and a.userid = 3 --User Control
order by a.id asc
```

### 15. Add tip in textbox

```javascript
<script type="text/javascript">
  jQuery(document).ready(function(){
    $("#field7126").attr('placeholder',"Please upload attachment in comments");
    $("#field7041").attr('placeholder',"Please upload attachment in comments");
    $("#field7079").attr('placeholder',"Please upload attachment in comments");
    $("#field7112").attr('placeholder',"Std: 0.1% per day");
    $("#field7113").attr('placeholder',"Std: 60 days");
    $("#field7070").attr('placeholder',"Std: on 5th/month");
    $("#field7114").attr('placeholder',"Std: 3-6 months");
    $("#field7115").attr('placeholder',"Std: 3 month");
    $("#field7076").attr('placeholder',"Std: Deposit");
  });
</script>
```

### 17. Check date and time

```javascript
<script>
    jQuery(document).ready(function() {
        WfForm.bindFieldChangeEvent("field5866,field5870,field8239,field5871",
        function(obj, id, value) {
            console.log("WfForm.bindFieldChangeEvent--", obj, id, value);
            var startdate = WfForm.getFieldValue("field5866"); //Start Date Field
            var enddate = WfForm.getFieldValue("field8239"); //End Date Field
            var starttime = WfForm.getFieldValue("field5870"); // Start Time
            var endtime = WfForm.getFieldValue("field5871"); // End Time
            if (startdate != "" && enddate != "" && startdate > enddate) {
                WfForm.showMessage("Start Date later than end date！！！", 2, 5);
                WfForm.changeFieldValue("field5866", {
                    value: ""
                });
                WfForm.changeFieldValue("field8239", {
                    value: ""
                });
            } else if (startdate != "" && enddate != "" && startdate == enddate) {
                if (starttime != "" && endtime != "" && starttime >= endtime) {
                    WfForm.showMessage("Start date and end date is the same date, but start time later than end time！！！", 2, 5);
                    WfForm.changeFieldValue("field5870", {
                        value: ""
                    });
                    WfForm.changeFieldValue("field5871", {
                        value: ""
                    });
                } else {}
            } else {}
        });
    });
</script>
```

### 18. Query all users who did not login to system

```sql
select id as User_id, lastname as Name, loginid as Account
  from hrmresource
 where status in(0,1,2,3) and not exists--Who didnot have login log in last 3 month
 (select 1
          from hrmsysmaintenancelog
         where hrmresource.id = hrmsysmaintenancelog.relatedid
           and hrmsysmaintenancelog.operatedate >= ''2016-11-06''--Login start time
           and hrmsysmaintenancelog.operatedate < ''2017-02-07'')--Login ENd time
```

### 19. Workflow process log

```sql
select t1.clientip, t1.logtype,t1.operatedate,t1.operatetime,t1.workflowid,t1.operator,
t1.requestid, t2.creater, t2.requestname
from  workflow_requestLog t1,workflow_requestbase t2 
where t1.requestid=t2.requestid
order by t1.operatedate desc,t1.operatetime desc
```

### 20. Get exit condition
```sql
select a.workflowid,c.workflowname, a.nodeid,d.nodename,a.linkname,b.rulename,b.condit  
from workflow_nodelink a,rule_base b ,workflow_base c,workflow_nodebase d
where  b.linkid=a.id and a.workflowid=c.id and a.nodeid =d.id 
```

### 21. Check any statement make CPU usage too high
#### 21.1 Check field linkage = assign field
```sql
select *
  from workflow_base
 where id in
       (select distinct workflowid
          from (select main.id, entry.triggerfieldname, entry.workflowid
                  from workflow_datainput_entry entry
                  left join workflow_datainput_main main
                    on main.entryid = entry.id) t1,
               (select * from workflow_datainput_field where type = 2) t2
         where t2.datainputid = t1.id
           and t2.pagefieldname = t1.triggerfieldname)
```
#### 21.2 check field attribute
```sql
select * from workflow_nodefieldattr where  attrcontent like '%'+cast(fieldid as varchar)+'%'
```
