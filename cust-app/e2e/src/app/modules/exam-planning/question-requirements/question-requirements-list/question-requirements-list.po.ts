import { browser, by, element } from 'protractor';

export class QuitionRequirementsList {
    navigateTo() {
        return browser.get('/question/requirements');
    }

    getFilterToggleButton() {
        return element(by.css('.filter-block'));
    }

    getPendingPlanDropdownOption() {
        return element(by.cssContainingText('option', 'Setup Finalized'));
    }

    getFirstManageExamLink() {
        return element(by.id('question-requirements-list'))
            .element(by.tagName('table'))
            .all(by.tagName('tbody')).first()
            .element(by.css('.flex-t1-col-12'))
            .element(by.css('.btn-group'))
            .all(by.tagName('a')).first();
    }

}