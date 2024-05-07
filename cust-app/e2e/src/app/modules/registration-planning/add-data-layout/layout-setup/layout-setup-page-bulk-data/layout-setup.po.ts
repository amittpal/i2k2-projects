import { browser, by, element } from 'protractor';
let setMiliSec = 1000;

export class Layout {


  fillGeneralInformation(userInfo:any)
  {
    //Input First Name
    let name=userInfo.Name.split(" ")
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[2]/ngx-ixcheck-firstname/div/input')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[2]/ngx-ixcheck-firstname/div/input')).sendKeys(name[0]);
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    name.splice(0, 1);// Getting middle name and last name
     // Fill Last Name
     element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[3]/ngx-ixcheck-lastname/div/input')).clear();
     element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[3]/ngx-ixcheck-lastname/div/input')).sendKeys(name.join(' '));
     browser.sleep(2 * setMiliSec);
     browser.waitForAngular();

    // Fill Father Name
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[4]/ngx-ixcheck-fathername/div/input')).clear();
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[4]/ngx-ixcheck-fathername/div/input')).sendKeys(userInfo["Father Name"]);
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

        // Fill DOB
        element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[5]/ngx-ixcheck-dateofbirth/div/input')).sendKeys(userInfo.DOB);
        browser.sleep(2 * setMiliSec);
        browser.waitForAngular();

         // Fill Gender
         element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[6]/ngx-ixcheck-gender/div/select')).element(by.cssContainingText('option', userInfo.gender)).click();
         browser.sleep(2 * setMiliSec);
         browser.waitForAngular();

         // Fill Category
         element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[7]/ngx-ixcheck-category/div/select')).element(by.cssContainingText('option', userInfo.Category)).click();
         browser.sleep(2 * setMiliSec);
         browser.waitForAngular();

          // Fill Religion
          element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[8]/lib-ngx-ixcheck-religion/div/select')).element(by.cssContainingText('option', userInfo.Religion)).click();
          browser.sleep(2 * setMiliSec);
          browser.waitForAngular();

          // Fill Nationality
          element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[9]/ngx-ixcheck-nationality/div/select')).element(by.cssContainingText('option', userInfo.Nationality)).click();
          browser.sleep(2 * setMiliSec);
          browser.waitForAngular();

          //  // Reset Post
          //  element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[10]/ngx-ixcheck-post/div/select')).element(by.cssContainingText('option', "Select")).click();
          //  element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[10]/ngx-ixcheck-post/div/select')).element(by.cssContainingText('option', "Select")).click();
          //  browser.sleep(1 * setMiliSec);
           //Fill Post
           let post=userInfo['Post Name'].split(",");
           for(let postValue of post){
            element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[10]/ngx-ixcheck-post/div/select')).element(by.cssContainingText('option', postValue)).click();
         }
         browser.sleep(2 * setMiliSec);
         browser.waitForAngular();

          // Fill Qualification
          element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[1]/div[11]/ngx-ixcheck-qualification/div/select')).element(by.cssContainingText('option', userInfo.Qualification)).click();
          browser.sleep(2 * setMiliSec);
          browser.waitForAngular();



  }

  scrollToTheBottom(){
    let loc = element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[12]/ngx-ixcheck-submitbutton/div/input'));
    browser.actions().mouseMove(loc).perform();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  }

  submitForm(){

    //Submit
    element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[12]/ngx-ixcheck-submitbutton/div/input')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

    //Close Modal
    element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[1]/button')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();

  }

  goToNextPage(){
     //Submit
     element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[12]/ngx-ixcheck-submitbutton/div/input')).click();
     browser.sleep(2 * setMiliSec);
     browser.waitForAngular();

    // Go to List
    element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  }

  fillAdditionalDetails(userInfo:any)
  {

    //  Input Email
     element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[2]/ngx-ixcheck-email/div/input')).clear();
     element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[2]/ngx-ixcheck-email/div/input')).sendKeys(userInfo.EMAIL);
     browser.sleep(2 * setMiliSec);
     browser.waitForAngular();


      //Input Mobile Number
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[3]/ngx-ixcheck-mobilenumber/div/input')).clear();
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[3]/ngx-ixcheck-mobilenumber/div/input')).sendKeys(userInfo['Mob No']);
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();

    // Fill Physical Disability
     element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[4]/ngx-ixcheck-physical-disability/div/select')).element(by.cssContainingText('option', userInfo.PH)).click();
     browser.sleep(2 * setMiliSec);
     browser.waitForAngular();

      //  Input Address 1
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[5]/ngx-ixcheck-addressline1/div/input')).clear();
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[5]/ngx-ixcheck-addressline1/div/input')).sendKeys(userInfo['Address 1']);
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();

      //  Input Address 2
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[6]/ngx-ixcheck-addressline2/div/input')).clear();
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[6]/ngx-ixcheck-addressline2/div/input')).sendKeys(userInfo['Address 2']);
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();

      //  Input Address 3
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[7]/lib-ngx-ixcheck-addressline3/div/input')).clear();
      element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[7]/lib-ngx-ixcheck-addressline3/div/input')).sendKeys(userInfo['Address 3']);
      browser.sleep(2 * setMiliSec);
      browser.waitForAngular();

       //Input Pincode
       element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[8]/ngx-ixcheck-pincode/div/input')).clear();
       element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[8]/ngx-ixcheck-pincode/div/input')).sendKeys(userInfo.Pincode);
       browser.waitForAngular();
       browser.sleep(2 * setMiliSec);

       //Input City Priority 1
       element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[9]/ngx-ixcheck-city-priority1/div/select')).element(by.cssContainingText('option', userInfo['City Priority 1'])).click();
       browser.waitForAngular();
       browser.sleep(2 * setMiliSec);

        //Input City Priority 2
        element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[10]/ngx-ixcheck-city-priority2/div/select')).element(by.cssContainingText('option', userInfo['City Priority 2'])).click();
        browser.sleep(2 * setMiliSec);
        browser.waitForAngular();

         //Input City Priority 3
       element(by.xpath('/html/body/app-root/app-primary-layout/div/app-layout-preview/div/div/div/div[2]/div[2]/form/div/div/div/div/div[2]/div[11]/ngx-ixcheck-city-priority3/div/select')).element(by.cssContainingText('option', userInfo['City Priority 3'])).click();
       browser.sleep(2 * setMiliSec);
       browser.waitForAngular();


  }

}
