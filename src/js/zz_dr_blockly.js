/* jshint -W069 */

Blockly.Blocks['_move_'] = {
  // block for moving forward
  init: function() {
    this.setColour(290);
    this.appendDummyInput().appendField(RUR.translate("move")+"()");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(RUR.translate("move forward"));
  }
};


Blockly.Python['_move_'] = function(block) {
  // Generate Python for moving forward.
  return RUR.translate("move")+'()\n';
};

Blockly.JavaScript['_move_'] = function(block) {
  // Generate Javascript for moving forward.
  return RUR.translate("move")+'();\n';
};


Blockly.Blocks['_turn_left_'] = {
  // block for moving forward
  init: function() {
    this.setColour(290);
    this.appendDummyInput().appendField(RUR.translate("turn_left")+"() \u21BA");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(RUR.translate("turn left"));
  }
};


Blockly.Python['_turn_left_'] = function(block) {
  // Generate Python for moving forward.
  return RUR.translate("turn_left")+'()\n';
};

Blockly.JavaScript['_turn_left_'] = function(block) {
  // Generate Javascript for moving forward.
  return RUR.translate("turn_left")+'();\n';
};


// over-riding default
Blockly.JavaScript['text_print'] = function(block) {
  // Print statement.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return RUR.translate("write")+'(' + argument0 + '\n);\n';
};
Blockly.Python.INDENT = '    ';

RUR.blockly = {};
RUR.blockly.workspace = Blockly.inject('blocklyDiv',
          {toolbox: document.getElementById('toolbox')});

$("#blocklyDiv").resizable({
    resize: function() {
        $("#blocklyDiv:first-child").height($(this).height()-1).width($(this).width()-1);
        window.dispatchEvent(new Event('resize'));
    }
});

$("#blockly-wrapper").draggable({
    cursor: "move",
    handle: "p",
    drag: function( event, ui ) {
        window.dispatchEvent(new Event('resize'));
    },
    stop: function( event, ui ) {
        window.dispatchEvent(new Event('resize'));
    }
});