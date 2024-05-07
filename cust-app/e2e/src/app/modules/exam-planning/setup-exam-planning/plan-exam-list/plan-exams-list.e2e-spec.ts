import { PlanExamsList } from './plan-exams-list.po';
import { browser, logging, by, element } from 'protractor';
import { HttpClient } from '@angular/common/http';

describe('workspace:- ixcheck-customer-app exam setup list', () => {
  let page: PlanExamsList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new PlanExamsList();
  });


  it('should open exam setup list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select "pending" plan status from dropdown & filter', () => {

    /** commenting for testing */
    page.getPendingPlanDropdownOption().click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    // /** test code */
    // element(by.name('code')).sendKeys('e2e-test-exam-4/9/2020, 12:57:31 PM');
    // browser.sleep(3 * setMiliSec);
    // browser.waitForAngular();
    // /** test code end */

    //filter click
    element(by.id('btnSubmit')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should display list of pending exams', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click manage button of first exam from list', () => {
    page.getFirstManageExamLink().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
