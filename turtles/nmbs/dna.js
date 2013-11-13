
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

            // immediately get collection data
            this.fetch();
        },
        url : function()
        {
            var today = new Date();
            var query = encodeURIComponent(this.options.location) + "/" + today.format("{Y}/{m}/{d}/{H}/{M}");

            return "https://data.irail.be/spectql/NMBS/Liveboard/" + query + "/departures.limit(" + parseInt(this.options.limit) + "):json";
        },
        parse : function(json)
        {
            var liveboard = json.spectql;

            for (var i in liveboard)
            {
                if (liveboard[i].time)
                {
                    var time = new Date(liveboard[i].time * 1000);
                    liveboard[i].time = time.format("{H}:{M}");
                }

                if (liveboard[i].direction)
                {
                    liveboard[i].direction = liveboard[i].direction.capitalize();
                }

                if (!liveboard[i].platform.name)
                {
                    liveboard[i].platform.name = "-";
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
            $.get("turtles/nmbs/view.html", function(template)
            {
                self.template = template;

                // check if we're ready to add the popup
                self.addPopup();
            });

            var today = new Date();
            var query = encodeURIComponent(options.location) + "/" + today.format("{Y}/{m}/{d}/{H}/{M}");

            // get marker location
            $.getJSON("//data.irail.be/NMBS/Liveboard/" + query + ".json", function(data)
            {
                self.options.latitude = data.Liveboard.location.latitude;
                self.options.longitude = data.Liveboard.location.longitude;

                // show on map
                self.render();
            });

            // show popup when collection is ready
            this.collection.on("sync", this.addPopup);
        },
        render : function()
        {
            // add marker
            this.marker = Map.marker(this.options.latitude, this.options.longitude, "train");

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
    Turtles.register("nmbs", {
        collection : collection,
        view : view
    });

})(jQuery);
