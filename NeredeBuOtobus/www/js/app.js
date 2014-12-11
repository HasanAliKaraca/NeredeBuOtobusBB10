
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

        var homeScrExist = false;
        $.each(bb.screens, function (index, item) {
            if (item.id == "busInfoScr") {
                homeScrExist = true;
            }
        });

        if (homeScrExist == false) {
            bb.pushScreen('busInfo.html', 'busInfoScr');
        }



        //empty datalist
        var dataList = $("#dataList"); //document.getElementById('dataList');
        if (!dataList.html()) {
            dataList.html("Yükleniyor..");
        }

        //dataList.clear();

        //show loading
        //Spinner.on();

        Connection.doAjaxReq(dataObject);
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
        // Spinner.off();


        var date = new Date();
        var hour = date.getHours()
        if (hour < 10) hour = "0" + hour;

        var min = date.getMinutes();
        if (min < 10) min = "0" + min;

        var sec = date.getSeconds();
        if (sec < 10) sec = "0" + sec;


        var now = hour + ":" + min + ":" + sec;
        $("#lblLastUpdateTime").html("Son güncellenme: " + now);

        console.log(data);
        if ($.isEmptyObject(data)) {
            var message = "Sonuç bulunamadı.";
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