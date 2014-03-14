
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

        var dataObject = { durakNo: durakNo, hatNo: hatNo };

        return dataObject;
    },
    buttonClicked: function () {
        var dataObject = this.getValues();
        Connection.doAjaxReq(dataObject);
    }
};