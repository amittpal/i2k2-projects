import { PrefA } from './pref-1.po';
import { browser, logging, by, element } from 'protractor';
import { ManagePlanCentresPrefATab } from '../../../../../../assets/centre-planning/plan-centres.json';


describe('workspace:- ixcheck-customer-app exam manage setup', () => {
  let page: PrefA;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new PrefA();
  });


  it('should display exam tab', () => {
    // browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });

  //#region
  //************************* Assign Pref-1 *********************************/
  it('should activate Pref-1 tab', () => {
    //activating next tab
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-centre-main/div/div/div/div[1]/tabset/ul/li[4]/a')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });

  //************************* Adding center *********************************/
    it('should add pref-1 center', () => {

      //displaying 1 table row details
      element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr[1]/td[2]/span[1]')).click();
      //Select centre
      element(by.xpath('//*[@id="mapCentreslist"]/table/tbody/tr/td[4]/div/div[2]')).click();
      //Update centre
      element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr[2]/td/app-first-tab-rowdetail/div/div/div/button[1]')).click();
      // Ok
      element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();

      // displaying 3 table row details
      element(by.xpath('//*[@id="products-grid"]/table/tbody[3]/tr/td[2]/span[1]')).click();
      //Select centre
      element(by.xpath('//*[@id="mapCentreslist"]/table/tbody/tr/td[4]/div/div[2]')).click();
      //Update centre
      element(by.xpath('//*[@id="products-grid"]/table/tbody[3]/tr[2]/td/app-first-tab-rowdetail/div/div/div/button[1]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      //  Ok
      element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();


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
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys(ManagePlanCentresPrefATab.FirstTabA);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys(ManagePlanCentresPrefATab.FirstTabB);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys(ManagePlanCentresPrefATab.FirstTabC);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys(ManagePlanCentresPrefATab.FirstTabD);
      browser.sleep(1 * setMiliSec);
      browser.waitForAngular();
      //Add value
      element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();


      /// Open Third Tab
      element(by.xpath('//*[@id="products-grid"]/table/tbody[3]/tr/td[1]')).click();
      browser.sleep(2 * setMiliSec);
      // Open Sub tab
      element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      browser.sleep(2 * setMiliSec);
      //Add data
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys(ManagePlanCentresPrefATab.ThirdTabA);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys(ManagePlanCentresPrefATab.ThirdTabB);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys(ManagePlanCentresPrefATab.ThirdTabC);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys(ManagePlanCentresPrefATab.ThirdTabD);
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
