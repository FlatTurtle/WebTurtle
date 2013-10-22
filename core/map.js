
window.Map = (function() {

    var gmap;

    /**
    * Initialize the Map object.
    */
    function initialize(config)
    {
        var mapOptions = {
            zoom: 14,
            disableDefaultUI: true,
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
