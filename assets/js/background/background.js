



// on first install
chrome.runtime.onInstalled.addListener(function (object) {
    console.log(">>>>> new [update|install] detected");
    // is this the first install?
    if ( !prop(store("tally_meta")) ){
        // attempt to install if not found
        createApp();
    // } else if (!hasValidKey()){
    //     // start registration
    //     startRegistration();
    // } else if (!hasValidToken()){
    //     // get/refresh token
    //     getUpdateToken();
    } else {
        // safe to proceed, update all data and let's play
        startApp();
    }
});


//createApp();//testing
// no version installed so need to create user, etc.
function createApp(){
    console.log(">>>>> createApp() -> first install: creating tally_user");
	try {
        // Create objects
		store("tally_user",createUser());
		store("tally_options",createOptions());
		store("tally_meta",createMeta());
		store("tally_secret",createSecret());
        // createOptions();
        // createGame();
        // createMeta();
        // these are empty the first time
    	store("tally_domains",{});
    	store("tally_urls",{});

        // start registration
        //...
	} catch(ex){
		console.log("failed to create user");
	}
}



function startApp(){
    try {
        tally_user = store("tally_user");
        tally_options = store("tally_options");
        tally_meta = store("tally_meta");
        tally_secret = store("tally_secret");
        console.log("############################## welcome back ! ##############################");
        console.log("tally_user", JSON.stringify(tally_user));
        console.log("tally_options", JSON.stringify(tally_options));
        console.log("tally_meta", JSON.stringify(tally_meta));
        console.log("tally_secret", JSON.stringify(tally_secret));
    } catch(ex){
        console.log("failed to get tally_user");
    }
}



function sendDataTest(data){
    $.ajax({
        url: "http://localhost:5000/json_test",
		type: "GET",
        timeout: 15000, // set timeout to 15 secs to catch ERR_CONNECTION_REFUSED
        contentType: 'application/json',
        dataType: 'json',
		data: JSON.stringify(data),
		success: function(result){
			//console.log("sendData() RESULT =",result);
			console.log("\nsendData() RESULT =",JSON.stringify(result));

		},
        error: function( jqXhr, textStatus, errorThrown ){
            console.error( errorThrown );
        }
	}).fail(function (jqXHR, textStatus, errorThrown) {
        console.error( errorThrown );
    });
}







/*  BACKGROUND INIT FUNCTIONS
******************************************************************************/


/**
 *  Create user
 */
function createUser(){
	var obj = { "username":"ow3n",
                "score":createScore(),
                "achievements":createAchievements()
			};
	return obj;
}
// Create Score object (separate function so we can reset)
function createScore(){
    var obj = { "score":0,
                "clicks":0,
                "likes":0,
                "pages":0,
                "domains":0,
                "level":0,
            };
    return obj;
}
// Create Achievements object (separate function so we can reset)
function createAchievements(){
    var obj = { "monsters":{},
            };
    return obj;
}
function createOptions(){
	var obj = { "showTally":true,
                "showClickVisuals":false,
				"playSounds":false,
				"showAnimations":false,
                "gameMode":"slim",
                "disabledDomains":[
                    "drive.google.com",
                    "docs.google.com",
                ],
				"showDebugger":true,
				"debuggerPosition":[0,300]
			};
	return obj;
}
/**
 *  Create Meta object on installation
 */
function createMeta(){
	var obj = { "version": 0.1,
				"installedOn": returnDateISO(),
				"lastSyncedToServer":0,
				"lastSyncedResult":0,
                "userOnline":navigator.onLine,
				"serverOnline":0,
				"connectionSpeed":0,
				"api":"http://127.0.0.1:3000",
                "browser": getBrowser()
            };
	return obj;
}
function getBrowser() {
	if (navigator.userAgent.indexOf("Chrome") != -1) {
		return "Chrome";
	} else if (navigator.userAgent.indexOf("Opera") != -1) {
		return "Opera";
	} else if (navigator.userAgent.indexOf("MSIE") != -1) {
		return "IE";
	} else if (navigator.userAgent.indexOf("Firefox") != -1) {
		return "Firefox";
	} else {
		return "unknown";
	}
}

/**
 *  Create Secret object on installation
 */
function createSecret(){
	var obj = { "key":"tally6d8fv87df7ydvsd7sSKfhA89asdapqdaklkj2j2kj29ks", // "tally6d8fv87df7ydvsd7sSKfhA89asdapqdaklkj2j2kj29ks"
				"updateToken": getUpdateToken()
            };
	return obj;
}

/*  BACKGROUND AUTH FUNCTIONS
******************************************************************************/


// Verify that a key is correct
function verifyKey(key){
	if (key.substr(0,3) == "ty_"){
		return 1;
	}
	return 0;
}


// get updateToken from server
function getUpdateToken() {
	return "93d8258d39b7f7220a02b0e66";
}
