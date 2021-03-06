﻿///#source 1 1 /js/App.js

var App = {
    startApplication: function () {

        //check if the internet is offline
        ConnectionStatus.check();



        // load the first screen here
        bb.pushScreen('home.html', 'homeScr');


    },

    alert: function (message, title) {
        blackberry.ui.dialog.standardAskAsync(message, blackberry.ui.dialog.D_OK, function () { }, { title: title });
    },
    getValues: function () {
        var durakNo = localStorage.getItem("lastDurakNo");// $("#txtDurakNo").val();
        if (!durakNo) {
            var message = "Lütfen bir durak numarası giriniz";
            var title = "Durak No";
            App.alert(message, title);
            //blackberry.ui.dialog.standardAskAsync(message, blackberry.ui.dialog.D_OK, function () { }, { title: "Durak No" });
            return null;
        }

        var hatNo = localStorage.getItem("lastHatNo");//$("#txtHatNo").val();

        //localStorage.setItem("lastDurakNo", durakNo);
        //localStorage.setItem("lastHatNo", hatNo);

        var dataObject = { durakNo: durakNo, hatNo: hatNo };
        this.values = dataObject;
        return dataObject;
    },
    values: null,
    getBusInfo: function () {

        var dataObject = App.getValues();
        if (!dataObject) {
            return null;
        }

        var busInfoScrExist = false;
        $.each(bb.screens, function (index, item) {
            if (item.id == "busInfoScr") {
                busInfoScrExist = true;
            }
        });

        if (busInfoScrExist == false) {
            bb.pushScreen('busInfo.html', 'busInfoScr');
        }
        //show loading - ekran yüklendikten sonra çalıştırılması lazım
        Spinner.on();

        Connection.doAjaxReq(dataObject);

        //empty datalist
        //var dataList = $("#dataList"); //document.getElementById('dataList');
        //if (!dataList.html()) {
        //    dataList.html("Yükleniyor..");
        //}

        //dataList.clear();



      //  Toast.regular('Yükleniyor..');
    },

    showBusInfo: function (data) {


        var i,
		listItem,
		items = [],
		detay,
		kalanDk,
		dataList = document.getElementById('dataList');

        //hatNo girilmişse
        if (this.values != null && this.values.hatNo != "") {

            var hatNo = this.values.hatNo;

            for (var i = 0; i < data.Row; i++) {
                var record = data.Tbl[i];
                if (hatNo && hatNo != "undefined") {
                    if (record.kodu !== hatNo) {
                        continue;
                    }
                }

                createListItem(record);
                items.push(listItem);
            }
        }

            //hatNo girilmemişse
        else {
            data.Tbl.forEach(function (o) {
                createListItem(o);
                items.push(listItem);
            });
        }

        //helper functions record=data.Tbl bir tablo objesi yani
        function findKalanDk(record) {
            var detay = record.detay;
            var firstPos;
            var lastPos;

            if (detay.indexOf("<br />") != -1) {
                firstPos = detay.indexOf("<br />") + 6;
                lastPos = detay.lastIndexOf("<br />");
            }
            else if (detay.indexOf("<br/>") != -1) {
                firstPos = detay.indexOf("<br/>") + 5;
                lastPos = detay.lastIndexOf("<br/>");
            }
            else {
                console.error("hata!! api de 'detay' parametresi değişmiş olabilir");
            }

            kalanDk = detay.substring(firstPos, lastPos);
            return kalanDk;
        };
        function createListItem(record) {

            var kalanDk = findKalanDk(record);
            var tmpl =
                "<li>" +
                    "<h4>" + record.kodu + ", " + record.adi + "</h4>" +
                    "<label>" +
                    record.detay +
                    "</label>" +
                "</li>";
            tmpl += "<hr/>";

            listItem = tmpl;

            // listItem = document.createElement('div');
            // listItem.setAttribute('data-bb-type', 'item');
            // listItem.setAttribute('data-bb-title', 'Hat No: ' + record.kodu);
            // listItem.setAttribute('data-bb-accent-text', '');//sağdaki text
            // listItem.innerHTML = kalanDk;
        };

        // Remove our waiting and refresh the list
        Spinner.off();


        var date = new Date();
        var hour = date.getHours()
        if (hour < 10) hour = "0" + hour;

        var min = date.getMinutes();
        if (min < 10) min = "0" + min;

        var sec = date.getSeconds();
        if (sec < 10) sec = "0" + sec;


        var now = hour + ":" + min + ":" + sec;
        $("#lblLastUpdateTime").html("Son güncellenme: " + now);

        //  console.log(data);
        if ($.isEmptyObject(data) || data.Row < 1) {
            var message = "Otobüs bulunamadı..";
            var title = "Sonuç";
            App.alert(message, title);
            return;
        }

        try {
            //li ler için yapıldı bu
            dataList.innerHTML = items.join("");

            dataList.clear();
            dataList.refresh(items);
        } catch (e) {

        }

        Timer.start();
    },


};
///#source 1 1 /js/Application.js

var Application = {

    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', ConnectionStatus.offline, false);
        document.addEventListener('online', ConnectionStatus.online, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        Application.receivedEvent('deviceready');

        bb.init({
            actionBarDark: true,
            controlsDark: true,
            listsDark: false,

            // Fires "before" styling is applied and "before" the screen is inserted in the DOM
            onscreenready: function (element, id, params) {

            },

            // Fires "after" styling is applied and "after" the screen is inserted in the DOM
            ondomready: function (element, id) {
                $("#txtDurakNo").val(localStorage.getItem("lastDurakNo"));
                $("#txtHatNo").val(localStorage.getItem("lastHatNo"));
                $("#txtDurakNo").focus();

                $("#txtDurakNo").keyup(function (event) {
                    var durakNo = $("#txtDurakNo").val();
                    localStorage.setItem("lastDurakNo", durakNo);
                    if (event.keyCode == 13) {
                        App.getBusInfo();
                    }
                });

                $("#txtHatNo").keyup(function (event) {
                    var hatNo = $("#txtHatNo").val();
                    localStorage.setItem("lastHatNo", hatNo);
                });


            }
        });

        //try {
        //    // register with bbm
        //  //  Bbm.register();

        //    // setup active frame / window cover
        //    //App.ui.windowCover.setup('local:///images/cover.png');
        //} catch (e) {
        //    alert(e);
        //    console.log('BBM / Window Covers will not work in the browser. On device only.');
        //}

        App.startApplication();

    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },
};


//// filepicker (async)

//function pickFile() {
//    Invoke.utils.filePicker(function (path) {
//        Toast.regular('Picked: ' + path, 3000);
//    },

//        function (reason) {
//            Toast.regular('Card canceled: ' + reason);
//        },

//        function (error) {
//            console.log(error);
//        });
//}

//// camera (async)

//function takePhoto() {
//    Invoke.utils.camera(function (path) {
//        Toast.regular('Photo: ' + path, 3000);
//    },

//        function (reason) {
//            Toast.regular('Card canceled: ' + reason);
//        },

//        function (error) {
//            console.log(error);
//        });
//}

//// sample toast button callback

//function toastCallback() {
//    alert('In the callback!');
//}

//// spinner usage

//function spinner(size) {
//    // hide the current spinner, if it's visible
//    Spinner.off();
//    Spinner.on(size);
//}

//// show a welcome message

//function welcome() {
//    Toast.regular('Welcome to the BFB Sample!', 2000);
//    setTimeout(function () {
//        Toast.regular('Swipe down to see the App Menu!', 2000);
//        setTimeout(function () {
//            Toast.regular('Minimize the app to see the Window Cover', 2300);
//        }, 2300);
//    }, 2300);
//}




///#source 1 1 /js/Connection.js

var Connection = {
    doAjaxReq: function (data) {
        var parameterObject = {
            fnc: "DuraktanGeçecekOtobüsler",
            prm: "",
            hat: data.hatNo,
            durak: data.durakNo
        }

        if (this.myIp == null && this.myIp == "") {
            this.loadMyIp();

            var timeStamp = Date.now();

            //10sec wait
            while (Date.now - timeStamp < 10000) {

            }
            if (this.myIp == null && this.myIp == "") {

                alert("şu anki ipiniz alınamadığı için işlem gerçekleştirilemiyor!");
                return;
            }

        }

        var ajaxCID = Connection.myIp;
        var ajaxAPP = 'OtobusNerede';

        var url = "http://www.ego.gov.tr/mobil/mapToDo.asp";

        url = url + "?AjaxSid=" + encodeURI(Math.random()) + "&AjaxCid=" + encodeURI(ajaxCID) + "&AjaxApp=" + encodeURI(ajaxAPP) + "&AjaxLog=True";

        $.ajax({
            type: "POST",
            url: url,
            data: parameterObject,
            success: Connection.returnData,
            error: function (jqXHR, textStatus, errorThrown) {
                console.warn("error: " + errorThrown);

                App.alert("Bağlantı esnasında hata oluştu. Lütfen tekrar deneyiniz.", "Bağlantı hatası");

                ConnectionStatus.check();
            }
        });

    },
    returnData: function (data, textStatus, jqXHR) {
        //console.log("ajax success");

        try {
            //gelen data yanlış şekillendirilmiş: "{'Err': '','Msg': '','Row': 0,'Tbl': []}"
            //bu datada parse edebilmek için ' karakterleri " döndürülmeli.
            var correctedString = data.replace(/'/g, '"');

            if (correctedString) {
                //string to json
                var jsonObject = $.parseJSON(correctedString);
            }
            else {
                console.log("correctedString: " + correctedString);
                throw "Data boş döndü!";
            }


        } catch (e) {
            // alert(e);
            console.warn(e);
            Spinner.off();
            return null;
        }

        App.showBusInfo(jsonObject);

    },

    myIp: "",
    loadMyIp: function () {

        $.getJSON("http://jsonip.com?callback=?", function (data) {
            var ip = data.ip;
            console.log(ip);

            Connection.myIp = ip;
        });
    }
};

///#source 1 1 /js/ConnectionStatus.js

var ConnectionStatus = {
    offline: function () {

        //SHOW DIALOG
        try {
            var buttons = ["Yoksay", "Ayarlar"];

            blackberry.ui.dialog.customAskAsync("Devam edebilmek için Wi-Fi ya da mobil bir ağa bağlanın.", buttons, dialogCallBack, { title: "Internet bağlantısı yok" });

            //if (Timer.working==true) {
            //}
            Timer.stop();
        } catch (e) {
            alert(e);
            console.warn("Exception in standardDialog: " + e);
        }

    },

    online: function () {
        //cuz async it'll wait a bit
        Connection.loadMyIp();
        App.getBusInfo(); //implement this function
    },

    check: function () {
        var con = blackberry.connection.type;
        console.log("con: " + con);
        if (con == "none") {
            console.log("internet is offline");

            this.offline();
        }
        else if (con === "wifi" || con === "4g" || con === "3g" || con === "2g" || con === "vpn") {

            //take ip
            Connection.loadMyIp();
        }
    },

}

function dialogCallBack(selection) {
    console.log(selection);
    //button 1
    if (selection == 1) {
        Invoke.openNetworkConnections();
    }
};
///#source 1 1 /js/Invoke.js

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





///#source 1 1 /js/Spinner.js
var Spinner = {
    visible: false,

    off: function () {
        //document.getElementById('spinner').style.display = 'none';
        $("#spinner").hide();
        Spinner.visible = false;

    },

    on: function () {
        //document.getElementById('spinner').style.display = 'block';
        $("#spinner").show();
        Spinner.visible = true;
    }
};
///#source 1 1 /js/Timer.js

var Timer = {
    working: false,

    counter: null,

    start: function () {
        this.working = true;
        this.stop();
        this.counter = setInterval(App.getBusInfo, 30000); //App.getBusInfo() functionını 30saniyede bir çalıştır
    },

    stop: function () {
        clearInterval(this.counter);
        this.working = false;
    }
};
