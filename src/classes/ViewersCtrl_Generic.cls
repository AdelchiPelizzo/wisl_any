/**
 * Created by adpel on 08/04/2024.
 */

public with sharing class ViewersCtrl_Generic {

    @AuraEnabled
    public static adelanywisl__Viewer_Setting__c saveViewerSettings(String fieldList, String obj){
        List<adelanywisl__Viewer_Setting__c> vsList = [SELECT adelanywisl__Field_Selection__c FROM adelanywisl__Viewer_Setting__c WHERE Name =: obj];
        if( vsList.size() == 0 && Schema.SObjectType.adelanywisl__Viewer_Setting__c.isCreateable()){
            adelanywisl__Viewer_Setting__c vs = new adelanywisl__Viewer_Setting__c();
            vs.Name = obj;
            vs.adelanywisl__Field_Selection__c = fieldList;
            insert vs;
            return vs;
        }else{
            return vsList[0];
        }
    }

    @AuraEnabled
    public static List<String> getViewerSettings(String recId){
        System.debug(recId);
        List<String> fields = new List<String>();
        Id recordId = recId;
        String objType = recordId.getSobjectType().toString();
        adelanywisl__Viewer_Setting__c vs = [SELECT adelanywisl__Field_Selection__c FROM adelanywisl__Viewer_Setting__c WHERE Name =: objType];
        for(String s : vs.adelanywisl__Field_Selection__c.split(',')){
            fields.add(s);
        }
        return fields;
    }

    @AuraEnabled
    public static String getSObjectName(Id recId){
        String Id = String.valueOf(recId.getSobjectType());
        return Id;
    }

    @AuraEnabled
    public static List<String> getFieldsName(String objectAPIName){

        List<String> fldList = new List<String>();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Map<String, Schema.SObjectField> fieldMap = schemaMap.get(objectAPIName).getDescribe().fields.getMap();
        for( Schema.SObjectField field : fieldMap.values() )
        {
            if(field.getDescribe().getName() != 'Email'){
                fldList.add(field.getDescribe().getName());}
            }
        return fldList;
    }

    @AuraEnabled
    public static List<String> getObjectList(){
        System.debug('getting objects ...');
        List<String> SObjectList = new List<String>();
        for(Schema.SObjectType objTyp : Schema.getGlobalDescribe().values()){
            String name = objTyp.getDescribe().getName();
            if(!objTyp.getDescribe().isCreateable()) continue;
            if(!objTyp.getDescribe().isCustom() && objTyp.getDescribe().getRecordTypeInfos().size() > 0 && objTyp.getDescribe().isAccessible()
                    && name != 'DuplicateRecordSet'
                    && name != 'PartyConsent'
                    && name != 'ContentVersion'
                    && name != 'ContentVersion'
                    && name != 'SearchPromotionRule'
                    && name != 'Pricebook2'
                    && name != 'Individual'
                    && name != 'Event'
                    && name != 'Task'
                    && name != 'ContentVersion'
                    && name != 'Product2'
                    && name != 'Macro'
                    && name != 'MacroInstruction'
                    && name != 'Address'
                    && name != 'Location'
                    && name != 'AssociatedLocation'
                    && name != 'CalendarView'
                    && name != 'QuickText'
                    && name != 'SOSSession'
                    && name != 'DuplicateRecordItem'
                    && name != 'AssetRelationship'
                    && name != 'ListEmail'
                    && name != 'ListEmailRecipientSource'
                    && name != 'RecordAction'
                    && name != 'OrgDeleteRequest'
                    && name != 'FlowRecordRelation'
                    && name != 'ContactRequest'
                    && name != 'ContactPointEmail'
                    && name != 'ContactPointPhone'
                    && name != 'ListEmailIndividualRecipient'
                    && name != 'UserEmailPreferredPerson'
                    && name != 'ConsumptionSchedule'
                    && name != 'ConsumptionRate'
                    && name != 'ProductConsumptionSchedule'
                    && name != 'AppAnalyticsQueryRequest'
                    && name != 'ContactPointConsent'
                    && name != 'ContactPointTypeConsent'
                    && name != 'DataUseLegalBasis'
                    && name != 'DataUsePurpose'
                    && name != 'ExpressionFilter'
                    && name != 'ExpressionFilterCriteria'
                    && name != 'Image'
                    && name != 'Recommendation'
                    && name != 'AuthorizationForm'
                    && name != 'AuthorizationFormConsent'
                    && name != 'AuthorizationFormDataUse'
                    && name != 'AuthorizationFormText'
                    && name != 'PromptAction'
                    && name != 'OrgMetric'
                    && name != 'OrgMetricScanResult'
                    && name != 'OrgMetricScanSummary'
                    && name != 'RevenueElement'
                    && name != 'CommSubscription'
                    && name != 'CommSubscriptionChannelType'
                    && name != 'CommSubscriptionConsent'
                    && name != 'CommSubscriptionTiming'
                    && name != 'EngagementChannelType'
            ){  }
            SObjectList.add(name);
        }

        for(Integer i = 0; i< SObjectList.size(); i++){
            System.debug(SObjectList[i]);
        }
        return SObjectList;
    }

    @AuraEnabled
    public static List<String> getObjectsName(){
        List<String> fieldList = new List<String>();
        return fieldList;
    }

    @AuraEnabled(cacheable=true)
    public static List<adelanywisl__ViewerGeneric__c> getList(){
        System.debug('getting list of viewers');
        String userId = UserInfo.getUserId();
        return (List<adelanywisl__ViewerGeneric__c>) [SELECT Id, adelanywisl__objectType__c, adelanywisl__record_id__c, adelanywisl__Profile__c, Name, adelanywisl__fullName__c, CreatedDate FROM adelanywisl__ViewerGeneric__c WHERE Name !=: userId];
    }
    
    @AuraEnabled
    public static void deleteGenericViewer(String cId){
        System.debug('delete method called ...');
        String userId = UserInfo.getUserId();
        System.debug(cId +' '+userId);
        try {
            System.debug('deleting ... '+[SELECT Id FROM adelanywisl__ViewerGeneric__c WHERE Name =: userId AND adelanywisl__record_id__c =: cId LIMIT 1]);
            adelanywisl__ViewerGeneric__c v = [SELECT Id FROM adelanywisl__ViewerGeneric__c WHERE Name =: userId AND adelanywisl__record_id__c =: cId LIMIT 1];
            if(Schema.SObjectType.adelanywisl__ViewerGeneric__c.isDeletable()){
                delete v;
            }
        }catch(Exception e){
            System.debug('Error--'+e.getMessage());
        }
    }

    @AuraEnabled
    public static Integer sessionMills(){
        Integer year = Integer.valueOf(Auth.SessionManagement.getCurrentSession().get('CreatedDate').split(' ')[5]);
        Integer month = ViewersCtrl_Generic.getMonthNumber(Auth.SessionManagement.getCurrentSession().get('CreatedDate').split(' ')[1]);
        Integer day = Integer.valueOf(Auth.SessionManagement.getCurrentSession().get('CreatedDate').split(' ')[2]);
        List<String> lstTime = Auth.SessionManagement.getCurrentSession().get('CreatedDate').split(' ')[3].split(':');
        Integer hour = Integer.valueOf(lstTime[0]);
        Integer min = Integer.valueOf(lstTime[1]);
        Integer sec = Integer.valueOf(lstTime[2]);

        System.debug(Auth.SessionManagement.getCurrentSession().get('CreatedDate'));
        System.debug(Datetime.newInstance(year,month,day,hour,min,sec));
        System.debug(Datetime.newInstance(year,month,day,hour,min,sec).millisecond());
        System.debug(Datetime.newInstance(year,month,day,hour,min,sec).addMinutes(Integer.valueOf(Auth.SessionManagement.getCurrentSession().get('NumSecondsValid'))/60));
        Datetime dt =  Datetime.newInstance(year,month,day,hour,min,sec).addMinutes(Integer.valueOf(Auth.SessionManagement.getCurrentSession().get('NumSecondsValid'))/60);
        return dt.millisecond();
    }

    public static Integer getMonthNumber(String month ){
        switch on month {
            when 'Jan' {
                return 1;
            }
            when 'Feb' {
                return 2;
            }
            when 'Mar' {
                return 3;
            }
            when 'Apr' {
                return 4;
            }
            when 'May' {
                return 5;
            }
            when 'Jun' {
                return 6;
            }
            when 'Jul' {
                return 7;
            }
            when 'Aug' {
                return 8;
            }
            when 'Sep' {
                return 9;
            }
            when 'Oct' {
                return 10;
            }
            when 'Nov' {
                return 11;
            }
            when 'Dec' {
                return 12;
            }
        }
        return null;
    }

    @AuraEnabled
    @TestVisible
    public static void renewSession(){
        System.debug('renewSession');
        try{
            System.debug(Auth.SessionManagement.getCurrentSession().get('IsCurrent'));
            }
        catch(Exception e){
            System.debug(e.getMessage());
        }
    }

    @AuraEnabled (cacheable=true)
    public static Integer getSessionTime(){
        System.debug('getSessionTime');
        return ((Integer.valueOf(Auth.SessionManagement.getCurrentSession().get('NumSecondsValid'))-300)*1000);
    }

    @AuraEnabled
    public static adelanywisl__ViewerGeneric__c createGenericViewer(String recId){
        Id rId = recId;
        adelanywisl__ViewerGeneric__c v = new adelanywisl__ViewerGeneric__c();
        v.adelanywisl__objectType__c = String.valueOf(rId.getSobjectType());
        v.adelanywisl__Profile__c = String.valueOf([SELECT Name FROM Profile WHERE Id =: UserInfo.getProfileId()][0].Name);
        System.debug( String.valueOf([SELECT Name FROM Profile WHERE Id =: UserInfo.getProfileId()][0].Name));
        v.Name = UserInfo.getUserId();
        v.adelanywisl__fullName__c = UserInfo.getName();
        v.adelanywisl__record_id__c = recId;
        List<adelanywisl__ViewerGeneric__c> vG = [SELECT Id FROM adelanywisl__ViewerGeneric__c WHERE adelanywisl__record_id__c =: recId AND Name =: UserInfo.getUserId() ];
        if(vG.size() == 0 && Schema.SObjectType.adelanywisl__ViewerGeneric__c.isCreateable()){
            insert v;
            return [SELECT CreatedDate, adelanywisl__objectType__c, Name, adelanywisl__record_id__c, adelanywisl__Profile__c, adelanywisl__fullName__c FROM adelanywisl__ViewerGeneric__c WHERE Id =: v.Id LIMIT 1];
        }else{
            return v;
        }
    }

}