/**
 * Created by adpel on 08/04/2024.
 */

public with sharing class ViewersCtrl_Generic {

    @AuraEnabled
    public static Viewer_Setting__c saveViewerSettings(String fieldList, String obj){
        Viewer_Setting__c vs = new Viewer_Setting__c();
        vs.Name = obj;
        vs.Field_Selection__c = fieldList;
        insert vs;
        return vs;
    }

    @AuraEnabled
    public static List<String> getViewerSettings(String recId){
        System.debug(recId);
        List<String> fields = new List<String>();
        Id recordId = recId;
        String objType = recordId.getSobjectType().toString();
        Viewer_Setting__c vs = [SELECT Field_Selection__c FROM Viewer_Setting__c WHERE Name =: objType];
        for(String s : vs.Field_Selection__c.split(',')){
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
    public static List<ViewerGeneric__c> getList(){
        String userId = UserInfo.getUserId();
        return (List<ViewerGeneric__c>) [SELECT Id, objectType__c, record_id__c,  Name, fullName__c, CreatedDate FROM ViewerGeneric__c WHERE Name !=: userId];
    }
    @AuraEnabled
    public static void deleteGenericViewer(String cId){
        System.debug('delete method called ...');
        String userId = UserInfo.getUserId();
        System.debug(cId +' '+userId);
        try {
            System.debug('deleting ... '+[SELECT Id FROM ViewerGeneric__c WHERE Name =: userId AND record_id__c =: cId LIMIT 1]);
            ViewerGeneric__c v = [SELECT Id FROM ViewerGeneric__c WHERE Name =: userId AND record_id__c =: cId LIMIT 1];
            delete v;
        }catch(Exception e){
            System.debug('Error--'+e.getMessage());
        }
    }
    @AuraEnabled
    public static ViewerGeneric__c createGenericViewer(String recId){
        Id rId = recId;
        System.debug(String.valueOf(rId.getSobjectType()));
        ViewerGeneric__c v = new ViewerGeneric__c();
        v.objectType__c = String.valueOf(rId.getSobjectType());
        v.Name = UserInfo.getUserId();
        v.fullName__c = UserInfo.getName();
        v.record_id__c = recId;
        List<ViewerGeneric__c> vG = [SELECT Id FROM ViewerGeneric__c WHERE record_id__c =: recId AND Name =: UserInfo.getUserId() ];
        if(vG.size() == 0){
            insert v;
            return [SELECT CreatedDate, objectType__c, Name, record_id__c, fullName__c FROM ViewerGeneric__c WHERE Id =: v.Id LIMIT 1];
        }else{
            return v;
        }
    }
    @AuraEnabled(cacheable=true)
    public static String getCaseNumber (String Id) {
        System.debug(Id);
        Case c = [SELECT CaseNumber FROM Case WHERE Id = :Id];
        return c.CaseNumber;
    }

}