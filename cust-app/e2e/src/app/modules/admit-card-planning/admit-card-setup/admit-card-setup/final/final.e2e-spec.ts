import { Finalcode } from './final.po';
import { browser, logging, by, element } from 'protractor';

describe('workspace:- ixcheck-customer-app admit card manage final setup', () => {
  let page: Finalcode;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Finalcode();
  });


  it('should display final review tab', () => {
    // browser.sleep(3 * setMiliSec);    
    browser.waitForAngular();
  });

  //#region

  // *************** Final Review Tab ***************************/

  it('checking if Final Review form is valid & submitting data', () => {
    ////check if form is valid
    let form = element(by.id('finalReviewFormGroup')).getAttribute('class');
    expect(form).toContain('ng-valid');

    ////clicking submit
    element(by.id('submitBtn')).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    element(by.buttonText('Go to Main list')).click();    

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

