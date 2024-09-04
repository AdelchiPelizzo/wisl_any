/**
 * Created by adpel on 03/06/2024.
 */

@IsTest
private class PurgeViewersTest {
    @IsTest
    static void testBehavior() {
        Test.startTest();
        Test.setCurrentPage(Page.Remove_Residual_Viewers);
        List<adelanywisl__ViewerGeneric__c> vList = new List<ViewerGeneric__c>();
        adelanywisl__ViewerGeneric__c v = new adelanywisl__ViewerGeneric__c();
        v.Name = '123';
        vList.add(v);
        ApexPages.StandardSetController stdSetController = new ApexPages.StandardSetController(vList);
        stdSetController.setSelected(vList);
        adelanywisl.ViewersManagement ext = new adelanywisl.ViewersManagement(stdSetController);
        PurgeViewers schedulableClass = new PurgeViewers ();
        String chron = '0 0 23 * * ?';
        System.schedule('Test Sched', chron, schedulableClass);
        Test.stopTest();
    }
}