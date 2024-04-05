import { LightningElement, wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
  } from "lightning/messageService";
import viewAccountContactChannel from '@salesforce/messageChannel/sampleMessageChannel__c'
import getAccountContacts from '@salesforce/apex/LWCAccountsController.getAccountContacts'
import {deleteRecord} from 'lightning/uiRecordApi'
import LightningConfirm from 'lightning/confirm';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
  
export default class AccountContacts extends LightningElement {
    subscription = null;
    accountId = '';
    contacts=[];
    title="Contacts";
    editableContactId = '';
    isShowModal = false;

    @wire(MessageContext)
    messageContext;
  
    get isAccountSelected () {
        return this.accountId;
    }

    get hasContacts () {
        return this.contacts?.length
    }

    async getContacts () {
        const data = await getAccountContacts({accountId: this.accountId}); 
        this.contacts = data;
    }

    subscribeToMessageChannel() {
      if (!this.subscription) {
        this.subscription = subscribe(
          this.messageContext,
          viewAccountContactChannel,
          (data) => this.handleAccountSelection(data),
          { scope: APPLICATION_SCOPE },
        );
      }
    }
  
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
  

    handleAccountSelection(data ) {
        this.accountId = data.accountId;
        this.title = `${data.accountName} Contact`
        this.getContacts();
    }

    handleEditContact(e) {
        this.editableContactId = e.target.dataset.contactId;
        this.isShowModal = true;
    }

    async handleDeleteContact(e) {
        const result = await LightningConfirm.open({
            message: 'Are you sure you want to delete thos contact?',
            variant: 'headrless',
            label: 'Delete'
        })
        if(result) {
            let contactId = e.target.dataset.contactId;
            await deleteRecord(contactId);
            this.showToast('Contact Deleted', 'Contact Deleted Successfully', 'success')
            this.getContacts();
        }
    }

    modalCloseHandler(e) {
        this.isShowModal = false;
        this.editableContactId = null;
    }

    successHandler() {
        this.modalCloseHandler();
        this.getContacts();
    }

    showToast (title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        })
        this.dispatchEvent(event)
    }

    addContactHandler() {
        this.isShowModal = true;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
  }