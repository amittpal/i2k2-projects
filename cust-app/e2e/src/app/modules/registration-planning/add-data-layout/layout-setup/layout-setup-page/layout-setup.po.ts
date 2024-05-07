import { browser, by, element } from 'protractor';
var path = require('path');
let setMiliSec = 1000;

export class Layout {


  fillGeneralInformation(userInfo: any) {
    let title;
    if (userInfo.gender == 'Male') {
      title = "Mr.";
    } else {
      title = "Ms.";
    }
    //Title
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[2]/lib-ngx-ixcheck-title/div/select')).element(by.cssContainingText('option', title)).click();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    //Input Name
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[3]/ngx-ixcheck-firstname/div/input')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[3]/ngx-ixcheck-firstname/div/input')).sendKeys(userInfo.name);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    // Fill Father Name
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[4]/ngx-ixcheck-fathername/div/input')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[4]/ngx-ixcheck-fathername/div/input')).sendKeys(userInfo.fatherName);
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    // Fill DOB
    let changeDateFormatArr = userInfo.dob.split('/');
    let changeDateFormat = changeDateFormatArr[2] + "-" + changeDateFormatArr[1] + "-" + changeDateFormatArr[0];
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[5]/ngx-ixcheck-dateofbirth/div/input')).sendKeys(new Date(changeDateFormat).toLocaleDateString('en-US',{month: '2-digit',day: '2-digit',year: 'numeric'}));
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    // Fill Gender
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[6]/ngx-ixcheck-gender/div/select')).element(by.cssContainingText('option', userInfo.gender)).click();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    // Fill Category
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[7]/ngx-ixcheck-category/div/select')).element(by.cssContainingText('option', userInfo.category)).click();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    // Fill Physical Disability
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[8]/ngx-ixcheck-physical-disability/div/select')).element(by.cssContainingText('option', userInfo.phyDis)).click();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();


  }

  scrollToTheBottom() {
    let loc = element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[10]/ngx-ixcheck-submitbutton/div/input'));
    browser.actions().mouseMove(loc).perform();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }

  submitForm() {

    //Submit
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[10]/ngx-ixcheck-submitbutton/div/input')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    //Close Modal
    element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[1]/button')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

  }

  goToNextPage() {
    //Submit
    //element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[8]/ngx-ixcheck-submitbutton/div/input')).click();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[10]/ngx-ixcheck-submitbutton/div/input')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    // Go to List
    element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }

  InputContactInfo(userInfo: any, index: any) {
    //  Input Email
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[2]/ngx-ixcheck-email/div/input')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[2]/ngx-ixcheck-email/div/input')).sendKeys(userInfo.email);
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();


    //Input Mobile Number
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[3]/ngx-ixcheck-mobilenumber/div/input')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[3]/ngx-ixcheck-mobilenumber/div/input')).sendKeys(userInfo.mob);
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    //  Input Address
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[4]/ngx-ixcheck-address/div/textarea')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[4]/ngx-ixcheck-address/div/textarea')).sendKeys(userInfo.add);
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    //Input City Priority 1
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[5]/ngx-ixcheck-city-priority1/div/select')).element(by.cssContainingText('option', userInfo.cityA)).click();
    browser.waitForAngular();
    browser.sleep(2 * setMiliSec);

    //Input City Priority 2
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[6]/ngx-ixcheck-city-priority2/div/select')).element(by.cssContainingText('option', userInfo.cityB)).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    //Input City Priority 3
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[7]/ngx-ixcheck-city-priority3/div/select')).element(by.cssContainingText('option', userInfo.cityC)).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    //Reset Photo
    if (index > 0) {
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[8]/lib-ngx-ixcheck-photouploader/div/div[4]/div[3]/a')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();

      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[9]/lib-ngx-ixcheck-signature-uploader/div/div[4]/div[3]/a')).click();
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();

    }

    var fileToUpload = 'image/sample-photo.jpg',
      absolutePath = path.resolve(__dirname, fileToUpload);

    //Photo Upload
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[8]/lib-ngx-ixcheck-photouploader/div/div[1]/input')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[8]/lib-ngx-ixcheck-photouploader/div/div[1]/input')).sendKeys(absolutePath);
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[8]/lib-ngx-ixcheck-photouploader/div/div[1]/div/input')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    //Signature upload
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[9]/lib-ngx-ixcheck-signature-uploader/div/div[1]/input')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[9]/lib-ngx-ixcheck-signature-uploader/div/div[1]/input')).sendKeys(absolutePath);
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[9]/lib-ngx-ixcheck-signature-uploader/div/div[1]/div/input')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

  }

}
