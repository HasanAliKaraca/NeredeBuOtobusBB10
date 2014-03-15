
var App = {
    startApplication: function () {

        //check if the internet is offline
        ConnectionStatus.check();

        // load the first screen here
        bb.pushScreen('home.html', 'homeScr');

    },

    getValues: function () {
        var durakNo = $("#txtDurakNo").val();
        var hatNo = $("#txtHatNo").val();

        localStorage.setItem("lastDurakNo", durakNo);
        localStorage.setItem("lastHatNo", durakNo);

        var dataObject = { durakNo: durakNo, hatNo: hatNo };

        return dataObject;
    },

    getBusInfo: function () {

        //empty datalist
        var dataList = document.getElementById('dataList');
        dataList.clear();

        //show loading
        Spinner.on();

        var dataObject = this.getValues();
        Connection.doAjaxReq(dataObject);
    },

    showBusInfo: function (data) {
        console.log(data);
        console.log(data.Row);

        var i,
		listItem,
		items = [],
		dataList = document.getElementById('dataList');

        data.Tbl.forEach(function (o) {
            listItem = document.createElement('div');
            listItem.setAttribute('data-bb-type', 'item');
            listItem.setAttribute('data-bb-title', o.kodu + " " + o.adi);
            listItem.setAttribute('data-bb-accent-text', 'accent text');
            listItem.innerHTML = o.detay;
            items.push(listItem);
        });


        // Remove our waiting and refresh the list
        Spinner.off();

        dataList.refresh(items);
    }
};