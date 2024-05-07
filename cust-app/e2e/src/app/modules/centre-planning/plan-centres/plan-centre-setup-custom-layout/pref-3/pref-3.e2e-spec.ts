import { PrefC } from './Pref-3.po';
import { browser, logging, by, element } from 'protractor';
import { ManagePlanCentresPrefCTab } from '../../../../../../assets/centre-planning/plan-centres.json';


describe('workspace:- ixcheck-customer-app exam manage setup', () => {
  let page: PrefC;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new PrefC();
  });


  //* *************** Assign Pref-3 ***************************** */
  it('should activate Pref-3 tab', () => {
    //activating next tab
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-centre-main/div/div/div/div[1]/tabset/ul/li[6]/a')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });

    //************************* Adding center *********************************/
    it('should add Pref-3 center', () => {
      // displaying 1 table row details
      element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr[1]/td[2]/span[1]')).click();
      //Select centre
      element(by.xpath('//*[@id="mapCentreslist"]/table/tbody/tr/td[4]/div/div[2]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      //Update centre
      element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr[2]/td/app-first-tab-c-rowdetail/div/div/div/button[1]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      // Ok
      element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();

    });
    //************************* Adding data *********************************/
    it('should add data to Pref-3', () => {

      // // Open First Tab
      element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr/td[1]')).click();
      browser.sleep(2 * setMiliSec);
      // Open Sub tab
      element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      browser.sleep(2 * setMiliSec);
      //Add data
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys(ManagePlanCentresPrefCTab.FirstTabA);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys(ManagePlanCentresPrefCTab.FirstTabB);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys(ManagePlanCentresPrefCTab.FirstTabC);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys(ManagePlanCentresPrefCTab.FirstTabD);
      browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();
      //Add value
      element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();

    })

  //#endregion




  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

