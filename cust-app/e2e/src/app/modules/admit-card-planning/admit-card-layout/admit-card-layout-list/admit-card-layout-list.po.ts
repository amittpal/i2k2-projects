import { browser, by, element } from 'protractor';

export class AdmitCardLayoutList {

  getFilterToggleButton()
  {
    return element(by.css('.filter-block'));
  }

  getActiveLayoutDropdownOption()
  {
    return element(by.cssContainingText('option', 'Active'));
  }

  getFirstAdmitCardLayoutLink()
  {
    return element(by.xpath('//*[@id="admitcard-layout-list"]/table/tbody[1]/tr/td[9]/div/div/a'));

  }

}
