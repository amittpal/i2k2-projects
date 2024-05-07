import { browser, by, element } from 'protractor';

export class MainPage {
  navigateTo() {
    return browser.get('/main');///browser.get(browser.baseUrl) as Promise<any>;
  }


  getCentrePlanningModuleLink()
  {
    return element(by.id('icon-mod4'))
  }

  getRegistrationDataLink()
  { //*[@id="mod4"]/div/nav/a
    // return  element(by.xpath('//*[@id="mod4"]/nav/a'));
    return  element(by.id('mod4')).all(by.tagName('nav')).get(1);
  }


}
