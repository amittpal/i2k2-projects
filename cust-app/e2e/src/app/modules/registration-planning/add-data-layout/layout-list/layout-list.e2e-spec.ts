import { PlanExamsList } from './layout-list.po';
import { browser, logging, by, element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { LayoutListDetail } from '../../../../../assets/registration-planning/create-layout/layout-list.json';

describe('workspace:- ixcheck-customer-app exam setup list', () => {
  let page: PlanExamsList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new PlanExamsList();
  });

  it('should open layout setup list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select from dropdown & filter', () => {
    var layoutName;
    if (LayoutListDetail.layoutName) {
      layoutName = LayoutListDetail.layoutName;
    } else {
      layoutName = browser.executeScript("return window.sessionStorage.getItem('exam');");
    }

    // var layoutName = "e2e-test-exam-5/11/2020, 8:29:56 PM";
    page.getLayout(layoutName);  //********************************* Add Layout Code ****************//
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    //filter click
    element(by.id('btnSubmit')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    //Close Filter
    element(by.xpath('//*[@id="filterDiv"]/div/div[1]/div[2]/ul/li/a')).click();
  });

  it('should display layout', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click manage button of first layout from list', () => {
    page.getFirstManageExamLink().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();

    page.selectLayoutPreview().click();
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
