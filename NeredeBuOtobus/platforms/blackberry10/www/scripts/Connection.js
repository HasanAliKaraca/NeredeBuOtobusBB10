
var Connection = {
    getData: function (data) {
        var url = "";
        //{ name: "John", time: "2pm" };

        $.ajax({
            url: url,
            data: data,
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