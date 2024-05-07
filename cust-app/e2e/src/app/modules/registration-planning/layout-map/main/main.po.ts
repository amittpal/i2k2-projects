import { browser, by, element } from 'protractor';

export class MainPage {
  navigateTo() {
    return browser.get('/main');///browser.get(browser.baseUrl) as Promise<any>;
  }


  getLayoutMappingModuleLink()
  {
    return element(by.id('icon-mod3'))
  }

  getLayoutMappingSetup()
  {
    // Select add layout
    return  element(by.xpath('//*[@id="mod3"]/nav/a[3]'));
  }


}
