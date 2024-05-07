import { Sms } from './sms.po';
import { browser, logging, by, element } from 'protractor';
import { SmsSetupValues } from "../../../../../../assets/admit-card-planning/admit-card-setup.json";

describe('workspace:- ixcheck-customer-app admit card manage sms setup', () => {
  let page: Sms;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Sms();
  });


  it('should display sms tab', () => {
    // browser.sleep(3 * setMiliSec);    
    browser.waitForAngular();
  });

  //#region

  // *************** Sms Tab ***************************/
  
  it('fill admit card setup sms form with values', () => {
    element(by.id('url')).clear();
    element(by.id('url')).sendKeys(SmsSetupValues.Url);
    element(by.id('key_uid')).clear();
    element(by.id('key_uid')).sendKeys(SmsSetupValues.Uid);
    element(by.id('password')).clear();
    element(by.id('password')).sendKeys(SmsSetupValues.Password);
    element(by.id('template')).clear();
    element(by.id('template')).sendKeys(SmsSetupValues.TemplateText);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    ////check if form is valid
    let form = element(by.id('smsSetupFormGroup')).getAttribute('class');
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

