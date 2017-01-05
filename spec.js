describe('VW Automated Testing', function() {

    var testNo = 1;

    it('launch VW window', function() {

        if(browser.params.debugMode=='false') {

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



    it('launch VW window from Debug', function() {

        if(browser.params.debugMode=='true') {

            var url = browser.params.baseURL;

            browser.driver.ignoreSynchronization = true;

            var findByName = function (name) {
                return browser.driver.findElement(by.name(name));
            };
            var findById = function (name) {
                return browser.driver.findElement(by.id(name));
            };

            browser.driver.get(url);

            findById('debugAuthenticationEndpoint').clear();
            findById('debugAuthenticationEndpoint').sendKeys(browser.params.endpoint);
            findById('debugAuthenticationToken').clear();
            findById('debugAuthenticationToken').sendKeys(browser.params.token);

            findByName('launchVW').click();

            browser.getAllWindowHandles().then(function (handles) {
                if (handles.length >= 2)
                    browser.switchTo().window(handles[1]);
            });

            expect(browser.getCurrentUrl()).toEqual(browser.params.vwLandingURL);
            console.log("." + testNo + ". launch VW window");
            testNo++;

        }//debug mode is true

    });





    it('VW is connected', function() {

        browser.getAllWindowHandles().then(function (handles) {
            if(handles.length>=2)
                browser.switchTo().window(handles[1]);
        });
        browser.ignoreSynchronization = false;

        var  project;
        browser.wait(function() {

            return element(by.id('vwConnectionOnLanding')).evaluate('model.connected').then(function(value) {
                project = value;
                if(value===true) {
                    project=value;
                    return value;
                }
            });

        }).thenFinally(function() {
            // this will always be executed - put expectation here.
            console.log(testNo + ". VW Connected state is:  " + project);
            testNo++;
            expect(project).toBeTruthy();
        });

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


    it('test directory search', function() {


        element(by.id('directory-no-results')).evaluate('directoryList').then(function (value) {

            var originalLen = value.length;

            element(by.id('directory-search')).sendKeys(browser.params.dirSearchText);

            element(by.id('directory-no-results')).evaluate('directoryList').then(function (value) {

                expect(value.length).toBeGreaterThan(browser.params.minDirSearchLen,'Directory search must return atleast ' + browser.params.minDirSearchLen + " match/es.");

                var search = (value.length<originalLen && value.length!=0 )? "success":"failed"
                console.log(testNo + ". directory search: " + search + " .Entries found: " + value.length);
                testNo++;

            });
        });

        element(by.id('directory-search')).clear();

    });





    it('test directory filter', function() {

        var directive = element(by.className('directory-filter'));

        var flatSelectorList = directive.element(by.className('flat-selector-list'));
        directive.click();

        flatSelectorList.element(by.id(browser.params.dirFilterSearchId)).click();

        directive.evaluate('selectedFilterId').then(function (value) {
            console.log(testNo + ". directory filter test");
            testNo++;
            expect(value).toEqual(parseInt(browser.params.dirFilterSearchId));
        });

        directive.click();
        flatSelectorList.element(by.id('0')).click();


    });



    it('test directory selection to show up in right panel', function() {

        var liElements = element.all(by.id('dirRow'));
        var cardContainer= liElements.get(0).element(by.className('card-container'));

        var card=cardContainer.element(by.className('directory-wrapper'));
        card.click();

        var leftPanelFN,leftPanelLN;

        card.evaluate('entity').then(function (value) {
            leftPanelFN= value.FN;
            leftPanelLN= value.LN;
        });


        var rightPanelState;
        element(by.className('right-navigation')).evaluate('detailState.name').then(function (state) {
            rightPanelState=state;
        });

        element(by.className('right-navigation')).element(by.className('detail-main')).evaluate('entity').then(function (value) {
            console.log(testNo + ". directory card click: " + leftPanelFN + " " + leftPanelLN);
            testNo++;
            expect(rightPanelState=='directory' && leftPanelFN==value.FN && leftPanelLN==value.LN  );
        });

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

    it('validate active communications count', function() {

        browser.sleep(1000);

        var activeCount = element(by.className('left-navigation')).element(by.className('activeCount'));
        activeCount.evaluate(' _.keys(communicationList).length').then(function (cnt) {
            expect(cnt).toEqual(2);
            console.log(testNo + ". validate active communications count. " + cnt);
            testNo++;

        });


    });

    it('select active communication', function() {

        browser.sleep(1000);
        var actCommTab=element(by.className('left-navigation')).element(by.id('actCommTab'));

        var actCommunications =  element(by.className('left-navigation')).element(by.className('page-tabs')).element( by.css('div[ui-sref="landing.activity"]'));
        actCommunications.click();

        var liElements = element.all(by.id('acCard'));
        var cardContainer= liElements.get(0).element(by.className('active-communication-row'));
        cardContainer.click();

        var card=cardContainer.element(by.className('communicationName'));

        var leftPanelValue;
        card.evaluate('communication.displayName').then(function (val){
            leftPanelValue=val;
        });

        var rightPanelState;
        element(by.className('right-navigation')).evaluate('detailState.name').then(function (state) {
            rightPanelState=state;
        });

        var rightPanelName;
        element(by.className('right-navigation')).element(by.className('other-parties-wrapper')).element(by.className('otherPartyName')).evaluate('chatConversation.OtherParties').then(function (value) {

            rightPanelName = value[1].FN + " " + value[1].LN + ", "  +  value[0].FN + " " + value[0].LN;
            console.log(testNo + ". Select active communication: " + rightPanelName);
            testNo++;
            expect(rightPanelState=='chat' && leftPanelValue == rightPanelName);

        });

    });



    it('Change personal status', function() {

        browser.sleep(1000);

        element(by.id('currentUserInfo')).element(by.className('currentUserAvatar')).click();
        var directive = element(by.className('quick-settings-status-list'));
        directive.element(by.id('statusList')).click();

        var divList=element.all(by.id('psList'));
        var statusInit = divList.get(0).element(by.className('status-list-item-name'));
        statusInit.click(); //initialize to Available


        directive.element(by.id('statusList')).click();


        //change status
        var changedStatus = divList.get(browser.params.personalStatusIndex).element(by.className('status-list-item-name'));
        changedStatus.click();

        browser.sleep(1000);

        var changedToStatus;
        changedStatus.evaluate('status.Name | translatePS').then(function(val){
            changedToStatus=val;

            browser.sleep(1000);

            var headerStatus;
            var avatarDirective = element(by.id('currentUserInfo')).element(by.className('currentUserAvatar'));
            avatarDirective.element(by.id('avatarElement')).evaluate('entity').then(function(val) {
                headerStatus =  val.PS ;

                console.log(testNo + ". Change personal status to: " + changedToStatus);
                var compareStatus = "*" + changedToStatus;
                testNo++;
                expect(compareStatus).toEqual(headerStatus);

                directive.element(by.id('statusList')).click();

                statusInit.click();

                element(by.className('quick-settings-close')).click();


            });

        });

    });




    it('make an outbound call', function() {

        var dirTab =element(by.className('left-navigation')).element(by.id('dirTab'));

        var directory =  element(by.className('left-navigation')).element(by.className('page-tabs')).element( by.css('div[ui-sref="landing.directory"]'));
        directory.click();

        //since i am testing with a softphone, I need to enable that setting before making the call
        //this is not required when not a softphone. Log in as softphone flag in conf file dictates this.
        element(by.id('currentUserInfo')). element(by.className('currentUserAvatar')).click();


        if(browser.params.logInAsSoftphone=='true')
        {
            var directive = element(by.className('quick-settings-device-list'));
            directive.element(by.id('softphoneRadio')).click();

        }

        browser.sleep(5000);

        element(by.className('quick-settings-close')).click();


        element(by.id('directory-search')).sendKeys(browser.params.callExtension);
        element(by.id('directory-search')).sendKeys(protractor.Key.ENTER);


        browser.wait(function () {
            return  browser.isElementPresent($('#callStatus')).then(function (isPresent) {
                if (isPresent) {
                    return true;
                }
            });
        });

        var partyStatuselm = element(by.className('right-navigation')).element(by.id('callStatus'));

        var callState;
        browser.wait(function () {

            return partyStatuselm.evaluate('getPrimaryPartyStatusText()').then(function (value) {

                if (value == 'Connected') {
                    callState = value;
                    return value;
                }
            });

        }).thenFinally(function() {
            // this will always be executed - put expectation here.
            console.log(testNo + ". Outbound call state:  " + callState);
            testNo++;
            expect('Connected').toEqual(callState);

        });

    });




    it('test mute call', function() {
        var callElm = element(by.className('right-navigation')).element(by.id('callMute'));
        callElm.click();
        var mute=false;;
        callElm.evaluate('isSoftphoneAudioMuted()').then(function (value) {

            if(value==true) {
                mute=value;
                callElm.click();
                return;
            }

        }).thenFinally(function() {
            // this will always be executed - put expectation here.
            console.log(testNo + ". Mute call:  " + mute);
            testNo++;
            expect(mute).toBeTruthy();
        });

    });



    it('test hold call', function() {
        var callElm = element(by.className('right-navigation')).element(by.id('callHold'));
        callElm.click();
        browser.sleep(1000);
        var hold=false;
        callElm.evaluate('call.isOnHold').then(function (value) {

            if(value==true) {
                hold=value;
                callElm.click();
                return;
            }

        }).thenFinally(function() {
            // this will always be executed - put expectation here.
            console.log(testNo + ". Hold call:  " + hold);
            testNo++;
            expect(hold).toBeTruthy();
        });
    });

    it('test transfer call', function() {

        browser.sleep(1000);

        var callElm = element(by.className('right-navigation')).element(by.id('transferButton'));
        callElm.click();

        var directive = element(by.id('directoryList'));

        var searchBox = directive.element(by.id('target-search'));
        searchBox.sendKeys(browser.params.transferTo);



        var length;
        var children =  directive.element(by.id('target-list')).$$('li');
        children.count().then(function(realCount) {
            length=realCount;

            expect(children.count()).toEqual(length);
            children.get(1).click();
            var connectTransfer =  element(by.className('right-navigation')).element(by.id('directoryConnect'));
            connectTransfer.click();

            browser.sleep(1000);
            var secondaryComplete = element(by.className('right-navigation')).element(by.id('secondaryCallComplete'));
            secondaryComplete.isDisplayed().then(function(isVisible){
                secondaryComplete.click();
            });

        });


        browser.sleep(2000);


        element(by.className('right-navigation')).evaluate('detailState.name').then(function (state) {
            expect(state).toEqual("");
            console.log(testNo + ". Transfer call (right panel state):  " + state);
            testNo++;
        });


    });



    it('send problem report', function() {

        element(by.id('currentUserInfo')).element(by.className('currentUserAvatar')).click();
        element(by.className('quick-settings-sections')).element(by.id('showProblemReport')).click();

        var problemText = element(by.id('problem-report-wrapper')).element(by.id('probText'));
        problemText.sendKeys(browser.params.problemReportText);
        var sendButton = element(by.id('problem-report-wrapper')).element(by.id('sendReport'));
        sendButton.click();

        var overly = element(by.className('settings-feedback-overlay'));
        var  overlayshown=false;
        browser.wait(function () {
            return overly.evaluate('showOverlay').then(function (shown) {
                if(shown) {
                    overlayshown = true;
                    return true;
                }
            });
        }).thenFinally(function() {
            // this will always be executed - put expectation here.
            expect(overlayshown).toEqual(true,"There was a problem sending the Problem report.");
            console.log(testNo + ". Send problem report.");
            testNo++;

        });



    });


    /* it('test end call', function() {
     var callElm = element(by.className('right-navigation')).element(by.id('callDisconnect'));
     callElm.click();

     var rightPanelState;
     browser.wait(function () {
     return element(by.className('right-navigation')).evaluate('detailState.name').then(function (state) {
     rightPanelState = state;
     if(state !='call')
     return true;
     });
     }).thenFinally(function() {
     // this will always be executed - put expectation here.
     console.log(testNo + ". End call: " + rightPanelState);
     testNo++;
     expect(rightPanelState).not.toEqual('call');

     });
     });*/



});