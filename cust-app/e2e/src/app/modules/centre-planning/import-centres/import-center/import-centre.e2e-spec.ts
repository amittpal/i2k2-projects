import { RegistrationsList } from './import-centre.po';
import { browser, logging, by, element } from 'protractor';
import { HttpClient } from '@angular/common/http';

describe('workspace:- ixcheck-customer-app exam setup list', () => {
  let page: RegistrationsList;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new RegistrationsList();
  });

  /**************** STATE TAB ***********************************************/
  it('should fill data in import code and import name', () => {
    page.fillIntialData();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should add state name', () => {
    page.addStateName();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should save state name', () => {
    page.saveStateName();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });
  /****************  END ***********************************************/

  /**************** CITY TAB ***********************************************/

  it('should add city name', () => {
    page.addCityName();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should save city name', () => {
    page.saveCityName();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });
  /****************  END ***********************************************/

  /**************** CENTRE TAB ***********************************************/

  it('should add centre name', () => {
    page.addCentreName();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should submit centre name', () => {
    page.saveCentreName();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });



  /****************  END ***********************************************/

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
