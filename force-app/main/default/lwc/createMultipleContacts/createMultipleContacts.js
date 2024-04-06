import { LightningElement, track, wire } from 'lwc';
import saveMultipleContacts from '@salesforce/apex/addMultipleContacts.saveMultipleContacts'
import {getPicklistValues} from 'lightning/uiObjectInfoApi'
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import GENDER_IDENTITY_FIELD from '@salesforce/schema/Contact.GenderIdentity'
import CONTACT_OBJECT from '@salesforce/schema/Contact'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

export default class CreateMultipleContacts extends LightningElement {
    @track
    contacts = [];

    get isContactsExist () {
        return this.contacts.length;
    }

    @wire(getObjectInfo, {objectApiName: CONTACT_OBJECT})
    contactObjectInfo;

    @wire(getPicklistValues, {recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId',fieldApiName: GENDER_IDENTITY_FIELD})
    genderPicklistValues;

    get getGenderPicklistValues() {
        return this.genderPicklistValues?.data?.values || [];
    }

    connectedCallback() {
        this.createEmptyContact();
    }

    firstNameHandleChange(e) {
        const index = +e.target.dataset.index;
        const value = e.target.value;
        const editContact = this.contacts.find(contact => contact.index === index);
        editContact['FirstName'] = value;
    }

    lastNameHandleChange(e) {
        const index = +e.target.dataset.index;
        const value = e.target.value;
        const editContact = this.contacts.find(contact => contact.index === index);
        editContact['LastName'] = value;

    }
    
    emailHandleChange(e) {
        const index = +e.target.dataset.index;
        const value = e.target.value;
        const editContact = this.contacts.find(contact => contact.index === index);
        editContact['Email'] = value;
    }

    createEmptyContact() {
        const emptyContact = {
            index: this.contacts.length,
            FirstName: '',
            LastName: '',
            Email: '',
            gender: ''
        }
        this.contacts = [...this.contacts, emptyContact];
    }

    handeDeleteContact(e) {
        const index = +e.target.dataset.index;
        this.contacts = this.contacts.filter(contact => {
            if(contact.index === index) {
                return false;
            }
            if(contact.index > index) {
                contact.index = contact.index - 1;
            }
            return true;
        })
    }

    async handleSubmit(e) {
        e.preventDefault();
        let isValid = true;
        const allInputs = this.template.querySelectorAll('lightning-input');
        allInputs.forEach(input => {
            if(!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        })
        if(isValid) {
            const result = await saveMultipleContacts({contacts: this.contacts});
            const isSuccess = result.isSuccess;
            if(isSuccess) {
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: `${this.contacts.length > 1 ? 'Contacts' : 'Contact'} successfully inserted`,
                    variant: 'success'
                })
                this.dispatchEvent(event)
                this.contacts = [];
            } else {
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: result.message,
                    variant: 'error'
                })
                this.dispatchEvent(event)
            }
        }
    }
}