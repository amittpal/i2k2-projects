import { browser, by, element } from "protractor";
var dragAndDrop = require('html-dnd').code;

let setMiliSec = 1000;
export class LayoutList {
  // navigateTo() {
  //   return browser.get("/exam/planning");
  // }

  fillLayoutDetails(layoutName: any) {
    // Add Layout Code
    element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/form/div/div[1]/input"
      )
    ).clear();
    element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/form/div/div[1]/input"
      )
    ).sendKeys(layoutName);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
    // Add Layout Name
    element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/form/div/div[2]/input"
      )
    ).clear();
    element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/form/div/div[2]/input"
      )
    ).sendKeys(layoutName);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
    // Add Type
    element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/form/div/div[3]/select"
      )
    )
      .element(by.cssContainingText("option", "Recruitment"))
      .click();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
    // Add Section Group Name
    element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/form/div/div[4]/input"
      )
    ).clear();
    element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/form/div/div[4]/input"
      )
    ).sendKeys(layoutName);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  }

  saveLayoutDetails() {
    element(by.xpath('//*[@id="submitBtn"]')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }

  addNewSection(name: any) {
    // Click on Add New Section button
    element(by.xpath("/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/div/div/div/div/div[1]/input")).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    // Add Name
    element(by.xpath("/html/body/modal-container/div/div/div[2]/form/div[1]/input")).sendKeys(name);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    // Save section
    element(by.xpath("/html/body/modal-container/div/div/div[2]/form/div[2]/input")).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }

  addDragDropDetails() {


    var destination = element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/div/div/div/div/div[2]/gridster'));

    // Add Title
    var priotC = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[31]'));
    browser.executeScript(dragAndDrop, priotC, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Name
    var name = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[7]'));
    browser.executeScript(dragAndDrop, name, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add father Name
    var fatherName = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[8]'));
    browser.executeScript(dragAndDrop, fatherName, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add DOB
    var dob = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[5]'));
    browser.executeScript(dragAndDrop, dob, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Gender
    var gender = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[21]'));
    browser.executeScript(dragAndDrop, gender, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Category
    var category = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[20]'));
    browser.executeScript(dragAndDrop, category, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Physical Disability
    var phyDis = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[15]'));
    browser.executeScript(dragAndDrop, phyDis, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);
  }

  addcontactInfo() {
    var destination = element(by.xpath("/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[2]/div/div/div/div/div[3]/gridster"));

    // Add Email
    var email = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[6]'));

    browser.executeScript(dragAndDrop, email, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Mobile Number
    var mobileNumber = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[11]'));
    browser.executeScript(dragAndDrop, mobileNumber, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add address
    var address = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[1]'));
    browser.executeScript(dragAndDrop, address, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Priority 1
    var priotA = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[17]'));
    browser.executeScript(dragAndDrop, priotA, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Priority 2
    var priotB = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[18]'));
    browser.executeScript(dragAndDrop, priotB, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Priority 3
    var priotC = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[19]'));
    browser.executeScript(dragAndDrop, priotC, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Photo upload
    var priotC = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[39]'));
    browser.executeScript(dragAndDrop, priotC, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Signature Upload
    var priotC = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[40]'));
    browser.executeScript(dragAndDrop, priotC, destination);
    browser.waitForAngular();
    browser.sleep(5 * setMiliSec);

    // Add Submit
    var submit = element(by.xpath('//*[@id="filterDiv"]/div/div[2]/div/div[2]/div[27]'));
    browser.executeScript(dragAndDrop, submit, destination);
    browser.waitForAngular();
    browser.sleep(3 * setMiliSec);

    //Submit form
    element(by.xpath("/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[3]/input")).click();
    browser.waitForAngular();
    browser.sleep(2 * setMiliSec);

    //Go to the list
    element(by.xpath("/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button")).click();
    browser.waitForAngular();
    browser.sleep(2 * setMiliSec);
  }

  scrollToTheBottom() {
    let loc = element(
      by.xpath(
        "/html/body/app-root/app-primary-layout/div/app-layout-add/div/div/div/div[3]/input"
      )
    );
    browser.actions().mouseMove(loc).perform();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }
}
