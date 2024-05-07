import { browser, by, element } from 'protractor';

export class RegistrationsList {
  navigateTo() {
    return browser.get('/exam/planning');
  }

  getFilterToggleButton()
  {
    return element(by.css('.filter-block'));
  }

  getLayout(layoutCode: any) {
    return element(by.xpath('//*[@id="code"]')).sendKeys(layoutCode);
  }

  selectImport(){
    return element(by.xpath('//*[@id="exam-list"]/table/tbody/tr/td[9]/div/div[2]/a'));
  }

}
