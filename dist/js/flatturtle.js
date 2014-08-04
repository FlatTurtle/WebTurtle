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

/**
 * Get URL parameters
 */
$.parameter = function(name)
{
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);

    if (results == null)
    {
       return null;
    }
    else
    {
       return results[1] || 0;
    }
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

    // whitelist for turtles so that unrelated turtles don't try to load
    var whitelist = ["delijn", "mivb", "navitia", "nmbs", "villo", "velo"];

	var config = null;

    // check if a key exists in an array
    function inArray(key, array)
    {
        for(var i = 0; i < array.length; i++)
        {
            if (array[i] === key)
            {
                return true;
            }
        }

        return false;
    }

	/**
	* Initialize the FlatTurtle object, fetches the configuration
    * json and triggers the Map object.
	*/
	function initialize(api)
    {
        Log.debug("Initializing application");

        // Accept cross domain
        jQuery.support.cors = true;

        // Check if map is in lite mode
        App.lite = $.parameter('lite') != null;

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
                    if (inArray(turtle.type, whitelist)) {
                        Turtles.grow(turtle.type, id, turtle.options, Map);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                Log.error(errorThrown);
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

    // the traffic layer
    var traffic;

    /**
    * Initialize the Map object.
    */
    function initialize(config)
    {
        Log.debug("Initializing map");

        // show or hide the legend
        if ($.parameter('legend') == 0) $('#legend').hide();

        // get zoom value from URL
        var zoom = $.parameter('zoom');

        var mapOptions = {
            zoom: zoom ? parseInt(zoom) : 14,
            disableDefaultUI: false,
            streetViewControl: false,
            scrollwheel: false,
            mapTypeControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            },
            panControl: false,
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
        traffic = new google.maps.TrafficLayer();
        traffic.setMap(gmap);

        // add location marker
        var here = marker(config.interface.latitude, config.interface.longitude, "location", null, null, true);

        // make sure the location marker is on top
        here.setZIndex(9999);

        // add location popup
        var info = popup(here, '<div class="infowindow"><strong>' + config.interface.title + '</strong><br>' + config.interface.location + '</div>');

        // open popup
        if ($.parameter('popup') != 0)
        {
            info.open(gmap, here);
        }

        // traffic refresh interval
        setTimeout(function(){
            setInterval(refresh, 240000);
        }, Math.round(Math.random() * 5000));
    }

    /**
     * Refresh the traffic layer.
     */
    function refresh()
    {
        // remove traffic layer
        if (traffic != null)
        {
            traffic.setMap(null);
            delete traffic;
            traffic = null;
        }

        // add traffic layer with delay
        // http://stackoverflow.com/questions/7659072/google-maps-refresh-traffic-layer
        setTimeout(function()
        {
            traffic = new google.maps.TrafficLayer();
            traffic.setMap(gmap);
        }, 1000);
    }

    /**
    * Add marker to map.
    */
    function marker(latitude, longitude, icon, color, size, inverse)
    {
        // marker location
        var myLatlng = new google.maps.LatLng(latitude, longitude);

        // check markers for the same location
        for (var i in markers)
        {
            if (markers[i].position.equals(myLatlng))
            {
                myLatlng = new google.maps.LatLng(latitude + 0.0001, longitude + 0.0001);
            }
        }

        // marker options
        var options = {
            position: myLatlng,
            map: gmap,
        };

        // custom icon
        if (icon)
        {
            // get color from interface
            if (!color) color = App.config.interface.color;

            // icon url
            url = "icon.php?type=" + icon + "&color=" + color.replace('#', '');

            // invert colors
            if (inverse) url += "&inverse=1";

            // default size
            if (!size) size = 30;

            // set additional options
            options.content = '<img src="' + url + '" width="' + size + '" height="' + size + '">';
            options.flat = true;
            options.anchor = new google.maps.Size(-(size/2), -(size/5*2));

            // create rich marker to fix svg problems in IE
            marker = new RichMarker(options);
        }
        else
        {
            // create default google marker
            var marker = new google.maps.Marker(options);
        }

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
        popup: popup,
        refresh: refresh
    }

}());