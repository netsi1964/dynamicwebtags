/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */
define(function (require, exports, module) {


	var CommandManager = brackets.getModule("command/CommandManager"),
		Menus = brackets.getModule("command/Menus"),
		PanelManager = brackets.getModule("view/PanelManager"),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		AppInit = brackets.getModule("utils/AppInit");

	var DynamicwebTags_EXECUTE = "DynamicwebTags.execute";
	var panel;
	var panelHtml = require("text!panel.html");

	function log(s) {
		console.log("[DynamicwebTags] " + s);
	}

	function handleDynamicwebTags() {
		if (panel.isVisible()) {
			panel.hide();
			CommandManager.get(DynamicwebTags_EXECUTE).setChecked(false);
		} else {
			panel.show();
			CommandManager.get(DynamicwebTags_EXECUTE).setChecked(true);
		}
	}

	AppInit.appReady(function () {

		ExtensionUtils.loadStyleSheet(module, "DynamicwebTags.css");
		CommandManager.register("Dynamicweb tags", DynamicwebTags_EXECUTE, handleDynamicwebTags);

		var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
		menu.addMenuItem(DynamicwebTags_EXECUTE);

		panel = PanelManager.createBottomPanel(DynamicwebTags_EXECUTE, $(panelHtml), 200);

	});

});