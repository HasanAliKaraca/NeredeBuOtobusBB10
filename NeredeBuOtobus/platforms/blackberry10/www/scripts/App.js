
var App = {
    startApplication: function () {

        //check if the internet is offline
        ConnectionStatus.check();

        // load the first screen here
        bb.pushScreen('home.html', 'homeScr');

    },
    bindEvents: function () {
        $("#btnShow").onclick = function () {
            alert();
        };

        bb.refresh();
    },
};