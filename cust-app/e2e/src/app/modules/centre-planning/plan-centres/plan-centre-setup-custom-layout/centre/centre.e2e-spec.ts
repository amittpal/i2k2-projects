import { Centre } from './centre.po';
import { browser, logging, by, element } from 'protractor';
import { ManagePlanCentresExam } from '../../../../../../assets/centre-planning/plan-centres.json';


describe('workspace:- ixcheck-customer-app exam manage setup', () => {
  let page: Centre;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Centre();
  });


  it('should display exam tab', () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  //#region

  // *************** Exam Tab ***************************/
  it('fill exam form with values', () => {
    element(by.id('exam_days')).element(by.cssContainingText('option', ManagePlanCentresExam.ExamDays)).click();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();

    ////check if form is valid
    let form = element(by.id('examDetailForm')).getAttribute('class');
    expect(form).toContain('ng-valid');

    ////clicking submit
    element(by.id('submitBtn')).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    // element(by.buttonText('Go to next tab')).click();
    element(by.xpath('/html/body/modal-container/div/div/ngx-ixcheck-alert/div[3]/button')).click();

    browser.sleep(5 * setMiliSec);
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

