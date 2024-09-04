/**
 * Created by adpel on 28/05/2024.
 */

public with sharing class PurgeViewers implements Schedulable {

    public void execute(SchedulableContext context) {
        ViewersManagement.cleanUp();
    }
}