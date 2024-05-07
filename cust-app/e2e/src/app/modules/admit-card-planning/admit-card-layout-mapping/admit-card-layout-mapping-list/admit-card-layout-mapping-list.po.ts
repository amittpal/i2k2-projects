import { browser, by, element } from 'protractor';

export class AdmitCardLayoutMappingList {

  getFilterToggleButton()
  {
    return element(by.css('.filter-block'));
  }

  getFirstAdmitCardLayoutLink()
  {
    return element(by.xpath('//*[@id="exam-list"]/table/tbody[1]/tr/td[11]/div/div/a'));

  }

}
