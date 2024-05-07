import { PrefB } from './pref-2.po';
import { browser, logging, by, element } from 'protractor';
import { ManagePlanCentresPrefBTab } from '../../../../../../assets/centre-planning/plan-centres.json';


describe('workspace:- ixcheck-customer-app exam manage setup', () => {
  let page: PrefB;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new PrefB();
  });


  //* *************** Assign Pref-2 ***************************** */
  it('should activate Pref-2 tab', () => {
    //activating next tab
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-centre-main/div/div/div/div[1]/tabset/ul/li[5]/a')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });



    //************************* Adding center *********************************/
    it('should add pref-2 center', () => {

      // displaying 1 table row details
      element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr[1]/td[2]/span[1]')).click();
      //Select centre
      element(by.xpath('//*[@id="mapCentreslist"]/table/tbody/tr/td[4]/div/div[2]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      //Update centre
      element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr[2]/td/app-first-tab-b-rowdetail/div/div/div/button[1]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      // Ok
      element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();

      // displaying 2 table row details
      element(by.xpath('//*[@id="products-grid"]/table/tbody[2]/tr/td[2]/span[1]')).click();
      //Select centre
      element(by.xpath('//*[@id="mapCentreslist"]/table/tbody/tr/td[4]/div/div[2]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      //Update centre
      element(by.xpath('//*[@id="products-grid"]/table/tbody[2]/tr[2]/td/app-first-tab-b-rowdetail/div/div/div/button[1]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      //  Ok
      element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();

    });


    //************************* Adding data *********************************/

    it('should add data to pref-2', () => {

      // // Open First Tab
      element(by.xpath('//*[@id="products-grid"]/table/tbody[1]/tr/td[1]')).click();
      browser.sleep(2 * setMiliSec);
      // Open Sub tab
      element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      browser.sleep(2 * setMiliSec);
      //Add data
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys(ManagePlanCentresPrefBTab.FirstTabA);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys(ManagePlanCentresPrefBTab.FirstTabB);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys(ManagePlanCentresPrefBTab.FirstTabC);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys(ManagePlanCentresPrefBTab.FirstTabD);
      browser.sleep(1 * setMiliSec);
      // browser.waitForAngular();
      //Add value
      element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();

      /// Open Second Tab
      element(by.xpath('//*[@id="products-grid"]/table/tbody[2]/tr/td[1]')).click();
      browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();
      // Open Sub tab
      element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();
      //Add data
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys(ManagePlanCentresPrefBTab.SecondTabA);
      browser.sleep(1 * setMiliSec);
      // browser.waitForAngular();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys(ManagePlanCentresPrefBTab.SecondTabB);
      browser.sleep(1 * setMiliSec);
      // browser.waitForAngular();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys(ManagePlanCentresPrefBTab.SecondTabC);
      browser.sleep(1 * setMiliSec);
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys(ManagePlanCentresPrefBTab.SecondTabD);
      browser.sleep(1 * setMiliSec);
      // browser.waitForAngular();
      //Add value
      element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();

      /// Open Third Tab
      // element(by.xpath('//*[@id="products-grid"]/table/tbody[3]/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // // Open Sub tab
      // element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // //Add data
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // // browser.waitForAngular();
      // //Add value
      // element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();

      // /// Open double centre Tab
      // element(by.xpath('//*[@id="products-grid"]/table/tbody[10]/tr[1]/td[1]')).click();
      // browser.sleep(2 * setMiliSec);

      // // Open first Sub tab
      // element(by.xpath('//*[@id="orders-list"]/table/tbody[1]/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // //Add data
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys("1");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // browser.waitForAngular();
      // //Update value
      // element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();


      // // Open Second Sub tab
      // element(by.xpath('//*[@id="products-grid"]/table/tbody[10]/tr[1]/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // // Open second tab
      // element(by.xpath('//*[@id="orders-list"]/table/tbody[2]/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // //Add data
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys("0");
      // browser.sleep(1 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys("1");
      // browser.sleep(1 * setMiliSec);
      // browser.waitForAngular();

      // //Update value
      // element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();


      /// Open fourth Tab
      // element(by.xpath('//*[@id="products-grid"]/table/tbody[4]/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // // Open Sub tab
      // element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // //Add data
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys("1");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys("0");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys("10");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys("2");
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();
      // //Add value
      // element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();

      /// Open Five Tab
      // element(by.xpath('//*[@id="products-grid"]/table/tbody[5]/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // // Open Sub tab
      // element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // //Add data
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys("1");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys("0");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys("10");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys("2");
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();
      // //Add value
      // element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();


      /// Open Six Tab
      // element(by.xpath('//*[@id="products-grid"]/table/tbody[6]/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // // Open Sub tab
      // element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // //Add data
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys("1");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys("0");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys("10");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys("2");
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();
      // //Add value
      // element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();


      /// Open Seventh Tab
      // element(by.xpath('//*[@id="products-grid"]/table/tbody[7]/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // // Open Sub tab
      // element(by.xpath('//*[@id="orders-list"]/table/tbody/tr/td[1]')).click();
      // browser.sleep(2 * setMiliSec);
      // //Add data
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[2]/input')).sendKeys("1");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[3]/input')).sendKeys("0");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[4]/input')).sendKeys("10");
      // browser.sleep(2 * setMiliSec);
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).clear();
      // element(by.xpath('//*[@id="childFrom"]/div[1]/div[5]/input')).sendKeys("2");
      // browser.sleep(2 * setMiliSec);
      // browser.waitForAngular();
      // //Add value
      // element(by.xpath('//*[@id="childFrom"]/div[2]/div/button[1]')).click();
      // browser.sleep(2 * setMiliSec);
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

