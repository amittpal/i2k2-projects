import { browser, by, element } from "protractor";
import { dataCallExisting } from 'src/app/shared/classes/data.class';
import { LayoutListDetail } from '../../../../../assets/registration-planning/create-layout/layout-list.json';

let setMiliSec = 1000;
export class MapLayout {
  navigateTo() {
    return browser.get("/exam/planning");
  }

  selectLayout() {
    //Select Layout
    // element(by.xpath('//*[@id="exam-list"]/table/tbody[5]/tr/td[11]/div/div[2]/a')).click();
    element(by.xpath('//*[@id="exam-list"]/table/tbody[1]/tr/td[11]/div/div[2]/a')).click(); // Select First
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }


  getName() {
    let data = new Promise((resolve, reject) => {
      let res = browser.executeScript("return window.sessionStorage.getItem('exam');")
      resolve(res);
    });
    return data;
  }

  async filterLayoutCode() {
    //OpenFilterTab
    var layoutName: any;
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-mapping-add/div/div/div/div[1]/div/div[3]/div[2]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
    if (LayoutListDetail.layoutName) {
      layoutName = LayoutListDetail.layoutName;
    } else {
      layoutName = await this.getName();
    }
    // if (global['caseNo'] == "case2" || global['caseNo'] == "case1") {
    //   layoutName = await this.getName();
    // }
    // if (global['caseNo'] == "case3") {
    //   layoutName = LayoutListDetail.layoutName;
    // }
    // layoutName="e2e-test-exam-5/12/2020, 8:49:16 PM";
    element(by.xpath('//*[@id="layout_code"]')).sendKeys(layoutName); // filter layout
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    element(by.xpath('//*[@id="btnSubmit"]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

  }

  scrollToTheBottom() {
    let loc = element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-mapping-add/div/div/div/div[3]/input"
      )
    );
    browser.actions().mouseMove(loc).perform();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  }

  async selectLayoutCode() {
    var layoutName: any;
    if (LayoutListDetail.layoutName) {
      layoutName = LayoutListDetail.layoutName;
    } else {
      layoutName = await this.getName();
    }
    // if (global['caseNo'] == "case2" || global['caseNo'] == "case1") {
    //   layoutName = await this.getName();
    // }
    // if (global['caseNo'] == "case3") {
    //   layoutName = LayoutListDetail.layoutName;
    // }
    // layoutName="e2e-test-exam-5/12/2020, 8:49:16 PM";
    element(by.xpath("/html/body/app-root/app-primary-layout/div/app-layout-mapping-add/div/div/div/div[2]/div[1]/div[2]/div/div[1]/select")).sendKeys(layoutName); /********* Enter layout code */
    browser.sleep(4 * setMiliSec);
    browser.waitForAngular();
  }

  saveLayout() {
    // Click on save button
    element(by.xpath("/html/body/app-root/app-primary-layout/div/app-layout-mapping-add/div/div/div/div[3]/input")).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    //Go to the List
    element(
      by.xpath(
        "/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button"
      )
    ).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  }
}
