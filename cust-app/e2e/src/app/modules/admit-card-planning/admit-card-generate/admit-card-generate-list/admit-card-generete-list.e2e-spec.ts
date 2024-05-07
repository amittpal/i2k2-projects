import { AdmitCardGenerateList } from './admit-card-generete-list.po';
import { browser, logging, by, element } from 'protractor';
import { ExamCode,AdmitCardStatus } from "../../../../../assets/admit-card-planning/admit-card-generate.json";

describe('workspace:- ixcheck-customer-app admit card generate list', () => {
  let page: AdmitCardGenerateList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardGenerateList();
  });

  it('should open admit card generate list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should type provided exam code on filter', () => {

    element(by.xpath('//*[@id="code"]')).clear();
    element(by.xpath('//*[@id="code"]')).sendKeys(ExamCode.Code);
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

  });

  it('should select provided admit card status from dropdown on filter', () => {

    /** commenting for testing */
    element(by.cssContainingText('option', AdmitCardStatus.Status)).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    var examName:any = browser.executeScript("return window.sessionStorage.getItem('exam');");
    element(by.xpath('//*[@id="examName"]')).clear();
    element(by.xpath('//*[@id="examName"]')).sendKeys(examName);
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    //filter click
    element(by.id('btnSubmit')).click();
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });  

  it('should display list of admit card whose layout are mapped', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click button of first exam from list & generate admit cards', () => {
   page.getFirstAdmitCardLink().click();
   browser.sleep(15 * setMiliSec);
   browser.waitForAngular();
  })

  it('should get success message of admit card generation', () => {
    expect(element(by.buttonText('Go to Main list')).isPresent()).toBe(true);
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should go to the main list', () => {
    element(by.buttonText('Go to Main list')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should open admit card generate list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select "Admit Card Generated" status from dropdown and type Exam Name on filter', () => {

    /** commenting for testing */
    page.getLayoutMappedDropdownOption(" Admit Card Generated ").click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    var examName:any = browser.executeScript("return window.sessionStorage.getItem('exam');");
    element(by.xpath('//*[@id="examName"]')).clear();
    element(by.xpath('//*[@id="examName"]')).sendKeys(examName);
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    //filter click
    element(by.id('btnSubmit')).click();
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should click manage button of first admit card generated exam from list', () => {
    page.getFirstAdmitCardLink().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
   })

   it('should click first shift manage button', () => {
    page.getFirstAdmitCardShiftLink().click();
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
