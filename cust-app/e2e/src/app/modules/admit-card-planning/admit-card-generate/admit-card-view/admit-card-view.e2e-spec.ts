import { AdmitCardView } from './admit-card-view.po';
import { browser, logging, by, element } from 'protractor';

describe('workspace:- ixcheck-customer-app admit card view', () => {
  let page: AdmitCardView;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new AdmitCardView();
  });

  it('should display list of admit card', () => {
    browser.sleep(5 * setMiliSec);
  });

  it('should click arrow button to collapse and show the candidate detail state wise', () => {
   page.getFirstStateWiseAdmitCardLink().click();
   browser.sleep(5 * setMiliSec);
   browser.waitForAngular();
  })

  it('should click on the down arrow icon of the candidate action column', () => {
    element(by.xpath('//*[@id="rowDetailsId"]/td[10]/a[2]')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    })

  it('download admit card', () => {
    element(by.xpath('//*[@id="rowDetailsId"]/td[10]/ul/li[2]/a')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    })

  it('should click on the preview button of first candidate details', () => {
    element(by.xpath('//*[@id="rowDetailsId"]/td[10]/a[1]')).click();
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
