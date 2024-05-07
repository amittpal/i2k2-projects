import { AdmitCardLayoutMapping } from './admit-card-layout-mapping.po';
import { browser, logging, by, element } from 'protractor';
import { MapLayoutCode } from "../../../../../assets/admit-card-planning/admit-card-layout-mapping.json";

describe('workspace:- ixcheck-customer-app admit card layout mapping', () => {
  let page: AdmitCardLayoutMapping;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardLayoutMapping();
  });

  it('should open admit card map layout page', () => {    
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select "All" layout type option from dropdown & filter', () => {

    /** commenting for testing */
    page.getAllDropdownOption().click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    //filter click
    element(by.id('btnSubmit')).click();    
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });


  it('fill map layout form', () => {
    element(by.xpath('//*[@id="layout_code"]')).element(by.cssContainingText('option', MapLayoutCode.Code)).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should show admit card layout preview', () => {
    expect(element(by.id('StiViewer')).isPresent()).toBe(true);
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should scroll to the bottom', () => {
    let loc = element(by.xpath('//*[@id="formSubmitBtn"]'));
    browser.actions().mouseMove(loc).perform();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should submit the form & map the admit card layout', () => {
    element(by.xpath('//*[@id="formSubmitBtn"]')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should go to the main list', () => {
    element(by.buttonText('Go to List')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });
});
