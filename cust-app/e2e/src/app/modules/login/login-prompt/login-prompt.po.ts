import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login');///browser.get(browser.baseUrl) as Promise<any>;
  }

  // getTitleText() {
  //   return element(by.css('app-root app-login-layout app-login-prompt div h1')).getText();
  //   //return element(by.css('app-root h1')).getText() as Promise<string>;
  // }
/******************************* Login *************************/
  getLoginForm(){
   return element(by.tagName('form'));
  }
  getErrorMessage() {
    return element(by.css('.text-danger')).getText();
  }
  getUsernameTextbox() {
    return element(by.name('username'));
  }

   getPasswordTextbox() {
    return element(by.name('password'));
  }

   getSubmitButton() {
    return element(by.tagName('button'));
  }
/****************************************** Main Page *******************************/
  
}
