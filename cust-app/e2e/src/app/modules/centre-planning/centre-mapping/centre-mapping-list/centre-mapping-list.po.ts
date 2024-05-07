import { browser, by, element } from 'protractor';
import { CentreMapList } from '../../../../../assets/centre-planning/centre-mapping.json';
export class PlanExamsList {
  navigateTo() {
    return browser.get('/exam/planning');
  }

  getFilterToggleButton() {
    return element(by.css('.filter-block'));
  }

  getPendingPlanDropdownOption() {
    return element(by.cssContainingText('option', CentreMapList.PlanStatus));
  }

  getLayout(layoutCode: any) {
    return element(by.xpath('//*[@id="code"]')).sendKeys(layoutCode);
  }

  getFirstManageExamLink() {
    return element(by.xpath('//*[@id="imported-centres-list"]/table/tbody/tr/td[10]'));

  }

}
