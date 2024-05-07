import { MainPage } from './main.po';
import { browser, logging, by, element, $$} from 'protractor';

describe('workspace:- ixcheck-customer-app main', () => {
  let page: MainPage;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new MainPage();
  });

  it('should display main page', () => {});

  it('navigating to layout list', () => {

    //clicking layout plannig module
    page.getLayoutModuleLink().click();
    browser.sleep(3*setMiliSec);

    //clicking layout setup list link
    page.getLayoutSetupListLink().click();
    browser.sleep(5*setMiliSec);
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
