/**
 * Created by adpel on 11/04/2024.
 */

trigger ViewerGenericHandler on ViewerGeneric__c (after delete, after insert) {
    if (Trigger.isAfter && Trigger.isInsert) {
        System.debug(Trigger.new[0].record_id__c);
        System.debug(Trigger.new[0].objectType__c);
        System.debug(Trigger.new[0].Name);
        List<StartViewing__e> eS = new List<StartViewing__e>();
        eS.add(new StartViewing__e(
                StartViewing__c = Trigger.new[0].CreatedDate,
                type__c = Trigger.new[0].objectType__c,
                userName__c = Trigger.new[0].Name,
                fullName__c = Trigger.new[0].fullName__c
        ));
        List<Database.SaveResult> results = EventBus.publish(eS);
        for (Database.SaveResult sr : results) {
            if (sr.isSuccess()) {
                System.debug('Successfully published Start event. Id >> ' + sr.Id);
            } else {
                for (Database.Error err : sr.getErrors()) {
                    System.debug('Error returned: ' +
                            err.getStatusCode() +
                            ' - ' +
                            err.getMessage());
                }
            }
        }
    }
    if (Trigger.isAfter && Trigger.isDelete) {
        System.debug(Trigger.old[0].record_id__c);
        System.debug(Trigger.old[0].objectType__c);
        System.debug(Trigger.old[0].Name);
        List<EndViewing__e> eE = new List<EndViewing__e>();
        eE.add(new EndViewing__e(
                EndViewing__c = Trigger.old[0].CreatedDate,
                fullName__c = Trigger.old[0].fullName__c,
                type__c = Trigger.old[0].objectType__c,
                userName__c = Trigger.old[0].Name
        ));
        List<Database.SaveResult> results = EventBus.publish(eE);
        for (Database.SaveResult sr : results) {
            if (sr.isSuccess()) {
                System.debug('Successfully published End event. Id >> ' + sr.Id);
            } else {
                for (Database.Error err : sr.getErrors()) {
                    System.debug('Error returned: ' +
                            err.getStatusCode() +
                            ' - ' +
                            err.getMessage());
                }
            }
        }
    }
}