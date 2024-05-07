import { AdmitCardCentresList } from './admit-card-centres-list.po';
import { browser, logging, by, element } from 'protractor';
import { ExamCode,PlanStatus } from "../../../../../assets/admit-card-planning/admit-card-centre.json";

describe('workspace:- ixcheck-customer-app admit card centres list', () => {
  let page: AdmitCardCentresList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardCentresList();
  });

  it('should open admit card centres list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should type provided exam code on filter', () => {

    element(by.xpath('//*[@id="exam_code"]')).clear();
    element(by.xpath('//*[@id="exam_code"]')).sendKeys(ExamCode.Code);
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

  });


  it('should select provided plan status from dropdown on filter', () => {

    /** commenting for testing */
    page.getLayoutMappedDropdownOption().click();
    element(by.cssContainingText('option', PlanStatus.Status)).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    var examName:any = browser.executeScript("return window.sessionStorage.getItem('exam');");    
    element(by.xpath('//*[@id="exam_name"]')).clear();
    element(by.xpath('//*[@id="exam_name"]')).sendKeys(examName);
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();


    //filter click
    element(by.id('btnSubmit')).click();
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should display list of admit card centres list', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click view link button of first exam from list', () => {
   page.getFirstAdmitCardCentresLink().click();
   browser.sleep(5 * setMiliSec);
   browser.waitForAngular();
  })

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });
});
