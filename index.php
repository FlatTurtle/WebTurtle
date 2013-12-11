<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title></title>
    <link href="dist/css/style.css?v=281101" rel="stylesheet" type="text/css" />
    <link href="img/favicon.ico" rel="icon" type="image/x-icon">
</head>
<body>

    <div id="logo"><a href="https://flatturtle.com" target="_blank"><img src="img/logo.svg?v=281101"></a></div>

    <div id="map-canvas"></div>

    <script src="//maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script src="dist/js/vendor.js"></script>
    <script src="dist/js/flatturtle.js"></script>

    <script>
    App.initialize('//s.flatturtle.com/<?php echo $_SERVER['QUERY_STRING']; ?>.json');
    </script>
</body>
</html>
