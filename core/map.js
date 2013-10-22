
window.Map = (function() {

    var gmap;

    /**
    * Initialize the Map object.
    */
    function initialize(config)
    {
        // Get zoom from config
        var zoom, turtle;
        for (var i in config.turtles)
        {
            turtle = config.turtles[i];
            if (turtle.type == "map") zoom = parseInt(turtle.options.zoom);
        }

        // Default zoom
        if (!zoom) zoom = 15;

        var mapOptions = {
            zoom: zoom,
            center: new google.maps.LatLng(config.interface.latitude, config.interface.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        // Create google maps object
        gmap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Add traffic
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(gmap);
    }

    return {
        initialize: initialize
    }

}());
