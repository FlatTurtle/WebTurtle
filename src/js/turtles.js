
window.Turtles = (function() {

    // all registered turtles
    var turtles = {};

    // all turtles instances
    var instances = {};

    /**
     * Register a new turtle interface
     */
    function register(type, turtle)
    {
        // turtle already registered
        if (turtles[type] != null)
        {
            Log.error("Turtle " + type + " already registered");
            return false;
        }
        // wrong
        else if (typeof turtle != "object")
        {
            Log.error("Turtle " + type + " is invalid");
            return false;
        }
        else
        {
            Log.debug("Turtle " + type + " registered");
            turtles[type] = turtle;
        }

        return true;
    }

    /**
     * Check if a turtle is registered
     */
    function registered(type)
    {
        return turtles[type] != null;
    }

    /**
     * Create a new turtle (backbone) instance
     */
    function instantiate(type, id, options, map)
    {
        // get turtle specification
        var turtle = turtles[type];

        if (turtle == null)
        {
            Log.error("Could not instantiate " + type + " turtle: not registered");
            return;
        }

        Log.debug("Instatiate " + type + " turtle");

        // perpare instance object
        var instance = {
            id: parseInt(id),
            type: type,
            map: map
        };

        // assign model
        instance.model = turtle.model || Backbone.Model.extend();

        // build and assign collection
        if (typeof turtle.collection == "function")
        {
            instance.collection = new turtle.collection(turtle.models, _.extend(options, {
                model : instance.model
            }));

            if (instance.collection.model == null)
            {
                instance.collection.model = instance.model;
            }

            // link options
            instance.collection.options = options;
        }

        // build and assign view
        if (typeof turtle.view == "function")
        {
            instance.view = new turtle.view(_.extend(options, {
                collection : instance.collection,
                model : instance.model,
                map : map
            }));

            // link options
            instance.view.options = options;
        }

        // trigger born event
        if (typeof instance.collection == "object")
            instance.collection.trigger("born");
        if (typeof instance.view == "object")
            instance.view.trigger("born");

        // save instance
        instances[id] = instance;
        return instance;
    }

    /**
     * Load a turtle dna with a callback (async)
     */
    function load(type)
    {
        // dna location
        var source = "turtles/" + type + "/dna.js";
        Log.info("Loading " + type + " DNA " + source);

        $.ajax({
            url : source,
            dataType : "script",
            async : false, // prevent duplicate javascript file loading
            error : function(jqXHR, textStatus, errorThrown)
            {
                Log.error("Unable to load " + type + " DNA");
            }
        });
    }

    /**
     * Grows baby turtles.
     */
    function grow(type, id, options, map)
    {
        id = parseInt(id);

        // check if turtle already exists
        if (instances[id] != null)
        {
            Log.error("Turtle already exists: " + id);
            return;
        }

        // load the turtle dna if needed
        if (!registered(type))
        {
            load(type);
        }

        // check if dna was loaded
        if (turtles[type] == null)
        {
            Log.error("Unknown turtle " + type);
            return;
        }

        // options must be an object
        if (options == null || typeof options != "object")
        {
            options = {};
        }

        // create a baby turtle
        var instance = instantiate(type, id, options, map);

        // return our baby turtle
        return instance;
    }

    /**
     * Kill a turtle :(
     */
    function kill(id)
    {
        id = parseInt(id);
        Log.debug("Kill turtle " + id);

        if (instances[id] == null)
        {
            Log.error("Unknown turtle instance " + id);
            return;
        }

        var turtle = instances[id];

        // trigger destroy event
        trigger(id, "destroy");

        // delete backbone objects
        delete turtle.collection;
        delete turtle.view;
        delete turtle.model;

        // delete instance
        delete instances[id];
    }

    /**
     * Public interface to this object
     */
    return {
        register : register,
        registered : registered,
        grow : grow,
        kill : kill
    };

}());
