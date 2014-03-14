cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.blackberry.connection/www/client.js",
        "id": "com.blackberry.connection.client",
        "clobbers": [
            "blackberry.connection"
        ]
    },
    {
        "file": "plugins/com.blackberry.ui.dialog/www/client.js",
        "id": "com.blackberry.ui.dialog.client",
        "clobbers": [
            "blackberry.ui.dialog"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.blackberry.connection": "1.0.0",
    "com.blackberry.ui.dialog": "1.0.0",
    "com.blackberry.utils": "1.0.0",
    "com.blackberry.jpps": "1.0.0"
}
// BOTTOM OF METADATA
});