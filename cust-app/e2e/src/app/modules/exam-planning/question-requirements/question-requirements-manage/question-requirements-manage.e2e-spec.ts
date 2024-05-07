import { browser, logging, by, element } from 'protractor';
import { ManageQuitionRequirements } from './question-requirements-manage.po';

describe('workspace:- ixcheck-customer-app exam setup list', () => {
    let page: ManageQuitionRequirements;
    let setMiliSec = 1000;

    beforeEach(() => {
        page = new ManageQuitionRequirements();
    });


    it('should be finalize manage quition requirements ', () => {
        page.getFinalizeButton().click();
        browser.sleep(5 * setMiliSec);
        browser.waitForAngular();
    });
    it('navigate to quition requirements list', () => {
        page.getGotoListButton().click();
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
