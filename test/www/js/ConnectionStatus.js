
var ConnectionStatus = {
    offline: function () {

        //SHOW DIALOG
        try {
            var buttons = ["Yoksay", "Ayarlar"];

            blackberry.ui.dialog.customAskAsync("Devam edebilmek için Wi-Fi ya da mobil bir ağa bağlanın.", buttons, dialogCallBack, { title: "Internet bağlantısı yok" });

            //if (Timer.working==true) {
            //}
            Timer.stop();
        } catch (e) {
            alert(e);
            console.warn("Exception in standardDialog: " + e);
        }

    },

    online: function () {
        //cuz async it'll wait a bit
        Connection.loadMyIp();
        App.getBusInfo(); //implement this function
    },

    check: function () {
        var con = blackberry.connection.type;
        console.log("con: " + con);
        if (con == "none") {
            console.log("internet is offline");

            this.offline();
        }
        else if (con === "wifi" || con === "4g" || con === "3g" || con === "2g" || con === "vpn") {

            //take ip
            Connection.loadMyIp();
        }
    },

}

function dialogCallBack(selection) {
    console.log(selection);
    //button 1
    if (selection == 1) {
        Invoke.openNetworkConnections();
    }
};