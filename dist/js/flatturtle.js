/**
 * Set a default timeout of 15 seconds for all ajax requests
 */
$.ajaxSetup({
    timeout: 15000
});

/**
 * A friendly time format function
 *
 * {Y} - 4 digit year
 * {m} - month with leading zero
 * {d} - day with leading zero
 * {H} - hours with leading zero
 * {h} - hours without leading zero
 * {M} - minutes with leading zero
 * {i} - minutes without leading zero
 * {S} - seconds with leading zero
 */
Date.prototype.format = function(format) {

    var date = this;

    // 4 digit year
    format = format.replace('{Y}', function() {
        return date.getFullYear();
    });

    // 4 digit year
    format = format.replace('{y}', function() {
        return date.getFullYear() % 100;
    });

    // month with leading zero
    format = format.replace('{m}', function() {
        var month = date.getMonth() + 1;
        return (month < 10 ? "0" : "") + month;
    });

    // day with leading zero
    format = format.replace('{d}', function() {
        var day = date.getDate();
        return (day < 10 ? "0" : "") + day;
    });

    // hours with leading zero
    format = format.replace('{H}', function() {
        var hours = date.getHours();
        return (hours < 10 ? "0" : "") + hours;
    });

    // hours without leading zero
    format = format.replace('{h}', function() {
        return date.getHours();
    });

    // minutes with leading zero
    format = format.replace('{M}', function() {
        var minutes = date.getMinutes();
        return (minutes < 10 ? "0" : "") + minutes;
    });

    // minutes without leading zero
    format = format.replace('{i}', function() {
        return date.getMinutes();
    });

    // seconds with leading zero
    format = format.replace('{S}', function() {
        var seconds = date.getSeconds();
        return (seconds < 10 ? "0" : "") + seconds;
    });

    return format;
}

// Roman digit regepx
var detectRomanNumber = new RegExp('^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$');

/**
 * Capitalize every word of a string
 */
String.prototype.capitalize = function()
{
    return this.replace(/(\w)(\w*)/g, function(g0,g1,g2)
    {
        // Filter roman numbers
        if (g2.match(detectRomanNumber))
        {
            g2 = g2.toUpperCase();
        } else
        {
            g2 = g2.toLowerCase();
        }

        return g1.toUpperCase() + g2;
    });
}


window.Log = (function() {

    /**
    * Log info message
    */
    function info(message)
    {
        console.log(message);
    }

    /**
    * Log debug message
    */
    function debug(message)
    {
        if (App.debug) console.log(message);
    }

    /**
    * Log error message
    */
    function error(message)
    {
        console.error(message);
    }

    return {
        debug: debug,
        info: info,
        error: error
    }

}());


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


window.App = (function() {

    // toggle debugging
    var debug = true;

	var config = null;

	/**
	* Initialize the FlatTurtle object, fetches the configuration
    * json and triggers the Map object.
	*/
	function initialize(api)
    {
        Log.debug("Initializing application");

		$.ajax({
            url : api,
            dataType: "json",
            success : function(config)
            {
                Log.debug("Loaded JSON: " + api);

                // save the config
                App.config = config;

                // set page title
                document.title = config.interface.title;

                // load the map
                Map.initialize(config);

                // spawn turtles
                for (var id in config.turtles)
                {
                    var turtle = config.turtles[id];
                    Turtles.grow(turtle.type, id, turtle.options, Map);
                }
            },
            error: function()
            {
                Log.error("Could not load JSON: " + api);
            }
        });
	}

	return {
        debug: debug,
        config: config,
		initialize: initialize
	}

}());


window.Map = (function() {

    // google maps object
    var gmap;

    // all markers
    var markers = [];

    // all popups
    var popups = [];

    /**
    * Initialize the Map object.
    */
    function initialize(config)
    {
        Log.debug("Initializing map");

        var mapOptions = {
            zoom: 14,
            disableDefaultUI: true,
            center: new google.maps.LatLng(config.interface.latitude, config.interface.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        // create google maps object
        gmap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        // recenter on resize
        google.maps.event.addListener(gmap, "idle", function()
        {
            //gmap.setCenter(mapOptions.center);
            google.maps.event.trigger(gmap, "resize");
        });

        // add traffic
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(gmap);

        // add location marker
        var here = marker(config.interface.latitude, config.interface.longitude, "location");

        // add location popup
        popup(here, "<strong>" + config.interface.title + "</strong><br>" + config.interface.location);
    }

    /**
    * Add marker to map.
    */
    function marker(latitude, longitude, icon)
    {
        // marker location
        var myLatlng = new google.maps.LatLng(latitude, longitude);

        // marker options
        var options = {
            position: myLatlng,
            map: gmap,
        }

        // custom icon
        if (icon)
        {
            url = "icon.php?type=" + icon + "&color=" + App.config.interface.color.replace('#', '');
            options.icon = new google.maps.MarkerImage(url , undefined, undefined, undefined, new google.maps.Size(30, 30));
        }

        // add marker to map
        var marker = new google.maps.Marker(options);

        // add to markers list
        markers.push(marker);

        // fit markers on screen
        /*if (markers.length >= 2)
        {
            var bounds = new google.maps.LatLngBounds();

            for (var i in markers)
            {
                bounds.extend(markers[i].position);
            }

            gmap.fitBounds(bounds);
        }*/

        return marker;
    }

    function popup(marker, content)
    {
        var popup = new google.maps.InfoWindow({
            content: content
        });

        // add to popups list
        popups.push(popup);

        google.maps.event.addListener(marker, 'click', function()
        {
            // close other popups
            for (var i in popups)
            {
                popups[i].close();
            }

            // open popup
            popup.open(gmap, marker);
        });

        return popup;
    }

    return {
        initialize: initialize,
        marker: marker,
        popup: popup
    }

}());