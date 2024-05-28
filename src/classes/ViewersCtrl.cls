/**
 * Created by adpel on 03/04/2024.
 */

global with sharing class ViewersCtrl {

    @AuraEnabled
    public static String getSObjectName(Id recId){
        String Id = String.valueOf(recId.getSObjectType());
        return Id;
    }

    @AuraEnabled
    public static List<Viewer__c> getList(){
        return (List<Viewer__c>) [SELECT Id, User__c, Case__c, Name, CreatedDate FROM Viewer__c];
    }
    @AuraEnabled
    public static void deleteViewer(String cId){
        String userId = UserInfo.getUserId();
        System.debug(cId +' '+userId);
        try {
            System.debug('deleting ... '+[SELECT Id FROM Viewer__c WHERE User__c =: userId AND Case__c =: cId LIMIT 1]);
            Viewer__c v = [SELECT Id FROM Viewer__c WHERE User__c =: userId AND Case__c =: cId LIMIT 1];
            delete v;
        }catch(Exception e){
            System.debug('Error--'+e.getMessage());
        }
    }
    @AuraEnabled
    public static Viewer__c createViewer(String cId){
        System.debug(cId);
        Viewer__c v = new Viewer__c();
        v.Case__c = cId;
        v.User__c = v.Name = UserInfo.getUserId();
        insert v;
        return v;
    }
    @AuraEnabled(cacheable=true)
    public static String getCaseNumber (String Id) {
        System.debug(Id);
        Case c = [SELECT CaseNumber FROM Case WHERE Id = :Id];
        return c.CaseNumber;
    }

}