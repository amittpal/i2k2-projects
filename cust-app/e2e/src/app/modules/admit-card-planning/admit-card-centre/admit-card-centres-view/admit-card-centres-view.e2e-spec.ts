import { AdmitCardCentresView } from './admit-card-centres-view.po';
import { browser, logging, by, element } from 'protractor';

describe('workspace:- ixcheck-customer-app admit card centres view', () => {
  let page: AdmitCardCentresView;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardCentresView();
  });

  it('should display admit card centres view', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should collapse & show the centres details', () => {
    page.collapseFirstCentresDetails().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
   })

  it('should click view link button of first centre', () => {
   page.getFirstCentresViewLink().click();
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
