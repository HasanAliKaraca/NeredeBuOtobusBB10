
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

