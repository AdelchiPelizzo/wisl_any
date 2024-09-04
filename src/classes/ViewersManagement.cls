/**
 * Created by adpel on 11/06/2024.
 */

public with sharing class ViewersManagement {

    public ViewersManagement(ApexPages.StandardSetController controller) { }

    public static String response {get; set;}
    public static String message {get; set;}

    public static void cleanUp(){
        List<adelanywisl__ViewerGeneric__c> v = [SELECT Id FROM adelanywisl__ViewerGeneric__c];
        try{
            if(Schema.SObjectType.adelanywisl__ViewerGeneric__c.isDeletable()){
                delete v;
                response = 'ok';
                message = 'Deletion of any existing Viewers records has been completed successfully.';
            }
        }catch(Exception e){
            message = e.getMessage();
            response = 'not ok';
        }
    }

}