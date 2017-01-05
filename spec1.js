/**
 * Created by adoan on 11/4/2016.
 */


describe('VW Automated Testing', function() {

    var testNo = 1;

    it('launch VW window', function () {

        if (browser.params.debugMode == 'false') {

            var url = browser.params.vAppCenterbaseURL;

            browser.driver.ignoreSynchronization = true;

            var findById = function (name) {
                return browser.driver.findElement(by.id(name));
            };
            var findBylinkText = function (name) {
                return browser.driver.findElement(by.linkText(name));
            };

            browser.driver.get(url);

            findById('login-email').clear();
            findById('login-email').sendKeys(browser.params.vAppCenteEmail);

            findById('login-password').clear();
            findById('login-password').sendKeys(browser.params.vAppCentePassword);

            findById('login-button').click();

            var chooseApps = browser.driver.findElement(by.id('apps-list'));

            browser.driver.wait(function () {
                return chooseApps.isDisplayed().then(function (isVisible) {
                    if (isVisible) {
                        var vwLaunch = browser.driver.findElement(by.id(browser.params.vwLaunchLinkID));
                        vwLaunch.click();

                        browser.sleep(10000);

                        browser.getAllWindowHandles().then(function (handles) {
                            if (handles.length >= 2) {
                                browser.switchTo().window(handles[1]);
                                var link = browser.getCurrentUrl();
                                expect((link == browser.params.vAppCentervwLandingURL) || (link == browser.params.vAppCentervwDirectoryURL));
                                console.log("." + testNo + ". launch VW window");
                                testNo++;
                            }
                        });

                        return true;
                    }
                });
            });
        }//debug mode is false

    });



    it('load directory view', function() {

        var dirList;
        browser.wait(function () {

            return element(by.id('directory-no-results')).evaluate('directoryList').then(function (value) {

                dirList = value;
                if(value.length>0)
                    return true;

            });
        }).thenFinally(function() {
            // this will always be executed - put expectation here.
            console.log(testNo + ". directory view loaded with entries:  " + dirList.length);
            testNo++;
            expect(dirList.length).toBeGreaterThan(0);
        });

    });


    it('load company user view', function(){

        browser.driver.findElement(by.className('flat-selector')).click();
        browser.pause();




    });

    it('load groups', function(){

      




    });


     it('dialing using Dialpad', function(){

         browser.driver.findElement(by.className('directory-dialpad-button')).click();






     });








});





