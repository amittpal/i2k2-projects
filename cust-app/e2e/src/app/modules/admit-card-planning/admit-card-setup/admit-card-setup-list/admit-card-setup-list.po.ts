import { browser, by, element } from 'protractor';

export class AdmitCardSetupList {

  getFilterToggleButton()
  {
    return element(by.css('.filter-block'));
  }

  getPendingSetupDropdownOption()
  {
    return element(by.cssContainingText('option', 'Pending'));
  }

  getFirstManageAdmitCardSetupExamLink()
  {
    return element(by.xpath('//*[@id="admitcard-setup-list"]/table/tbody[1]/tr/td[10]/div/div/a'));

  }

}
