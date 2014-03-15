
var Timer = {
    counter: null,
    startTimer: function () {
        this.stopTimer();
        this.counter = setInterval(App.getBusInfo, 30000); //App.getBusInfo() functionını 30saniyede bir çalıştır
    },
    stopTimer: function () {
        clearInterval(this.counter);
    }
};