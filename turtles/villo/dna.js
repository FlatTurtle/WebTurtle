
(function($) {

    var collection = Backbone.Collection.extend(
    {
        initialize : function(models, options)
        {
            this.options = options;

            // immediately get collection data
            this.fetch();
        },
        url : function()
        {
            var location = this.options.location.split(",");

            return "https://data.irail.be/Bikes/Villo.json?lat=" + encodeURIComponent(location[0]) + "&long=" + encodeURIComponent(location[1]) + "&offset=0&rowcount=1";
        },
        parse : function(json)
        {
            var villo = json.Villo;

            for (var i in villo)
            {
                if (villo[i].distance)
                {
                    villo[i].distance = Math.round(parseInt(villo[i].distance)/10)*10;
                }

                var name = jQuery.trim(villo[i].name);
                name = name.match(/^[0-9]+\s*-\s*(.*?)(?:[\/|:](.*))?$/)[1];
                villo[i].name = name.capitalize();

                if (!villo[i].freebikes)
                {
                    villo[i].freebikes = 0;
                }

                if (!villo[i].freespots)
                {
                    villo[i].freespots = 0;
                }

                villo[i].freespots += villo[i].freebikes;
            }

            return villo;
        }
    });

    var view = Backbone.View.extend(
    {
        initialize : function(options)
        {
            // prevents loss of 'this' inside methods
            _.bindAll(this, "render", "popup");

            this.options = options;
            var self = this;

            // get template
            $.get("turtles/villo/view.html", function(template)
            {
                self.template = template;

                // check if we're ready to add the popup
                self.popup();
            });

            // split longitude and latitude
            var location = options.location.split(",");
            this.options.latitude = location[0];
            this.options.longitude = location[1];

            this.render();

            // show popup when collection is ready
            this.collection.on("sync", this.popup);
        },
        render : function()
        {
            // add marker
            this.marker = Map.marker(this.options.latitude, this.options.longitude, "images/bike.png");
        },
        popup : function()
        {
            // wait for everything to load
            if (!this.template) return;
            if (!this.collection.length) return;
            if (!this.marker) return;

            var data = this.collection.toJSON()[0];

            // render view
            var html = Mustache.render(this.template, data);

            // add popup
            var popup = Map.popup(this.marker, html);
        }
    });

    // register turtle
    Turtles.register("villo", {
        collection : collection,
        view : view
    });

})(jQuery);
