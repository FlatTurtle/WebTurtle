
window.App = (function() {

    // toggle debugging
    var debug = true;

    // whitelist for turtles so that unrelated turtles don't try to load
    var whitelist = ["delijn", "mivb", "navitia", "nmbs", "villo", "velo"];

	var config = null;

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
                if (textStatus == 'timeout')
                {
                    Log.error("JSON request timed out -- Retrying in 2 seconds");
                    setTimeout(
                            function()
                            {
                                $.ajax(this)
                            },2000);
                } 
                else
                {
                    Log.error(errorThrown);
                    Log.error("Could not load JSON: " + api);
                }
            }
        });
	}

	return {
        debug: debug,
        config: config,
		initialize: initialize
	}

}());
