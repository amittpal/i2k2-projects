import { browser, by, element } from 'protractor';

export class MainPage {
    navigateTo() {
        return browser.get('/main');
    }


    getExamPlanningModuleLink() {
        return element(by.id('icon-mod2'))
    }

    getQuestionRrequirementsListLink() {
        return element(by.id('mod2')).element(by.tagName('nav')).all(by.css('.nav-link')).last();
    }
}
