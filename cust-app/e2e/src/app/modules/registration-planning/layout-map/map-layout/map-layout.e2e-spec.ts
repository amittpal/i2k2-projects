import { MapLayout } from './map-layout.po';
import { browser, logging, by, element } from 'protractor';

describe('workspace:- map-layout', () => {
  let page: MapLayout;
  let setMiliSec = 1000;

  beforeEach(() => {
    page = new MapLayout();
  });


  it('should display layout', () => {
    browser.sleep(1 * setMiliSec);
  });

    it('should select first layout', () => {
      page.selectLayout();
      browser.sleep(1 * setMiliSec);
      browser.waitForAngular();
    })

    it('should filter layout code from seasonStorage', () => {
      page.filterLayoutCode();
      browser.sleep(1 * setMiliSec);
      browser.waitForAngular();
    })

    it('should select layout code', () => {
      page.selectLayoutCode();
      browser.sleep(1 * setMiliSec);
      browser.waitForAngular();
    })

  it("should scroll to the bottom", () => {
    page.scrollToTheBottom();
    browser.sleep(2 * setMiliSec);
    browser.waitForAngular();
  });


  it('should click save button', () => {
    page.saveLayout();
    browser.sleep(1 * setMiliSec);
    browser.waitForAngular();
  })


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
