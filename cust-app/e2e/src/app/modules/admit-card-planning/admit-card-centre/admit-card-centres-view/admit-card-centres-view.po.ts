import { browser, by, element } from 'protractor';

export class AdmitCardCentresView {

  collapseFirstCentresDetails()
  {
    return element(by.xpath('//*[@id="orders-list"]/table/tbody[1]/tr/td[1]'));
  }

  getFirstCentresViewLink()
  {
    return element(by.xpath('//*[@id="orders-list"]/table/tbody[1]/tr/td[10]/div/div/a'));
  }

}
