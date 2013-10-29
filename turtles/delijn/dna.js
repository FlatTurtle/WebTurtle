
(function($) {

    var collection = Backbone.Collection.extend(
    {
        initialize : function(models, options)
        {
        }
    });

    var view = Backbone.View.extend(
    {
        initialize : function(options)
        {
            this.options = options;

            var self = this;
            $.getJSON("//data.irail.be/DeLijn/Stations.json?name=" + encodeURIComponent(options.location), function(data)
            {
                if (data.Stations[0] != undefined)
                {
                    self.options.latitude = data.Stations[0].latitude;
                    self.options.longitude = data.Stations[0].longitude;

                    // show on map
                    self.render();
                }
            });
        },
        render : function()
        {
            // add marker
            var marker = Map.marker(this.options.latitude, this.options.longitude);

            // add popup
            var popup = Map.popup(marker, "<strong>De Lijn:</strong> " + this.options.location);
        }
    });

    // register turtle
    Turtles.register("delijn", {
        collection : collection,
        view : view
    });

})(jQuery);
