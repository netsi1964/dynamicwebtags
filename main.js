/*
Based - in part - on the HelloWorld sample extension on the Brackets wiki:
https://github.com/adobe/brackets/wiki/Simple-%22Hello-World%22-extension
*/
define(function(require, exports, module) {


    var CommandManager = brackets.getModule("command/CommandManager"),
    Menus = brackets.getModule("command/Menus"),
    PanelManager = brackets.getModule("view/PanelManager"),
    ExtensionUtils          = brackets.getModule("utils/ExtensionUtils"),
    AppInit = brackets.getModule("utils/AppInit");

    var NETSI1964TEST_EXECUTE = "netsi1964Test.execute";
    var panel;
    var panelHtml     = require("text!panel.html");

    function log(s) {
            console.log("[netsi1964Test] "+s);
    }

    function handleNetsi1964Test() {
        if(panel.isVisible()) {
            panel.hide();
            CommandManager.get(NETSI1964TEST_EXECUTE).setChecked(false);
        } else {
            panel.show();
            CommandManager.get(NETSI1964TEST_EXECUTE).setChecked(true);
        }
    }

    AppInit.appReady(function () {

        log("Hello from netsi1964Test.");
        ExtensionUtils.loadStyleSheet(module, "netsi1964Test.css");
        CommandManager.register("Run netsi1964Test", NETSI1964TEST_EXECUTE, handleNetsi1964Test);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(NETSI1964TEST_EXECUTE);

        panel = PanelManager.createBottomPanel(NETSI1964TEST_EXECUTE, $(panelHtml),200);

    });

});
