require("./../state.js");
require("./../listeners/reload.js");
var record_id = require("./../utils/record_id.js").record_id;


/* This sets up the various running mode blockly/editor/repl
   for both Python and Javascript (if relevant).
   Note that at the very end, we select a default which could be
   superceded if we have set a different choice in the previous
   session and if that choice has been saved in local storage and
   retrieved.
 */

//TODO: add translations element to record_id

record_id("python-choices");
$("#python-choices").change(function() {
    if($(this).val() == "editor") {
        show_python_editor();
        hide_console();
        hide_blockly();
        RUR.state.input_method = "editor";
        editor.setOption("readOnly", false);
    } else if($(this).val() == "repl") {
        hide_python_editor();
        show_console();
        hide_blockly();
        RUR.state.input_method = "repl";
    } else {
        hide_python_editor();
        hide_console();
        show_blockly();
        RUR.state.input_method = "blockly";
        editor.setOption("readOnly", true);
    }
});

record_id("javascript-choices");
$("#javascript-choices").change(function() {
    if($(this).val() == "blockly") {
        hide_javascript_editor();
        show_blockly();
        RUR.state.input_method = "blockly";
        editor.setOption("readOnly", false);
    } else {
        show_javascript_editor();
        hide_blockly();
        RUR.state.input_method = "editor";
        editor.setOption("readOnly", true);
    }
});

record_id("editor-visible-blockly");
$('#editor-visible-blockly').change(function() {
    if ($('#editor-visible-blockly')[0].checked) {
        RUR.state.input_method = "editor";
        if (RUR.state.programming_language == "python"){
            show_python_editor();
        } else {
            show_javascript_editor();
        }
    } else {
        RUR.state.input_method = "blockly";
        if (RUR.state.programming_language == "python"){
            hide_python_editor();
        } else {
            hide_javascript_editor();
        }
    }
});

function show_blockly () {
    $("#blockly-wrapper").show();
    $("#visible-blockly").show();
    if ($("#special-keyboard-button").hasClass("reverse-blue-gradient")) {
        $("#special-keyboard-button").click();
    }
    $("#special-keyboard-button").hide();
    $("#Reeborg-watches").dialog("close");
    if ($('#editor-visible-blockly')[0].checked) {
        show_python_editor();
    }
    window.dispatchEvent(new Event('resize')); // important to ensure that blockly is visible
}

function hide_blockly () {
    $("#blockly-wrapper").hide();
    window.dispatchEvent(new Event('resize'));
    $("#visible-blockly").hide();
    $("#special-keyboard-button").show();
}

function show_javascript_editor () {
    $("#editor-panel").addClass("active");
    $("#kbd-javascript-btn").show();
    RUR.reload();
    editor.refresh();
}

function hide_javascript_editor () {
    $("#editor-panel").removeClass("active");
    $("#kbd-javascript-btn").hide();
}

function show_python_editor () {
    $("#editor-panel").addClass("active");
    $("#kbd-python-btn").show();
    RUR.state.highlight = RUR.state.highlight || RUR._saved_highlight_value;
    RUR.reload();
    editor.refresh();
}
function hide_python_editor () {
    $("#editor-panel").removeClass("active");
    $("#kbd-python-btn").hide();
    RUR._saved_highlight_value = RUR.state.highlight;
    RUR.state.highlight = false;
}
function show_console() {
    $("#py-console").show();
    $("#kbd-py-console-btn").show();
    $("#stop").hide();
    $("#pause").hide();
    $("#run").hide();
    $("#step").hide();
    $("#reverse-step").hide();
    $("#reload").hide();
    $("#reload2").show();
    $("#reload2").removeAttr("disabled");
    try {
        restart_repl();
    } catch (e) {
        console.log("trying to restart repl failure", e);
    }
}

function hide_console() {
    $("#py-console").hide();
    $("#kbd-py-console-btn").hide();
    $("#stop").show();
    $("#pause").show();
    $("#run").show();
    $("#step").show();
    $("#reverse-step").show();
    $("#reload").show();
    $("#reload2").hide();
}

hide_console();
