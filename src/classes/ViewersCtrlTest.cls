/**
 * Created by adpel on 03/06/2024.
 */

@IsTest
private class ViewersCtrlTest {

    public static Account acc;
    public static adelanywisl__Viewer_Setting__c vs;
    public static adelanywisl__ViewerGeneric__c vg;
    public static User us;
    public static List<String> months ;

    static void generateTestData(){
        acc = new Account(Name='Test Account');
        vs = new adelanywisl__Viewer_Setting__c(
                adelanywisl__Field_Selection__c='Test Account',
                Name='Account');
        us = new User(LastName = 'testUser',
                FirstName='testUser',
                Alias = 'test',
                Email = 'test@test.test',
                Username = 'adelanywisl@test.test',
                ProfileId = [SELECT Id FROM Profile WHERE Name='System Administrator'].Id,
                TimeZoneSidKey = 'GMT',
                LanguageLocaleKey = 'en_US',
                EmailEncodingKey = 'UTF-8',
                LocaleSidKey = 'en_US'
        );
        vg = new adelanywisl__ViewerGeneric__c();
        insert us;
        insert acc;
        insert vs;
        months = new List<String>{ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'};
    }

    @IsTest
    static void testBehavior() {
        Test.startTest();
        PurgeViewers schedulableClass = new PurgeViewers ();
        String chron = '0 0 23 * * ?';
        System.schedule('Test Sched', chron, schedulableClass);
        generateTestData();
        List<adelanywisl__ViewerGeneric__c> vgList = [SELECT Name FROM adelanywisl__ViewerGeneric__c];
        ApexPages.StandardSetController ctrl = new ApexPages.StandardSetController(vgList);
        ViewersManagement vm = new ViewersManagement((ApexPages.StandardSetController) ctrl);
        System.runAs(us) {
            ViewersCtrl_Generic.getObjectList();
            ViewersCtrl_Generic.getFieldsName('Account');
            ViewersCtrl_Generic.getSObjectName(acc.Id);
            ViewersCtrl_Generic.getViewerSettings(acc.Id);
            ViewersCtrl_Generic.saveViewerSettings('Name', 'Account');
            ViewersCtrl_Generic.saveViewerSettings('Name', 'Contact');
            ViewersCtrl_Generic.getObjectsName();
            ViewersCtrl_Generic.deleteGenericViewer(vs.Id);
            ViewersCtrl_Generic.createGenericViewer(acc.Id);
            for(String m: months){
                ViewersCtrl_Generic.getMonthNumber(m);
            }
            ViewersCtrl_Generic.getMonthNumber('');
            ViewersCtrl_Generic.getList();
            System.assert(Utility.getIt() == 'it');
        }
        Test.stopTest();
    }
}