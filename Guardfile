#--------------------------------------------------------------------------
# Sass
#--------------------------------------------------------------------------

guard 'sass',
    :style => :compressed,
    :input => 'src/sass',
    :output => 'dist/css'

#--------------------------------------------------------------------------
# Vendor
#--------------------------------------------------------------------------

guard :concat,
    type: 'js',
    files: %w(jquery underscore backbone jquery.mustache),
    input_dir: 'src/js/vendor',
    output: 'dist/js/vendor'


#--------------------------------------------------------------------------
# FlatTurtle
#--------------------------------------------------------------------------

guard :concat,
    type: 'js',
    files: %w(utilities log turtles app map),
    input_dir: 'src/js',
    output: 'dist/js/flatturtle'
