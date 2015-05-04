///#source 1 1 /js/App.js

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

        var hatNo = localStorage.getItem("lastHatNo"); //$("#txtHatNo").val(); 

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
        if (this.values != null && this.values.hatNo != "" && this.values.hatNo != null) {

            var hatNo = this.values.hatNo;

            for (var i = 0; i < data.length; i++) {
                var record = data[i];
                if (hatNo && hatNo != "undefined") {
                    if (record.hatNo !== hatNo) {
                        continue;
                    }
                }

                createListItem(record);
                items.push(listItem);
            }
        }

            //hatNo girilmemişse
        else {
            data.forEach(function (o) {
                createListItem(o);
                items.push(listItem);
            });
        }

        //helper functions record=data.Tbl bir tablo objesi yani
        function createListItem(record) {

            //var kalanDk = findKalanDk(record);
            var tmpl =
                "<li>" +
                    "<h4>" + record.hatNo + ", " + record.hatAd + "</h4>" +
                    "<label>" +
                    record.varisSure +
                    "</label>" +
                    "<br/>" +
                    "<label>" +
                    record.info +
                    "</label>" +
                "</li>";
            tmpl += "<hr/>";

            listItem = tmpl;
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

                $("#txtDurakNo").focusout(function (event) {
                    var durakNo = $("#txtDurakNo").val();
                    localStorage.setItem("lastDurakNo", durakNo);
                    if (event.keyCode == 13) {
                        App.getBusInfo();
                    }
                });

                $("#txtHatNo").focusout(function (event) {
                    var hatNo = $("#txtHatNo").val();
                    localStorage.setItem("lastHatNo", hatNo);
                    if (event.keyCode == 13) {
                        App.getBusInfo();
                    }
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

        var hatNo = data.hatNo || "";
        var durakNo = data.durakNo;

        var url = "http://www.ego.gov.tr/otobusnerede?durak_no=" + durakNo + "&hat_no=" + hatNo;

        $.ajax({
            url: url,
            success: Connection.returnData,
            error: function (jqXHR, textStatus, errorThrown) {
                console.warn("error: " + errorThrown);

                App.alert("Bağlantı esnasında hata oluştu. Lütfen tekrar deneyiniz.", "Bağlantı hatası");

                ConnectionStatus.check();
            }
        });



    },
    returnData: function (data, textStatus, jqXHR) {
        var resultData = "";

        try {
            //html dönecek otobusnerede tablosunu al

            if (data) {
                resultData = Connection.parseHtml(data);
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

        App.showBusInfo(resultData);

    },

    parseHtml: function (data) {
        var resultArr = [];

        if (!data) {
            return resultArr;
        }

        var html = $.parseHTML(data);
        var table = $(html).find(".otobusneredemobil"); //otobusnerede
        

        var tbody = $(table).find("tbody"); //:nth-child(2)
        var trList = $(tbody).find("tr");

        for (var i = 0; i < trList.length; i = i + 3) {

            var busObj = {
                hatNo: '',
                hatAd: '',
                varisSure: '',
                info: ''
            };

            var hatRow = trList[i];

            busObj.hatNo = $(hatRow).find("th").text().trim();  //busObj.hatNo = $(hatRow).find("td:nth-child(1)").text().trim();

            busObj.hatAd = $(hatRow).find("td").text().trim();  //busObj.hatAd = $(hatRow).find("td:nth-child(2)").text().trim();


            var infoRow = trList[i + 1];

            busObj.varisSure = $(infoRow).find("h6:nth-child(2)").text().trim(); //busObj.varisSure = $(infoRow).find("i b").text().trim().replace("Tahmini Varış Süresi: ", "");
                //.clone()    //clone the element
                //.children() //select all the children
                //.remove()   //remove all the children
                //.end()  //again go back to selected element
                //.text().trim().replace("Tahmini Varış Süresi: ", "");

            //take just first text not childs'
            busObj.info = $(infoRow).find("th h6:nth-child(3)").text().trim(); //busObj.info = $(infoRow).find("i").clone().children().remove().end().text().trim();

            resultArr.push(busObj);
        }

        return resultArr;
    },

    myIp: "",
    loadMyIp: function () {

        $.getJSON("http://jsonip.com?callback=?", function (data) {
            var ip = data.ip;
            console.log(ip);

            Connection.myIp = ip;
        });
    },
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
