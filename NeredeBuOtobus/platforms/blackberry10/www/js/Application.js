
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

        try {
            // register with bbm
            Bbm.register();
            // setup active frame / window cover
            App.ui.windowCover.setup('local:///images/cover.png');
        } catch (e) {
            alert(e);
            console.log('BBM / Window Covers will not work in the browser. On device only.');
        }

        App.startApplication();

    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },
};


// filepicker (async)

function pickFile() {
    Invoke.utils.filePicker(function (path) {
        Toast.regular('Picked: ' + path, 3000);
    },

        function (reason) {
            Toast.regular('Card canceled: ' + reason);
        },

        function (error) {
            console.log(error);
        });
}

// camera (async)

function takePhoto() {
    Invoke.utils.camera(function (path) {
        Toast.regular('Photo: ' + path, 3000);
    },

        function (reason) {
            Toast.regular('Card canceled: ' + reason);
        },

        function (error) {
            console.log(error);
        });
}

// sample toast button callback

function toastCallback() {
    alert('In the callback!');
}

// spinner usage

function spinner(size) {
    // hide the current spinner, if it's visible
    Spinner.off();
    Spinner.on(size);
}

// show a welcome message

function welcome() {
    Toast.regular('Welcome to the BFB Sample!', 2000);
    setTimeout(function () {
        Toast.regular('Swipe down to see the App Menu!', 2000);
        setTimeout(function () {
            Toast.regular('Minimize the app to see the Window Cover', 2300);
        }, 2300);
    }, 2300);
}