import { Qrcode } from './qrcode.po';
import { browser, logging, by, element } from 'protractor';

describe('workspace:- ixcheck-customer-app admit card manage qrcode setup', () => {
  let page: Qrcode;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Qrcode();
  });


  it('should display qrcode tab', () => {
    // browser.sleep(3 * setMiliSec);    
    browser.waitForAngular();
  });

  //#region

  // *************** Qrcode Tab ***************************/
  
  it('Filling Qrcode body template', () => {
    browser.actions().doubleClick(element(by.xpath('//*[@id="qrcode_placeholder_row"]/div[1]/span'))).perform();    
    browser.actions().doubleClick(element(by.xpath('//*[@id="qrcode_placeholder_row"]/div[2]/span'))).perform();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
    });

  it('checking if Qrcode form is valid & submitting data', () => {
    ////check if form is valid
    let form = element(by.id('qrCodeSetupFormGroup')).getAttribute('class');
    expect(form).toContain('ng-valid');

    ////clicking submit
    element(by.id('submitBtn')).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    element(by.buttonText('Next')).click();    

    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();

  });
  //#endregion

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });
});

