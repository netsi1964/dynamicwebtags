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

    var DynamicwebTags = require("dynamicwebTags");
    var Settings = require("settings");
    var DynamicwebTags_EXECUTE = "DynamicwebTags.execute";
    var panel, insertionPos, editor, language;
    var ignoreCase = Settings.getSetting("ignorecase", true);
    var iMaxShow = Settings.getSetting("maxshow", 150);
    var bShowPanel = Settings.getSetting("showpanel", false);
    var $count;
    var panelHtml = require("text!templates/panel.html");

    var iDynamicwebTags = DynamicwebTags.tags.length;
    var searchTags = [];
    [].forEach.call(DynamicwebTags.tags, function prepearForSearch(tag) {
        searchTags.push(tag.value.toLowerCase());
    });

    // var autocomplete = require("autocomplete");

    function log(s) {
        console.log("[DynamicwebTags] " + s);
    }

    function wrapAsTag(sTag) {
        var sWrappedTag = sTag;
        var sFilename = editor.getFile()._path;
        var extType = sFilename.substring(sFilename.lastIndexOf(".") + 1).toLowerCase();
        var _language = ("|cshtml|vbhtml|".indexOf("|"+extType + "|") > -1 || language === "C#") ? "Razor" : language;
        switch (_language) {
        case "XML":
            sWrappedTag = "<xsl:value-of select=\"" + sWrappedTag + "\" />";
            break;
        case "Razor":
            sWrappedTag = "@GetValue(\"" + sWrappedTag + "\")";
            break;
        default:
            sWrappedTag = "<!--@" + sWrappedTag + "-->";
            break;
        }
        return sWrappedTag;
    }


    function insertTag(e) {
        editor = EditorManager.getActiveEditor();
        language = editor.getLanguageForSelection()._name;
        var tag = e.toElement.attributes.getNamedItem("data-tag").value;
        if (tag !== "") {
            var pos = editor.getCursorPos();
            pos = (typeof pos === "undefined") ? {
                line: 0,
                ch: 0
            } : pos;
            insertText(wrapAsTag(tag));
        }

    }

    function insertText(sText) {
        var cursor = editor.getCursorPos(),
            start = {
                line: -1,
                ch: -1
            },
            end = {
                line: -1,
                ch: -1
            },
            offset = 0,
            charCount = 0;

        end.line = start.line = cursor.line;
        start.ch = cursor.ch - offset;
        end.ch = start.ch + charCount;

        if (start.ch !== end.ch) {
            editor.document.replaceRange(sText, start, end);
        } else {
            editor.document.replaceRange(sText, start);
        }
    }

    function handleDynamicwebTags() {
        var $found = $(".found").off("click").on('click', insertTag);
        if (typeof panel !== "undefined") {
            if (panel.isVisible()) {
                panel.hide();
                CommandManager.get(DynamicwebTags_EXECUTE).setChecked(false);
                Settings.setSetting("showpanel", false);
            } else {
                if (editor) {
                    insertionPos = editor.getCursorPos();
                }
                panel.show();
                $(".tags").text(iDynamicwebTags + " tags");
                $('#autocomplete').on("keyup", function doSearch(e) {
                    var searchFor = $.trim(this.value);
                    searchFor = (ignoreCase) ? searchFor.toLowerCase() : searchFor;
                    var sFound = "";
                    var iFound = 0;
                    if (searchFor !== "") {
                        for (var i = 0; iFound < iMaxShow && i < iDynamicwebTags; i++) {
                            var curr = searchTags[i];
                            if (curr.indexOf(searchFor) !== -1) {
                                sFound += "<li><a href=\"#\" data-tag=\"" + DynamicwebTags.tags[i].value + "\">" + DynamicwebTags.tags[i].value + "</a> <small>" + DynamicwebTags.tags[i].context + "</small></li>";
                                iFound++;
                            }
                        }
                        if (iFound === 0) {
                            sFound = "<li>No tags found</li>";
                        }
                        $count.text((iFound == iMaxShow) ? "Showing first " + iFound.toString() + " found" : "Found " + iFound.toString());
                        $found.html(sFound);
                    }
                });
                CommandManager.get(DynamicwebTags_EXECUTE).setChecked(true);
                Settings.setSetting("showpanel", true);
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
            Settings.setSetting(showpanel, false);
        });

        bShowPanel = Settings.getSetting("showpanel", false);
        if (bShowPanel) {
            handleDynamicwebTags();
        }

        $count = $(".count");
        $(".inactive").hide();
    });

});