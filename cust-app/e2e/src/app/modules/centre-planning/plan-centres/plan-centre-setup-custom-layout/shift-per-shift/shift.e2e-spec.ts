import { Shift } from './shift.po';
import { browser, logging, by, element } from 'protractor';
import { ManagePlanCentresShiftTab ,UpdatePlanCentresPrefATab} from '../../../../../../assets/centre-planning/plan-centres.json';

describe('workspace:- ixcheck-customer-app exam manage setup', () => {
  let page: Shift;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Shift();
  });


  it('should display shift tab', () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });


  //#region
  // *************** shift Tab ***************************/
  it('should activate shift tab', () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    // Switch to next tab
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-centre-main/div/div/div/div[1]/tabset/ul/li[3]/a')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  // Select Registration Data Copy Option
  it('should open registration data copy option', () => {
    element(by.xpath('//*[@id="examShiftForm"]/div/div/div/div[2]/select')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.RegistrationDataOption)).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    // Select Yes from Modal
    element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button[1]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });


  it('should open table first row details', () => {
    element(by.xpath('//*[@id="products-grid"]/tbody[1]/tr/td[2]')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });


  it('filling data in first row of table & submit', () => {
    // Input Reg Data Distribution
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys(ManagePlanCentresShiftTab.FirstTabPercentage);
    browser.sleep(1 * setMiliSec);

    // Click Update Button
    element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });

  it('should open table second row details', () => {
    element(by.xpath('//*[@id="products-grid"]/tbody[2]/tr/td[2]')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('filling data in second row of table & submit', () => {
    // Input Reg Data Distribution
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys(ManagePlanCentresShiftTab.SecondTabPercentage);
    browser.sleep(1 * setMiliSec);

    // Click Update Button
    element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });

  it('checking if shift form is valid & submit data', () => {
    ////check if form is valid
    // let form = element(by.id('examShiftForm')).getAttribute('class');
    // expect(form).toContain('ng-valid');

    ////clicking submit
    element(by.id('submitBtn')).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    element(by.buttonText('OK')).click();

    browser.waitForAngular();
  });
  //#endregion
  //************************* Assign Pref-1 *********************************/
  it('should activate Pref-1 tab', () => {
    //activating next tab
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-centre-main/div/div/div/div[1]/tabset/ul/li[4]/a')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });


  //************************* Adding data *********************************/
  it('should add data to pref-1', () => {

    /// Open First Tab
    element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr/td[1]')).click();
    browser.sleep(2 * setMiliSec);
    // Open Sub tab
    element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
    browser.sleep(2 * setMiliSec);
    //Add data
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys(UpdatePlanCentresPrefATab.FirstTabA);
    browser.sleep(1 * setMiliSec);
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys(UpdatePlanCentresPrefATab.FirstTabB);
    browser.sleep(1 * setMiliSec);
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys(UpdatePlanCentresPrefATab.FirstTabC);
    browser.sleep(1 * setMiliSec);
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys(UpdatePlanCentresPrefATab.FirstTabD);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
    //Add value
    element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

  })


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

