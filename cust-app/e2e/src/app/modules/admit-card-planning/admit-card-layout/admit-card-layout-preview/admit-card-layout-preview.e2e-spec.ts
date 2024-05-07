import { AdmitCardLayoutPreview } from './admit-card-layout-preview.po';
import { browser, logging, by, element } from 'protractor';

describe('workspace:- ixcheck-customer-app admit card layout preview', () => {
  let page: AdmitCardLayoutPreview;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardLayoutPreview();
  });

  it('should show admit card layout preview', () => {
    expect(element(by.id('StiViewer')).isPresent()).toBe(true);
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('go back to admit card layout list', () => {
    element(by.id('backToList')).click();
    browser.sleep(5 * setMiliSec);
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
