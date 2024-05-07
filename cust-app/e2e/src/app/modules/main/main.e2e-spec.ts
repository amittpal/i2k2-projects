import { MainPage } from './main.po';
import { browser, logging, by, element, $$} from 'protractor';
import { async } from '@angular/core/testing';


describe('workspace:- ixcheck-customer-app main', () => {
  let page: MainPage;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new MainPage();
  });

  it('should display main page', () => {});

  it('navigating to exam setup list', () => {

    //clicking exam plannig module
    page.getExamPlanningModuleLink().click();
    browser.sleep(3*setMiliSec);

    //clicking exam setup list link
    page.getExamSetupListLink().click();
    browser.sleep(5*setMiliSec);
    browser.waitForAngular();

  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
