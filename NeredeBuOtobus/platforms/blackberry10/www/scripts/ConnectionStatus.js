var ConnectionStatus = {
    offline: function () {

        //SHOW DIALOG
        try {
            var buttons = ["Yoksay", "Ayarlar"];

            blackberry.ui.dialog.customAskAsync("Devam edebilmek için Wi-Fi ya da mobil bir ağa bağlanın.", buttons, dialogCallBack, { title: "Internet bağlantısı yok" });
        } catch (e) {
            console.warn("Exception in standardDialog: " + e);
        }

    },
    online: function () {
        Connection.showData(); //implement this function
    },

    check: function () {
        var con = blackberry.connection.type
        if (con == "none") {
            console.log("internet is offline");

            this.offline();
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