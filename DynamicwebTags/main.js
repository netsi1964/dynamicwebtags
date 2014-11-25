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
	var panel, insertionPos, editor, language;
	var panelHtml = require("text!templates/panel.html");
	var dynamicwebTags = require("dynamicwebTags");
	var iDynamicwebTags = dynamicwebTags.tags.length;

	// var autocomplete = require("autocomplete");

	function log(s) {
		console.log("[DynamicwebTags] " + s);
	}

	function wrapAsTag(sTag) {
		var sWrappedTag = sTag;
		switch (sTag) {
		case "XML":
			sWrappedTag = "<xsl:value-of select=\"" + sWrappedTag + "\" />";
			break;
		case "C#":
			sWrappedTag = "@GetValue(\"" + sWrappedTag + "\") />";
			break;
		default:
			sWrappedTag = "<!--@" + sWrappedTag + "-->";
			break;
		}
	}


	function insertTag(e) {
		var tag = e.toElement.attributes.getNamedItem("data-tag").value;
		if (tag !== "") {
			var pos = editor.getCursorPos();
			pos = (typeof pos === "undefined") ? {
				line: 0,
				ch: 0
			} : pos;
			editor.document.replaceRange(wrapAsTag(tag), editor.getCursorPos());
		}

	}

	function handleDynamicwebTags() {
		var $found = $(".found").off("click").on('click', insertTag);
		if (typeof panel !== "undefined") {
			if (panel.isVisible()) {
				panel.hide();
				CommandManager.get(DynamicwebTags_EXECUTE).setChecked(false);
			} else {
				editor = EditorManager.getFocusedEditor();
				language = EditorManager.getFocusedEditor().document.language._name;
				console.log(language);
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
								sFound += "<li><a href=\"#\" data-tag=\"" + curr.value + "\">" + curr.value + "</a> (" + curr.context + ")</li>";
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


	AppInit.appReady(function () {
		log("Starting panel");

		ExtensionUtils.loadStyleSheet(module, "DynamicwebTags.css");
		CommandManager.register("Dynamicweb tags", DynamicwebTags_EXECUTE, handleDynamicwebTags);

		var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
		menu.addMenuItem(DynamicwebTags_EXECUTE);

		panel = WorkspaceManager.createBottomPanel(DynamicwebTags_EXECUTE, $(panelHtml), 300);
		log("panel created");
		$("[data-action='close']").on("click", function () {
			panel.hide();
			CommandManager.get(DynamicwebTags_EXECUTE).setChecked(false);
		});

	});

});