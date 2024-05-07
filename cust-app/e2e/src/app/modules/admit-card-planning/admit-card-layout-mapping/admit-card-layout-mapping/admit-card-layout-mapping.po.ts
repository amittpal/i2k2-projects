import { browser, by, element } from 'protractor';

export class AdmitCardLayoutMapping {

  getAllDropdownOption()
  {
    return element(by.cssContainingText('option', 'All'));
  }

  getFirstAdmitCardLayoutLink()
  {
    return element(by.xpath('//*[@id="exam-list"]/table/tbody[1]/tr/td[11]/div/div/a'));

  }

}
