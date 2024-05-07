import { browser, by, element } from 'protractor';
import { PlanCentreList } from '../../../../../assets/centre-planning/plan-centres.json';
export class PlanExamsList {
  navigateTo() {
    return browser.get('/exam/planning');
  }

  getFilterToggleButton() {
    return element(by.css('.filter-block'));
  }

  getPendingPlanDropdownOption() {
    return element(by.cssContainingText('option', PlanCentreList.PlanStatus));
  }

  getFirstManageExamLink() {
    return element(by.xpath('//*[@id="exam-list"]/table/tbody[1]/tr/td[12]/div/span/div/a'));

  }

}
