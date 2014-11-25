/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, requirejs, tags */
define(function (require, exports, module) {


	var CommandManager = brackets.getModule("command/CommandManager"),
		Menus = brackets.getModule("command/Menus"),
		WorkspaceManager = brackets.getModule('view/WorkspaceManager'),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		AppInit = brackets.getModule("utils/AppInit");


	ExtensionUtils.loadStyleSheet(module, "style/styles.css");

	var DynamicwebTags_EXECUTE = "DynamicwebTags.execute";
	var panel;
	var panelHtml = require("text!templates/panel.html");
	var dynamicwebTags = require("dynamicwebTags");
	//	var autocomplete = require("javascript!jquery.autocomplete.min.js");

	function log(s) {
		console.log("[DynamicwebTags] " + s);
	}

	function handleDynamicwebTags() {
		if (typeof panel !== "undefined") {
			if (panel.isVisible()) {
				panel.hide();
				CommandManager.get(DynamicwebTags_EXECUTE).setChecked(false);
			} else {
				panel.show();
				$(".tags").text(dynamicwebTags.tags.length + " tags");
				$('#autocomplete').autocomplete({
					lookup: dynamicwebTags.tags,
					maxHeight: 400,
					formatResult: function (suggestion, currentValue) {
						return suggestion.data.replace(new RegExp(currentValue, "ig"), "<strong>" + currentValue + "</strong>") + " (" + suggestion.context + ")";
					},
					onSelect: function (suggestion) {
						$(".found").html("<small>&lt;!-- " + suggestion.context + " --&gt;</small><br>&lt;!--@" + suggestion.data + "--&gt;<br />" + $(".found").html());
					}
				});

				CommandManager.get(DynamicwebTags_EXECUTE).setChecked(true);
			}
		}
	}

	AppInit.appReady(function () {
		log("Starting panel");
		ExtensionUtils.loadStyleSheet(module, "DynamicwebTags.css");
		CommandManager.register("Dynamicweb tags", DynamicwebTags_EXECUTE, handleDynamicwebTags);

		var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
		menu.addMenuItem(DynamicwebTags_EXECUTE);

		panel = WorkspaceManager.createBottomPanel(DynamicwebTags_EXECUTE, $(panelHtml), 200);
		log("panel created");


	});

});