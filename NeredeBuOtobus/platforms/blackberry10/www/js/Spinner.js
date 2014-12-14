var Spinner = {
    visible: false,

    off: function () {
        //document.getElementById('spinner').style.display = 'none';
        $("#spinner").hide();
        Spinner.visible = false;

    },

    on: function () {
        //document.getElementById('spinner').style.display = 'block';
        $("#spinner").show();
        Spinner.visible = true;
    }
};