import { MainPage } from './main.po';
import { browser, logging, by, element, $$} from 'protractor';

describe('workspace:- ixcheck-customer-app admit card layout mapping list main form', () => {
  let page: MainPage;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new MainPage();
  });

  it('should display main page', () => {});

  it('navigating to Admit-Card-Planning layout list', () => {

    //clicking admitcard plannig module
    page.getAdmitCardPlanningModuleLink().click();
    browser.sleep(3*setMiliSec);

    //clicking admitcard layout mapping list link
    page.getAdmitCardPlanningLayoutMappingListLink().click();
    browser.sleep(5*setMiliSec);
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
