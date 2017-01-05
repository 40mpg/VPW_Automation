


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


    it('send an IM', function() {

        element(by.id('directory-search')).clear();
        element(by.id('directory-search')).sendKeys(browser.params.sendIMTo);

        var liElements = element.all(by.id('dirRow'));
        var cardContainer= liElements.get(0).element(by.className('card-container'));
        var card=cardContainer.element(by.className('directory-wrapper'));

        browser.actions().mouseMove(card).perform();

        var chatBtn=card.element(by.id('chatButton'));
        chatBtn.click();

        var chatPanel = element(by.className('right-navigation')).element(by.id('chat-input-panel'));
        var newChatMessage = chatPanel.element(by.id('chat-input-control'));
        newChatMessage.sendKeys(browser.params.textIM);

        var sendButton = chatPanel.element(by.id('chat-send-button'));
        sendButton.click();

        expect(newChatMessage.getText()).toEqual("");
        console.log(testNo + ". Send an IM");
        testNo++;

    });


    it('start multiparty chat', function() {

        var chatPanel = element(by.className('right-navigation')).element(by.id('chat-input-panel'));
        var newChatMessage = chatPanel.element(by.id('chat-input-control'));
        var addPerson = chatPanel.element(by.id('chat-add-person'));
        addPerson.click();

        browser.sleep(1000);

        var directive =  element(by.className('right-navigation')).element(by.id('addPersonArea')).element(by.id('directoryList'));

        var searchBox = directive.element(by.id('target-search'));
        searchBox.sendKeys(browser.params.addToIM);



        var length;
        var children =  directive.element(by.id('target-list')).$$('li');
        children.count().then(function(realCount) {
            length = realCount;

            expect(children.count()).toEqual(length);
            children.get(1).click();

            var connectMultiParty =  element(by.className('right-navigation')).element(by.id('directoryConnect'));
            connectMultiParty.click();

            browser.sleep(1000);
            var startMultipParty = element(by.className('right-navigation')).element(by.id('multiPartyThreadButton'));
            startMultipParty.isDisplayed().then(function(isVisible) {
                startMultipParty.click();

                expect(newChatMessage.getText()).toEqual("");
                console.log(testNo + ". Start multiparty chat.");
                testNo++;
            });
        });

    });


     it('dialing using Dialpad', function(){

         browser.driver.findElement(by.className('directory-dialpad-button')).click();






     });


    it('start video call', function() {






    });


    it('add user to group', function() {






    });


    it('add user to favourite', function() {






    });








});





