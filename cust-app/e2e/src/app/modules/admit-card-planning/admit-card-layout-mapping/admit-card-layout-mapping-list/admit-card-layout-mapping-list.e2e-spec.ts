import { AdmitCardLayoutMappingList } from './admit-card-layout-mapping-list.po';
import { browser, logging, by, element } from 'protractor';
import { LayoutCode,LayoutName,AdmitCardStatus } from "../../../../../assets/admit-card-planning/admit-card-layout-mapping.json";

describe('workspace:- ixcheck-customer-app admit card layout mapping list', () => {
  let page: AdmitCardLayoutMappingList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardLayoutMappingList();
  });

  it('should open admit card layout mapping list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
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

  it('should select provided admit card status from dropdown on filter', () => {

    /** commenting for testing */    
    element(by.cssContainingText('option', AdmitCardStatus.Status)).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    var examName:any = browser.executeScript("return window.sessionStorage.getItem('exam');");    
    element(by.xpath('//*[@id="exam_name"]')).clear();
    element(by.xpath('//*[@id="exam_name"]')).sendKeys(examName);
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

  it('should display list of setup finalized exam list', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click map layout button of first exam from list', () => {
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
