import { browser, by, element } from 'protractor';

export class MainPage {
  navigateTo() {
    return browser.get('/main');///browser.get(browser.baseUrl) as Promise<any>;
  }


  getCentrePlanningModuleLink() {
    return element(by.id('icon-mod4'))
  }

  getImportCentres() {
    return element(by.xpath('//*[@id="mod4"]/nav/a[2]'))
  }


}
