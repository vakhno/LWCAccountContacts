import { LightningElement } from 'lwc';

export default class AccountSearchBar extends LightningElement {
    accountName = '';

    handleChangeAccountName(e) {
        this.accountName = e.target.value
    }

    handleClickSearch() {
        const event = new CustomEvent('searchaccountcontact', {
            detail: this.accountName
        });
        this.dispatchEvent(event);
    }
}