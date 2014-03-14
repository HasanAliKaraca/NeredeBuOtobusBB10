/* ===========================================================================================
 *	SPINNERS - https://github.com/blackberry/bbUI.js/wiki/Activity-Indicator
 * ======================================================================================== */
// spinner divs in spinners.html

var Spinner = {
    'visible': false,

    off: function () {
        var el = document.getElementById('spinner');
        el.style.display = 'none';
        Spinner.visible = false;

    },

    on: function () {
        var el = document.getElementById('spinner');
        el.style.display = 'block';

        Spinner.visible = true;
    }
};