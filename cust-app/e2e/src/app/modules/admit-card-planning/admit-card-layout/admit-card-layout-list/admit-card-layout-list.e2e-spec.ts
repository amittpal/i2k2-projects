import { AdmitCardLayoutList } from './admit-card-layout-list.po';
import { browser, logging, by, element } from 'protractor';
import { LayoutCode,LayoutName } from "../../../../../assets/admit-card-planning/admit-card-layout.json";

describe('workspace:- ixcheck-customer-app admit card layout list', () => {
  let page: AdmitCardLayoutList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardLayoutList();
  });

  it('should open admit card layout list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select "active" layout status from dropdown on filter', () => {

    /** commenting for testing */
    page.getActiveLayoutDropdownOption().click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

  });

  it('should type provided layout code on filter', () => {

    element(by.xpath('//*[@id="code"]')).clear();
    element(by.xpath('//*[@id="code"]')).sendKeys(LayoutCode.Code);
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

  });

  it('should type provided layout name on filter', () => {    
    
    element(by.xpath('//*[@id="name"]')).clear();
    element(by.xpath('//*[@id="name"]')).sendKeys(LayoutCode.Code);    
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

  });

  it('should click on filter submit button', () => {
     //filter click
     element(by.id('btnSubmit')).click();
     page.getFilterToggleButton().click();
     browser.sleep(5 * setMiliSec);
     browser.waitForAngular();
  });

  it('should display list of admit card layout active list', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click layout preview button of first exam from list', () => {
   page.getFirstAdmitCardLayoutLink().click();
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
