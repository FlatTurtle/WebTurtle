
window.WebTurtle = (function() {

	var config = null;

	/**
	* Initialize the FlatTurtle object, fetches the configuration
    * json and triggers the Map object.
	*/
	function initialize(api)
    {
		$.ajax({
            url : api,
            dataType: "json",
            success : function(config)
            {
                // Save the config
                WebTurtle.config = config;

                // Set page title
                document.title = config.interface.title;

                // Load the map
                Map.initialize(config);
            },
            error: function()
            {
                console.log("Error while loading JSON: " + api);
            }
        });
	}

	return {
        config: config,
		initialize: initialize
	}

}());
