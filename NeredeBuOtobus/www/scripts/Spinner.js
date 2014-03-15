/* ===========================================================================================
 *	SPINNERS - https://github.com/blackberry/bbUI.js/wiki/Activity-Indicator
 * ======================================================================================== */
// spinner divs in spinners.html

var Spinner = {
    'visible': false,

    off: function () {
        document.getElementById('spinner').style.display = 'none';
        Spinner.visible = false;

    },

    on: function () {
       document.getElementById('spinner').style.display = 'block';
        Spinner.visible = true;
    }
};