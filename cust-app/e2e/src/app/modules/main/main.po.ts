import { browser, by, element } from 'protractor';

export class MainPage {
  navigateTo() {
    return browser.get('/main');///browser.get(browser.baseUrl) as Promise<any>;
  }


  getExamPlanningModuleLink()
  {  
    return element(by.id('icon-mod2'))
  }  
  
  getExamSetupListLink()
  {
    return   element(by.id('mod2')).element(by.tagName('nav')).all(by.css('.nav-link')).first();
  }

  
}
