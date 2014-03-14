
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
            success: this.loadData,
            dataType: "json"
        });

    },
    loadData: function (data, textStatus, jqXHR) {
        console.log(data);
    },
    showData: function () {

    },
};

function myfunction() {
    var url = "http://www.ego.gov.tr/mobil/mapToDo.asp";
    var parameterObject = {
        fnc: "DuraktanGeçecekOtobüsler",
        prm: "",
        hat: "",
        durak: data.durakNo
    };
    $.ajax({
        url: url,
        data: parameterObject,
        success: this.loadData,
        dataType: "json"
    });

    url = url + "?AjaxSid=" + escape(Math.random()) + "&AjaxCid=" + encodeURI(ajaxCID) + "&AjaxApp=" + encodeURI(ajaxAPP) + "&AjaxLog=True";
    $.ajax({
        type: "POST",
        url: url,
        data: data
    });
}