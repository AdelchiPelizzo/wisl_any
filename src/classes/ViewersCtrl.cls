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
    public static List<adelanywisl__Viewer__c> getList(){
        return (List<adelanywisl__Viewer__c>) [SELECT Id, adelanywisl__User__c, adelanywisl__Case__c, Name, CreatedDate FROM adelanywisl__Viewer__c];
    }
    @AuraEnabled
    public static void deleteViewer(String cId){
        String userId = UserInfo.getUserId();
        System.debug(cId +' '+userId);
        try {
            System.debug('deleting ... '+[SELECT Id FROM adelanywisl__Viewer__c WHERE adelanywisl__User__c =: userId AND adelanywisl__Case__c =: cId LIMIT 1]);
            adelanywisl__Viewer__c v = [SELECT Id FROM adelanywisl__Viewer__c WHERE adelanywisl__User__c =: userId AND adelanywisl__Case__c =: cId LIMIT 1];
            delete v;
        }catch(Exception e){
            System.debug('Error--'+e.getMessage());
        }
    }
    @AuraEnabled
    public static adelanywisl__Viewer__c createViewer(String cId){
        System.debug(cId);
        adelanywisl__Viewer__c v = new adelanywisl__Viewer__c();
        v.adelanywisl__Case__c = cId;
        v.adelanywisl__User__c = v.Name = UserInfo.getUserId();
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