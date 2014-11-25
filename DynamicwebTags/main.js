/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, requirejs, tags */
define(function (require, exports, module) {


	var CommandManager = brackets.getModule("command/CommandManager"),
		Menus = brackets.getModule("command/Menus"),
		WorkspaceManager = brackets.getModule('view/WorkspaceManager'),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		AppInit = brackets.getModule("utils/AppInit"),
		EditorManager = brackets.getModule("editor/EditorManager");


	ExtensionUtils.loadStyleSheet(module, "style/styles.css");

	var DynamicwebTags_EXECUTE = "DynamicwebTags.execute";
	var panel, insertionPos, editor;
	var panelHtml = require("text!templates/panel.html");
	var dynamicwebTags = require("dynamicwebTags");
	var iDynamicwebTags = dynamicwebTags.tags.length;

	// var autocomplete = require("autocomplete");

	function log(s) {
		console.log("[DynamicwebTags] " + s);
	}

	function handleDynamicwebTags() {
		var $found = $(".found").off("click").on('click', insertTag);
		if (typeof panel !== "undefined") {
			log(dynamicwebTags);
			if (panel.isVisible()) {
				panel.hide();
				CommandManager.get(DynamicwebTags_EXECUTE).setChecked(false);
			} else {
				editor = EditorManager.getFocusedEditor();
				if (editor) {
					insertionPos = editor.getCursorPos();
				}
				panel.show();
				$(".tags").text(iDynamicwebTags + " tags");
				$('#autocomplete').on("keyup", function doSearch(e) {
					var searchFor = $.trim(this.value);
					var sFound = "";
					var iFound = 0;
					if (searchFor !== "") {
						for (var i = 0; iFound < 30 && i < iDynamicwebTags; i++) {
							var curr = dynamicwebTags.tags[i];
							if (curr.value.indexOf(searchFor) !== -1) {
								sFound += "<li><a href=\"#\" data-tag=\"" + curr.value + "\">" + curr.value + " (" + curr.context + ")</a></li>";
								iFound++;
							}
						}
						if (iFound === 0) {
							sFound = "<li>No tags found</li>";
						}
						$found.html(sFound);
					}
				});
				CommandManager.get(DynamicwebTags_EXECUTE).setChecked(true);
			}
		}
	}



	function insertTag(e) {
		var tag = e.toElement.attributes.getNamedItem("data-tag").value;
		if (tag !== "") {
			editor.document.replaceRange("<!--@" + tag + "-->", insertionPos);
		}

	}

	AppInit.appReady(function () {
		log("Starting panel");
		ExtensionUtils.loadStyleSheet(module, "DynamicwebTags.css");
		CommandManager.register("Dynamicweb tags", DynamicwebTags_EXECUTE, handleDynamicwebTags);

		var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
		menu.addMenuItem(DynamicwebTags_EXECUTE);

		panel = WorkspaceManager.createBottomPanel(DynamicwebTags_EXECUTE, $(panelHtml), 300);
		log("panel created");
		log(dynamicwebTags);

	});

});