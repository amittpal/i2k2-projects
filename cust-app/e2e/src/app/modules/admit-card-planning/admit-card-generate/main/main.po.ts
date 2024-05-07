import { browser, by, element } from 'protractor';

export class MainPage {
  navigateTo() {
    return browser.get('/main');///browser.get(browser.baseUrl) as Promise<any>;
  }


  getAdmitCardModuleLink()
  {
    return element(by.id('icon-mod6'))
  }

  getAdmitCardGenerateListLink()
  {
    return  element(by.xpath('//*[@id="mod6"]/div[1]/nav/a[1]'));
  }


}
