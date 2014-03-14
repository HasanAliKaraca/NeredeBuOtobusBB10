
var Connection = {
    doAjaxReq: function (data) {
        var url = "http://www.ego.gov.tr/mobil/mapToDo.asp";
        //{ name: "John", time: "2pm" };

        var parameterObject = {
            fnc: "DuraktanGeçecekOtobüsler",
            prm: "",
            hat: data.hatNo,
            durak: data.durakNo
        }

        $.ajax({
            url: url,
            data: parameterObject,
            success: Connection.loadData,
            dataType: "json"
        });

    },

    loadData: function (data, textStatus, jqXHR) {
        console.log(data);
    },
    showData: function () {

    },
    myIp: "",
    loadMyIp: function () {

        //ip is empty
        if (this.myIp != "") {
            return false;
        }

        $.getJSON("http://jsonip.com?callback=?", function (data) {
            var ip = data.ip;
            console.log(ip);

            Connection.myIp = ip;
        });
    }
};



function myfunction() {
    var url = "http://www.ego.gov.tr/mobil/mapToDo.asp";
    var parameterObject = {
        fnc: "DuraktanGeçecekOtobüsler",
        prm: "",
        hat: "",
        durak: "11542"
    };

    var ajaxCID = '217.131.141.30';
    var ajaxAPP = 'OtobusNerede';


    url = url + "?AjaxSid=" + escape(Math.random()) + "&AjaxCid=" + encodeURI(ajaxCID) + "&AjaxApp=" + encodeURI(ajaxAPP) + "&AjaxLog=True";

    $.ajax({
        type: "POST",
        url: url,
        data: parameterObject,
        success: function (data) {
            console.log(data);
        }
    });


    //restxt = decodeURI($.ajax({
    //    type: "POST",
    //    async: false,
    //    url: url,
    //    data: parameterObject
    //}).responseText);

    //console.log(restxt);
}
myfunction();





//console.log(url);
//$.ajax({
//    type: "POST",
//    async: false,
//    url: url,
//    data: {
//        fnc: "DuraktanGeçecekOtobüsler",
//        prm: "",
//        hat: "",
//        durak: "11542"
//    },
//    success: sonuc
//});

function sonuc(data) {

    console.log(data);

    alert(data);

}