exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec.js'],
    params: {


        'debugMode': 'false',

        'vAppCenterbaseURL': 'https://vpqa.vappcenter.com',
        'vAppCentervwLandingURL': 'https://vpqa.vappcenter.com/vpw/?rc=0#/landing',
        'vAppCentervwDirectoryURL': 'https://vpqa.vappcenter.com/vpw/?rc=0#/landing/directory',
        'vAppCenteEmail' : 'adoan@vertical.com',
        'vAppCentePassword': 'ILoveme$$2016',
        'vwLaunchLinkID': 'ViewPoint-Web---QA',


        'baseURL': 'https://localhost:9000/debug.html',
        'vwLandingURL': 'https://localhost:9000/#/landing',
        'endpoint': 'vpdev.dev1.vappcenter.com', //specify VCC endpoint here
        'token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NTEsInRpZCI6MjAsImV4cCI6MTQ2Mjk1NTE5OH0.Cwbj5DzTEQpwamOlWYjPnCl30NEA5t8uxnxtxlP9Llw', //VCC token

        'logInAsSoftphone': 'true', //set to true if logged in as 'Browser Secondary Softphone'

        'dirSearchText': 'sm',//Assumption is that the no of matches found is less than the total no of entries in the selected view.
        'minDirSearchLen' : '0',//Default is 0. Zero or more matches can be returned
        'dirFilterSearchId':'3', // id to select when filter dropdown is selected

        'callExtension': '250', //It would help to fully automate the test if this extension is set to go auto off hook on an incoming call.
        'transferTo': 'VPWDIGI 251', //name of the user call will be transferred to

        'sendIMTo': 'vpwauto 301', //name of user to send IM to
        'textIM': 'send test message', // IM text body
        'addToIM': 'Denell Hopkins', // name of party to add to a 2 party chat


        'personalStatusIndex': '2', //index of personal status dropdown to set to

        'problemReportText': 'This is a test problem report text that describes the problem.' //problem report text

    },
    capabilities :  {
        browserName: "chrome",//,
        chromeOptions : {
            // args: ["incognito"]
            args: [
                'use-fake-ui-for-media-stream'
            ]
        }
    },

    jasmineNodeOpts: {
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 50000
    },
    
}