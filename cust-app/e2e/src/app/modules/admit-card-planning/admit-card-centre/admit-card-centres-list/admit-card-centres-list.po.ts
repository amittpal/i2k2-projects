import { browser, by, element } from 'protractor';

export class AdmitCardCentresList {

  getFilterToggleButton()
  {
    return element(by.css('.filter-block'));
  }

  getLayoutMappedDropdownOption()
  {
    return element(by.cssContainingText('option', ' Layout Mapped '));
  }

  getFirstAdmitCardCentresLink()
  {
    return element(by.xpath('//*[@id="exam-list"]/table/tbody[1]/tr/td[10]/div/div/a'));

  }

}
