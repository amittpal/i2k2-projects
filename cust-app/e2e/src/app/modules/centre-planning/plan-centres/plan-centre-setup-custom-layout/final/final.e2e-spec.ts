import { Final } from "./final.po";
import { browser, logging, by, element } from "protractor";
import { ManagePlanCentresFinalTab } from '../../../../../../assets/centre-planning/plan-centres.json';


describe("workspace:- ixcheck-customer-app exam manage setup", () => {
  let page: Final;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Final();
  });

  //* *************** final-Review ***************************** */
  it("should activate final tab", () => {
    //activating next tab
    element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-centre-main/div/div/div/div[1]/tabset/ul/li[7]/a"
      )
    ).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it("should select city priotiy", () => {
    //activating next tab
    element(by.xpath('//*[@id="finalViewForm"]/div/div/div/div[2]/select'))
      .element(by.cssContainingText("option",ManagePlanCentresFinalTab.CityPriority))
      .click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it("should scroll to the bottom", () => {
    //activating next tab
    let loc = element(by.xpath('//*[@id="scrolldown"]'));
    browser.actions().mouseMove(loc).perform();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it("should select finalize button", () => {
    //activating next tab
    element(by.xpath('//*[@id="submitBtn"]')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
    element(
      by.xpath(
        "/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button"
      )
    ).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });

  //#endregion

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
