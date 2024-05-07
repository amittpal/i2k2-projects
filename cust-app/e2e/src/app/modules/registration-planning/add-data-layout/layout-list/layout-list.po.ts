import { browser, by, element } from 'protractor';

export class PlanExamsList {
  navigateTo() {
    return browser.get('/exam/planning');
  }

  getFilterToggleButton()
  {
    return element(by.css('.filter-block'));
  }

  getLayout(code:any)
  {

    return element(by.xpath('//*[@id="layout_code"]')).sendKeys(code);
    // return element(by.cssContainingText('option', ' Centres Mapped '));
  }

  getFirstManageExamLink()
  {
    return element(by.xpath('//*[@id="exam-list"]/table/tbody[1]/tr/td[9]/div/div[2]/a[2]'));

  }
  selectLayoutPreview()
  {
    return element(by.xpath('//*[@id="dropdown-autoclose1"]/li[1]/a'));

  }



}
