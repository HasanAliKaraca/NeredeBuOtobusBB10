
var Connection = {
    doAjaxReq: function (data) {

        var hatNo = data.hatNo;
        var durakNo = data.durakNo;

        var url = "http://www.ego.gov.tr/otobusnerede?durak_no=" + durak + "&hat_no=" + hatNo;

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

        try {
            //html dönecek otobusnerede
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
    },
};

