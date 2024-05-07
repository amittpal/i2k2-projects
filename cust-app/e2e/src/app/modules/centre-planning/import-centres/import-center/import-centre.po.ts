import { browser, by, element } from 'protractor';
import { ImportCentres } from '../../../../../assets/centre-planning/import-centres.json';
export class RegistrationsList {

  fillIntialData() {
    // Fill Import Code
    element(by.xpath('//*[@id="import_code"]')).sendKeys(ImportCentres.ImportCode);
    // Fill Import Name
    element(by.xpath('//*[@id="import_name"]')).sendKeys(ImportCentres.ImportName);
  }

  addStateName() {
    let setMiliSec = 1000;
    let i = 5
    while (i > 0) {
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-import-centre/div[1]/div/div/div[2]/div/app-state/div/div/div[1]/div/div[1]/div/table/tbody/tr[1]/td[2]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      i--;
    }
  }

  saveStateName() {
    let setMiliSec = 1000;
    element(by.xpath('//*[@id="submitBtn"]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }

  addCityName() {
    let setMiliSec = 1000;
    let i = 5;
    while (i > 0) {
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-import-centre/div[1]/div/div/div[2]/div/app-city/div/div/div[1]/div/div[1]/div/table/tbody/tr[1]/td[3]')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
      i--;
    }
  }

  saveCityName() {
    let setMiliSec = 1000;
    element(by.xpath('//*[@id="submitBtn"]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }

  addCentreName() {
    let setMiliSec = 1000;
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-import-centre/div[1]/div/div/div[2]/div/app-centres/div/div/div[1]/div/div/div/table/tbody/tr[1]/td[10]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-import-centre/div[1]/div/div/div[2]/div/app-centres/div/div/div[1]/div/div/div/table/tbody/tr[2]/td[10]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-import-centre/div[1]/div/div/div[2]/div/app-centres/div/div/div[1]/div/div/div/table/tbody/tr[3]/td[10]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }

  saveCentreName() {
    let setMiliSec = 1000;
    element(by.xpath('//*[@id="submitBtn"]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    //Go to the list
    element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

  }

}
