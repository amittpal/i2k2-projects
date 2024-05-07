import { Shift } from './shift.po';
import { browser, logging, by, element } from 'protractor';
import { ManagePlanCentresShiftTab } from '../../../../../../assets/centre-planning/plan-centres.json';

describe('workspace:- ixcheck-customer-app exam manage setup', () => {
  let page: Shift;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Shift();
  });


  it('should display exam tab', () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });



  //#endregion

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


  it('should open table first row details', () => {
    element(by.xpath('//*[@id="products-grid"]/tbody[1]/tr/td[2]')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });


  it('filling data in first row of table & submitting', () => {

    let changeDateFormatArr = ManagePlanCentresShiftTab.FirstTabA.split('/');
    let changeDateFormat = changeDateFormatArr[2] + "-" + changeDateFormatArr[1] + "-" + changeDateFormatArr[0];
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[1]/input')).sendKeys(new Date(changeDateFormat).toLocaleDateString('en-US',{month: '2-digit',day: '2-digit',year: 'numeric'}));
    browser.sleep(2 * setMiliSec);

    element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/div/select[1]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.FirstTabB)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/div/select[2]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.FirstTabB)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/div/select[3]')).sendKeys(ManagePlanCentresShiftTab.Status);
    browser.sleep(2 * setMiliSec);

    element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/div/select[1]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.FirstTabC)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/div/select[2]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.FirstTabC)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/div/select[3]')).sendKeys(ManagePlanCentresShiftTab.Status);
    browser.sleep(2 * setMiliSec);


    element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/div/select[1]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.FirstTabD)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/div/select[2]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.FirstTabD)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/div/select[3]')).sendKeys(ManagePlanCentresShiftTab.Status);
    browser.sleep(2 * setMiliSec);


    element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();

    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should open table second row details', () => {
    element(by.xpath('//*[@id="products-grid"]/tbody[2]/tr/td[2]')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('filling data in second row of table & submitting', () => {

    let changeDateFormatArr = ManagePlanCentresShiftTab.SecondTabA.split('/');
    let changeDateFormat = changeDateFormatArr[2] + "-" + changeDateFormatArr[1] + "-" + changeDateFormatArr[0];
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[1]/input')).sendKeys(new Date(changeDateFormat).toLocaleDateString('en-US',{month: '2-digit',day: '2-digit',year: 'numeric'}));
    browser.sleep(2 * setMiliSec);

    element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/div/select[1]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.SecondTabB)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/div/select[2]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.SecondTabB)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/div/select[3]')).sendKeys(ManagePlanCentresShiftTab.Status);
    browser.sleep(2 * setMiliSec);

    element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/div/select[1]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.SecondTabC)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/div/select[2]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.SecondTabC)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/div/select[3]')).sendKeys(ManagePlanCentresShiftTab.Status);
    browser.sleep(2 * setMiliSec);


    element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/div/select[1]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.SecondTabD)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/div/select[2]')).element(by.cssContainingText('option', ManagePlanCentresShiftTab.SecondTabD)).click();
    element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/div/select[3]')).sendKeys(ManagePlanCentresShiftTab.Status);
    browser.sleep(2 * setMiliSec);


    element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();

    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('checking if shift form is valid & submitting data', () => {
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

  //#region


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

