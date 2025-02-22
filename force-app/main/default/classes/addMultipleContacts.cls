public with sharing class addMultipleContacts {
 @AuraEnabled
 public static ResponseWrapper saveMultipleContacts(List<Contact> contacts){
    ResponseWrapper response = new ResponseWrapper();
    try {
        insert contacts;
        response.isSuccess = true;
    } catch (Exception e) {
        response.isSuccess = false;
        response.message = e.getMessage();
    }
    return response;
 }

 public class ResponseWrapper {
    @AuraEnabled
    public boolean isSuccess{get; set;}
    @AuraEnabled
    public string message{get; set;}
 }
}