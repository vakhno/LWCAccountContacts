public with sharing class LWCAccountsController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsByName(string searchText){
        try {
            if(String.isBlank(searchText)){
                return [SELECT Id, Name FROM Account];
            } else {
                searchText = '%' + searchText + '%';
                return [SELECT Id, Name FROM Account WHERE Name LIKE :searchText];
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getAccountContacts(string accountId){
        try {
            return [SELECT Id,Name FROM Contact WHERE AccountId=:accountId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}