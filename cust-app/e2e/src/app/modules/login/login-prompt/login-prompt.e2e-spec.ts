import { LoginPage } from './login-prompt.po';
import { browser, logging, by, element } from 'protractor';
import { UserInfo } from '../../../../assets/login/login-details.json';


describe('workspace:- ixcheck-customer-app Login', () => {
  let page: LoginPage;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should display Login page', () => {
    page.navigateTo();
    //expect(page.getTitleText()).toEqual('Login');
  });

  // Getting Suite name and setting global case value
  // browser.getProcessedConfig().then(function (config) {
  //   console.log('suite: ' + config.suite)
  //   if (config.suite == "complete_lifecycle_with_five_user") {
  //     global['caseNo'] = "case1";
  //   }
  //   if (config.suite == "complete_lifecycle_with_fifty_user") {
  //     global['caseNo'] = "case2";
  //   } if (config.suite == "complete_lifecycle_via_register_planning") {
  //     global['caseNo'] = "case3";
  //   }
  // });

  it('Login form should be valid', () => {
    page.getUsernameTextbox().sendKeys(UserInfo.UserName);
    page.getPasswordTextbox().sendKeys(UserInfo.TestPassword);
    let form = page.getLoginForm().getAttribute('class');
    expect(form).toContain('ng-valid');
    browser.sleep(5 * setMiliSec);
  });

  it('Login form should be invalid', () => {
    //browser.clearMockModules();
    page.getUsernameTextbox().clear();
    page.getPasswordTextbox().clear();
    page.getUsernameTextbox().sendKeys('');
    page.getPasswordTextbox().sendKeys('');
    let form = page.getLoginForm().getAttribute('class');
    expect(form).toContain('ng-valid');
    browser.sleep(5 * setMiliSec);
  });

  //    it('when user trying to login with wrong credentials he should stay on “login” page and see error notification', () => {
  //     page.getUsernameTextbox().clear();
  //     page.getPasswordTextbox().clear();
  //     page.getUsernameTextbox().sendKeys(UserInfo.TestUser);
  //     page.getPasswordTextbox().sendKeys(UserInfo.TestPassword);
  //     page.getSubmitButton().click();
  //     browser.sleep(5*setMiliSec);
  //     expect(page.getErrorMessage()).toEqual('Username or password is incorrect');
  //   });

  it('Should set token value to local storage and navigate to main', () => {
    page.getUsernameTextbox().clear();
    page.getPasswordTextbox().clear();
    page.getUsernameTextbox().sendKeys(UserInfo.UserName);
    page.getPasswordTextbox().sendKeys(UserInfo.Password);
    page.getSubmitButton().click();
    browser.sleep(5 * setMiliSec);

    //let valLocalStorage = browser.executeScript("return window.localStorage.getItem('accessToken');");
    //expect(valLocalStorage).toEqual('raj-test-001');
    // return browser.get('/main'); expectelement(by.css('.heading-block')).getText()).toEqual('FEATURE 5');

  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
