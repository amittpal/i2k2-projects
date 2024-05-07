import { Email } from './email.po';
import { browser, logging, by, element } from 'protractor';
import { EmailSetupValues } from "../../../../../../assets/admit-card-planning/admit-card-setup.json";

describe('workspace:- ixcheck-customer-app admit card manage email setup', () => {
  let page: Email;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Email();
  });


  it('should display email tab', () => {
    // browser.sleep(3 * setMiliSec);    
    browser.waitForAngular();
  });

  //#region

  // *************** Email Tab ***************************/
  
  it('fill admit card setup email form with values', () => {
    element(by.id('smtp_server')).clear();
    element(by.id('smtp_server')).sendKeys(EmailSetupValues.SmtpServer);
    element(by.id('smtp_port')).clear();
    element(by.id('smtp_port')).sendKeys(EmailSetupValues.SmtpPort);
    element(by.id('sender_email')).clear();
    element(by.id('sender_email')).sendKeys(EmailSetupValues.SendersEmailId);
    element(by.id('sender_name')).clear();
    element(by.id('sender_name')).sendKeys(EmailSetupValues.SendersName);
    element(by.id('verify_email')).clear();
    element(by.id('verify_email')).sendKeys(EmailSetupValues.VerifyEmailAccount);
    element(by.id('password')).clear();
    element(by.id('password')).sendKeys(EmailSetupValues.Password);
    element(by.id('email_sub_text')).clear();
    element(by.id('email_sub_text')).sendKeys(EmailSetupValues.EmailSubjectsTemplateText);
    element(by.id('attach_admit_card')).click();
  });

  it('Filling Email body template', () => {    
    browser.actions().doubleClick(element(by.xpath('//*[@id="email_placeholder_row"]/div[1]/span'))).perform();    
    browser.actions().doubleClick(element(by.xpath('//*[@id="email_placeholder_row"]/div[8]/span'))).perform();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
    });

  it('checking if email form is valid & submitting data', () => {
    ////check if form is valid
    let form = element(by.id('emailSetupFormGroup')).getAttribute('class');
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

