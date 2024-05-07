import { browser, by, element } from 'protractor';

export class ManageQuitionRequirements {
    getFinalizeButton() {
        return element(by.id('submitBtn'));
    }
    getGotoListButton() {
        return element(by.buttonText('Go to List'));
    }
}