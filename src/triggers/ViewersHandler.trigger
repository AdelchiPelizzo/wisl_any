/**
 * Created by adpel on 03/04/2024.
 */

trigger ViewersHandler on Viewer__c (after insert, after delete) {

    if (Trigger.isAfter && Trigger.isInsert) {

        System.debug(Trigger.new[0].Case__c);
        System.debug(Trigger.new[0].User__c);

        String queryCase = 'SELECT caseNumber FROM Case WHERE Id = \'' + Trigger.new[0].Case__c + '\'';
        String queryUser = 'SELECT Name FROM User WHERE Id = \'' + Trigger.new[0].User__c + '\'';
        User u = Database.query(queryUser);
        Case c = Database.query(queryCase);

        System.debug(u.Name);
        System.debug(c.CaseNumber);

        List<StartCaseViewing__e> eS = new List<StartCaseViewing__e>();
        eS.add(new StartCaseViewing__e(
                caseNumber__c = c.CaseNumber,
                userName__c = u.Name
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

        System.debug(Trigger.old[0].Case__c);
        System.debug(Trigger.old[0].User__c);

        String queryCase = 'SELECT caseNumber FROM Case WHERE Id = \'' + Trigger.old[0].Case__c + '\'';
        String queryUser = 'SELECT Name FROM User WHERE Id = \'' + Trigger.old[0].User__c + '\'';
        User u = Database.query(queryUser);
        Case c = Database.query(queryCase);

        System.debug(u.Name);
        System.debug(c.CaseNumber);

        List<EndCaseViewing__e> eS = new List<EndCaseViewing__e>();
        eS.add(new EndCaseViewing__e(
                caseNumber__c = c.CaseNumber,
                userName__c = u.Name
        ));
        List<Database.SaveResult> results = EventBus.publish(eS);

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