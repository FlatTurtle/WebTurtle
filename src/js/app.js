
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

                Turtles.grow('navitia', 100, { location: "RTP:SA:1781" }, Map);
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
