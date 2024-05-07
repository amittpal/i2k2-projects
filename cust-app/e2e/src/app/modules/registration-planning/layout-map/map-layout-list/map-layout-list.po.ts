import { browser, by, element } from "protractor";

export class PlanExamsList {
  navigateTo() {
    return browser.get("/exam/planning");
  }

  getFilterToggleButton() {
    return element(by.css(".filter-block"));
  }

  getLayout(layoutCode: any) {
    return element(by.xpath('//*[@id="exam_code"]')).sendKeys(layoutCode);
  }

  refreshExamListButton() {
    element(by.xpath('//*[@id="submitBtn"]')).click();
    browser.sleep(2000);
    browser.waitForAngular();
  }
}
