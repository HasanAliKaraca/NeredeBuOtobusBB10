
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