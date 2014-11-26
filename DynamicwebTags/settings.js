/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

/*global define */

define(function (require, exports, module) {
    "use strict";

    var sExtensionID = "dynamicwebtags"; // TO-DO: fetch from context or perhaps package

    var PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        prefs = PreferencesManager.getExtensionPrefs(sExtensionID),
        stateManager = PreferencesManager.stateManager.getPrefixedSystem(sExtensionID);

    exports.getSetting = function (sKey, sDefault) {
        var value = prefs.get(sKey);
        if (typeof value === "undefined") {
            value = (typeof sDefault !== "undefined") ? sDefault : "";
            prefs.set(sKey, value);
        }
        return value;
    }
     exports.setSetting = function (sKey, sValue) {
        prefs.set(sKey, sValue);
        return prefs.get(sKey);
    }
});