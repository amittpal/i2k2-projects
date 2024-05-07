import { PlanExamsList } from './centre-mapping-list.po';
import { browser, logging, by, element } from 'protractor';

describe('workspace:- ixcheck-customer-app list', () => {
  let page: PlanExamsList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new PlanExamsList();
  });
  it('should click refresh button', () => {
    element(by.xpath('//*[@id="submitBtn"]')).click();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  });

  it('should open centre-mapping list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select from dropdown & filter', () => {
    var examName = browser.executeScript("return window.sessionStorage.getItem('exam');");
    // var examName="e2e-test-exam-5/6/2020, 7:46:02 PM";
    page.getLayout(examName); // ****************************** Enter layout code to search ************************************/
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    //filter click
    element(by.id('btnSubmit')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
    // //Close Filter
    element(by.xpath('//*[@id="filterDiv"]/div/div[1]/div[2]/ul/li/a')).click();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  });

  it('should display layout', () => {
    browser.sleep(2 * setMiliSec);
  });

  it('should click manage button from list', () => {
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
