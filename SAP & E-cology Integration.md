# SAP & E-cology Integration ABAP Program



## 1. Query Region

```ABAP
FUNCTION ZMMIP004.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  T005U
*"----------------------------------------------------------------------
  SELECT *
    FROM T005U

    INTO TABLE et_output
    WHERE  SPRAS = 1 AND land1 = 'CN'.

  IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No Data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 2. Query Counry

```ABAP
FUNCTION zmmip005 .
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_LAND1) TYPE  LAND1 OPTIONAL
*"     VALUE(IV_LANDX) TYPE  LANDX OPTIONAL
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSMMIP005
*"----------------------------------------------------------------------
  DATA: lv_where TYPE string.
  DATA: con_name TYPE landx.
  IF iv_land1 IS NOT INITIAL.
    CONCATENATE lv_where 'land1 = iv_land1' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF iv_landx IS NOT INITIAL.
    CONCATENATE '%' iv_landx '%' INTO con_name.
    CONCATENATE lv_where 'landx LIKE con_name'  'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.
  ENDIF.

  SELECT LAND1 LANDX
    FROM t005t

    INTO TABLE et_output
    WHERE (lv_where).

  IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 3. Query Language

```ABAP
FUNCTION zmmip006.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_SPRSL) TYPE  SPRAS OPTIONAL
*"     VALUE(IV_SPTXT) TYPE  SPTXT OPTIONAL
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSMMIP006
*"----------------------------------------------------------------------

  DATA: lv_where TYPE string.
  DATA: con_name TYPE sptxt.
  data: ty_data type TABLE OF t002t.

  IF iv_sprsl IS NOT INITIAL.
    CONCATENATE lv_where 'sprsl = iv_sprsl' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF iv_sptxt IS NOT INITIAL.
    CONCATENATE '%' iv_sptxt '%' INTO con_name.
    CONCATENATE lv_where 'sptxt LIKE con_name'  'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF  lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.
  ENDIF.
  select SPRSL sptxt from  t002t into table ty_data[] where spras = 1.
  
  SELECT b~laiso , a~sptxt
    FROM t002t AS a
    LEFT JOIN t002 AS b  ON b~spras = a~SPRSL
    INTO TABLE @et_output
    WHERE (lv_where) and a~spras = 1 .

  IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.
ENDFUNCTION.

```

## 4. Query G/L account master (company code)

```ABAP
FUNCTION zmmip007.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_SAKNR) TYPE  STRING OPTIONAL
*"  EXPORTING
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSMMIP007
*"----------------------------------------------------------------------
  DATA: lv_where TYPE string.
  DATA: con_name TYPE string.
  " IF iv_saknr IS NOT INITIAL.
  "    CONCATENATE lv_where 'saknr = iv_saknr' 'AND' INTO lv_where SEPARATED BY space.
  "  ENDIF.
  CONCATENATE lv_where  'skb1~bukrs = ''1100'' or skb1~bukrs = ''1200'' AND'   INTO lv_where SEPARATED BY space.
  IF iv_saknr IS NOT INITIAL.
    CONCATENATE '%' iv_saknr '%' INTO con_name.
    CONCATENATE lv_where 'skb1~saknr LIKE con_name'  'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF  lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.
  ENDIF.

  SELECT
          skb1~bukrs
          skb1~saknr"G/L Account Number
          skat~txt50 "G/L Account Long Text
        INTO CORRESPONDING FIELDS OF TABLE et_output
        FROM skb1
      JOIN skat ON skb1~saknr = skat~saknr
   WHERE (lv_where).
  IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 5.  Query Rules for 'Allocation' Field Layout data

```ABAP
FUNCTION zmmip008.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_ZUAWA) TYPE  DZUAWA OPTIONAL
*"     VALUE(IV_NAME1) TYPE  NAME1_ZUN OPTIONAL
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSMMIP008
*"----------------------------------------------------------------------
  DATA: lv_where TYPE string.
  DATA: con_name TYPE NAME1_ZUN.

  IF iv_zuawa IS NOT INITIAL.
    CONCATENATE lv_where 'zuawa = iv_zuawa' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF iv_name1 IS NOT INITIAL.
    CONCATENATE '%' iv_name1  '%' INTO con_name.
    CONCATENATE lv_where 'name1 LIKE con_name'  'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF  lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.
  ENDIF.

  SELECT zuawa name1 FELD1
    FROM TZUN
    INTO CORRESPONDING FIELDS OF TABLE et_output
    WHERE (lv_where).

  IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 6. Query Own Explanations for Terms of Payment

```ABAP
FUNCTION zmmip009.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_ZTERM) TYPE  DZTERM OPTIONAL
*"     VALUE(IV_VTEXT) TYPE  DZTERM_BEZ OPTIONAL
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  TVZBT
*"----------------------------------------------------------------------


  DATA: lv_where TYPE string.
  DATA: con_name TYPE  dzterm_bez.


  IF iv_zterm IS NOT INITIAL.
    CONCATENATE lv_where 'zterm = iv_zterm' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF iv_vtext IS NOT INITIAL.
    CONCATENATE '%' iv_vtext '%' INTO con_name.
    CONCATENATE lv_where 'vtext LIKE con_name'  'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

  IF  lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.
  ENDIF.

  SELECT
    t052u~zterm,
    t052u~TEXT1 as VTEXT
    FROM t052u
    join T052 on t052~zterm = t052u~zterm and KOART = 'K'
    WHERE spras = 1

    INTO CORRESPONDING FIELDS OF  TABLE @et_output.

  IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No Data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 7. Create new vendor

```ABAP
FUNCTION zmmip010.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_BUKRS) TYPE  LFB1-BUKRS
*"     VALUE(IV_AKONT) TYPE  LFB1-AKONT
*"     VALUE(IV_ZUAWA) TYPE  LFB1-ZUAWA
*"     VALUE(IV_ZTERM) TYPE  LFB1-ZTERM
*"     VALUE(IV_BU_SORT1_TXT) TYPE  BUS000FLDS-BU_SORT1_TXT
*"     VALUE(IV_BU_SORT2_TXT) TYPE  BUS000FLDS-BU_SORT2_TXT OPTIONAL
*"     VALUE(IV_COUNTRY) TYPE  ADDR2_DATA-COUNTRY
*"     VALUE(IV_REGION) TYPE  ADDR2_DATA-REGION
*"     VALUE(IV_STREET) TYPE  ADDR2_DATA-STREET
*"     VALUE(IV_LANGU) TYPE  T002-LAISO
*"     VALUE(IV_POST_CODE1) TYPE  ADDR2_DATA-POST_CODE1
*"     VALUE(IV_NO) TYPE  CHAR8 OPTIONAL
*"     VALUE(IV_NAME_ORG1) TYPE  BU_NAMEOR1
*"     VALUE(IV_NAME_ORG2) TYPE  BU_NAMEOR2 OPTIONAL
*"     VALUE(IV_CITY) TYPE  ADDR2_DATA-CITY1
*"     VALUE(IV_CREATION_GROUP) TYPE  BAPIBUS1006_HEAD-PARTN_GRP
*"       DEFAULT 'MM05'
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"     VALUE(EV_SAP_NO) TYPE  BAPIBUS1006_HEAD-BPARTNER
*"----------------------------------------------------------------------


  lw_data-bukrs = iv_bukrs.
  lw_data-akont  = iv_akont.
  lw_data-zuawa = iv_zuawa.
  lw_data-termtj = iv_zterm.
  lw_data-bu_sort1_txt = iv_bu_sort1_txt.
  lw_data-bu_sort2_txt = iv_bu_sort2_txt.
  lw_data-country = iv_country.
  lw_data-region = iv_region.
  lw_data-street  = iv_street.
  lw_data-langu = iv_langu.
  lw_data-post_code1 = iv_post_code1.
  lw_data-name_org1  = iv_name_org1.
  lw_data-name_org2  = iv_name_org2.
  lw_data-city1 = iv_city.
  lw_data-creation_group = iv_creation_group.

  APPEND lw_data TO gt_data.

  SELECT * INTO TABLE lt_tb003 FROM tb003.
  lt_comp = gt_data.
  SORT lt_comp BY  bukrs.
  DELETE ADJACENT DUPLICATES FROM lt_comp COMPARING bukrs."CREATION_NUMBER BUKRS.
*
  lt_org = gt_data.
  SORT lt_org BY  ekorg.
  DELETE ADJACENT DUPLICATES FROM lt_org COMPARING ekorg."CREATION_NUMBER EKORG.

  PERFORM frm_check_data.

**Check wheter BP is existing or not
  IF lw_data-creation_number IS INITIAL.
    PERFORM frm_check_bp_exit USING lw_data-name_org1
    CHANGING lw_data-exist
      lw_data-creation_number.
  ELSE.
    DATA: lw_but000 LIKE but000.
    SELECT SINGLE * FROM but000 INTO lw_but000 WHERE partner = lw_data-creation_number AND bu_group = lw_data-creation_group  AND type = '2'.
    IF sy-subrc = 0.
*------Supplier exist, marked as X, update data
      lw_data-exist  = 'X'.
    ELSE.
*------Supplier not exist, mark as blank, create new data
      lw_data-exist = ''.
    ENDIF.

  ENDIF.

  IF lw_data-exist IS INITIAL.
**Create BP
    PERFORM frm_create_bp USING lw_data-creation_number
    CHANGING lw_data.

  ELSE.
**Create BP
    PERFORM frm_change_bp USING lw_data-creation_number
    CHANGING lw_data.

**Update address
    PERFORM frm_add_addr USING lw_data-creation_number
    CHANGING lw_data.
  ENDIF.

  IF lw_data-exist = 'X'.
**Supplier role
    READ TABLE lt_tb003 INTO lw_tb003 WITH KEY role = 'FLVN01'.
    IF sy-subrc = 0.

      PERFORM frm_add_role USING lw_data-creation_number
            lw_tb003-rolecategory
            'FLVN01'
      CHANGING lw_head.
    ENDIF.

**Finance Role
    READ TABLE lt_tb003 INTO lw_tb003 WITH KEY role = 'FLVN00'.
    IF sy-subrc = 0.

      PERFORM frm_add_role USING lw_data-creation_number
            lw_tb003-rolecategory
            'FLVN00'
      CHANGING lw_head.
    ENDIF.


**Submit data
    PERFORM frm_commit USING lw_data-creation_number.

***change address data
*      PERFORM frm_change_addr USING lw_head-creation_number
*      CHANGING lw_head.

**Supplier data
    CLEAR: lt_comp_temp.
    LOOP AT lt_comp INTO lw_comp WHERE bukrs = lw_data-bukrs.
      APPEND lw_comp TO lt_comp_temp.
    ENDLOOP.

    CLEAR: lt_org_temp.
    LOOP AT lt_org INTO lw_org WHERE ekorg = lw_data-ekorg.
      APPEND lw_org TO lt_org_temp.
    ENDLOOP.

    PERFORM frm_create_vendor TABLES lt_comp_temp lt_org_temp
    USING lw_data-creation_number
    CHANGING lw_data.

**Submit data
    PERFORM frm_commit USING lw_data-creation_number.

  ENDIF.

  ev_msgty = lw_data-type.
  ev_message = lw_data-message.
  ev_sap_no = lw_data-creation_number.
ENDFUNCTION.

```

## 8. Query Material Master Data

```ABAP
FUNCTION ZMMIP011 .
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_WERKSTYPE  WERKS_D OPTIONAL
*"     VALUE(IV_MATNR) TYPE  TEXT18 OPTIONAL
*"  EXPORTING
*"     VALUE(EV_MSGTYTYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSMMIP011OUT
*"----------------------------------------------------------------------
INCLUDE zmmip011top. "Global variable, screen variable, data type
  IF iv_matnr IS NOT INITIAL.
*Material code plus leading zero
  CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
    EXPORTING
      input  = IV_MATNR
    IMPORTING
      output = IV_MATNR.
   CONCATENATE lv_where 'mast~matnr = iv_matnr' 'AND' INTO lv_where SEPARATED BY space.
ELSE.
    ev_msgty = 'E'.
    ev_message = 'Please enter material code'.
     RETURN.
  ENDIF.

 IF lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.  " Delete last AND
  ENDIF.

*Get all the secondary classifications and descriptions of the part number
 SELECT  atnam attxt
       INTO CORRESPONDING FIELDS OF TABLE gt_fldm2
          FROM ZTMM_OA_DATA
       WHERE fldm2 = IV_MATNR+6(3).

 IF gt_fldm2[] IS INITIAL.
    ev_msgty = 'E'.
    ev_message = 'No such data'.
    RETURN.
  ENDIF.

*Get the characteristics and description of the material
 SELECT cabn~atnam cabnt~atinn cabnt~atbez
   INTO TABLE it_cabn
   FROM cabn
   JOIN cabnt ON cabn~atinn = cabnt~atinn
   FOR ALL ENTRIES IN gt_fldm2
   WHERE
         cabn~atnam = gt_fldm2-atnam AND
         cabnt~spras = sy-langu AND cabn~lkenz = ''.

    SELECT ausp~objek ausp~atinn ausp~atwrt ausp~dec_value_from cabn~anzdz
      FROM ausp
      JOIN cabn ON cabn~atinn = ausp~atinn
      INTO TABLE gt_ausp
      WHERE ausp~objek = IV_MATNR  AND
            ausp~lkenz = '' AND
            ausp~klart = '001'."Class Type

SORT it_cabn BY atinn.
SORT gt_ausp BY atinn.

  LOOP AT gt_ausp INTO wa_ausp.
*   Convert scientific notation into numbers
    l_decf = wa_ausp-dec_value_from.
    l_digits = wa_ausp-digits.
    CALL FUNCTION 'QSS0_FLTP_TO_CHAR_CONVERSION'
      EXPORTING
        i_number_of_digits       = l_digits  "digits
        i_fltp_value             = l_decf
        i_value_not_initial_flag = 'X'
        i_screen_fieldlength     = 16
      IMPORTING
        e_char_field             = l_char.
    CONDENSE l_char NO-GAPS.
    wa_ausp-value = l_char.
    MODIFY gt_ausp FROM wa_ausp TRANSPORTING value.
    CLEAR wa_ausp.
  ENDLOOP.

  LOOP AT it_cabn INTO wa_cabn.
        READ TABLE gt_ausp INTO wa_ausp WITH KEY atinn = wa_cabn-atinn.
        IF sy-subrc = 0 AND wa_ausp-atwrt  IS NOT INITIAL.
            wa_out-z_value = wa_ausp-atwrt.
            ELSEIF sy-subrc = 0 AND wa_ausp-atwrt IS INITIAL..
              wa_out-z_value = wa_ausp-value.
           ELSE.
              wa_out-z_value = ''.
          ENDIF.
       wa_out-atbez =  wa_cabn-atbez.
       wa_out-atnam =  wa_cabn-atnam.
     APPEND wa_out TO et_output.
     CLEAR wa_cabn.
     CLEAR wa_ausp.
     ENDLOOP.

SORT et_output BY atnam.
   IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
   ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 9. Interactive-Material Master Data Classification Features

```ABAP
FUNCTION ZMMIP011A.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      IV_INPUT STRUCTURE  ZSMMIP011A
*"----------------------------------------------------------------------

INCLUDE ZMMIP011ATOP.

IF IV_INPUT[] IS INITIAL.
    ev_msgty = 'E'.
    ev_message = 'No changes'.
    RETURN.
  ELSE.
    SORT IV_INPUT BY  matnr.
    LOOP AT IV_INPUT INTO wa_input.
*Material code plus leading zero
      CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
        EXPORTING
          input  = wa_input-matnr
        IMPORTING
          output = wa_input-matnr.
    MODIFY IV_INPUT FROM wa_input.
    AT NEW matnr.
       APPEND wa_input TO gt_temp."Remove same sap material no.
     ENDAT.
    CLEAR wa_input.
    ENDLOOP.
   ENDIF.
*Query all feature value of material via ZMMIP011
LOOP AT gt_temp INTO wa_temp.
  CALL FUNCTION 'ZMMIP011'
  EXPORTING
    iv_werks  =  wa_temp-werks
    iv_matnr  =  wa_temp-matnr
    TABLES
      et_output = gt_output.
lv_key = wa_temp-matnr.
lv_class = wa_temp-matnr+6(6).
*CALL FUNCTION 'BAPI_OBJCL_GETDETAIL'
*  EXPORTING
*    objectkey              = lv_key
*    objecttable            = lv_table
*    classnum               = lv_class
*    classtype              = lv_class_type
*  tables
*    allocvaluesnum         = lt_alloc_num
*    allocvalueschar        = lt_alloc_char
*    allocvaluescurr        = lt_alloc_curr
*    return                 = lt_return.
*Get the character format of each characteristic value
SELECT atnam atfor FROM cabn INTO TABLE lt_cabn
   FOR ALL ENTRIES IN gt_output
       WHERE atnam = gt_output-atnam.

LOOP AT gt_output INTO wa_output.
 DATA:lv_atnam TYPE atnam.
 DATA:lv_value TYPE TXT50.
 READ TABLE lt_cabn INTO lw_cabn WITH KEY atnam = wa_output-atnam ."Check the character format of the characteristic value one by one
        CASE lw_cabn-atfor.
        WHEN 'CHAR'.
           READ TABLE IV_INPUT INTO wa_input  WITH KEY  atnam = wa_output-atnam matnr = wa_temp-matnr.
          IF  wa_output-z_value IS INITIAL AND ( wa_input-z_value = '' OR  wa_input-z_value IS INITIAL )."Skip if there is no such characteristic value
            CONTINUE.
          ENDIF.
             IF sy-subrc = 0 AND  wa_input-z_value IS NOT INITIAL."Indicates that the characteristic value has changed
               lw_alloc_char-charact = wa_input-atnam .
               lw_alloc_char-value_char = wa_input-z_value .
               lw_alloc_char-value_char_long = wa_input-z_value .
               ELSEIF  sy-subrc = 0 AND wa_input-z_value IS INITIAL."Modify the characteristic value to blank
                 CONTINUE.
                 ELSE."The characteristic value has no changed
                 lw_alloc_char-charact = wa_output-atnam .
                 lw_alloc_char-value_char = wa_output-z_value .
                 lw_alloc_char-value_char_long = wa_output-z_value .
              ENDIF.
          APPEND lw_alloc_char TO lt_alloc_char.
        WHEN 'NUM'.
            READ TABLE IV_INPUT INTO wa_input  WITH KEY  atnam = wa_output-atnam matnr = wa_temp-matnr.
            IF  wa_output-z_value IS INITIAL AND wa_input-z_value IS INITIAL.
            CONTINUE.
           ENDIF.
             IF sy-subrc = 0.
               lv_atnam = wa_input-atnam.
               lv_value = wa_input-z_value.
               ELSE.
               lv_atnam = wa_output-atnam.
               lv_value =  wa_output-z_value.
               ENDIF.
               IF lv_value CN '0123456789.- '."Check if the data is in digital format
                 ev_msgty = 'E'.
                 ev_message = 'Characteristic' && wa_input-atnam && ' value is not digit'.
                  RETURN.
                  ELSE.
                     lw_alloc_num-charact = lv_atnam  .
                    CALL FUNCTION 'CHAR_FLTP_CONVERSION'
                     EXPORTING
                       string             = lv_value
                       IMPORTING
                         flstr              = lw_alloc_num-value_from
                         EXCEPTIONS
                      exponent_too_big   = 1
                      exponent_too_small = 2
                      string_not_fltp    = 3
                      too_many_decim     = 4
                      OTHERS             = 5.
                    ENDIF.
                      APPEND lw_alloc_num TO lt_alloc_num.
                WHEN OTHERS.
            ENDCASE.
      CLEAR:lw_alloc_char,lw_alloc_num,lw_cabn,wa_input.
   ENDLOOP.
*
    CALL FUNCTION 'BAPI_OBJCL_CHANGE'
      EXPORTING
        objectkey    = lv_key
        objecttable  = lv_table
        classnum     = lv_class        "lv_class
        classtype    = lv_class_type
*        status       = '1'
*        keydate         = sy-datum
*        NO_DEFAULT_VALUES       = ' '
*    IMPORTING
*        CLASSIF_STATUS  =
      TABLES
        allocvaluesnumnew  = lt_alloc_num
        allocvaluescharnew = lt_alloc_char
        allocvaluescurrnew = lt_alloc_curr
        return          = lt_return.

    READ TABLE lt_return INTO lw_return  WITH KEY type = 'E'..
*  IF lw_return-type = 'S' .
    IF sy-subrc <> 0.
    CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
    EXPORTING
     wait = 'X'.
     LOOP AT lt_return INTO lw_return WHERE type = 'S' AND number = '737'.
       IF  ev_msgty <> 'E'.
       ev_msgty  = 'S'.
       ENDIF.
      IF  EV_MESSAGE IS INITIAL.
         EV_MESSAGE = lv_key+6 && ' modified successfully'.
      ELSE.
        CONCATENATE  EV_MESSAGE '/' lv_key+6 ' modified successfully' INTO  EV_MESSAGE.
      ENDIF.
    ENDLOOP.
  ELSE.
    LOOP AT lt_return INTO lw_return WHERE type = 'E'.
      EV_MSGTY = 'E'.
      IF  EV_MESSAGE IS INITIAL.
         EV_MESSAGE = lv_key+6 && lw_return-message.
      ELSE.
        CONCATENATE  EV_MESSAGE '/' lv_key+6 lw_return-message INTO  EV_MESSAGE.
      ENDIF.
    ENDLOOP.
  ENDIF.

IF ev_msgty  = 'S'.

PERFORM bdc_init.
***************************************************************
perform bdc_dynpro      using 'SAPLMGMM'              '0060'.
perform bdc_field       using 'BDC_CURSOR'            'RMMG1-MATNR'.
perform bdc_field       using 'BDC_OKCODE'            '=AUSW'. "ENTR
perform bdc_field       using 'RMMG1-MATNR'            lv_key+6(12).

perform bdc_dynpro      using 'SAPLMGMM'              '0070'.
perform bdc_field       using 'BDC_CURSOR'            'MSICHTAUSW-DYTXT(03)'.
perform bdc_field       using 'BDC_OKCODE'            '=ENTR'.
perform bdc_field       using 'MSICHTAUSW-KZSEL(03)'  'X'.

perform bdc_dynpro      using 'SAPLCLCA'               '0602'.
perform bdc_field       using 'BDC_CURSOR'             'RMCLF-KLART'.
perform bdc_field       using 'BDC_OKCODE'             '=ENTE'.
perform bdc_field       using 'RMCLF-KLART'            lv_class_type."=001

perform bdc_dynpro      using 'SAPLCLFM'               '0500'.
perform bdc_field       using 'BDC_CURSOR'             'RMCLF-CLASS(01)'.
perform bdc_field       using 'BDC_OKCODE'             '=AUSW'.
perform bdc_field       using 'RMCLF-PAGPOS'           1.

perform bdc_dynpro      using 'SAPLCTMS'                '0109'.
perform bdc_field       using 'BDC_CURSOR'              'RCTMS-MWERT(03)'.
perform bdc_field       using 'BDC_OKCODE'              '=BACK'.

perform bdc_dynpro      using 'SAPLCLFM'                '0500'.
perform bdc_field       using 'BDC_CURSOR'              'RMCLF-CLASS(01)'.
perform bdc_field       using 'BDC_OKCODE'              '=SAVE'.
perform bdc_field       using 'RMCLF-PAGPOS'            1.

*********************************************************
 CLEAR itmsg.
 CALL TRANSACTION 'MM02' USING itbdc MODE 'E' UPDATE 'S' MESSAGES INTO itmsg.
*      DATA: msg TYPE bdcmsgcoll.
*     LOOP AT itmsg INTO msg.
*      CALL FUNCTION 'MESSAGE_TEXT_BUILD'
*        EXPORTING
*          msgid               = msg-MSGID
*          msgnr               = msg-MSGNR
*          msgv1               = msg-MSGV1
*          msgv2               = msg-MSGV2
*          msgv3               = msg-MSGV3
*          msgv4               = msg-MSGV4
*        IMPORTING
*           MESSAGE_TEXT_OUTPUT = lv_txt.
*      ENDLOOP.
*----------------------Edit material long text----------------------
*SELECT clint class FROM klah INTO TABLE lt_klah
*       WHERE class = lv_class.
*
* READ TABLE lt_klah INTO lw_klah  WITH KEY class = lv_class.
*
*lw_allkssk-objek = lv_key.
*lw_allkssk-clint = lw_klah-clint.
*lw_allkssk-klart = lv_class_type. "=001
*lw_allkssk-class = lv_class.
*lw_allkssk-kschl = 'PZ'.
*  APPEND lw_allkssk TO lt_allkssk.
*
*l_rmclf-matnr = lv_key.
*l_rmclf-objek = lv_key.
*l_rmclf-class = lv_class.
*l_rmclf-statu = '1'.
*l_rmclf-zaehl = 10.
*l_rmclf-klart = lv_class_type.
*
*  SELECT
*       objek
*       atinn
*       atzhl
*       klart
*       mafid
*       atwrt
*       atflv
*   FROM ausp INTO TABLE lt_allausp
*       WHERE objek = lv_key.
*
*  CALL FUNCTION 'EXIT_SAPLCLFM_002'
*   EXPORTING
*    I_RMCLF  =  l_rmclf
*    I_APPL  = ''
*    I_CALLED = '1'
*    TABLES
*      t_allkssk = lt_allkssk
*      t_allausp = lt_allausp
*      t_delcl = lt_delcl
*      t_delob = lt_delob.

*����������������������������������������������������������������������������*
  ENDIF.

   CLEAR : lw_cabn,lw_alloc_curr,lw_alloc_num,lw_alloc_char,lw_return.
   REFRESH:lt_cabn,lt_alloc_curr,lt_alloc_num,lt_alloc_char,lt_return.
ENDLOOP.
  CLEAR : wa_temp,wa_input ,wa_output.
  REFRESH :gt_temp,gt_input ,gt_output.
ENDFUNCTION.

```

## 10. Query Material Master Data (Basic)

```ABAP
FUNCTION ZMMIP012 .
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_WERKS) TYPE  WERKS_D
*"     VALUE(IV_MATNR) TYPE  TEXT18
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSMMIP012
*"----------------------------------------------------------------------
INCLUDE zmmip012top.

IF IV_MATNR IS NOT INITIAL.
*Material code plus leading zero
  CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
    EXPORTING
      input  = IV_MATNR
    IMPORTING
      output = IV_MATNR.
    CONCATENATE lv_where  '  a~matnr = IV_MATNR ' 'AND' INTO lv_where SEPARATED BY space.
 ELSE.
    ev_msgty = 'E'.
    ev_message = 'Please enter materail no.'.
    RETURN.
  ENDIF.
IF IV_WERKS IS NOT INITIAL.
 CONCATENATE lv_where  '  b~werks = IV_WERKS ' 'AND' INTO lv_where SEPARATED BY space.
ENDIF.

 IF lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.  "Delete last AND
  ENDIF.

 SELECT

    a~matnr        "Material Number
    a~matkl        "Material Group
    a~mtart        "Material type
    a~bismt        "Old material number
    a~extwg        "External material group
    a~mtpos_mara   "General item category group
    a~brgew        "Gross weight
    a~ntgew        "Net weight
    a~gewei        "Weight Unit
    a~spart        "Division
    a~taklv        "Tax Classification of Material

    a~tragr        "Transportation Group
    b~ladgr        "Loading Group
    b~ekgrp        "Purchasing Group
    a~bstme        "Order unit
    b~insmk        "Post to Inspection Stock
    b~kordb        "Indicator: Source list requirement

    a~mprof        "Mfr part profile
    b~dismm        "MRP Type
    b~dispo        "MRP controller
    b~disgr        "MRP Group
    b~disls        "Lot size (materials planning)
    b~bstmi        "Minimum lot size
    b~maabc        "ABC indicator
    b~ausss        "Assembly scrap in percent(%)
    b~bstrf        "Rounding value for purchase order quantity
    b~beskz        "Procurement Type
    b~sobsl        "Special procurement type
    b~lgpro        "Issue storage location
    b~lgfsb        "Default storage location for external procurement
    b~rgekz        "Indicator: Backflush
    b~schgt        "Indicator: bulk material
    b~dzeit        "In-house production time
    b~eisbe        "Safety stock
    b~fhori        "Scheduling Margin Key for Floats
    b~plifz        "Planned delivery time in days
    b~webaz        "Goods receipt processing time in days
    b~strgr        "Planning strategy group
    b~vrmod        "Consumption mode
    b~vint1        "Consumption period: backward
    b~vint2        "Consumption period: forward
    b~miskz        "Mixed MRP indicator

    b~mtvfp        "Checking Group for Availability Check
    b~sbdkz        "Dependent requirements ind. for individual and coll. reqmts
    b~kausf        "Component scrap in percent%
    b~kzaus        "Discontinuation indicator
    b~ausdt        "Effective-out date
    b~nfmat        "Follow-up material
    b~ausme        "Unit of issue
*    umren type marm-umren,        "Denominator for conversion to base units of measure
*    umrez type marm-umrez,        "Numerator for Conversion to Base Units of Measure
    b~fevor        "Production Supervisor
    b~sfcpf        "Production Scheduling Profile
    b~xchpf        "Batch management requirement indicator
    a~mhdrz        "Minimum Remaining Shelf Life
    a~mhdhb        "Total shelf life
    a~iprkz        "Period Indicator for Shelf Life Expiration Date(SLED)
    b~ncost        "Do Not Cost
    b~losgr        "Costing lot size

    b~prctr        "Profit center
******Extra field********
    b~uneto         "Underdelivery tolerance limit
    b~ueeto         "Overdelivery tolerance limit
    b~ueetk         "Indicator: Unlimited overdelivery allowed
    a~laeda        "Date of Last Change
    a~ersda        "Created On
    a~ernam        "Name of Person who Created the Object
    INTO CORRESPONDING FIELDS OF TABLE gt_data
    FROM mara AS a INNER JOIN marc AS b ON a~matnr = b~matnr
    WHERE (lv_where).

  SORT gt_data BY matnr.

  IF gt_data[] IS NOT INITIAL.
*get marm
     SELECT
       matnr                   "Material Number
       umren as umrena         "Denominator for conversion for Order
       umrez as umreza         "Numerator for Conversion for Order
       INTO CORRESPONDING FIELDS OF TABLE gt_marmdata
       FROM marm FOR ALL ENTRIES IN gt_data
     WHERE matnr = gt_data-MATNR and meinh = gt_data-bstme.
     SELECT
       matnr                   "Material Number
       umren as umrenb         "Denominator for conversion for delivery
       umrez as umrezb         "Numerator for Conversion for delivery
       INTO CORRESPONDING FIELDS OF TABLE gt_marmdata2
       FROM marm FOR ALL ENTRIES IN gt_data
     WHERE matnr = gt_data-MATNR and meinh = gt_data-ausme.
*Get mbew
    SELECT
      matnr         "Material Number
      bwkey         "Valuation area
      bklas         "Valuation Class
      vprsv         "Price control indicator
      mlast         "Material Price Determination: Control
      peinh         "Price unit
      ekalr         "Material Is Costed with Quantity Structure
      hkmat         "Material-related origin
      INTO CORRESPONDING FIELDS OF TABLE gt_mbewdata
      FROM mbew
    WHERE matnr = IV_MATNR .
*Get mvke
     SELECT
       matnr         "Material Number
       vkorg         "Sales Organization
       vtweg         "Distribution Channel
       dwerk         "Delivering Plant (Own or External)
       aumng         "Minimum order quantity in base unit of measure
       ktgrm         "Account assignment group for this material
       mtpos         "Item category group from material master
       INTO CORRESPONDING FIELDS OF TABLE gt_mvkedata
       FROM mvke
     WHERE matnr = IV_MATNR .

*Get material description
     SELECT matnr spras maktx
       INTO CORRESPONDING FIELDS OF TABLE gt_maktx
       FROM makt
     WHERE matnr = IV_MATNR AND spras = '1'.
       .
*Get long description text
     SELECT matnr spras makt1
       INTO CORRESPONDING FIELDS OF TABLE gt_makt1
       FROM ZTMM0001
     WHERE matnr = IV_MATNR AND spras = '1'.
*end



     LOOP AT gt_data INTO wa_data.
       case wa_data-iprkz.
         when ''.
           wa_data-eprkz = 'D'.        " Base on differetn iprkz value decide different data type of eprkz
         when '1'.
           wa_data-eprkz = 'W'.
         when '2'.
           wa_data-eprkz = 'M'.
         when '3'.
           wa_data-eprkz = 'Y'.
       ENDCASE.


       CALL FUNCTION 'CONVERSION_EXIT_CUNIT_OUTPUT'
         EXPORTING
           input    = wa_data-meins
*              language = sy-langu
         IMPORTING
           output   = wa_data-meins.
*          CALL FUNCTION 'CONVERSION_EXIT_CUNIT_OUTPUT'
*            EXPORTING
*              input    = gt_data-ausme
*               language = sy-langu
*            IMPORTING
*              output   = gt_data-ausme.

       READ TABLE gt_marmdata WITH KEY matnr = IV_MATNR.
       IF sy-subrc = 0.
          wa_data-umrena = gt_marmdata-umrena.        
          wa_data-umreza = gt_marmdata-umreza.        
       ENDIF.
       READ TABLE gt_marmdata2 WITH KEY matnr = IV_MATNR.
       IF sy-subrc = 0.
          wa_data-umrenb = gt_marmdata2-umrenb.        
          wa_data-umrezb = gt_marmdata2-umrezb.        
       ENDIF.
       READ TABLE gt_mbewdata WITH KEY matnr = IV_MATNR bwkey = IV_WERKS.
       IF sy-subrc = 0.
          wa_data-bklas = gt_mbewdata-bklas.        
          wa_data-vprsv = gt_mbewdata-vprsv.         
          wa_data-mlast = gt_mbewdata-mlast.        
          wa_data-peinh = gt_mbewdata-peinh.         
          wa_data-ekalr = gt_mbewdata-ekalr.        
          wa_data-hkmat = gt_mbewdata-hkmat.         
       ENDIF.
       if IV_WERKS = '1101' or IV_WERKS = '1102' or IV_WERKS = '1103' or IV_WERKS = '1104' or IV_WERKS = '1105' or IV_WERKS = '1106' or IV_WERKS = '1199'.
         READ TABLE gt_mvkedata WITH KEY matnr = IV_MATNR dwerk = '1199'.
         IF sy-subrc = 0.
            wa_data-vkorg = gt_mvkedata-vkorg.         
            wa_data-vtweg = gt_mvkedata-vtweg.         
            wa_data-dwerk = gt_mvkedata-dwerk.         
            wa_data-aumng = gt_mvkedata-aumng.         
            wa_data-ktgrm = gt_mvkedata-ktgrm.         
            wa_data-mtpos = gt_mvkedata-mtpos.         
         ENDIF.
       elseif IV_WERKS = '1201' or IV_WERKS = '1501' or IV_WERKS = '1601' .
         READ TABLE gt_mvkedata WITH KEY matnr = IV_MATNR dwerk = IV_WERKS.
         IF sy-subrc = 0.
            wa_data-vkorg = gt_mvkedata-vkorg.         
            wa_data-vtweg = gt_mvkedata-vtweg.         
            wa_data-dwerk = gt_mvkedata-dwerk.         
            wa_data-aumng = gt_mvkedata-aumng.         
            wa_data-ktgrm = gt_mvkedata-ktgrm.         
            wa_data-mtpos = gt_mvkedata-mtpos.         
         ENDIF.
       else.
         READ TABLE gt_mvkedata WITH KEY matnr = IV_MATNR dwerk = IV_WERKS.
         IF sy-subrc = 0.
            wa_data-vkorg = gt_mvkedata-vkorg.         
            wa_data-vtweg = gt_mvkedata-vtweg.         
            wa_data-dwerk = gt_mvkedata-dwerk.         
            wa_data-aumng = gt_mvkedata-aumng.         
            wa_data-ktgrm = gt_mvkedata-ktgrm.         
            wa_data-mtpos = gt_mvkedata-mtpos.         
         ENDIF.
       endif.

       READ TABLE gt_maktx WITH KEY matnr = IV_MATNR.
       IF sy-subrc = 0.
          wa_data-maktx = gt_maktx-maktx.
       ENDIF.
       READ TABLE gt_maktx_e WITH KEY matnr = IV_MATNR.
       IF sy-subrc = 0.
          wa_data-maktx_en = gt_maktx_e-maktx.
       ENDIF.
       READ TABLE gt_makt1 WITH KEY matnr = IV_MATNR.
       IF sy-subrc = 0.
          wa_data-makt1 = gt_makt1-makt1.
       ENDIF.
       READ TABLE gt_makt1 WITH KEY matnr = IV_MATNR.
       IF sy-subrc = 0.
          wa_data-makt1_en = gt_makt1-makt1.
       ENDIF.

      MODIFY gt_data  FROM  wa_data.
      CLEAR wa_data.
     ENDLOOP.
   ENDIF.
*Export table
LOOP AT gt_data INTO wa_data.
********basic data1**********************
 wa_out-z_view = 'Basic data 1'.
 wa_out-z_text = 'Material group'.
 wa_out-z_value = wa_data-MATKL.
 wa_out-z_isref = 1.
* wa_out-z_item = 'MATKL'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.

*  Check the old material code must be input and uniqueness, premise: 1. finished product; 2. semi-finished product (excluding anode foil, cathode foil, electrolytic paper)
IF wa_data-mtart = 'AH03' OR  wa_data-mtart = 'AH04' OR ( wa_data-matkl+0(3) = '208' OR
                                      wa_data-matkl+0(3) = '209' OR wa_data-matkl+0(3) = '210' ).
 wa_out-z_view = 'Basic data 1'.
 wa_out-z_text = 'Materail Description'.
 wa_out-z_value = wa_data-MAKTX.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'maktx'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 ENDIF.
 wa_out-z_view = 'Basic Data 1'.
 wa_out-z_text = 'Old material number'.
 wa_out-z_value = wa_data-BISMT.
 wa_out-z_isref = 0.
"wa_out-z_item = 'BISMT'.
 APPEND wa_out TO et_output.

 CLEAR wa_out.
 wa_out-z_view = 'Basic Data 1'.
 wa_out-z_text = 'External material group'.
 wa_out-z_value = wa_data-EXTWG.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'EXTWG'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Basic Data 1'.
 wa_out-z_text = 'General item category group'.
 wa_out-z_value = wa_data-MTPOS_MARA.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'MTPOS_MARA'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Basic Data 1'.
 wa_out-z_text = 'Gross weight'.
 wa_out-z_value = wa_data-BRGEW.
 wa_out-z_isref = 0.
 "wa_out-z_item = 'BRGEW'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Basic Data 1'.
 wa_out-z_text = 'Net weight'.
 wa_out-z_value = wa_data-NTGEW.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'NTGEW'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Basic Data 1'.
 wa_out-z_text = 'Weight Unit'.
 wa_out-z_value = wa_data-GEWEI.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'GEWEI'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
****************Sales: Sales Organization 1*************
 wa_out-z_view = 'Sales: Sales Organization 1'.
 wa_out-z_text = 'Sales Organization'.
 wa_out-z_value = wa_data-VKORG.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'VKORG'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Sales: Sales Organization 1'.
 wa_out-z_text = 'Distribution Channel'.
 wa_out-z_value = wa_data-VTWEG.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'VTWEG'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Sales: Sales Organization 1'.
 wa_out-z_text = 'Division'.
 wa_out-z_value = wa_data-SPART.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'SPART'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Sales: Sales Organization 1'.
 wa_out-z_text = 'Delivering Plant (Own or External)'.
 wa_out-z_value = wa_data-DWERK.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'DWERK'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.

 wa_out-z_view = 'Sales: Sales Organization 1'.
 wa_out-z_text = 'Tax Classification of Material'.
 wa_out-z_value = wa_data-TAKLV.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'TAKLV'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Sales: Sales Organization 1'.
 wa_out-z_text = 'Minimum order quantity in base unit of measure'.
 wa_out-z_value = wa_data-AUMNG.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'AUMNG'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
****************Sales: Sales Organization 2*******************
 wa_out-z_view = 'Sales: Sales Organization 2'.
 wa_out-z_text = 'Account assignment group for this material'.
 wa_out-z_value = wa_data-KTGRM.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'KTGRM'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Sales: Sales Organization 2'.
 wa_out-z_text = 'Item category group from material master'.
 wa_out-z_value = wa_data-MTPOS.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'MTPOS'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Sales: Sales Organization 2'.
 wa_out-z_text = 'Transportation Group'.
 wa_out-z_value = wa_data-TRAGR.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'TRAGR'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Sales: Sales Organization 2'.
 wa_out-z_text = 'Loading Group'.
 wa_out-z_value = wa_data-LADGR.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'LADGR'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
********************Purchase***************
 wa_out-z_view = 'Purchase'.
 wa_out-z_text = 'Purchasing Group'.
 wa_out-z_value = wa_data-EKGRP.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'EKGRP'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Purchase'.
 wa_out-z_text = 'Order unit'.
 wa_out-z_value = wa_data-BSTME.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'BSTME'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Purchase'.
 wa_out-z_text = 'Denominator for conversion for Order'.
 wa_out-z_value = wa_data-UMRENA.
 wa_out-z_isref = 0.
 " wa_out-z_item = 'UMRENA'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Purchase'.
 wa_out-z_text = 'Numerator for Conversion for Order'.
 wa_out-z_value = wa_data-UMREZA.
 wa_out-z_isref = 0.
 " wa_out-z_item = 'UMREZA'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Purchase'.
 wa_out-z_text = 'Post to Inspection Stock'.
 wa_out-z_isref = 0.
 wa_out-z_value = wa_data-INSMK.
 " wa_out-z_item = 'INSMK'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Purchase'.
 wa_out-z_text = 'Indicator: Source list requirement'.
 wa_out-z_value = wa_data-KORDB.
  wa_out-z_isref = 0.
 " wa_out-z_item = 'KORDB'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Purchase'.
 wa_out-z_text = 'Mfr part profile'.
 wa_out-z_isref = 1.
 wa_out-z_value = wa_data-MPROF.
 " wa_out-z_item = 'MPROF'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
*****************MRP 1****************
 wa_out-z_view = 'MRP 1'.
 wa_out-z_text = 'MRP Type'.
 wa_out-z_value = wa_data-DISMM.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'DISMM'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 1'.
 wa_out-z_text = 'MRP controller'.
 wa_out-z_value = wa_data-DISPO.
 wa_out-z_isref = 1.
 " wa_out-z_item = 'DISPO'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 1'.
 wa_out-z_text = 'MRP Group'.
 wa_out-z_value = wa_data-DISGR.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'DISGR'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 1'.
 wa_out-z_text = 'Lot size (materials planning)'.
 wa_out-z_value = wa_data-DISLS.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'DISLS'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 1'.
 wa_out-z_text = 'Minimum lot size'.
 wa_out-z_value = wa_data-BSTMI.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'BSTMI'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 1'.
 wa_out-z_text = 'ABC indicator'.
 wa_out-z_value = wa_data-MAABC.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'MAABC'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 1'.
 wa_out-z_text = 'Assembly scrap in percent(%)'.
 wa_out-z_value = wa_data-AUSSS.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'AUSSS'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 1'.
 wa_out-z_text = 'Rounding value for purchase order quantity'.
 wa_out-z_value = wa_data-BSTRF.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'BSTRF'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
*****************MRP 2****************
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Procurement Type'.
 wa_out-z_value = wa_data-BESKZ.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'BESKZ'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Special procurement type'.
 wa_out-z_value = wa_data-SOBSL.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'SOBSL'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Issue storage location'.
 wa_out-z_value = wa_data-LGPRO.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'LGPRO'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Default storage location for external procurement'.
 wa_out-z_isref = 1.
 wa_out-z_value = wa_data-LGFSB.
  "wa_out-z_item = 'LGFSB'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Indicator: Backflush'.
 wa_out-z_value = wa_data-RGEKZ.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'RGEKZ'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Indicator: bulk material'.
 wa_out-z_value = wa_data-SCHGT.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'SCHGT'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'In-house production time'.
 wa_out-z_value = wa_data-DZEIT.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'DZEIT'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Safety stock'.
 wa_out-z_value = wa_data-EISBE.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'EISBE'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Scheduling Margin Key for Floats'.
 wa_out-z_value = wa_data-FHORI.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'FHORI'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Planned delivery time in days'.
 wa_out-z_value = wa_data-PLIFZ.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'PLIFZ'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 2'.
 wa_out-z_text = 'Goods receipt processing time in days'.
 wa_out-z_value = wa_data-WEBAZ.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'WEBAZ'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
***************MRP 3******************
 wa_out-z_view = 'MRP 3'.
 wa_out-z_text = 'Planning strategy group'.
 wa_out-z_value = wa_data-STRGR.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'STRGR'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 3'.
 wa_out-z_text = 'Consumption mode'.
 wa_out-z_value = wa_data-VRMOD.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'VRMOD'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 3'.
 wa_out-z_text = 'Consumption period: backward'.
 wa_out-z_value = wa_data-VINT1.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'VINT1'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 3'.
 wa_out-z_text = 'Consumption period: forward'.
 wa_out-z_value = wa_data-VINT2.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'VINT2'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 3'.
 wa_out-z_text = 'Mixed MRP indicator'.
 wa_out-z_value = wa_data-MISKZ.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'MISKZ'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 3'.
 wa_out-z_text = 'Checking Group for Availability Check'.
 wa_out-z_value = wa_data-MTVFP.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'MTVFP'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
***************MRP 4******************
 wa_out-z_view = 'MRP 4'.
 wa_out-z_text = 'Dependent requirements ind. for individual and coll. reqmts'.
 wa_out-z_value = wa_data-SBDKZ.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'SBDKZ'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 4'.
 wa_out-z_text = 'Component scrap in percent%'.
 wa_out-z_value = wa_data-KAUSF.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'KAUSF'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 4'.
 wa_out-z_text = 'Discontinuation indicator'.
 wa_out-z_value = wa_data-KZAUS.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'KZAUS'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 4'.
 wa_out-z_text = 'Effective-out date'.
 wa_out-z_value = wa_data-AUSDT.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'AUSDT'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'MRP 4'.
 wa_out-z_text = 'Follow-up material'.
 wa_out-z_value = wa_data-NFMAT.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'NFMAT'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
********************Work Plan*************
 wa_out-z_view = 'Work Plan'.
 wa_out-z_text = 'Unit of issue'.
 wa_out-z_value = wa_data-AUSME.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'AUSME'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Work Plan'.
 wa_out-z_text = 'Denominator for conversion to base units of measure'.
 wa_out-z_value = wa_data-UMRENB.
  wa_out-z_isref = 0.
  "wa_out-z_item = 'UMRENB'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Work Plan'.
 wa_out-z_text = 'Numerator for Conversion to Base Units of Measure'.
  wa_out-z_isref = 0.
 wa_out-z_value = wa_data-UMREZB.
  "wa_out-z_item = 'UMREZB'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Work Plan'.
 wa_out-z_text = 'Production Supervisor'.
 wa_out-z_value = wa_data-FEVOR.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'FEVOR'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Work Plan'.
 wa_out-z_text = 'Production Scheduling Profile'.
 wa_out-z_value = wa_data-SFCPF.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'SFCPF'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Work Plan'.
 wa_out-z_text = 'Underdelivery tolerance limit'.
 wa_out-z_value = wa_data-UNETO.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'UNETO'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Work Plan'.
 wa_out-z_text = 'Overdelivery tolerance limit'.
 wa_out-z_value = wa_data-UEETO.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'UEETO'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Work Plan'.
 wa_out-z_text = 'Indicator: Unlimited overdelivery allowed'.
 wa_out-z_value = wa_data-UEETK.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'UEETK'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
*****************Plant Data, storage 1*************
 wa_out-z_view = 'Plant Data, storage 1'.
 wa_out-z_text = 'Batch management requirement indicator'.
 wa_out-z_value = wa_data-XCHPF.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'XCHPF'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Plant Data, storage 1'.
 wa_out-z_text = 'Minimum Remaining Shelf Life'.
 wa_out-z_value = wa_data-MHDRZ.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'MHDRZ'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Plant Data, storage 1'.
 wa_out-z_text = 'Total shelf life'.
 wa_out-z_value = wa_data-MHDHB.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'MHDHB'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Plant Data, storage 1'.
 wa_out-z_text = 'Period Indicator for Shelf Life Expiration Date(SLED)'.
 wa_out-z_value = wa_data-EPRKZ.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'EPRKZ'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
*****************Accounting 1*************
 wa_out-z_view = 'Accounting 1'.
 wa_out-z_text = 'Evaluation'.
 wa_out-z_value = wa_data-BKLAS.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'BKLAS'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Accounting 1'.
 wa_out-z_text = 'Price Control'.
 wa_out-z_value = wa_data-VPRSV.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'VPRSV'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Accounting 1'.
 wa_out-z_text = 'Price Confirm'.
 wa_out-z_value = wa_data-MLAST.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'MLAST'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Accounting 1'.
 wa_out-z_text = 'Price Unit'.
 wa_out-z_value = wa_data-PEINH.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'PEINH'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
*****************Cost 1*************
 wa_out-z_view = 'Cost 1'.
 wa_out-z_text = 'Material Is Costed with Quantity Structure'.
 wa_out-z_value = wa_data-EKALR.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'EKALR'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Cost 1'.
 wa_out-z_text = 'Material Orgain'.
 wa_out-z_value = wa_data-HKMAT.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'HKMAT'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Cost 1'.
 wa_out-z_text = 'Do Not Cost'.
 wa_out-z_value = wa_data-NCOST.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'NCOST'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Cost 1'.
 wa_out-z_text = 'Costing lot size'.
 wa_out-z_value = wa_data-LOSGR.
 wa_out-z_isref = 0.
  "wa_out-z_item = 'LOSGR'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
 wa_out-z_view = 'Cost 1'.
 wa_out-z_text = 'Profit center'.
 wa_out-z_value = wa_data-PRCTR.
 wa_out-z_isref = 1.
  "wa_out-z_item = 'PRCTR'.
 APPEND wa_out TO et_output.
 CLEAR wa_out.
***********************************
ENDLOOP.

   IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
    ev_message = 'Query Successfully'.
   ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 11. Query Masterial Master Data(SAP CODE)

```ABAP
FUNCTION ZMMIP013.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_WERKS) TYPE  WERKS_D
*"     VALUE(IV_MATNR) TYPE  TEXT18 OPTIONAL
*"     VALUE(IV_MAKTX) TYPE  MAKTX OPTIONAL
*"     VALUE(IV_MAKT1) TYPE  ZE_MAKT1 OPTIONAL
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSMMIP013
*"----------------------------------------------------------------------
TYPES: BEGIN OF ty_data.
    INCLUDE TYPE ZSMMIP013.
TYPES: END OF ty_data.

DATA: v_tabix TYPE sy-tabix,
      p_in TYPE mara-matnr,
      s_key1 TYPE string,
      s_key2 TYPE string,
      s_key3 TYPE string,
      lv_where TYPE string.

DATA: gt_data TYPE TABLE OF ty_data,
      wa_data TYPE ty_data,
      wa_out TYPE ty_data.

 CONCATENATE lv_where '( mara~mtart = ''AH01''' 'OR' INTO lv_where SEPARATED BY space.
 CONCATENATE lv_where ' mara~mtart = ''AH02''' 'OR' INTO lv_where SEPARATED BY space.
 CONCATENATE lv_where ' mara~mtart = ''AH03'')' 'AND' INTO lv_where SEPARATED BY space.
  IF iv_matnr IS NOT INITIAL.
*Material code add leading zero
  CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
    EXPORTING
      input  = IV_MATNR
    IMPORTING
     output = IV_MATNR.
    CONCATENATE '%' iv_matnr '%' INTO s_key1.
    CONCATENATE lv_where 'mara~matnr LIKE s_key1' 'AND' INTO lv_where SEPARATED BY space.
   " CONCATENATE lv_where 'mara~matnr LIKE s_key2)' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

IF iv_maktx IS NOT INITIAL.
    CONCATENATE '%' iv_maktx '%' INTO s_key2.
    CONCATENATE lv_where 'makt~maktx LIKE s_key2 ' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

IF iv_makt1 IS NOT INITIAL.
    CONCATENATE '%' iv_makt1 '%' INTO s_key3.
    CONCATENATE lv_where 'ztmm0001~makt1 LIKE s_key3 ' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

IF iv_werks IS NOT INITIAL.
    CONCATENATE lv_where 'marc~werks = iv_werks ' 'AND' INTO lv_where SEPARATED BY space.
    ELSE.
       ev_msgty = 'w'.
       ev_message = '请输入查询工厂'.
    RETURN.
  ENDIF.

 IF lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.  "Delete last AND
  ENDIF.

SELECT mara~matnr "Material Number
       makt~maktx "Description
       ztmm0001~makt1 "Long Descruption
      INTO CORRESPONDING FIELDS OF TABLE gt_data
      FROM mara
    JOIN makt ON  mara~matnr =  makt~matnr
   JOIN marc ON  mara~matnr =  marc~matnr
   JOIN ztmm0001 ON mara~matnr = ztmm0001~matnr
 WHERE (lv_where) .

*Material code add leading zero
 LOOP AT gt_data INTO wa_data.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
    EXPORTING
      input  = wa_data-matnr
    IMPORTING
      output = p_in.
      wa_out-matnr = p_in.
      wa_out-bukrs = iv_werks.
      wa_out-maktx = wa_data-maktx.
      wa_out-makt1 = wa_data-makt1.
      APPEND  wa_out  TO et_output.
      CLEAR p_in.
    ENDLOOP.

  SORT et_output BY matnr.
    IF sy-subrc = 0.
    ev_msgty = 'S'.
    ev_message = 'Search successfully'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.

ENDFUNCTION.
```



## 12. Query Purchase Order

```ABAP
FUNCTION ZMMIP013.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_WERKS) TYPE  WERKS_D
*"     VALUE(IV_MATNR) TYPE  TEXT18 OPTIONAL
*"     VALUE(IV_MAKTX) TYPE  MAKTX OPTIONAL
*"     VALUE(IV_MAKT1) TYPE  ZE_MAKT1 OPTIONAL
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSMMIP013
*"----------------------------------------------------------------------
TYPES: BEGIN OF ty_data.
    INCLUDE TYPE ZSMMIP013.
TYPES: END OF ty_data.

DATA: v_tabix TYPE sy-tabix,
      p_in TYPE mara-matnr,
      s_key1 TYPE string,
      s_key2 TYPE string,
      s_key3 TYPE string,
      lv_where TYPE string.

DATA: gt_data TYPE TABLE OF ty_data,
      wa_data TYPE ty_data,
      wa_out TYPE ty_data.

 CONCATENATE lv_where '( mara~mtart = ''AH01''' 'OR' INTO lv_where SEPARATED BY space.
 CONCATENATE lv_where ' mara~mtart = ''AH02''' 'OR' INTO lv_where SEPARATED BY space.
 CONCATENATE lv_where ' mara~mtart = ''AH03'')' 'AND' INTO lv_where SEPARATED BY space.
  IF iv_matnr IS NOT INITIAL.
*Material code add leading zero
  CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
    EXPORTING
      input  = IV_MATNR
    IMPORTING
     output = IV_MATNR.
    CONCATENATE '%' iv_matnr '%' INTO s_key1.
    CONCATENATE lv_where 'mara~matnr LIKE s_key1' 'AND' INTO lv_where SEPARATED BY space.
   " CONCATENATE lv_where 'mara~matnr LIKE s_key2)' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

IF iv_maktx IS NOT INITIAL.
    CONCATENATE '%' iv_maktx '%' INTO s_key2.
    CONCATENATE lv_where 'makt~maktx LIKE s_key2 ' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

IF iv_makt1 IS NOT INITIAL.
    CONCATENATE '%' iv_makt1 '%' INTO s_key3.
    CONCATENATE lv_where 'ztmm0001~makt1 LIKE s_key3 ' 'AND' INTO lv_where SEPARATED BY space.
  ENDIF.

IF iv_werks IS NOT INITIAL.
    CONCATENATE lv_where 'marc~werks = iv_werks ' 'AND' INTO lv_where SEPARATED BY space.
    ELSE.
       ev_msgty = 'w'.
       ev_message = '请输入查询工厂'.
    RETURN.
  ENDIF.

 IF lv_where IS NOT INITIAL.
    SHIFT lv_where RIGHT DELETING TRAILING 'AND'.  "Delete last AND
  ENDIF.

SELECT mara~matnr "Material Number
       makt~maktx "Description
       ztmm0001~makt1 "Long Descruption
      INTO CORRESPONDING FIELDS OF TABLE gt_data
      FROM mara
    JOIN makt ON  mara~matnr =  makt~matnr
   JOIN marc ON  mara~matnr =  marc~matnr
   JOIN ztmm0001 ON mara~matnr = ztmm0001~matnr
 WHERE (lv_where) .

*Material code add leading zero
 LOOP AT gt_data INTO wa_data.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
    EXPORTING
      input  = wa_data-matnr
    IMPORTING
      output = p_in.
      wa_out-matnr = p_in.
      wa_out-bukrs = iv_werks.
      wa_out-maktx = wa_data-maktx.
      wa_out-makt1 = wa_data-makt1.
      APPEND  wa_out  TO et_output.
      CLEAR p_in.
    ENDLOOP.

  SORT et_output BY matnr.
    IF sy-subrc = 0.
    ev_msgty = 'S'.
    ev_message = 'Search successfully'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.

ENDFUNCTION.
```

## 13. Query Purchase Order Contract Number

```ABAP
FUNCTION zfiip022.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_EBELN) TYPE  EBELN
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"     VALUE(EV_TXT) TYPE  CHAR100
*"----------------------------------------------------------------------
  DATA: BEGIN OF t_lines OCCURS 50.
      INCLUDE STRUCTURE tline.
  DATA: END OF t_lines.

  DATA: BEGIN OF htext.
      INCLUDE STRUCTURE thead.
  DATA: END OF htext.

  DATA: tname LIKE thead-tdname.
  DATA: s_line(100) TYPE c.


  tname = iv_ebeln.
  s_line = ''.
  CLEAR t_lines.
  REFRESH t_lines.

*-- Purchase Header
  CALL FUNCTION 'READ_TEXT'
    EXPORTING
      client                  = sy-mandt
      id                      = 'F01'
      language                = '1'
      name                    = tname
      object                  = 'EKKO'
      archive_handle          = 0
    IMPORTING
      header                  = htext
    TABLES
      lines                   = t_lines
    EXCEPTIONS
      id                      = 1
      language                = 2
      name                    = 3
      not_found               = 4
      object                  = 5
      reference_check         = 6
      wrong_access_to_archive = 7
      OTHERS                  = 8.

  IF sy-subrc = 0.
    LOOP AT t_lines.
      IF t_lines-tdline NE ''.
        CONCATENATE s_line t_lines-tdline INTO s_line.
      ENDIF.
    ENDLOOP.
  ENDIF.

 REPLACE ALL OCCURRENCES OF REGEX '\/.*\/' IN s_line WITH ''.
  ev_txt = s_line.

  IF ev_txt IS NOT INITIAL.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No Data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 14. Receipt of fixed assets

```abap
FUNCTION zfiip023.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      IT_INPUT STRUCTURE  ZSFIIP021
*"----------------------------------------------------------------------

  DATA: mat_doc LIKE bapi2017_gm_head_ret-mat_doc.      "materialdocument No.
  DATA: gmhead LIKE bapi2017_gm_head_01.
  DATA: BEGIN OF mthead.
      INCLUDE STRUCTURE bapi2017_gm_head_ret.
  DATA: END OF mthead.

  DATA: BEGIN OF errmsg OCCURS 0.
      INCLUDE STRUCTURE bapiret2.
  DATA: END OF errmsg.
  DATA: BEGIN OF gmcode.
      INCLUDE STRUCTURE bapi2017_gm_code.
  DATA: END OF gmcode.

  DATA: BEGIN OF itab_bapi OCCURS 0.
      INCLUDE STRUCTURE bapi2017_gm_item_create.
  DATA: END OF itab_bapi.
  DATA: wa_input LIKE zsfiip021.

  gmcode-gm_code = '01'.                           "Move Type 101

  gmhead-pstng_date = sy-datum.                     "Voucher posting date
  gmhead-doc_date   = sy-datum.                     "Voucher document date
  gmhead-pr_uname   = sy-uname.
*  gmhead-ref_doc_no = it_tab-ref_doc_no.           "Reference Document No.
*  gmhead-header_txt = it_tab-header_txt.           "Header text

  LOOP AT it_input INTO wa_input.
    itab_bapi-po_number            = wa_input-ebeln           .   "PO
    itab_bapi-po_item              = wa_input-ebelp             .   "PO ITEM
*    itab_bapi-plant                = wa_input-plant               .   "Plant
*    itab_bapi-stge_loc             = wa_input-stge_lL            .   "Material
* itab_bapi-material             = lv_po_matnr oc            .   "Inventory Location
*    ITAB_BAPI-MATERIAL             = wa_input-MATERIA               .   "PO No.
    itab_bapi-entry_qnt            = wa_input-MENGE          .   "Qnt
*    itab_bapi-entry_uom            = wa_input-entry_uom           .   "UoM
    itab_bapi-move_type            = '101'                      .   "Move Type
*  itab_bapi-item_text            = it_tab-item_text           .   "Item Text

    IF gmcode-gm_code   = '01'.     "Purchase Order Arrive
      itab_bapi-mvt_ind            = 'B'.
    ENDIF.

    APPEND itab_bapi.
  ENDLOOP.

  CALL FUNCTION 'BAPI_GOODSMVT_CREATE'
    EXPORTING
      goodsmvt_header  = gmhead
      goodsmvt_code    = gmcode
*     TESTRUN          = ' '
*     GOODSMVT_REF_EWM =
    IMPORTING
      goodsmvt_headret = mthead
      materialdocument = mat_doc                      "Material document No. which should get by BAPI_TRANSACTION_COMMIT
*     MATDOCUMENTYEAR  =
    TABLES
      goodsmvt_item    = itab_bapi                    "Key table, required
*     GOODSMVT_SERIALNUMBER         =
      return           = errmsg                       "Error mesage
*     GOODSMVT_SERV_PART_DATA       =
*     EXTENSIONIN      =
    .
  READ TABLE errmsg WITH KEY type = 'E'.
  IF  sy-subrc = 0.
    CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK' .

    ev_msgty = 'E'.
    ev_message = errmsg-message.

  ELSE.
    CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
      EXPORTING
        wait = 'X'.
    ev_msgty = 'S'.
    CONCATENATE 'Voucher generated successfully, voucher No.: ' mat_doc INTO ev_message.
  ENDIF.
ENDFUNCTION.

```

## 15. Query Fix Asset Card Information

```ABAP
FUNCTION zfiip026.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSFIIP026
*"----------------------------------------------------------------------

***  Using period(Month) = ANLB-NDJAR (Planned useful life in years) * 12 + ANLB-NDPER(Planned useful life in periods);
***  Orginization value: anep~anbtr Amount Posted
  TYPES: BEGIN OF ty_data.
      INCLUDE TYPE zsfiip026.
  TYPES: ndjar TYPE anlb-ndjar,
         anln2 TYPE anla-anln2,
         deakt TYPE anla-deakt,
         ndper TYPE anlb-ndper,
         anbtr TYPE anep-anbtr,
         ljzi  TYPE answl,
         kansw TYPE anlc-kansw,
         knafa TYPE anlc-knafa,
         zusna TYPE anlc-zusna,
         nafav TYPE anlc-kansw,
         nafal TYPE anlc-nafal,
         nafaz TYPE anlp-nafaz,
         END OF ty_data.
  TYPES:BEGIN OF ty_cskt,
          kostl TYPE cskt-kostl,
          ktext TYPE cskt-ktext,
        END OF ty_cskt.
  DATA: gt_cskt TYPE TABLE OF ty_cskt,
        wa_cskt TYPE ty_cskt.
  DATA: lt_data TYPE TABLE OF ty_data.
  DATA: wa_data TYPE ty_data.
  DATA: wa_data_line TYPE zsfiip026.

  DATA: p_monat LIKE isellist-month.
  p_monat =  sy-datum+0(6).
  "Check accumulative depreciation increase in fiscal year
  DATA:ldf_gjahr TYPE i.
  ldf_gjahr = sy-datum+0(4).
  RANGES: r_budat FOR bkpf-budat.
  CONCATENATE p_monat '01' INTO r_budat-low.
  IF p_monat+4(2) = '12'.
    CONCATENATE p_monat '31' INTO r_budat-high.
  ELSE.
    r_budat-high+0(6) = r_budat-low+0(6) + 1.
    r_budat-high+6(2) = '01'.
    r_budat-high = r_budat-high - 1.
  ENDIF.

  SELECT
    anla~deakt,
    anla~anln1,
    anla~txt50,
    anla~bukrs,
    anla~txa50,
    anla~herst,
    anla~ktogr,
    anla~aktiv,
    anla~invzu,
    anlz~kostl,
    anlb~ndjar,
    anlb~ndper,
    t095t~ktgrtx
    FROM anla
    INNER JOIN anlz ON anlz~anln1 = anla~anln1 AND
     anlz~anln2 = anla~anln2
    AND anlz~bukrs = anla~bukrs
    INNER JOIN anlb ON anlb~anln1 = anla~anln1 AND anlb~anln2 = anla~anln2 AND anlb~bukrs = anla~bukrs AND anlb~afabe = '01'
    INNER JOIN anlc ON anlc~bukrs = anla~bukrs AND
                       anlc~anln1 = anla~anln1 AND
                       anlc~anln2 = anla~anln2
    INNER JOIN anlh ON anlh~bukrs = anla~bukrs AND anlh~anln1 = anla~anln1
    INNER JOIN t095t ON t095t~ktogr = anla~ktogr
    AND t095t~spras = @sy-langu
    INTO CORRESPONDING FIELDS OF TABLE @lt_data
    WHERE ( anla~deakt = '00000000' OR anla~deakt > @r_budat-high ) "Active or scrapped during the inquiry period
      AND   anlc~afabe = '01' AND anlc~gjahr = @p_monat+0(4)
    AND  ( anlz~bdatu >= @r_budat-high AND anlz~adatu <= @r_budat-high ).

  SELECT kostl
         ktext
    FROM cskt
    INTO CORRESPONDING FIELDS OF TABLE gt_cskt
   WHERE kokrs = '1000'
     AND spras = sy-langu.
  SORT gt_cskt BY kostl.

  LOOP AT lt_data INTO wa_data.
    CLEAR wa_data_line.

    IF wa_data-kostl IS NOT INITIAL.
      READ TABLE gt_cskt INTO wa_cskt WITH KEY kostl = wa_data-kostl BINARY SEARCH.
      IF sy-subrc = 0.
        wa_data-ktext = wa_cskt-ktext.
      ENDIF.
    ENDIF.
    wa_data-synxy = wa_data-ndjar * 12 + wa_data-ndper.

    CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
      EXPORTING
        input  = wa_data-anln1
      IMPORTING
        output = wa_data-anln1.

    MOVE-CORRESPONDING wa_data TO wa_data_line.
    APPEND wa_data_line TO et_output[].

  ENDLOOP.
  IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 16. Query fixed Asset Details

```ABAP
FUNCTION zfiip027.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  IMPORTING
*"     VALUE(IV_BUKRS) TYPE  BUKRS
*"     VALUE(IV_ANLN1) TYPE  ANLN1
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      ET_OUTPUT STRUCTURE  ZSFIIP027
*"----------------------------------------------------------------------
  CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
    EXPORTING
      input  = IV_ANLN1
    IMPORTING
      output = IV_ANLN1.


  TYPES: BEGIN OF ty_itab,
           flag(1).
      INCLUDE TYPE anla.
  TYPES: kostl   LIKE anlz-kostl,
         ltext   LIKE cskt-ltext,
         gsber   LIKE anlz-gsber,
         stort   LIKE anlz-stort,
         raumn   LIKE anlz-raumn,
         xstil   LIKE anlz-xstil,
         anlhtxt LIKE anlh-anlhtxt,
         afasl   LIKE anlb-afasl,
         ndjar   LIKE anlb-ndjar,
         ndper   LIKE anlb-ndper,
         afabg   LIKE anlb-afabg,
         schrw   LIKE anlb-schrw,
         ndabj   LIKE anlc-ndabj,
         ndabp   LIKE anlc-ndabp,
         kansw   LIKE anlc-kansw,
         kaufw   LIKE anlc-kaufw,
         aufwv   LIKE anea-aufwv,
         nafav   LIKE anea-nafav,
         nafal   LIKE anea-nafal,
         knafa   LIKE anlc-knafa,
         nafap   LIKE anlc-nafap,
         answl   LIKE anlc-answl,
         zcyz    LIKE anlc-answl,  "Asset orignial value
         ljzj    LIKE anlc-answl,  "Accumulated depreciation
         dyzj    LIKE anlc-answl,  "Depreciation of the month
         adatu   LIKE anlz-adatu,
         ordt1   LIKE t087t-ordtx,
         ordt2   LIKE t087t-ordtx,
         ordt3   LIKE t087t-ordtx,
         ordt4   LIKE t087t-ordtx,
         zjz     LIKE anlc-answl,   "Valye 20131016
         name1   LIKE lfa1-name1,   "Supplier 20140818

         kostlv  LIKE anlz-kostlv, "Cost center responsible for asset
         ktext1  LIKE cskt-ktext, "General Name
         caufn   LIKE anlz-caufn, "Internal Order
         ktext2  LIKE aufk-ktext, "Internal Order Description
         werks   LIKE anlz-werks, "Plant
         name2   LIKE t001w-name1, "Plant Description
         synxy   TYPE char4, "Service life (months)
         jtzjyf  TYPE char4, "Accounting period
         sykjqx  TYPE char4, "Remaining accounting period
         ahproz  TYPE ahproz, "Cutoff percentage rate
         txk50   TYPE txt50_ankt, "Asset class description
         END OF ty_itab.
  TYPES: BEGIN OF ty_itab1,
           bukrs LIKE anla-bukrs,
           anln1 LIKE anla-anln1,
           anln2 LIKE anla-anln2,         "Added by Vincent on 20141027
         END OF ty_itab1.
                                                            "20140818
  TYPES:BEGIN OF ty_lfa1 ,
          lifnr TYPE lfa1-lifnr,
          name1 TYPE lfa1-name1,
        END OF ty_lfa1.

  TYPES:BEGIN OF ty_cskt,
          kostl TYPE cskt-kostl,
          ktext TYPE cskt-ktext,
        END OF ty_cskt.

  TYPES:BEGIN OF ty_aufk,
          aufnr TYPE aufk-aufnr,
          ktext TYPE aufk-ktext,
        END OF ty_aufk.

  TYPES:BEGIN OF ty_t001w,
          werks TYPE t001w-werks,
          name1 TYPE t001w-name1,
        END OF ty_t001w.

  TYPES: BEGIN OF ty_zcyz,
           bukrs LIKE anla-bukrs,
           anln1 LIKE anla-anln1,
           anln2 LIKE anla-anln2,
           lnran TYPE lnran,
           anbtr TYPE p DECIMALS 2,
         END OF ty_zcyz.

  TYPES: BEGIN OF ty_aufwv,
           bukrs LIKE anla-bukrs,
           anln1 LIKE anla-anln1,
           anln2 LIKE anla-anln2,
           lnran TYPE lnran,
           aufwv TYPE p DECIMALS 2,
         END OF ty_aufwv.
  TYPES: BEGIN OF ty_nafa,
           bukrs LIKE anla-bukrs,
           anln1 LIKE anla-anln1,
           anln2 LIKE anla-anln2,
           lnran TYPE lnran,
           nafav TYPE p DECIMALS 2,
           nafal TYPE p DECIMALS 2,
         END OF ty_nafa.
  TYPES: BEGIN OF ty_qczjyf.
      INCLUDE TYPE ztfi001.
  TYPES:
    count TYPE i,
    END OF ty_qczjyf.
*------------------------------------------------------------*
* DESC:Define related internal table/STRUCTURE               *
*------------------------------------------------------------*
  DATA: wa_data_line TYPE zsfiip027.
  DATA: gt_t001w TYPE TABLE OF ty_t001w,
        wa_t001w TYPE ty_t001w.
  DATA: gt_aufk TYPE TABLE OF ty_aufk,
        wa_aufk TYPE ty_aufk.
  DATA: gt_cskt TYPE TABLE OF ty_cskt,
        wa_cskt TYPE ty_cskt.
  DATA: gt_zcyz      TYPE TABLE OF ty_zcyz,
        gt_zcyz_tmp  TYPE TABLE OF ty_zcyz,
        wa_zcyz      TYPE ty_zcyz,
        gt_aufwv     TYPE TABLE OF ty_aufwv,
        gt_aufwv_tmp TYPE TABLE OF ty_aufwv,
        wa_aufwv     TYPE ty_aufwv,
        gt_nafa      TYPE TABLE OF ty_nafa,
        gt_nafa_tmp  TYPE TABLE OF ty_nafa,
        wa_nafa      TYPE ty_nafa.
  DATA: gt_bkpf      LIKE bkpf OCCURS 0 WITH HEADER LINE,
        gt_bseg      LIKE bseg OCCURS 0 WITH HEADER LINE,
        gt_itab_bseg LIKE bseg OCCURS 0 WITH HEADER LINE. "zbseg
  DATA: gt_itab  TYPE TABLE OF ty_itab,
        wa_itab  TYPE ty_itab,
        gt_itab1 TYPE TABLE OF ty_itab1,
        wa_itab1 TYPE ty_itab1,
        gt_ankt  TYPE TABLE OF ankt WITH HEADER LINE,
        gt_lfa1  TYPE TABLE OF ty_lfa1,
        wa_lfa1  TYPE ty_lfa1.
  DATA: gt_post LIKE fiaa_dpost OCCURS 0 WITH HEADER LINE,
        gt_anla LIKE anla       OCCURS 0 WITH HEADER LINE,
        gt_anlb LIKE anlb       OCCURS 0 WITH HEADER LINE,
        gt_anlc LIKE anlc       OCCURS 0 WITH HEADER LINE,
        gt_anep LIKE anep       OCCURS 0 WITH HEADER LINE,
        gt_anea LIKE anea       OCCURS 0 WITH HEADER LINE,
        gt_anek LIKE anek       OCCURS 0 WITH HEADER LINE,
        gt_anlp LIKE anlp       OCCURS 0 WITH HEADER LINE.
  DATA: gt_qczjyf TYPE TABLE OF ty_qczjyf WITH HEADER LINE."Month of depreciation accrued at the beginning of the period
  DATA: gt_xtzjyf TYPE TABLE OF ty_qczjyf WITH HEADER LINE."SAP accrued depreciation month

* ABOUT ALV
  DATA: wa_fieldcat TYPE slis_fieldcat_alv.
  DATA: gt_fieldcat TYPE slis_t_fieldcat_alv.
  DATA: gs_layout TYPE slis_layout_alv.
  DATA: gt_list_top_of_page TYPE slis_t_listheader.
  DATA: gt_events TYPE slis_t_event,
        g_status  TYPE slis_formname VALUE 'STANDARD_ER01',
        g_comand  TYPE slis_formname VALUE 'USER_COMMAND'.
  CONSTANTS: c_formname_top_of_page TYPE slis_formname VALUE 'TOP_OF_PAGE'.
  DATA: gt_sort TYPE slis_t_sortinfo_alv.
  DATA: wa_sort TYPE slis_sortinfo_alv.
  DATA: gt_t087t TYPE TABLE OF t087t,
        wa_t087t TYPE t087t.
  RANGES: r_budat FOR bkpf-budat.

  DATA:p_monat TYPE sy-datum.
  p_monat = sy-datum+0(6).

  DATA: wa_anla    LIKE anla,
        lt_post    LIKE fiaa_dpost OCCURS 0 WITH HEADER LINE,
        lt_anlb    LIKE anlb       OCCURS 0 WITH HEADER LINE,
        lt_anlc    LIKE anlc       OCCURS 0 WITH HEADER LINE,
        lt_anep    LIKE anep       OCCURS 0 WITH HEADER LINE,
        lt_anea    LIKE anea       OCCURS 0 WITH HEADER LINE,
        lt_anek    LIKE anek       OCCURS 0 WITH HEADER LINE,
        lt_anlp    LIKE anlp       OCCURS 0 WITH HEADER LINE,
        l_maxmonth LIKE anlp-peraf.
  DATA: lt_anea2 LIKE anea OCCURS 0 WITH HEADER LINE.
  DATA: l_index TYPE i.

  "Check Accumulated depreciation increases of the fiscal year
  DATA:ldf_gjahr TYPE i.

  ldf_gjahr = p_monat+0(4).
  "End
  CONCATENATE p_monat '01' INTO r_budat-low.
  IF p_monat+4(2) = '12'.
    CONCATENATE p_monat '31' INTO r_budat-high.
  ELSE.
    r_budat-high+0(6) = r_budat-low+0(6) + 1.
    r_budat-high+6(2) = '01'.
    r_budat-high = r_budat-high - 1.
  ENDIF.
  r_budat-sign = 'I'.
  r_budat-option = 'BT'.
  APPEND r_budat.

  SELECT anla~anln1 anla~anln2 anla~ktogr anla~sernr anla~invnr anla~anlkl anla~txt50 anla~txa50 anla~menge anla~meins
          anla~ivdat anla~invzu anla~aktiv anla~ord41 anla~ord42 anla~ord43 anla~ord44 anla~gdlgrp
          anla~herst anla~eaufn anla~liefe anla~lifnr anlz~kostl anlz~stort anlz~raumn anlz~xstil anlh~anlhtxt anlb~afasl
          anlb~ndjar anlb~ndper anlb~afabg anlb~schrw anlc~ndabj anlc~ndabp anlc~kansw anlc~kaufw
          anlc~knafa anlc~nafap anlc~answl anla~bukrs anlz~adatu anlz~gsber anlz~kostlv anlz~caufn anlz~werks
          anla~aibn1
     FROM anla
     INNER JOIN anlb ON anlb~bukrs = anla~bukrs AND
                        anlb~anln1 = anla~anln1 AND
                        anlb~anln2 = anla~anln2
     INNER JOIN anlc ON anlc~bukrs = anla~bukrs AND
                        anlc~anln1 = anla~anln1 AND
                        anlc~anln2 = anla~anln2
     INNER JOIN anlh ON anlh~bukrs = anla~bukrs AND
                        anlh~anln1 = anla~anln1
     INNER JOIN anlz ON anlz~bukrs = anla~bukrs AND
                        anlz~anln1 = anla~anln1 AND
                        anlz~anln2 = anla~anln2

     INTO CORRESPONDING FIELDS OF TABLE gt_itab
   WHERE anla~bukrs = iv_bukrs AND
         anla~anln1 = iv_anln1 AND
*         anla~anln2 IN s_anln2 AND
*         anla~anlkl IN s_anlkl AND
*         anla~aktiv IN s_aktiv AND
*         anlh~anlhtxt IN s_anlht AND
         anlb~afabe = '01' AND
         anlc~afabe = '01' AND
         anlc~gjahr = p_monat+0(4) AND
         anlz~adatu <= r_budat-high AND
*         anlz~kostl IN s_kostl      AND
*         anla~invnr IN s_invnr AND
*         anlz~caufn IN s_caufn AND
         ( anla~deakt = '00000000' OR anla~deakt > r_budat-high ) AND"Active or scrapped during the inquiry period
         ( anlz~bdatu >= r_budat-high AND anlz~adatu <= r_budat-high ).

*    PERFORM frm_get_lfa1.

*  Get the month of depreciation as of December 2018 as the month of depreciation at the beginning of the period
*    SELECT bukrs anln1 anln2 afaber peraf
*      FROM ztfi001
*      INTO CORRESPONDING FIELDS OF TABLE gt_qczjyf
*      WHERE bukrs = p_bukrs AND
*            anln1 IN s_anln1 AND
*            anln2 IN s_anln2 AND
*            afaber = '01'.
*  In the table ANLP, the read serial number (AFBNR) has a value, and the depreciation range (AFABER) is recorded as 01, which counts all the depreciation periods of the asset
  SELECT bukrs anln1 anln2 afaber COUNT( DISTINCT peraf ) AS count
    FROM anlp
    INTO CORRESPONDING FIELDS OF TABLE gt_xtzjyf
    WHERE bukrs = iv_bukrs AND
          ( gjahr < p_monat(4) OR ( gjahr = p_monat(4) AND peraf <= p_monat+4(2) ) ) AND
          anln1 = iv_anln1 AND
*              anln2 IN s_anln2 AND
          afbnr <> '00' AND
          afaber = '01'
    GROUP BY bukrs anln1 anln2 afaber.

  LOOP AT gt_itab INTO wa_itab.
    l_index = sy-tabix.
    wa_itab1-bukrs = wa_itab-bukrs.
    wa_itab1-anln1 = wa_itab-anln1.
    wa_itab1-anln2 = wa_itab-anln2.
    COLLECT wa_itab1 INTO  gt_itab1.
    READ TABLE gt_lfa1 INTO wa_lfa1 WITH  KEY lifnr = wa_itab-lifnr.
    IF sy-subrc = 0.
      wa_itab-name1 = wa_lfa1-name1.
      MODIFY gt_itab FROM wa_itab INDEX l_index.
    ENDIF.
    CLEAR: wa_itab,wa_itab1,wa_lfa1.
  ENDLOOP.
  SORT gt_itab BY anln1 ASCENDING adatu DESCENDING.
  LOOP AT gt_itab INTO wa_itab.
    l_index = sy-tabix.
    READ TABLE gt_itab1 INTO wa_itab1 WITH KEY bukrs = wa_itab-bukrs
                              anln1 = wa_itab-anln1
                              anln2 = wa_itab-anln2.
    IF sy-subrc = 0.
      DELETE gt_itab1 WHERE bukrs = wa_itab-bukrs AND
                         anln1 = wa_itab-anln1 AND
                         anln2 = wa_itab-anln2.
    ELSE.
      DELETE gt_itab INDEX l_index.
    ENDIF.
    CLEAR: wa_itab,wa_itab1.
  ENDLOOP.

***Monthly original value of fixed assets
  CLEAR gt_itab1.
  MOVE-CORRESPONDING gt_itab TO gt_itab1.
  SORT gt_itab1 BY bukrs anln1 anln2.
  DELETE ADJACENT DUPLICATES FROM gt_itab1 COMPARING bukrs anln1 anln2.

  IF gt_itab1 IS NOT INITIAL.
    SELECT anep~bukrs anep~anln1 anep~anln2 anek~lnran anep~anbtr
      FROM anep
      INNER JOIN anek ON anek~bukrs = anep~bukrs AND
                         anek~anln1 = anep~anln1 AND
                         anek~gjahr = anep~gjahr AND
                         anek~lnran = anep~lnran
     INTO TABLE gt_zcyz_tmp
      FOR ALL ENTRIES IN gt_itab1
   WHERE anep~bukrs = gt_itab1-bukrs AND
         anep~anln1 = gt_itab1-anln1 AND
         anep~anln2 = gt_itab1-anln2 AND
         anep~gjahr = p_monat+0(4) AND
         anep~afabe = '01' AND

         anek~budat <= r_budat-high.
    LOOP AT gt_zcyz_tmp INTO wa_zcyz.
      CLEAR wa_zcyz-lnran.
      COLLECT wa_zcyz INTO gt_zcyz.
    ENDLOOP.
    DATA: l_lines(10),
          l_tabix(10),
          l_pecnt     TYPE p LENGTH 6 DECIMALS 2,
          l_pecet(6),
          l_text(40).
    SELECT *
      FROM anlc
      INTO TABLE gt_anlc
      FOR ALL ENTRIES IN gt_itab1
    WHERE bukrs = iv_bukrs AND
          anln1 = gt_itab1-anln1 AND
          anln2 = gt_itab1-anln2 AND
          gjahr = ldf_gjahr.
  ENDIF.

  SORT gt_itab1 BY bukrs anln1.
  DELETE ADJACENT DUPLICATES FROM gt_itab1 COMPARING bukrs anln1.

  IF gt_itab1 IS NOT INITIAL.
    SELECT *
      INTO CORRESPONDING FIELDS OF TABLE gt_anlp
      FROM anlp
      FOR ALL ENTRIES IN gt_itab1
     WHERE bukrs = iv_bukrs
      AND  gjahr = p_monat+0(4)
      AND  afaber = '1'
      AND  anln1 = gt_itab1-anln1
      AND  peraf <= p_monat+4(2).
    SORT gt_nafa BY bukrs anln1.
  ENDIF.
  LOOP AT gt_itab INTO wa_itab.
    l_tabix = sy-tabix.
***Monthly original value of fixed assets
    CLEAR: wa_itab-zcyz.

    READ TABLE gt_zcyz INTO wa_zcyz WITH KEY bukrs = wa_itab-bukrs
                                             anln1 = wa_itab-anln1
                                             anln2 = wa_itab-anln2.
    IF sy-subrc = 0.
      wa_itab-zcyz = wa_zcyz-anbtr.
    ENDIF.
    wa_itab-zcyz = wa_itab-zcyz + wa_itab-kansw.

***Cumulative depreciation of fixed assets
    lt_anlc[] = gt_anlc[].
    DELETE lt_anlc WHERE NOT ( anln1 = wa_itab-anln1 AND anln2 = wa_itab-anln2 ) .

    READ TABLE gt_nafa INTO wa_nafa WITH KEY bukrs = wa_itab-bukrs anln1 = wa_itab-anln1 BINARY SEARCH.
    IF sy-subrc = 0.
      wa_itab-nafal = wa_nafa-nafal.
      wa_itab-nafav = wa_nafa-nafav.
    ENDIF.

*    Accumulated depreciation at the beginning of the year
    LOOP AT lt_anlc WHERE afabe = '01'.
      wa_itab-ljzj = lt_anlc-knafa "+ LT_anlc-nafap
                + wa_itab-ljzj + lt_anlc-zusna + lt_anlc-nafav + lt_anlc-nafal.
    ENDLOOP.

*   Accumulated depreciation for this year until the current period
    lt_anlp[] = gt_anlp[].
    DELETE lt_anlp WHERE NOT anln1 = wa_itab-anln1.
    LOOP AT lt_anlp.
      wa_itab-ljzj = wa_itab-ljzj + lt_anlp-nafaz.
    ENDLOOP.

***Using period(Month) = ANLB-NDJAR (Planned useful life in years) * 12 + ANLB-NDPER(Planned useful life in periods);
    wa_itab-synxy = wa_itab-ndjar * 12 + wa_itab-ndper.

    wa_itab-zjz = wa_itab-zcyz + wa_itab-ljzj. "Net value = original value of assets-accumulated depreciation

    MOVE-CORRESPONDING wa_itab TO wa_data_line.
    APPEND wa_data_line TO et_output[].

  ENDLOOP.

    IF et_output[] IS NOT INITIAL.
    ev_msgty = 'S'.
    ev_message = 'Query successfully'.
  ELSE.
    ev_msgty = 'E'.
    ev_message = 'No data'.
    RETURN.
  ENDIF.
ENDFUNCTION.
```

## 17. Asset Retirement

```ABAP
FUNCTION zfiip029.
*"----------------------------------------------------------------------
*"*"Local Interface
*"  EXPORTING
*"     VALUE(EV_MSGTY) TYPE  BAPI_MTYPE
*"     VALUE(EV_MESSAGE) TYPE  BAPI_MSG
*"  TABLES
*"      IT_INPUT STRUCTURE  ZSFIIP029
*"----------------------------------------------------------------------

  DATA: flag TYPE char1.
  DATA: wa_input TYPE zsfiip029.
  flag = 'Y'.

  DATA: wa_invzu  TYPE bapi1022_feglg011,
        wa_invzux TYPE bapi1022_feglg011x,
        wa_kostl  TYPE bapi1022_feglg003,
        wa_kostlx TYPE bapi1022_feglg003x,
        wa_ret    TYPE bapiret2.


  LOOP AT it_input[] INTO wa_input.

    CLEAR: wa_invzu, wa_invzux, wa_kostl, wa_kostlx.

    IF wa_input-invzu IS NOT INITIAL.
      wa_invzu-note = wa_input-invzu.
      wa_invzux-note = 'X'.
    ENDIF.

    IF wa_input-kostl IS NOT INITIAL.
      wa_kostl-costcenter = wa_input-kostl.
      wa_kostlx-costcenter = 'X'.
      wa_kostl-from_date = sy-datum.
      wa_kostlx-from_date = 'X'.
      IF wa_input-werks IS NOT INITIAL.
        wa_kostl-plant = wa_input-werks.
        wa_kostlx-plant = 'X'.
      ELSE.
        wa_kostl-plant = ''.
        wa_kostlx-plant = 'X'.
      ENDIF.


    ENDIF.

    CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
      EXPORTING
        input  = wa_input-anln1
      IMPORTING
        output = wa_input-anln1.

    CALL FUNCTION 'BAPI_FIXEDASSET_CHANGE'
      EXPORTING
        companycode        = wa_input-bukrs
        asset              = wa_input-anln1
        subnumber          = '0000'
        inventory          = wa_invzu
        inventoryx         = wa_invzux
        timedependentdatax = wa_kostlx
        timedependentdata  = wa_kostl
      IMPORTING
        return             = wa_ret.

    IF  wa_ret-type = 'S'.
      CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
        EXPORTING
          wait = 'X'.
      CONCATENATE ev_message wa_ret-message ';' INTO ev_message SEPARATED BY space.
    ELSE.
      CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
      flag = 'E'.
      CONCATENATE ev_message wa_ret-message ';' INTO ev_message SEPARATED BY space.
    ENDIF.

  ENDLOOP.
  IF flag = 'Y'.
    ev_msgty = 'S'.
  ELSE.
    ev_msgty = 'E'.
  ENDIF.
ENDFUNCTION.
```
