import { Basic } from './basic.po';
import { browser, logging, by, element } from 'protractor';
import { BasicSetupValues } from "../../../../../../assets/admit-card-planning/admit-card-setup.json";

var path = require('path');

describe('workspace:- ixcheck-customer-app admit card manage basic setup', () => {
  let page: Basic;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Basic();
  });


  it('should display basic tab', () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  //#region

  // *************** Basic Tab ***************************/
  
  it('fill admit card setup basic form with values', () => {
    element(by.id('distribution_schedule')).element(by.cssContainingText('option', BasicSetupValues.DistributionSchedule)).click();
    element(by.id('centre_map')).element(by.cssContainingText('option', BasicSetupValues.ShowCentreMap)).click();
    element(by.id('randomize_reg')).element(by.cssContainingText('option', BasicSetupValues.RandomizeRegistration)).click();
    element(by.xpath('//*[@id="days_for_distribution"]')).clear();
    element(by.xpath('//*[@id="days_for_distribution"]')).sendKeys(BasicSetupValues.DaysForDistribution);
    element(by.id('distribution_method')).element(by.cssContainingText('option', BasicSetupValues.DistributionMethod)).click();
    element(by.id('qr_barcode')).element(by.cssContainingText('option', BasicSetupValues.QrBarCode)).click();
    let logoImgAbsolutePath = path.resolve(__dirname,BasicSetupValues.LogoImage);    
    element(by.xpath('//*[@id="logo_img_visible"]')).sendKeys(logoImgAbsolutePath);
    let signImgAbsolutePath = path.resolve(__dirname,BasicSetupValues.SignatoryImage);  
    element(by.xpath('//*[@id="sign_img_visible"]')).sendKeys(signImgAbsolutePath);
    let bgImgAbsolutePath = path.resolve(__dirname,BasicSetupValues.BackgroundImage);  
    element(by.xpath('//*[@id="bg_img_visible"]')).sendKeys(bgImgAbsolutePath);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    ////check if form is valid
    let form = element(by.id('basicSetupFormGroup')).getAttribute('class');
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

