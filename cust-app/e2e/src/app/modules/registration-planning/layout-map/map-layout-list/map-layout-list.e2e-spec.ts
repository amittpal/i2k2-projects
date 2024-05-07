import { PlanExamsList } from './map-layout-list.po';
import { browser, logging, by, element } from 'protractor';
import { MapLayoutCode } from '../../../../../assets/registration-planning/layout-map/map-layout.json';

describe('workspace:- map-layout-list', () => {
  let page: PlanExamsList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new PlanExamsList();
  });


  it('should click on refresh exam list button', () => {
    page.refreshExamListButton()
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should open layout setup list filter', () => {
    page.getFilterToggleButton().click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should select from dropdown & filter', () => {
    var examName;
    if (MapLayoutCode.ExamName) {
      examName = MapLayoutCode.ExamName;
    } else {
      examName = browser.executeScript("return window.sessionStorage.getItem('exam');");
    }
    // var examName="e2e-test-exam-5/11/2020, 8:29:56 PM";
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



  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
