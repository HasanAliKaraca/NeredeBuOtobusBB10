
var Application = {

    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', ConnectionStatus.offline, false);
        document.addEventListener('online', ConnectionStatus.online, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        Application.receivedEvent('deviceready');

        bb.init({
            actionBarDark: true,
            controlsDark: true,
            listsDark: false,

            // Fires "before" styling is applied and "before" the screen is inserted in the DOM
            onscreenready: function (element, id) { },

            // Fires "after" styling is applied and "after" the screen is inserted in the DOM
            ondomready: function (element, id) {
                $("#txtDurakNo").val(localStorage.getItem("lastDurakNo"));
                $("#txtHatNo").val(localStorage.getItem("lastHatNo"));
                $("#txtDurakNo").focus();

                
            }
        });

        App.startApplication();

    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },
};
