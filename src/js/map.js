
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
        info.open(gmap, here);

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
