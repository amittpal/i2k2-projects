import { Exam } from './exam.po';
import { browser, logging, by, element } from 'protractor';
import { ManageExamValues, ManageExamSectionValues } from '../../../../../../assets/exam-planning/setup-exam-planning.json';

function getUniqueExamName() {
  return "e2e-test-exam-" + new Date().toLocaleString('en-US')
}

describe('workspace:- ixcheck-customer-app exam manage setup', () => {
  let page: Exam;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new Exam();
  });


  it('should display exam tab', () => {
    // browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  //#region

  //*************** Exam Tab ***************************/
  it('fill exam form with values', () => {
    var uniqueName = getUniqueExamName();
    browser.executeScript('window.sessionStorage.setItem("exam", arguments[0])', uniqueName);
    element(by.name('exam_code')).sendKeys(uniqueName);
    element(by.name('name')).sendKeys(uniqueName);
    element(by.name('description')).sendKeys(uniqueName);
    element(by.id('exam_type')).element(by.cssContainingText('option', ManageExamValues.ExamType)).click();
    element(by.name('shifts')).sendKeys(ManageExamValues.NumberOfUniqueShifts);
    element(by.name('duration')).sendKeys(ManageExamValues.Duration);
    element(by.id('duration_uom')).element(by.cssContainingText('option', ManageExamValues.DurationType)).click();
    element(by.name('sections')).sendKeys(ManageExamValues.NumberOfSection);
    element(by.id('negative_mark')).element(by.cssContainingText('option', ManageExamValues.NegativeMarking)).click();
    element(by.id('languages')).element(by.cssContainingText('option', ManageExamValues.Languages)).click();
    element(by.id('Primang_lg')).element(by.cssContainingText('option', ManageExamValues.PrimaryLanguage)).click();
    element(by.id('dual_show_primary')).element(by.cssContainingText('option', ManageExamValues.DualShowPrimary)).click();
    element(by.id('subjects')).element(by.cssContainingText('option', ManageExamValues.Subjects)).click();
    element(by.id('grade')).element(by.cssContainingText('option', ManageExamValues.ExamGrade)).click();
    element(by.id('priority')).element(by.cssContainingText('option', ManageExamValues.NumberOfCityPriority)).click();

    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

    ////check if form is valid
    let form = element(by.id('addExamForm')).getAttribute('class');
    expect(form).toContain('ng-valid');

    ////clicking submit
    element(by.id('submitBtn')).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    element(by.buttonText('Go to next tab')).click();

    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();

  });

  //#endregion

  //#region
  //*************** Section Tab ***************************/
  it('should activate sections tab', () => {
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('fill section tab form with values', () => {
    element(by.id('section')).element(by.cssContainingText('option', ManageExamSectionValues.Section)).click();
    element(by.name('name')).sendKeys(ManageExamSectionValues.SectionName);
    element(by.id('subjects')).element(by.cssContainingText('option', ManageExamSectionValues.Subject)).click();
    element(by.name('question_count')).sendKeys(ManageExamSectionValues.QuestionCount);
    element(by.id('allow_duration')).element(by.cssContainingText('option', ManageExamSectionValues.AllowDuration)).click();
    element(by.name('duration')).sendKeys(ManageExamSectionValues.Duration);
    element(by.id('duration_uom')).element(by.cssContainingText('option', ManageExamSectionValues.DurationType)).click();
    element(by.id('auto_switch')).element(by.cssContainingText('option', ManageExamSectionValues.AutoSwitchQuestion)).click();

    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();

    //updating first row
    //  element(by.tagName('ngx-ixcheck-table3'))
    // .element(by.tagName('table'))
    // .all(element(by.tagName('tbody'))).first()
    // .element(by.css('.expand-icons')).all(element(by.tagName('span'))).first().click();
  });

  it('should open table first row details', () => {
    element(by.tagName('ngx-ixcheck-table3')).click()
    // element(by.css('.flx-col-2.flx-col-sm-2.expand-icons'))
    // .all(element(by.tagName('span'))).first().click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('check if it opened successfully', () => {
    expect(element(by.tagName('ngx-ixcheck-product-info')).isPresent()).toBeTruthy();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  })

  it('filling data in first row of table & submitting', () => {
    element(by.id('productForm'))
      .element(by.id('subject'))
      .element(by.cssContainingText('option', ' English')).click();

    element(by.id('productForm'))
      .element(by.id('difficulty_level'))
      .element(by.cssContainingText('option', 'Easy')).click();

    element(by.id('productForm'))
      .element(by.name('question')).sendKeys(1);

    element(by.id('productForm'))
      .element(by.buttonText('Update')).click();

    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();
  });

  it('checking if section form is valid & submitting data', () => {
    ////check if form is valid
    let form = element(by.id('addSectionsForm')).getAttribute('class');
    expect(form).toContain('ng-valid');

    ////clicking submit
    element(by.id('submitBtn')).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    element(by.buttonText('OK')).click();
    browser.waitForAngular();
  });
  //#endregion

  //#region

  //****************Question Tab ***************************** */
  it('should activate OPTIONS tab', () => {
    //activating option tab
    element.all(by.css('.nav.nav-tabs li')).get(2).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  it('should update question details', () => {
    //displaying table row details

    // element(by.tagName('ngx-ixcheck-table3')).click()
    element(by.xpath('//*[@id="products-grid"]/tbody/tr/td[2]')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();

    element(by.id('childFrom')).element(by.name('txt_desc')).sendKeys("1");
    element(by.id('childFrom')).element(by.id('duration')).element(by.cssContainingText('option', 'Hour(s)')).click();
    element(by.id('childFrom')).element(by.cssContainingText('option', ' Multiple Choice (4) ')).click();
    element(by.id('childFrom')).element(by.name('marks')).sendKeys(2);
    element(by.id('childFrom')).element(by.name('negative_marks')).sendKeys(1);
    element(by.id('childFrom')).element(by.buttonText('Update')).click();
    browser.sleep(3 * setMiliSec);
    browser.waitForAngular();

  });

  it('should submit QUESTIONS tab form ', () => {
    ////check if form is valid
    let form = element(by.id('addQuestionsForm')).getAttribute('class');
    expect(form).toContain('ng-valid');

    ////clicking submit
    element(by.id('submitBtn')).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
    element(by.buttonText('OK')).click();
    browser.waitForAngular();

  })
  //#endregion

  //****************Final Review Tab ***************************** */
  it('should activate FINAL REVIEW tab & finalize questions', () => {
    //activating final review tab
    element.all(by.css('.nav.nav-tabs li')).get(3).click()
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();

    //clicking submit
    element(by.buttonText('Finalize')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();

    //Go to Main list
    element(by.buttonText('Go to Main list')).click();
    browser.sleep(5 * setMiliSec);
    browser.waitForAngular();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

