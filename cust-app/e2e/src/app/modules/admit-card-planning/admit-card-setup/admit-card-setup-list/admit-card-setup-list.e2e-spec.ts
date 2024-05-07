import { AdmitCardSetupList } from './admit-card-setup-list.po';
import { browser, logging, by, element } from 'protractor';
import { SetExamNumber } from "../../../../../assets/admit-card-planning/admit-card-setup.json";

describe('workspace:- ixcheck-customer-app admit card setup list', () => {
  let page: AdmitCardSetupList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardSetupList();
  });

//   it('should refresh the list', () => {
//     element(by.xpath('//*[@id="refreshBtn"]')).click();
//     browser.sleep(5 * setMiliSec);
//     browser.waitForAngular();
//   });

it('should set exam number in case admit card e2e test running separately', () => {
  var examNumber = SetExamNumber.ExamNumber;
  if(examNumber){
    browser.executeScript('window.sessionStorage.setItem("exam", arguments[0])', examNumber);
    //console.log("GOT EXAM NUMBER")
  }    
});

  it('should open admit card setup list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select "pending" setup status from dropdown and type Exam Name on filter', () => {

    /** commenting for testing */
    page.getPendingSetupDropdownOption().click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    var examName:any = browser.executeScript("return window.sessionStorage.getItem('exam');");    
    element(by.xpath('//*[@id="examName"]')).clear();
    element(by.xpath('//*[@id="examName"]')).sendKeys(examName);
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

  });

  it('should click on the filter submit button', () => {
     //filter click
     element(by.id('btnSubmit')).click();
     page.getFilterToggleButton().click();
     browser.sleep(5 * setMiliSec);
     browser.waitForAngular();

    });     

  it('should display list of admit card setup pending exams', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click manage button of first exam from list', () => {
   page.getFirstManageAdmitCardSetupExamLink().click();
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
