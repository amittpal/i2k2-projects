import { browser, by, element } from 'protractor';

export class MainPage {
  navigateTo() {
    return browser.get('/main');///browser.get(browser.baseUrl) as Promise<any>;
  }


  getCentrePlanningModuleLink()
  {
    return element(by.id('icon-mod3'))
  }

  getCentreSetupListLink()
  {
    return  element(by.xpath('//*[@id="mod3"]/nav/a[1]'));
    // return  element(by.id('mod4')).element(by.tagName('nav')).all(by.tagName('a')).get(3);
  }


}
