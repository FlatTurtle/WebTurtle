
(function($) {

    var collection = Backbone.Collection.extend(
    {
        initialize : function(models, options)
        {
            this.options = options;

            // immediately get collection data
            if (!App.lite) this.fetch();
        },
        url : function()
        {
            var location = this.options.location.split(",");

            return "https://data.irail.be/Bikes/Velo.json?lat=" + encodeURIComponent(location[0]) + "&long=" + encodeURIComponent(location[1]) + "&offset=0&rowcount=1";
        },
        parse : function(json)
        {
            var velo = json.Velo;

            for (var i in velo)
            {
                if (velo[i].distance)
                {
                    velo[i].distance = Math.round(parseInt(velo[i].distance)/10)*10;
                }

                var name = jQuery.trim(velo[i].name);
                name = name.match(/^[0-9]+\s*-\s*(.*?)(?:[\/|:](.*))?$/)[1];
                velo[i].name = name.capitalize();

                if (!velo[i].freebikes)
                {
                    velo[i].freebikes = 0;
                }

                if (!velo[i].freespots)
                {
                    velo[i].freespots = 0;
                }

                velo[i].freespots += velo[i].freebikes;
            }

            return velo;
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
            $.get("turtles/velo/view.html", function(template)
            {
                self.template = template;

                // check if we're ready to add the popup
                self.addPopup();
            });

            // split longitude and latitude
            var location = options.location.split(",");
            this.options.latitude = location[0];
            this.options.longitude = location[1];

            this.render();

            // show popup when collection is ready
            this.collection.on("sync", this.addPopup);
        },
        render : function()
        {
            // add marker
            this.marker = Map.marker(this.options.latitude, this.options.longitude, "bike");

            // check if we're ready to add the popup
            this.addPopup();
        },
        addPopup : function()
        {
            // wait for everything to load
            if (!this.template) return;
            if (!this.marker) return;

            var data = this.collection.toJSON()[0];

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
    Turtles.register("velo", {
        collection : collection,
        view : view
    });

})(jQuery);
