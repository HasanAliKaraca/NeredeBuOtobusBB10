
var Timer = {
    working: false,

    counter: null,

    start: function () {
        this.working = true;
        this.stop();
        this.counter = setInterval(App.getBusInfo, 30000); //App.getBusInfo() functionını 30saniyede bir çalıştır
    },

    stop: function () {
        clearInterval(this.counter);
        this.working = false;
    }
};