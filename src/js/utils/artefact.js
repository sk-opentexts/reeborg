/*  This file contains generic methods called by more specialized methods
    used to create worlds. */

require("./../rur.js");
require("./utils_namespace.js");
require("./../translator.js");
require("./../programming_api/exceptions.js");
require("./key_exist.js");
require("./validator.js");
require("./supplant.js");
get_world = require("./../world_utils/get_world.js").get_world;


// private helper function that
// ensures that the position is within the world boundaries
function ensure_valid_position(args) {
    "use strict";
    var position;
    if (args.x !== undefined && args.y !== undefined) {
        if (!RUR.utils.is_valid_position(args.x, args.y)) {
            position = "(" + args.x + ", " + args.y + ")";
            throw new RUR.ReeborgError(
                RUR.translate("Invalid position.").supplant({pos:position}));
        }
    } else {
        if (args.x === undefined) args.x = "?";
        if (args.y === undefined) args.y = "?";
        position = "(" + args.x + ", " + args.y + ")";
        throw new RUR.ReeborgError(
            RUR.translate("Invalid position.").supplant({pos:position}));
    }
}

function ensure_common_required_args_present(args) {
    "use strict";
    ensure_valid_position(args);
    if (args.type === undefined) {
        throw new Error("Object type must be specified.");
    }
    if (args.name === undefined) {
        throw new Error("Object name must be specified.");
    }
    if (args.valid_names !== undefined) {
        if (args.valid_names.indexOf(args.name) === -1) {
            throw new Error("Invalid name");
        }
    }
}

// for testing purpose
if (RUR.UnitTest === undefined) {
    RUR.UnitTest = {};
}
RUR.UnitTest.ensure_common_required_args_present = ensure_common_required_args_present;

/** @function set_nb_artefact
 * @memberof RUR.utils
 * @instance
 * @summary **This function is intended for private use by developers.**
 * 
 *    This function adds a specified number of a named artefact of a 
 *    specified type (e.g. object, goal object) at
 *    a given location.
 *    
 *    
 * @param {Object} args A Javascript object (similar to a Python dict) that
 *                      holds the relevant attribute.
 *
 * @param {string} args.name  The name of the object to be added; an error
 *    will be thrown if it is missing.
 *
 * @param {integer} args.number  The number of artefacts to be added; an error
 *    will be thrown if it is missing or if its value is not an integer 
 *    strictly greater than zero.
 *    
 * @param {string} args.type  The type of the object to be added; an error
 *    will be thrown if it is missing.
 * 
 * @param {integer} args.x The `x` coordinate where the object should be found.
 *                        If it is missing, or not within the world boundaries,
 *                        or is not an integer, an error will be thrown.
 *
 * @param {integer} args.y The `y` coordinate where the object should be found.
 *                        If it is missing, or not within the world boundaries,
 *                        or is not an integer, an error will be thrown.
 *
 * @param {boolean} [args.goal] If specified, indicates that it is a goal that
 *                        must be set.
 *
 * 
 * @param {string} [args.valid_names] A list containing the name of the 
 *                        acceptable objects. If this argument is specified, 
 *                        `args.name` must be found in that list, otherwise an
 *                        error will be thrown.
 *
 * 
 * @throws Will throw an error if `name` attribute is not specified.
 * @throws Will throw an error if `type` attribute is not specified.
 * @throws Will throw an error if `number` attribute is not specified.
 * @throws Will throw an error if `number` attribute is not a positive integer
 * @throws Will throw an error if a valid position is not specified.
 *
 * @see {@link UnitTest#test_artefact} for unit tests.
 *  
 */
RUR.utils.set_nb_artefact = function (args) {
    "use strict";
    var base, coords, world = get_world();

    ensure_common_required_args_present(args);
    if (args.number === undefined) {
        throw new Error("Number of objects must be specified.");
    } else if(!RUR.utils.is_positive_integer(args.number)) {
        throw new Error("Number must be a positive integer.");    
    }

    coords = args.x + "," + args.y;
    base = world;
    if (args.goal) {
        RUR.utils.ensure_key_for_obj_exists(world, "goal");
        base = world.goal;
    }

    RUR.utils.ensure_key_for_obj_exists(base, args.type);
    RUR.utils.ensure_key_for_obj_exists(base[args.type], coords);
    base[args.type][coords][args.name] = args.number;

};


/** @function add_artefact
 * @memberof RUR.utils
 * @instance
 * @summary **This function is intended for private use by developers.**
 * 
 *    This function adds a specified (named) artefact of a 
 *    specified type (e.g. object, background tile, wall, etc.) at
 *    a given location, potentially subject to some limitations.
 *    
 *    
 * @param {Object} args A Javascript object (similar to a Python dict) that
 *                      holds the relevant attribute.
 *
 * @param {string} args.name  The name of the object to be found; an error
 *    will be thrown if it is missing.
 *
 * @param {string} args.type  The type of the object to be found; an error
 *    will be thrown if it is missing.
 *
 * @param {integer} args.x The `x` coordinate where the object should be found.
 *                        If it is missing, or not within the world boundaries,
 *                        or is not an integer, an error will be thrown.
 *
 * @param {integer} args.y The `y` coordinate where the object should be found.
 *                        If it is missing, or not within the world boundaries,
 *                        or is not an integer, an error will be thrown.
 *
 *
 * @param {string} [args.valid_names] A list containing the name of the 
 *                        acceptable objects. If this argument is specified, 
 *                        `args.name` must be found in that list, otherwise an
 *                        error will be thrown.
 *
 * @param {boolean} [args.single] Specifies if only one of a given kind of
 *                        artefact is permitted at a given location.
 * 
 * @returns {integer} The number of object found at that location (could be 0).
 * @throws Will throw an error if `name` attribute is not specified.
 * @throws Will throw an error if `type` attribute is not specified.
 * @throws Will throw an error if a valid position is not specified.
 * @throws Will throw an error if `single` is "true" but more than one kind
 * of artefact is found at that location.
 *
 * @see {@link UnitTest#test_artefact} for unit tests.
 *  
 */
RUR.utils.add_artefact = function (args) {
    "use strict";
    var base, coords, world = get_world();

    ensure_common_required_args_present(args);

    base = world;
    if (args.goal) {
        RUR.utils.ensure_key_for_obj_exists(world, "goal");
        base = world.goal;
    }
    coords = args.x + "," + args.y;

    // This should not happen if functions upstream always
    // use args.single consistently
    if (args.single && base[args.type] !== undefined &&
               base[args.type][coords] !== undefined && 
               base[args.type][coords].length > 1) {
        throw new Error("Cannot replace: more than one artefact present.");
    }

    RUR.utils.ensure_key_for_obj_exists(base, args.type);
    RUR.utils.ensure_key_for_array_exists(base[args.type], coords);
    if (args.single) {
        base[args.type][coords] = [args.name];
    } else {
        base[args.type][coords].push(args.name);
    }
};


/** @function get_nb_artefact
 * @memberof RUR.utils
 * @instance
 * @summary **This function is intended for private use by developers.**
 * 
 *    This function returns the number of a specified (named) artefact of a 
 *    specified type (e.g. object, background tile, wall, etc.) at
 *    a given location.
 *    
 * @param {Object} args A Javascript object (similar to a Python dict) that
 *                      holds the relevant attribute.
 *
 * @param {string} args.name  The name of the object to be found; an error
 *    will be thrown if it is missing.
 *
 * @param {string} args.type  The type of the object to be found; an error
 *    will be thrown if it is missing.
 *
 * @param {integer} args.x The `x` coordinate where the object should be found.
 *                        If it is missing, or not within the world boundaries,
 *                        or is not an integer, an error will be thrown.
 *
 * @param {integer} args.y The `y` coordinate where the object should be found.
 *                        If it is missing, or not within the world boundaries,
 *                        or is not an integer, an error will be thrown.
 *                        
 * @param {boolean} [args.goal] If specified, indicates that it is a goal-type
 *                        object that must be found.
 *
 * @param {string} [args.valid_names] A list containing the name of the 
 *                        acceptable objects. If this argument is specified, 
 *                        `args.name` must be found in that list, otherwise an
 *                        error will be thrown.
 *
 * @returns {integer} The number of object found at that location (could be 0).
 * @throws Will throw an error if `name` attribute is not specified.
 * @throws Will throw an error if `type` attribute is not specified.
 * @throws Will throw an error if a valid position is not specified.
 *
 * @see {@link UnitTest#test_artefact} for unit tests.
 *  
 */
RUR.utils.get_nb_artefact = function(args) {
    "use strict";
    var coords, container, world = get_world();

    ensure_common_required_args_present(args);

    coords = args.x + "," + args.y;
    if (args.goal) {
        if (world.goal === undefined || 
            world.goal[args.type] === undefined ||
            world.goal[args.type][coords] === undefined) {
            return 0;
        } else { 
            container = world.goal[args.type][coords];
        }
    } else if (world[args.type] === undefined ||
               world[args.type][coords] === undefined) {
        return 0;
    } else {
        container = world[args.type][coords];
    }

    if (Object.prototype.toString.call(container) == "[object Object]") {
        if (Object.keys(container).indexOf(args.name) == -1) {
            return 0;
        } else {
            return container[args.name];
        }
    } else if (Object.prototype.toString.call(container) == "[object Array]"){
        if (container.indexOf(args.name) == -1) {
            return 0;
        } else {
            return 1;
        }
    } else { // should never happen
        throw new Error("Unknown container type; need Object or Array");
    }   
};

/** @function get_artefacts
 * @memberof RUR.utils
 * @instance
 * @summary **This function is intended for private use by developers.**
 *
 *    **Important:** This is the only function named with artefacts in plural
 *    form as other deal with a single artefact at a time, whereas this one
 *    returns a container that can contain many artefacts.
 * 
 *    This function returns a container (Javascript Object or Array) with the
 *    artefacts found at a location. 
 *    
 * @param {Object} args A Javascript object (similar to a Python dict) that
 *                      holds the relevant attribute.
 *
 *
 * @param {string} args.type  The type of the object to be found; an error
 *    will be thrown if it is missing.
 *
 * @param {integer} args.x The `x` coordinate where the object should be found.
 *                        If it is missing, or not within the world boundaries,
 *                        or is not an integer, an error will be thrown.
 *
 * @param {integer} args.y The `y` coordinate where the object should be found.
 *                        If it is missing, or not within the world boundaries,
 *                        or is not an integer, an error will be thrown.
 *                        
 * @param {boolean} [args.goal] If specified, indicates that it is a goal-type
 *                        kind that we are interested about.
 *
 *
 * @returns      A container (Array or Object) with the artefacts found at that
 *              location, or `null` if no container is found at that location.
 * @throws Will throw an error if `type` attribute is not specified.
 * @throws Will throw an error if a valid position is not specified.
 *
 * @see {@link UnitTest#test_artefact} for unit tests.
 *  
 */
RUR.utils.get_artefacts = function(args) {
    "use strict";
    var base, coords, container, world = get_world();

    ensure_valid_position(args);
    if (args.type === undefined) {
        throw new Error("Object type must be specified.");
    }

    coords = args.x + "," + args.y;
    if (args.goal) {
        if (world.goal === undefined || 
            world.goal[args.type] === undefined ||
            world.goal[args.type][coords] === undefined) {
            return null;
        } else { 
            container = world.goal[args.type][coords];
        }
    } else if (world[args.type] === undefined ||
               world[args.type][coords] === undefined) {
        return null;
    } else {
        container = world[args.type][coords];
    }

    return container; 
};


