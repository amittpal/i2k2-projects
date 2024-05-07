import { Layout } from "./layout-setup.po";
import { browser, logging, by, element } from "protractor";
import { contactData } from "../../../../../../assets/layout-data-bulk-data.json";

describe("workspace:- ixcheck-customer-app exam manage setup", () => {
  let page: Layout;
  let setMiliSec = 1000;
  let data = contactData;
  beforeEach(() => {
    page = new Layout();
  });

  it("should display layout preview tab", () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  //#region
  data.forEach((userInfo, i) => {
    // *************** Layout Tab ***************************/
    it("fill layout preview general details", () => {
      page.fillGeneralInformation(userInfo);
      browser.sleep(1 * setMiliSec);
      browser.waitForAngular();
    });

    it("should scroll to the bottom", () => {
      page.scrollToTheBottom();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();
    });

    it("fill layout additional details", () => {
      page.fillAdditionalDetails(userInfo);
      browser.sleep(1 * setMiliSec);
      browser.waitForAngular();
    });



    if (data.length - 1 === i) {
      it("go to next page", () => {
        page.goToNextPage();
        browser.sleep(3 * setMiliSec);
        browser.waitForAngular();
      });
    } else {
      it("submit layout form", () => {
        page.submitForm();
        browser.sleep(3 * setMiliSec);
        browser.waitForAngular();
      });
    }
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
