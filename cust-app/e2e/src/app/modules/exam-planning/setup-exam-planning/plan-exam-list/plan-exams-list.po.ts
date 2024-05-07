import { browser, by, element } from 'protractor';

export class PlanExamsList {
  navigateTo() {
    return browser.get('/exam/planning');
  }

  getFilterToggleButton()
  {
    return element(by.css('.filter-block'));       
  }

  getPendingPlanDropdownOption()
  {
    return element(by.cssContainingText('option', ' Pending '));      
  }

  getFirstManageExamLink()
  {
    return element(by.id('exam-list'))
    .element(by.tagName('table'))   
    .all(by.tagName('tbody')).first()
    .element(by.css('.flex-t1-col-12'))
    .element(by.css('.btn-group'))
    .all(by.tagName('a')).first();
  }
  
}
