import { PlanExamsList } from './plan-centre-list.po';
import { browser, logging, by, element } from 'protractor';
import { HttpClient } from '@angular/common/http';

describe('workspace:- ixcheck-customer-app exam setup list', () => {
  let page: PlanExamsList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new PlanExamsList();
  });

  it('should refresh the list', () => {
    element(by.xpath('//*[@id="refreshBtn"]')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
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

    //filter click
    element(by.id('btnSubmit')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should display list of pending exams', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click manage button of first  from list', () => {
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
