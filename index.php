<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title></title>
    <style>
        html, body, #map-canvas {
            height: 100%;
            margin: 0px;
            padding: 0px
        }
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script src="libs/jquery.js"></script>
    <script src="core/webturtle.js"></script>
    <script src="core/map.js"></script>

    <script>
    WebTurtle.initialize('http://s.flatturtle.com/<?php echo $_SERVER['QUERY_STRING']; ?>.json');
    </script>

</head>
<body>
    <div id="map-canvas"></div>
</body>
</html>
