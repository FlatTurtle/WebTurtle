
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
