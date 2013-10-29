
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

            var today = new Date();
            var query = encodeURIComponent(options.location) + "/" + today.format("{Y}/{m}/{d}/{H}/{M}");

            var self = this;
            $.getJSON("//data.irail.be/NMBS/Liveboard/" + query + ".json", function(data)
            {
                self.options.latitude = data.Liveboard.location.latitude;
                self.options.longitude = data.Liveboard.location.longitude;

                // show on map
                self.render();
            });
        },
        render : function()
        {
            // add marker
            var marker = Map.marker(this.options.latitude, this.options.longitude);

            // add popup
            var popup = Map.popup(marker, "<strong>NMBS:</strong> " + this.options.location);
        }
    });

    // register turtle
    Turtles.register("nmbs", {
        collection : collection,
        view : view
    });

})(jQuery);
