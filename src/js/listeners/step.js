
require("./../rur.js");
require("./reload.js");
require("./../runner/runner.js");
require("./../playback/play.js");
var record_id = require("./../../lang/msg.js").record_id;

var step_button = document.getElementById("step");
record_id("step");

step = function () {
    RUR.runner.run(RUR.rec.display_frame);
    RUR.state.stop_called = false;
    $("#stop").removeAttr("disabled");
    $("#reverse-step").removeAttr("disabled");
    $("#frame-selector").removeAttr("disabled").addClass("enabled").removeClass("disabled");
    $("#frame-selector").show();
    $("#frame-id").show();
    clearTimeout(RUR._TIMER);

    $("#highlight").attr("disabled", "true");
    $("#watch-variables-btn").attr("disabled", "true");

    $("#open-solution-btn").attr("disabled", "true");
    $("#save-solution-btn").attr("disabled", "true");

};
step_button.addEventListener("click", step, false);
