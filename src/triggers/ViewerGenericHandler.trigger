/**
 * Created by adpel on 11/04/2024.
 */

trigger ViewerGenericHandler on adelanywisl__ViewerGeneric__c (after delete, after insert) {
    if (Trigger.isAfter && Trigger.isInsert) {
        System.debug(Trigger.new[0].adelanywisl__record_id__c);
        System.debug(Trigger.new[0].adelanywisl__objectType__c);
        System.debug(Trigger.new[0].Name);
        List<adelanywisl__StartViewing__e> eS = new List<adelanywisl__StartViewing__e>();
        eS.add(new adelanywisl__StartViewing__e(
                adelanywisl__StartViewing__c = Trigger.new[0].CreatedDate,
                adelanywisl__type__c = Trigger.new[0].adelanywisl__objectType__c,
                adelanywisl__userName__c = Trigger.new[0].Name,
                adelanywisl__fullName__c = Trigger.new[0].adelanywisl__fullName__c
        ));
        List<Database.SaveResult> results = EventBus.publish(eS);
        for (Database.SaveResult sr : results) {
            if (sr.isSuccess()) {
                System.debug('Successfully published Start event. Id >> ' + sr.id);
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
        System.debug(Trigger.old[0].adelanywisl__record_id__c);
        System.debug(Trigger.old[0].adelanywisl__objectType__c);
        System.debug(Trigger.old[0].Name);
        List<adelanywisl__EndViewing__e> eE = new List<adelanywisl__EndViewing__e>();
        eE.add(new adelanywisl__EndViewing__e(
                adelanywisl__EndViewing__c = Trigger.old[0].CreatedDate,
                adelanywisl__fullName__c = Trigger.old[0].adelanywisl__fullName__c,
                adelanywisl__type__c = Trigger.old[0].adelanywisl__objectType__c,
                adelanywisl__userName__c = Trigger.old[0].Name
        ));
        List<Database.SaveResult> results = EventBus.publish(eE);
        for (Database.SaveResult sr : results) {
            if (sr.isSuccess()) {
                System.debug('Successfully published End event. Id >> ' + sr.id);
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