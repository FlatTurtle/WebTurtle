<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title></title>
    <link href="css/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <div id="map-canvas"></div>

    <script src="//maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script src="libs/jquery.js"></script>
    <script src="libs/jquery.mustache.js"></script>
    <script src="libs/underscore.js"></script>
    <script src="libs/backbone.js"></script>

    <script src="core/log.js"></script>
    <script src="core/utilities.js"></script>
    <script src="core/turtles.js"></script>
    <script src="core/app.js"></script>
    <script src="core/map.js"></script>

    <script>
    App.initialize('//s.flatturtle.com/<?php echo $_SERVER['QUERY_STRING']; ?>.json');
    </script>
</body>
</html>
