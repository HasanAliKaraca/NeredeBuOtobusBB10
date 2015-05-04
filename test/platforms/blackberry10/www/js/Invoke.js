
/* ==============================================================================================
 *  INVOCATION - https://developer.blackberry.com/html5/documentation/invoking_core_apps.html
 * =========================================================================================== */

var Invoke = {

    onInvokeError: function (error) {
        console.warn("Invocation failed, error: " + error);
    },

    onInvokeSuccess: function () {

    },

    openNetworkConnections: function () {

        blackberry.invoke.invoke({
            target: "sys.settings.card",
            action: "bb.action.OPEN",
            type: "settings/view",
            uri: "settings://networkconnections"
        }, this.onInvokeSuccess, this.onInvokeError);
    },

    // blackberry maps
    maps: function (geoPoint) {

        console.log(geoPoint);

        if (geoPoint != null) {

            blackberry.invoke.invoke({
                action: "bb.action.OPEN",
                type: "application/vnd.rim.map.action-v1",
                data: JSON.stringify(
                    {
                        "placemark": {
                            "latitude": geoPoint.lat,
                            "longitude": geoPoint.lng
                        }
                    }
                )
            });
        }
    },

    appworldOpenMyVendorPage: function () {
        blackberry.invoke.invoke({
            target: 'sys.appworld',
            action: 'bb.action.OPEN',
            uri: 'appworld://vendor/54824'
        },
            // success
            function () { console.log("success"); },

            // error
            function () { console.log("error"); });
    },
    /* 
    
    //TODOS
    
    // list of share targets
    targets: function (uri) {
        var title = 'Share';
        var request = {
            action: 'bb.action.SHARE',
            uri: uri,
            target_type: ["APPLICATION", "VIEWER", "CARD"]
        };
    
        blackberry.invoke.card.invokeTargetPicker(request, title,
            // success
    
            function () { },
    
            // error
    
            function (e) { });
    },
    
    // email
    email: function (to, subject, body) {
        var message = to + '?subject=' + subject + '&body=' + body;
        blackberry.invoke.invoke({
            target: 'sys.pim.uib.email.hybridcomposer',
            action: 'bb.action.OPEN, bb.action.SENDMAIL',
            type: 'message/rfc822',
            uri: 'mailto:' + message
        });
    },
    
    // twitter
    twitter: function (shareText) {
        blackberry.invoke.invoke({
            target: "Twitter",
            action: "bb.action.SHARE",
            type: "text/plain",
            data: shareText
        }, function () { }, function () { });
    },
    
    //facebook
    facebook: function (shareText) {
        blackberry.invoke.invoke({
            target: "Facebook",
            action: "bb.action.SHARE",
            type: "text/plain",
            data: shareText
        }, function () { }, function () { });
    }
    
    */

};




