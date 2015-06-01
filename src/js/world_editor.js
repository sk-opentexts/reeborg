/*jshint  -W002,browser:true, devel:true, indent:4, white:false, plusplus:false */
/*globals $, RUR */

RUR.we = {};   // we == World Editor

RUR.we.__give_to_robot = false;

RUR.we.edit_world = function  () {
    "use strict"
    // usually triggered when canvas is clicked if editing world;
    // call explicitly if needed.
    var value;
    switch (RUR.we.edit_world_flag) {
        case "robot-place":
            RUR.we.place_robot();
            break;
        case "object-token":
        case "object-star":
        case "object-triangle":
        case "object-square":
        case "object-strawberry":
        case "object-banana":
        case "object-apple":
        case "object-orange":
        case "object-dandelion":
        case "object-carrot":
        case "object-tulip":
        case "object-daisy":
        case "object-box":
            value = RUR.we.edit_world_flag.substring(7);
            RUR.we._add_object(value);
            break;
        case "tile-mud":
        case "tile-water":
        case "tile-gravel":
        case "tile-ice":
        case "tile-grass":
            value = RUR.we.edit_world_flag.substring(5);
            RUR.we.toggle_tile(value);
            break;
        case "world-walls":
            RUR.we.toggle_wall();
            break;
        case "position-green_home_tile":
        case "position-house":
        case "position-racing_flag":
            value = RUR.we.edit_world_flag.substring(9);
            RUR.we.set_goal_position(value);
            break;
        case "goal-wall":
            RUR.we.toggle_goal_wall();
            break;
        case "goal-token":
        case "goal-star":
        case "goal-triangle":
        case "goal-square":
        case "goal-strawberry":
        case "goal-banana":
        case "goal-apple":
        case "goal-orange":
        case "goal-dandelion":
        case "goal-carrot":
        case "goal-tulip":
        case "goal-daisy":
        case "goal-box":
            value = RUR.we.edit_world_flag.substring(5);
            RUR.we._add_goal_objects(value);
            break;
        case "goal-no-objects":
            RUR.we.set_goal_no_objects();
            break;
        default:
            break;
    }
    RUR.we.refresh_world_edited();
};

RUR.we.select = function (choice) {
    "use strict"
    var value;
    $(".edit-world-canvas").hide();
    $(".edit-goal-canvas").hide();
    $("#edit-goal-position").hide();
    RUR.we.edit_world_flag = choice;
    switch (choice) {
        case "world-info":
            $("#cmd-result").html(RUR.translate("Click on world to get information.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "robot-place":
            $("#cmd-result").html(RUR.translate("Click on world to move robot.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "robot-add":
            $("#cmd-result").html(RUR.translate("Added robot.")).effect("highlight", {color: "gold"}, 1500);
            RUR.we.add_robot();
            RUR.we.edit_world();
            RUR.we.change_edit_robot_menu();
            break;
        case "robot-orientation":
            $("#cmd-result").html(RUR.translate("Click on image to turn robot")).effect("highlight", {color: "gold"}, 1500);
            $("#edit-world-turn").show();
            $("#random-orientation").show();
            break;
        case "robot-objects":
            RUR.we.__give_to_robot = true;
            $("#edit-world-objects").show();
            $("#cmd-result").html(RUR.translate("Click on desired object below.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "world-objects":
            $("#edit-world-objects").show();
            RUR.we.__give_to_robot = false;
            $("#cmd-result").html(RUR.translate("Click on desired object below.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "world-tiles":
            $("#edit-tile").show();
            $("#cmd-result").html(RUR.translate("Click on desired tile below.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "object-token":
        case "object-star":
        case "object-triangle":
        case "object-square":
        case "object-strawberry":
        case "object-banana":
        case "object-apple":
        case "object-orange":
        case "object-dandelion":
        case "object-carrot":
        case "object-tulip":
        case "object-daisy":
        case "object-box":
            value = choice.substring(7);
            $("#edit-world-objects").show();
            if (RUR.we.__give_to_robot) {
                $(".not-for-robot").hide();
                RUR.we._give_objects_to_robot(value);
                RUR.we.edit_world_flag = '';
            } else {
                $(".not-for-robot").show();
                if (value == "box"){
                    $("#cmd-result").html(RUR.translate("Click on world to add single object.").supplant({obj: RUR.translate(value)})).effect("highlight", {color: "gold"}, 1500);
                } else {
                    $("#cmd-result").html(RUR.translate("Click on world to add object.").supplant({obj: RUR.translate(value)})).effect("highlight", {color: "gold"}, 1500);
                }
            }
            break;
        case "tile-mud":
        case "tile-water":
        case "tile-ice":
        case "tile-gravel":
        case "tile-grass":
            value = choice.substring(5);
            $("#edit-tile").show();
            $("#cmd-result").html(RUR.translate("Click on world to toggle tile.").supplant({tile: RUR.translate(value)})).effect("highlight", {color: "gold"}, 1500);
            break;
        case "world-walls":
            $("#cmd-result").html(RUR.translate("Click on world to toggle walls.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "goal-robot":
            $("#edit-goal-position").show();
            $("#cmd-result").html(RUR.translate("Click on image desired to indicate the final position of the robot.")).effect("highlight", {color: "gold"}, 1500);
            break
        case "position-green_home_tile":
        case "position-house":
        case "position-racing_flag":
            $("#cmd-result").html(RUR.translate("Click on world to set home position for robot.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "goal-wall":
            $("#cmd-result").html(RUR.translate("Click on world to toggle additional walls to build.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "goal-objects":
            $("#edit-goal-objects").show();
            $("#cmd-result").html(RUR.translate("Click on desired goal object below.")).effect("highlight", {color: "gold"}, 1500);
            break;
        case "goal-token":
        case "goal-star":
        case "goal-triangle":
        case "goal-square":
        case "goal-strawberry":
        case "goal-banana":
        case "goal-apple":
        case "goal-orange":
        case "goal-dandelion":
        case "goal-carrot":
        case "goal-tulip":
        case "goal-daisy":
        case "goal-box":
            value = choice.substring(5);
            $("#edit-goal-objects").show();
            if (value == "box"){
            $("#cmd-result").html(RUR.translate("Click on world to set number of single goal objects.").supplant({obj: RUR.translate(value)})).effect("highlight", {color: "gold"}, 1500);
            } else {
            $("#cmd-result").html(RUR.translate("Click on world to set number of goal objects.").supplant({obj: RUR.translate(value)})).effect("highlight", {color: "gold"}, 1500);
            }

            $("#cmd-result").html(RUR.translate("Click on world to set number of goal objects.").supplant({obj: RUR.translate(value)})).effect("highlight", {color: "gold"}, 1500);
            break;
        case "goal-no-objects":
            $("#cmd-result").html(RUR.translate("Click on world at x=1, y=1 to have no object left as a goal.")).effect("highlight", {color: "gold"}, 1500);
            break;
    }
};

RUR.we.change_edit_robot_menu = function () {
    if ("robots" in RUR.current_world &&
        RUR.current_world.robots.length > 0) {
        $(".robot-absent").hide();
        $(".robot-present").show();
    } else {
        $(".robot-absent").show();
        $(".robot-present").hide();
    }
};

function toggle_editing_mode () {
    // $("#edit-world-panel").toggleClass("active");
    if (RUR.we.editing_world) {
        RUR.we.editing_world = false;
        editing_world_enable_run();
        RUR.WALL_COLOR = "brown";
        RUR.SHADOW_WALL_COLOR = "#f0f0f0";
        RUR.vis_world.draw_all();
        if (!Object.identical(RUR.current_world, RUR.world.saved_world)) {
            $("#memorize-world").trigger('click');
        }
    } else {
        RUR.we.change_edit_robot_menu();
        RUR.we.editing_world = true;
        RUR.WALL_COLOR = "black";
        RUR.SHADOW_WALL_COLOR = "#ccd";
        RUR.vis_world.draw_all();
        editing_world_disable_run();
        RUR.we.show_pre_post_code();
    }
}

RUR.we.refresh_world_edited = function () {
    // todo: see if we could draw fewer...
    RUR.vis_world.draw_all();
};

function editing_world_enable_run(){
    $("#run").removeAttr("disabled");
    $("#step").removeAttr("disabled");
}

function editing_world_disable_run() {
    $("#stop").attr("disabled", "true");
    $("#pause").attr("disabled", "true");
    $("#run").attr("disabled", "true");
    $("#step").attr("disabled", "true");
    $("#reload").attr("disabled", "true");
}

RUR.we.calculate_grid_position = function () {
    var ctx, x, y;
    x = RUR.we.mouse_x - $("#robot_canvas").offset().left;
    y = RUR.we.mouse_y - $("#robot_canvas").offset().top;

    x /= RUR.WALL_LENGTH;
    x = Math.floor(x);

    y = RUR.HEIGHT - y + RUR.WALL_THICKNESS;
    y /= RUR.WALL_LENGTH;
    y = Math.floor(y);

    if (x < 1 ) {
        x = 1;
    } else if (x > RUR.COLS) {
        x = RUR.COLS;
    }
    if (y < 1 ) {
        y = 1;
    } else if (y > RUR.ROWS) {
        y = RUR.ROWS;
    }
    return [x, y];
};

RUR.we.show_world_info = function (no_grid) {
    "use strict"
    // shows the information about a given grid position
    // when the user clicks on the canvas at that grid position.
    // enabled in doc_ready.js
    var position, tile, obj, information, x, y, coords, obj_here, obj_type, goals;
    var topic, no_object, r, robot, robots;

    information = "";
    $("#World-info").dialog("open");
    if (!no_grid) {
        position = RUR.we.calculate_grid_position();
        x = position[0];
        y = position[1];
        coords = x + "," + y;
        if (!isNaN(x)){
            information = "x = " + x + ", y = " + y;
        }
    }

    tile = RUR.control.get_tile_at_position(x, y);
    topic = true;
    if (tile){
        if (tile.info) {
            if (topic){
                topic = false;
                information += "<br><br><b>" + RUR.translate("Special information about this location:") + "</b>"
            }
            information += "<br>" + tile.info;
        }
    }
    obj = RUR.current_world.objects;
    topic = true;
    if (obj != undefined && obj[coords] != undefined){
        obj_here = obj[coords];
        for (obj_type in obj_here) {
            if (obj_here.hasOwnProperty(obj_type)) {
                    if (topic){
                        topic = false;
                        information += "<br><br><b>" + RUR.translate("Objects found here:") + "</b>";
                    }
               information += "<br>" + RUR.translate(obj_type) + ":" + obj_here[obj_type];
            }
        }
    }

    goals = RUR.current_world.goal;
    if (goals != undefined){
        obj = goals.objects;
        topic = true;
        if (obj != undefined && obj[coords] != undefined){
            obj_here = obj[coords];
            for (obj_type in obj_here) {
                if (obj_here.hasOwnProperty(obj_type)) {
                    if (topic){
                        topic = false;
                        information += "<br><br><b>" + RUR.translate("Goal to achieve:") + "</b>";
                    }
                   information += "<br>" + RUR.translate(obj_type) + ":" + obj_here[obj_type];
                }
            }
        }
    }

    no_object = true;
    if (goals != undefined){
        obj = goals.objects;
        topic = true;
        if (obj != undefined){
            for (coords in obj) {
                if (obj.hasOwnProperty(coords)) {
                    no_object = false;
                }
            }
        }
    } else {
        no_object = false;
    }


    if (goals != undefined){
        if (goals.walls != undefined && coords) {
            if (goals.walls[coords] !== undefined){
                if (goals.walls[coords].indexOf("east") != -1) {
                    information += "<br>" + RUR.translate("A wall must be built east of this location.");
                }
                if (goals.walls[coords].indexOf("north") != -1) {
                    information += "<br>" + RUR.translate("A wall must be built north of this location.");
                }
            }
            x -= 1;
            coords = x + "," + y;
            if (goals.walls[coords] !== undefined){
                if (goals.walls[coords].indexOf("east") != -1) {
                    information += "<br>" + RUR.translate("A wall must be built west of this location.");
                }
            }
            x += 1;
            y -= 1;
            coords = x + "," + y;
            if (goals.walls[coords] !== undefined){
                if (goals.walls[coords].indexOf("north") != -1) {
                    information += "<br>" + RUR.translate("A wall must be built south of this location.");
                }
            }
            y += 1;
            coords = x + "," + y;
        }
    }

    if (no_object){
        information += "<br><br><b>" + RUR.translate("Note: no object must be left in this world at the end of the program.") + "</b>";
    }

    robots = RUR.current_world.robots;
    if (robots != undefined && robots.length != undefined){
        for (r=0; r<robots.length; r++){
            robot = robots[r];
            x = robot.x;
            y = robot.y;
            if (robot.start_positions != undefined && robot.start_positions.length > 1){
                x = RUR.translate("random location");
                y = ''
            }
            no_object = true;
            for (obj in robot.objects){
                if (robot.objects.hasOwnProperty(obj)) {
                    if (no_object) {
                        no_object = false;
                        information += "<br><br><b>" + RUR.translate("A robot located here carries:").supplant({x:x, y:y}) + "</b>"
                    }
                    information += "<br>" + RUR.translate(obj) + ":" + robot.objects[obj];
                }
            }
            if (no_object){
                information += "<br><br><b>" + RUR.translate("A robot located here carries no objects.").supplant({x:x, y:y}) + "</b>"
            }
        }
    }


    if (RUR.current_world.description) {
        information += "<br><br><b>" + RUR.translate("Description") + "</b><br>" + RUR.current_world.description;
    }

    $("#World-info").html(information);
}


RUR.we.place_robot = function () {
    "use strict";
    var position, world=RUR.current_world, robot, arr=[], pos, present=false;
    position = RUR.we.calculate_grid_position();
    if (world.robots !== undefined){
        if (world.robots.length >0) {
            robot = world.robots[0];
            if (!robot.start_positions){
                robot.start_positions = [[robot.x, robot.y]];
            }
        } else {
            RUR.we.add_robot();
            robot = world.robots[0];
            robot.x = position[0];
            robot.y = position[1];
            robot._prev_x = robot.x;
            robot._prev_y = robot.y;
            robot.start_positions = [[robot.x, robot.y]];
            return;
        }
    }

    for (var i=0; i < robot.start_positions.length; i++){
        pos = robot.start_positions[i];
        if(pos[0]==position[0] && pos[1]==position[1]){
            present = true;
        } else {
            arr.push(pos);
            robot.x = pos[0];
            robot.y = pos[1];
        }
    }
    if (!present){
        arr.push(position);
        robot.x = position[0];
        robot.y = position[1];
    }

    if (arr.length===0){
        RUR.current_world.robots = [];
        RUR.we.change_edit_robot_menu();
        return;
    }

    robot.start_positions = arr;
    robot._prev_x = robot.x;
    robot._prev_y = robot.y;
};


RUR.we._give_objects_to_robot = function (specific_object){
    "use strict";
    var query;
    query = prompt(RUR.translate("Enter number of objects to give to robot.").supplant({obj: specific_object}));
    if (query != null){
        RUR.we.give_objects_to_robot(specific_object, query);
        RUR.we.show_world_info(true);
    }
};


RUR.we.give_objects_to_robot = function (obj, nb, robot) {
    var translated_arg = RUR.translate_to_english(obj);

    if (RUR.objects.known_objects.indexOf(translated_arg) == -1){
        throw new RUR.ReeborgError(RUR.translate("Unknown object").supplant({obj: obj}));
    }

    obj = translated_arg;
    if (robot == undefined){
        robot = RUR.current_world.robots[0];
    }
    RUR.we.ensure_key_exist(robot, "objects");

    if (nb === "inf"){
        robot.objects[obj] = "infinite"
    } else if (RUR.filterInt(nb) >= 0) {
        if (nb==0 && robot.objects[obj] != undefined) {
            delete robot.objects[obj]
        } else {
            robot.objects[obj] = nb;
        }
    } else {
        $("#Reeborg-shouts").html(nb + RUR.translate(" is not a valid value!")).dialog("open");
    }
};

RUR.we.turn_robot = function (orientation) {
    if (RUR.we.edit_world_flag === "goal-robot") {
        RUR.we.set_goal_orientation(orientation);
        RUR.we.refresh_world_edited();
        return;
    }

    RUR.current_world.robots[0].orientation = orientation;
    RUR.current_world.robots[0]._prev_orientation = orientation;
    RUR.we.refresh_world_edited();
};

RUR.we.add_robot = function () {
    "use strict";
    RUR.current_world.robots = [RUR.robot.create_robot()];
};

RUR.we.calculate_wall_position = function () {
    var ctx, x, y, orientation, remain_x, remain_y, del_x, del_y;
    x = RUR.we.mouse_x - $("#robot_canvas").offset().left;
    y = RUR.we.mouse_y - $("#robot_canvas").offset().top;

    y = RUR.BACKGROUND_CANVAS.height - y;  // count from bottom

    x /= RUR.WALL_LENGTH;
    y /= RUR.WALL_LENGTH;
    remain_x = x - Math.floor(x);
    remain_y = y - Math.floor(y);

    // del_  denotes the distance to the closest wall
    if (Math.abs(1.0 - remain_x) < remain_x) {
        del_x = Math.abs(1.0 - remain_x);
    } else {
        del_x = remain_x;
    }

    if (Math.abs(1.0 - remain_y) < remain_y) {
        del_y = Math.abs(1.0 - remain_y);
    } else {
        del_y = remain_y;
    }

    x = Math.floor(x);
    y = Math.floor(y);

    if ( del_x < del_y ) {
        orientation = "east";
        if (remain_x < 0.5) {
            x -= 1;
        }
    } else {
        orientation = "north";
        if (remain_y < 0.5) {
            y -= 1;
        }
    }

    if (x < 1 ) {
        x = 1;
    } else if (x > RUR.COLS) {
        x = RUR.COLS;
    }
    if (y < 1 ) {
        y = 1;
    } else if (y > RUR.ROWS) {
        y = RUR.ROWS;
    }

    return [x, y, orientation];
};

RUR.we.toggle_wall = function () {
    var position, x, y, orientation, coords, index;
    position = RUR.we.calculate_wall_position();
    x = position[0];
    y = position[1];
    orientation = position[2];
    coords = x + "," + y;

    RUR.we.ensure_key_exist(RUR.current_world, "walls");
    if (RUR.current_world.walls[coords] === undefined){
        RUR.current_world.walls[coords] = [orientation];
    } else {
        index = RUR.current_world.walls[coords].indexOf(orientation);
        if (index === -1) {
            RUR.current_world.walls[coords].push(orientation);
        } else {
            RUR.current_world.walls[coords].remove(index);
            if (RUR.current_world.walls[coords].length === 0){
                delete RUR.current_world.walls[coords];
            }
        }
    }
};


RUR.we.toggle_goal_wall = function () {
    var position, response, x, y, orientation, coords, index;
    position = RUR.we.calculate_wall_position();
    x = position[0];
    y = position[1];
    orientation = position[2];
    coords = x + "," + y;

    RUR.we.ensure_key_exist(RUR.current_world, "goal");
    RUR.we.ensure_key_exist(RUR.current_world.goal, "walls");
    if (RUR.current_world.goal.walls[coords] === undefined){
        RUR.current_world.goal.walls[coords] = [orientation];
    } else {
        index = RUR.current_world.goal.walls[coords].indexOf(orientation);
        if (index === -1) {
            RUR.current_world.goal.walls[coords].push(orientation);
        } else {
            RUR.current_world.goal.walls[coords].remove(index);
            if (Object.keys(RUR.current_world.goal.walls[coords]).length === 0){
                delete RUR.current_world.goal.walls[coords];
                if (Object.keys(RUR.current_world.goal.walls).length === 0) {
                    delete RUR.current_world.goal.walls;
                    if (Object.keys(RUR.current_world.goal).length === 0) {
                        delete RUR.current_world.goal;
                    }
                }
            }
        }
    }
};

RUR.we.ensure_key_exist = function(obj, key){
    "use strict";
    if (obj[key] === undefined){
        obj[key] = {};
    }
};

RUR.we.insert_pre_code = function() {
    if (RUR.current_world.pre_code === undefined){
        RUR.current_world.pre_code = '';
        RUR.current_world.post_code = '';
    }
    RUR.current_world.pre_code = editor.getValue();
    RUR.we.show_pre_post_code();
}

RUR.we.insert_post_code = function() {
    if (RUR.current_world.post_code === undefined){
        RUR.current_world.pre_code = '';
        RUR.current_world.post_code = '';
    }
    RUR.current_world.post_code = editor.getValue();
    RUR.we.show_pre_post_code();
}

RUR.we.add_description = function() {
    if (RUR.current_world.description === undefined){
        RUR.current_world.description = '';
    }
    RUR.current_world.description = editor.getValue();
    RUR.we.show_world_info();
}

RUR.we.show_pre_post_code = function() {
    if (RUR.current_world.pre_code == undefined) {
        $("#code-copied").html('');
        return;
    }
    $("#code-copied").html("<br>pre-code: <pre>" + RUR.current_world.pre_code +
                           "</pre>post-code:<pre>" + RUR.current_world.post_code + "</pre>");
}


RUR.we._add_object = function (specific_object){
    "use strict";
    var position, x, y, query, tmp;
    position = RUR.we.calculate_grid_position();
    x = position[0];
    y = position[1];
    if (specific_object == "box") {
        if (RUR.current_world.objects != undefined &&
            RUR.current_world.objects[x+','+y] != undefined &&
            RUR.current_world.objects[x+','+y]["box"] == 1){
            RUR.we.add_object("box", x, y, 0);
        } else {
            RUR.we.add_object("box", x, y, 1);
        }
        return;
    }
    query = prompt(RUR.translate("Enter number of objects desired at that location.").supplant({obj: specific_object}));
    if (query != null){
        RUR.we.add_object(specific_object, x, y, query);
    }
};


RUR.we.add_object = function (specific_object, x, y, nb){
    "use strict";
    var coords, translated_arg, tmp;
    try {
        tmp = parseInt(nb, 10);
        nb = tmp;
    } catch (e) {}

    translated_arg = RUR.translate_to_english(specific_object);
    if (RUR.objects.known_objects.indexOf(translated_arg) == -1){
        throw new RUR.ReeborgError(RUR.translate("Unknown object").supplant({obj: specific_object}));
    }

    specific_object = translated_arg;
    coords = x + "," + y;
    RUR.we.ensure_key_exist(RUR.current_world, "objects");
    RUR.we.ensure_key_exist(RUR.current_world.objects, coords);

    if (nb==0) {
        delete RUR.current_world.objects[coords][specific_object];
        if (Object.keys(RUR.current_world.objects[coords]).length === 0){
            delete RUR.current_world.objects[coords];
        }
        if (Object.keys(RUR.current_world.objects).length === 0){
            delete RUR.current_world.objects;
        }
    } else {
        RUR.current_world.objects[coords][specific_object] = nb;
    }
};


RUR.we._add_goal_objects = function (specific_object){
    "use strict";
    var position, x, y, coords, query;
    position = RUR.we.calculate_grid_position();
    x = position[0];
    y = position[1];
    coords = x + "," + y;

    if (specific_object == "box") {
        RUR.we.add_goal_objects("box", x, y, 1);
        return;
    }

    query = prompt(RUR.translate("Enter number of objects desired as a goal at that location."));
    if (query == null){
        return;
    }
    if (query != "all"){
        try {
            query = parseInt(query, 10);
            if (isNaN(query)){
                $("#cmd-result").html(RUR.translate("Only integer values or 'all' please!")).effect("highlight", {color: "gold"}, 1500);
                return;
            }
        } catch (e) {
                $("#cmd-result").html(RUR.translate("Only integer values or 'all' please!")).effect("highlight", {color: "gold"}, 1500);
            return;
        }
    }

    RUR.we.add_goal_objects(specific_object, x, y, query)
};

RUR.we.add_goal_objects = function (specific_object, x, y, nb){
    "use strict";
    var coords;

    coords = x + "," + y;

    RUR.we.ensure_key_exist(RUR.current_world, "goal");
    RUR.we.ensure_key_exist(RUR.current_world.goal, "objects");
    RUR.we.ensure_key_exist(RUR.current_world.goal.objects, coords);
    if (nb==0) {
        delete RUR.current_world.goal.objects[coords][specific_object];
        if (Object.keys(RUR.current_world.goal.objects).length === 0){
            delete RUR.current_world.goal.objects[coords];
        }
        if (Object.keys(RUR.current_world.goal.objects).length === 0){
            delete RUR.current_world.goal.objects;
        }
        if (Object.keys(RUR.current_world.goal).length === 0){
            delete RUR.current_world.goal;
        }
    } else {
        RUR.current_world.goal.objects[coords][specific_object] = nb;
    }
};


RUR.we.set_goal_position = function (home){
    // will remove the position if clicked again.
    "use strict";
    var position, world=RUR.current_world, robot, arr=[], pos, present=false, goal;

    $("#cmd-result").html(RUR.translate("Click on world to set home position for robot.")).effect("highlight", {color: "gold"}, 1500);
    $("#edit-world-turn").show();
    $("#random-orientation").hide();

    RUR.we.ensure_key_exist(world, "goal");
    goal = world.goal;

    if (goal.possible_positions === undefined) {
        RUR.we.ensure_key_exist(goal, "possible_positions");
        if (goal.position !== undefined) {
            goal.possible_positions = [[goal.position.x, goal.position.y]];
        } else {
            RUR.we.ensure_key_exist(goal, "position");
        }
    }

    goal.position.image = home;

    position = RUR.we.calculate_grid_position();
    goal.position.x = position[0];
    goal.position.y = position[1];

    for(var i=0; i<goal.possible_positions.length; i++) {
        pos = goal.possible_positions[i];
        if(pos[0]==position[0] && pos[1]==position[1]){
            present = true;
        } else {
            arr.push(pos);
            goal.position.x = pos[0];
            goal.position.y = pos[1];
        }
    }

    if (!present){
        arr.push(position);
        goal.position.x = position[0];
        goal.position.y = position[1];
    }
    goal.possible_positions = arr;

    if (arr.length == 0) {
        delete RUR.current_world.goal.position;
        delete RUR.current_world.goal.possible_positions;
        if (Object.keys(RUR.current_world.goal).length === 0) {
            delete RUR.current_world.goal;
        }
        $("#edit-world-turn").hide();
    }
};

RUR.we.set_goal_no_objects = function(){
    "use strict";
    var position;
    position = RUR.we.calculate_grid_position();
    if (position[0] !== 1 || position[1] !== 1) {
        $("#cmd-result").html(RUR.translate("No effect.")).effect("highlight", {color: "gold"}, 1500);
        return;
    }
    RUR.we.ensure_key_exist(RUR.current_world, "goal");
    RUR.current_world.goal.objects = {};
    $("#cmd-result").html(RUR.translate("Goal: no object left in world.")).effect("highlight", {color: "gold"}, 1500);
};


RUR.we.toggle_tile = function (tile){
    // will remove the position if clicked again with tile of same type.
    "use strict";
    var x, y, position, coords, index;

    position = RUR.we.calculate_grid_position();
    x = position[0];
    y = position[1];
    coords = x + "," + y;

    RUR.we.ensure_key_exist(RUR.current_world, "tiles");
    if (RUR.current_world.tiles[coords] === undefined ||
        RUR.current_world.tiles[coords] != tile){
        RUR.current_world.tiles[coords] = tile;
    } else {
        delete RUR.current_world.tiles[coords];
    }
};


RUR.we.add_top_tile = function (specific_object, x, y, nb){
    "use strict";
    var coords, translated_arg, tmp;
    try {
        tmp = parseInt(nb, 10);
        nb = tmp;
    } catch (e) {}

    translated_arg = RUR.translate_to_english(specific_object);

    specific_object = translated_arg;
    coords = x + "," + y;
    RUR.we.ensure_key_exist(RUR.current_world, "top_tiles");
    RUR.we.ensure_key_exist(RUR.current_world.top_tiles, coords);

    if (nb==0) {
        delete RUR.current_world.top_tiles[coords][specific_object];
        if (Object.keys(RUR.current_world.top_tiles[coords]).length === 0){
            delete RUR.current_world.top_tiles[coords];
        }
        if (Object.keys(RUR.current_world.top_tiles).length === 0){
            delete RUR.current_world.top_tiles;
        }
    } else {
        RUR.current_world.top_tiles[coords][specific_object] = nb;
    }
};