import { LightningElement, api, wire } from 'lwc';
import getAccountsByName from '@salesforce/apex/LWCAccountsController.getAccountsByName';
import {publish, MessageContext} from 'lightning/messageService';
import viewAccountContactChannel from '@salesforce/messageChannel/sampleMessageChannel__c'

const COLUMNS = [
    { label: 'Id', fieldName: 'Id' },
    { label: 'Name', fieldName: 'Name' },
    { label: 'Action', type: 'button', typeAttributes: {
        label: 'View Contacts',
        name: 'View Contacts',
        title: 'View Contacts',
        value: 'View_Contacts'
    } }
];    

export default class AccountSearchResult extends LightningElement {
    @api searchText = '';
    columns = COLUMNS;

    @wire(getAccountsByName, {searchText: '$searchText'})
    accountList;

    @wire(MessageContext)
    messageContext;

    handleRowClickAction(e) {
        if(e.detail.action.value === 'View_Contacts') {
            const payload = {accountId: e.detail.row.Id, accountName: e.detail.row.Name};
            publish(this.messageContext, viewAccountContactChannel, payload);
        }
    }
}