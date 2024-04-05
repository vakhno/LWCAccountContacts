import { LightningElement } from 'lwc';

export default class AccountSearch extends LightningElement {
    searchText = '';

    searchAccountContactHandler(e){
        this.searchText = e.detail;
        console.log(`${this.searchText} !!!`)
    }
}