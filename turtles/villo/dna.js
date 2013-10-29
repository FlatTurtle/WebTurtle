
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

            var location = options.location.split(",");

            this.options.latitude = location[0];
            this.options.longitude = location[1];

            this.render();
        },
        render : function()
        {
            // add marker
            var marker = Map.marker(this.options.latitude, this.options.longitude);

            // add popup
            var popup = Map.popup(marker, "<strong>Villo</strong>");
        }
    });

    // register turtle
    Turtles.register("villo", {
        collection : collection,
        view : view
    });

})(jQuery);
