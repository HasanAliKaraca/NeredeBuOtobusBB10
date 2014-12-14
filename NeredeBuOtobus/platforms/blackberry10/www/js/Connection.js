
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
