import { browser, by, element } from 'protractor';

export class AdmitCardGenerateList {

  getFilterToggleButton()
  {
    return element(by.css('.filter-block'));
  }

  getLayoutMappedDropdownOption(status)
  {
    return element(by.cssContainingText('option',status));
  }

  getFirstAdmitCardLink()
  {
    return element(by.xpath('//*[@id="admitcard-generate-list"]/table/tbody[1]/tr/td[11]/div/div/a'));
  }

  getFirstAdmitCardShiftLink()
  {
    return element(by.xpath('//*[@id="admit-card-shifts"]/table/tbody[1]/tr/td[8]/div/div/a'));
  }

}
