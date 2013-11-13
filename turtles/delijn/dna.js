
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

            // set type (departures | arrivals)
            if (!options.type || options.type != "arrivals")
            {
                options.type = "departures";
            }

            this.options = options;

            // immediately get collection data
            this.fetch();
        },
        url : function()
        {
            var today = new Date();
            var query = encodeURIComponent(this.options.location) + "/" + today.format("{Y}/{m}/{d}/{H}/{M}");

            return "https://data.irail.be/DeLijn/" + this.options.type.capitalize()  + "/" + query + ".json?offset=0&rowcount=" + parseInt(this.options.limit);
        },
        parse : function(json)
        {
            var liveboard = json[this.options.type.capitalize()];

            for (var i in liveboard)
            {
                if (liveboard[i].time)
                {
                    var time = new Date(liveboard[i].time * 1000);
                    liveboard[i].time = time.format("{H}:{M}");
                }

                if (!liveboard[i].long_name)
                {
                    liveboard[i].long_name = "-";
                }
                else
                {
                    liveboard[i].long_name = liveboard[i].long_name.capitalize();

                    if (liveboard[i].long_name.split("-").length == 2)
                    {
                        liveboard[i].long_name = liveboard[i].long_name.split("-")[1];
                    }
                }
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
            $.get("turtles/delijn/view.html", function(template)
            {
                self.template = template;

                // check if we're ready to add the popup
                self.addPopup();
            });

            // get marker location
            $.getJSON("//data.irail.be/DeLijn/Stations.json?name=" + encodeURIComponent(options.location), function(data)
            {
                if (data.Stations[0] != undefined)
                {
                    self.options.latitude = data.Stations[0].latitude;
                    self.options.longitude = data.Stations[0].longitude;

                    // show marker on the map
                    self.render();
                }
            });

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
    Turtles.register("delijn", {
        collection : collection,
        view : view
    });

})(jQuery);
