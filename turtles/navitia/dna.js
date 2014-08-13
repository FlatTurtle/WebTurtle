
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
            var self = this;

            // stop point mode
            if (options.stop_point)
            {
                var q = "https://api.navitia.io/v1/coverage/" + this.options.region + "/stop_points/" + this.options.stop_point;
                $.getJSON("https://data.flatturtle.com/navitia_proxy.php?" + q, function(data)
                {
                    self.options.latitude = parseFloat(data.contents.stop_points[0].coord.lat);
                    self.options.longitude = parseFloat(data.contents.stop_points[0].coord.lon);
                    self.options.location = data.contents.stop_points[0].name.capitalize();
                });

                // fetch data
                self.fetch();
            }

            // stop area mode
            else if (options.stop_area)
            {   
                var q = "https://api.navitia.io/v1/coverage/" + this.options.region + "/stop_areas/" + this.options.stop_area;
                $.getJSON("https://data.flatturtle.com/navitia_proxy.php?" + q, function(data)
                {
                    self.options.latitude = parseFloat(data.contents.stop_areas[0].coord.lat);
                    self.options.longitude = parseFloat(data.contents.stop_areas[0].coord.lon);
                    self.options.location = data.contents.stop_areas[0].name.capitalize();
                });

                // fetch data
                self.fetch();
            }

            // search mode
            else
            {
                var q = "https://api.navitia.io/v1/coverage/" + self.options.region + "/places?q=" + self.options.location + "&type[]=stop_area&count=1";
                $.getJSON("https://data.flatturtle.com/navitia_proxy.php?" + q, function(data)
                {
                    self.options.stop_area = data.contents.places[0].stop_area.id;
                    self.options.latitude = parseFloat(data.contents.places[0].stop_area.coord.lat);
                    self.options.longitude = parseFloat(data.contents.places[0].stop_area.coord.lon);

                    // fetch data
                    self.fetch();
                });
            }
        },
        url : function()
        {
            // Don't fetch data in lite mode
            if(App.lite)
                return "https://data.flatturtle.com/navitia_proxy.php";

            var d = new Date;
            var query = d.format("{Y}{m}{d}T{H}{M}{S}");

            if (this.options.stop_point)
            {
                return "https://data.flatturtle.com/navitia_proxy.php?https://api.navitia.io/v1/coverage/" + this.options.region + "/stop_points/" + this.options.stop_point + "/departures?from_datetime=" + query + "&count=" + this.options.limit;
            }
            else if (this.options.mode)
            {
                return "https://data.flatturtle.com/navitia_proxy.php?https://api.navitia.io/v1/coverage/" + this.options.region + "/stop_areas/" + this.options.stop_area + "/commercial_modes/commercial_mode:" + this.options.mode.toLowerCase() + "/departures?from_datetime=" + query + "&count=" + this.options.limit;
            }
            else
            {
                return "https://data.flatturtle.com/navitia_proxy.php?https://api.navitia.io/v1/coverage/" + this.options.region + "/stop_areas/" + this.options.stop_area + "/departures?from_datetime=" + query + "&count=" + this.options.limit;
            }
        },
        parse : function(json)
        {
            var liveboard = json.contents.departures;
            var lines = new Array();

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

                // No all caps
                if (liveboard[i].route.name == liveboard[i].route.name.toUpperCase())
                {
                    liveboard[i].route.name = liveboard[i].route.name.capitalize();
                }

            	// set time
                var time = new Date(Date.parse(liveboard[i].stop_date_time.departure_date_time));
                liveboard[i].time = time.format("{H}:{M}");

                // Set proper icon
                var selected = liveboard[i].route.line.code;
                if (typeof selected == 'string'){
                    if (selected.length == 1){
                        if (selected >= 'A' && selected <= 'E') liveboard[i].route.icon = "img/icons/FT__0010_rer.png";
                        else if (selected >= 'H' && selected <= 'U') liveboard[i].route.icon = "img/icons/FT__0009_train.png";
                        else liveboard[i].route.icon = "img/icons/FT__0002_bus.png";
                    }else{
                        if (selected.charAt(0) == 'T') liveboard[i].route.icon = "img/icons/FT__0003_tram.png";
                        else liveboard[i].route.icon = "img/icons/FT__0002_bus.png";
                    }
                }else if(selected){
                    if (selected <= 14) liveboard[i].route.icon = "img/icons/FT__0011_metro.png";
                    else liveboard[i].route.icon = "img/icons/FT__0002_bus.png";
                }

                // increment line popularity
                lines[liveboard[i].route.line.code] = lines[liveboard[i].route.line.code] ? lines[liveboard[i].route.line.code]+1 : 1;
            }

            // select the most popular line
            var max = 0; var selected;
            for (var line in lines)
            {
                if (lines[line] > max)
                {
                    selected = line;
                    max = lines[line];
                }
            }

            // choose the icon based on the line
            if (typeof selected == 'string')
            {
                if (selected.length == 1)
                {
                    if (selected >= 'A' && selected <= 'E') this.options.icon = "rer";
                    else if (selected >= 'H' && selected <= 'U') this.options.icon = "train";
                    else this.options.icon = "bus";
                }
                else
                {
                    if (selected.charAt(0) == 'T') this.options.icon = "tram";
                    else this.options.icon = "bus";
                }
            }
            else if (selected)
            {
                if (selected <= 14) this.options.icon = "metro";
                else this.options.icon = "bus";
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
            if (!this.options.latitude) return;
            if (!this.options.longitude) return;

            if (this.options.icon)
            {
                this.marker = Map.marker(this.options.latitude, this.options.longitude, this.options.icon);
            }
            else
            {
                // New bagneux RER station
                if (this.options.stop_point == 'stop_point:RTF:SP:BAGNE1')
                {
                    this.marker = Map.marker(this.options.latitude, this.options.longitude, "rer");
                }
                else if (this.options.mode)
                {
                    this.marker = Map.marker(this.options.latitude, this.options.longitude, this.options.mode);
                }
                else
                {
                    this.marker = Map.marker(this.options.latitude, this.options.longitude, "bus");
                }
            }

            // check if we're ready to add the popup
            this.addPopup();
        },
        addPopup : function()
        {
            // Don't add popup in lite mode
            if(App.lite)
                return;
            // wait for everything to load
            if (!this.template) return;
            if (!this.marker) return;

            var data = {
                location: this.options.location,
                entries: this.collection.toJSON(),
                empty: this.collection.length == 0,
                underConstruction: this.options.stop_point == 'stop_point:RTF:SP:BAGNE1'
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
