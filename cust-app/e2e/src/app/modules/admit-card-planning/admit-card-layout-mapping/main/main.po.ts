import { browser, by, element } from 'protractor';

export class MainPage {
  navigateTo() {
    return browser.get('/main');///browser.get(browser.baseUrl) as Promise<any>;
  }


  getAdmitCardPlanningModuleLink()
  {
    return element(by.id('icon-mod6'))
  }

  getAdmitCardPlanningLayoutMappingListLink()
  {
    return  element(by.xpath('//*[@id="mod6"]/nav/a[3]'));
  }


}
