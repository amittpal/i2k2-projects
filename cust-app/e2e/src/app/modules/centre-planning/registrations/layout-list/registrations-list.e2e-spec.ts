import { RegistrationsList } from './registrations-list.po';
import { browser, logging, by, element } from 'protractor';
import { HttpClient } from '@angular/common/http';

describe('workspace:- ixcheck-customer-app exam setup list', () => {
  let page: RegistrationsList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new RegistrationsList();
  });

  it('should open centre-mapping list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select from dropdown & filter', () => {
    var examName = browser.executeScript("return window.sessionStorage.getItem('exam');");
    // var examName="exam_29_04_2020";
    page.getLayout(examName); // ****************************** Enter layout code to search ************************************/
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    //filter click
    element(by.id('btnSubmit')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
    // //Close Filter
    // element(by.xpath('//*[@id="filterDiv"]/div/div[1]/div[2]/ul/li/a')).click();
  });

  it('should display layout', () => {
    browser.sleep(2 * setMiliSec);
  });

  it('should click import button from list', () => {
   page.selectImport().click();
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
