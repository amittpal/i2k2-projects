import { MapCentres } from './map-centres.po';
import { browser, logging, by, element } from 'protractor';
import { MapCentresSetup } from '../../../../../../assets/centre-planning/centre-mapping.json';

describe('workspace:- centre-mapping-setup', () => {
  let page: MapCentres;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new MapCentres();
  });


  it('should display Map-Centres tab', () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  //#region

  // *************** Map-Centres filter Tab ***************************/
  // it('should open filter tab', () => {
  //   element(by.xpath('/html/body/app-root/app-primary-layout/div/app-map-centres/div/div/form/div/div[1]/div/div[3]/div[2]')).click();
  //   browser.sleep(3 * setMiliSec);
  //   browser.waitForAngular();
  // });

  it('fill map centers form with values', () => {
    element(by.xpath('//*[@id="btnSubmit"]')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('fill map centers form', () => {
    var layoutCode = "";

    layoutCode = MapCentresSetup.LayoutCodeA;

    // if (global['caseNo'] == "case3") {
    //   layoutCode = MapCentresSetup.LayoutCodeB;
    // }

    element(by.xpath('//*[@id="importedCentreCode"]')).element(by.cssContainingText('option', layoutCode)).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should scroll to the bottom', () => {
    let loc = element(by.xpath('//*[@id="submitBtn"]'));
    browser.actions().mouseMove(loc).perform();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should submit the form', () => {
    element(by.xpath('//*[@id="submitBtn"]')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('should go to the list', () => {
    element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });


  //#endregion
  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

