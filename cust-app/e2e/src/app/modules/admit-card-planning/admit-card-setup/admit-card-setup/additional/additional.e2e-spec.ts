import { Additional } from './additional.po';
import { browser, logging, by, element } from 'protractor';
import { AdditionalSetupValues } from "../../../../../../assets/admit-card-planning/admit-card-setup.json";
var path = require('path');

describe('workspace:- ixcheck-customer-app admit card manage additional setup', () => {
  let page: Additional;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Additional();
  });

  it('should display additional tab', () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  //#region

  // *************** Additional Tab ***************************/
  
  it('fill admit card setup additional tab form with values', () => {    


    element.all(by.css('.priority-binding')).each((element,index) =>{
      element.clear();
      element.sendKeys(index + 1);
    });

    element.all(by.css('.length-binding')).each((element,index) =>{
      element.clear();
      element.sendKeys((index * 2) + 2);
    });

    element(by.css('.english-term-binding')).clear();
    element(by.css('.english-term-binding')).sendKeys(AdditionalSetupValues.EnglishTermsnConditions);
    element(by.css('.english-notes-binding')).clear();
    element(by.css('.english-notes-binding')).sendKeys(AdditionalSetupValues.EnglishNotes);
    
    let termsNConditionsImgAbsolutePath = path.resolve(__dirname,AdditionalSetupValues.TermsNConditionsImage);
    element.all(by.css('.otherLangTerms-binding')).each(element =>{
      element.sendKeys(termsNConditionsImgAbsolutePath);
    });

    let notesImgAbsolutePath = path.resolve(__dirname,AdditionalSetupValues.NotesImage);
    element.all(by.css('.otherLangNotes-binding')).each(element =>{
      element.sendKeys(notesImgAbsolutePath);
    });
    
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    //check if form is valid
    let form = element(by.id('additionalSetupFormGroup')).getAttribute('class');
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

