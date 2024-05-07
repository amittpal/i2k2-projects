import { LayoutList } from './layout-list.po';
import { browser, logging, by, element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { LayoutListDetail } from '../../../../../assets/registration-planning/create-layout/layout-list.json';

describe('workspace:- ixcheck-customer-app', () => {
  let page: LayoutList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new LayoutList();
  });


  it('should display layout', () => {
    browser.sleep(1 * setMiliSec);
  });

  it('should fill layout details', () => {
    var layoutName;
    if (LayoutListDetail.layoutName) {
      layoutName = LayoutListDetail.layoutName
    } else {
      layoutName = browser.executeScript("return window.sessionStorage.getItem('exam');");
    }
    page.fillLayoutDetails(layoutName); //****************  Add Layout Custom Name here *************************/
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  })


  it('should save fill layout details', () => {
    page.saveLayoutDetails();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  })

  it('should add new section', () => {
    page.addNewSection(LayoutListDetail.SectionA);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  })
  it('should add layout drag drop details info', () => {
    page.addDragDropDetails();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  })

  it('should add new section', () => {
    page.addNewSection(LayoutListDetail.SectionB);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  })

  it("should scroll to the bottom", () => {
    page.scrollToTheBottom();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });

  it('should add contact information', () => {
    page.addcontactInfo();
    browser.sleep(1 * setMiliSec);
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
