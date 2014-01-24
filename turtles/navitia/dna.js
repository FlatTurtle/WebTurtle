
(function($) {

    var collection = Backbone.Collection.extend(
    {
        initialize : function(models, options)
        {
            // default limit
            if (!options.limit)
            {
                options.limit = 5;
            }

            this.options = options;
            this.options.region = "paris"; // DEMO
            this.options.location = "RTP:SP:4037026"; // DEMO

            // http://api.navitia.io/v1/coverage/paris/places?q=a&type[]=stop_point&count=1
            // http://api.navitia.io/v1/coverage/paris/stop_points/stop_point:RTP:SP:4037026/departures?from_datetime=

            // immediately get collection data
            this.fetch();
        },
        url : function()
        {
            var d = new Date;
            var query = d.format("{Y}{m}{d}T{H}{M}{S}");
            console.log("http://api.navitia.io/v1/coverage/" + this.options.region + "/stop_points/stop_point:" + this.options.location + "/departures?from_datetime=" + query);

            return "http://api.navitia.io/v1/coverage/" + this.options.region + "/stop_points/stop_point:" + this.options.location + "/departures?from_datetime=" + query;
        },
        parse : function(json)
        {
            var liveboard = json.departures;

            for (var i in liveboard)
            {
            	// set lng lat
            	if (!this.options.latitude || !this.options.longitude)
            	{
            		this.options.latitude = parseFloat(liveboard[i].stop_point.coord.lat);
            		this.options.longitude = parseFloat(liveboard[i].stop_point.coord.lon);
            		this.options.location = liveboard[i].stop_point.name.capitalize();
            	}

            	// use gray as default background color
            	if (liveboard[i].route.line.color == "FFFFFF")
            	{
            		liveboard[i].route.line.color = "555555";
            	}

            	// set time
                var time = new Date(Date.parse(liveboard[i].stop_date_time.departure_date_time));
                liveboard[i].time = time.format("{H}:{M}");
            }

            return liveboard;
        }
    });

    var view = Backbone.View.extend(
    {
        initialize : function(options)
        {
            // prevents loss of 'this' inside methods
            _.bindAll(this, "render", "addPopup");

            this.options = options;
            var self = this;

            // get template
            $.get("turtles/navitia/view.html", function(template)
            {
                self.template = template;

                // check if we're ready to add the popup
                self.addPopup();
            });

            // show marker when collection is ready
            this.collection.on("sync", this.render);

            // show popup when collection is ready
            this.collection.on("sync", this.addPopup);
        },
        render : function()
        {
        	// add marker
            this.marker = Map.marker(this.options.latitude, this.options.longitude, "bus");

            // check if we're ready to add the popup
            this.addPopup();
        },
        addPopup : function()
        {
            // wait for everything to load
            if (!this.template) return;
            if (!this.collection.length) return;
            if (!this.marker) return;

            var data = {
                location: this.options.location,
                entries: this.collection.toJSON()
            }

            // render view
            var html = Mustache.render(this.template, data);

            // add popup
            if (this.popup)
            {
                this.popup.setContent(html);
            }
            else
            {
                this.popup = Map.popup(this.marker, html);
            }
        }
    });

    // register turtle
    Turtles.register("navitia", {
        collection : collection,
        view : view
    });

})(jQuery);
