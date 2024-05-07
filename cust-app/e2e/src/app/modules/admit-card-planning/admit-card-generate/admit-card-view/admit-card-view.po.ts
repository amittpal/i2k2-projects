import { browser, by, element } from 'protractor';

export class AdmitCardView {

  getFirstStateWiseAdmitCardLink()
  {
    return element(by.xpath('//*[@id="admit-card-list"]/table/tbody[1]/tr/td[1]'));
  }
}
