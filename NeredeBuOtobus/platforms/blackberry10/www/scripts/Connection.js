
var Connection = {
    doAjaxReq: function (data) {

        var parameterObject = {
            fnc: "DuraktanGeçecekOtobüsler",
            prm: "",
            hat: data.hatNo,
            durak: data.durakNo
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

                ConnectionStatus.check();
            }
        });

    },
    returnData: function (data, textStatus, jqXHR) {
        console.log("ajax success");
        App.showBusInfo(data);
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