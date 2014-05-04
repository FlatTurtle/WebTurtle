<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf-8">
    <title></title>
    <link href="dist/css/style.css?v=1404" rel="stylesheet" type="text/css" />
    <link href="//fast.fonts.com/cssapi/66253153-9c89-413c-814d-60d3ba0d6ac2.css" type="text/css" >
    <link href="img/favicon.ico" rel="icon" type="image/x-icon">
</head>
<body>

    <div id="logo"><a href="https://flatturtle.com" target="_blank"><img src="img/logo.svg"></a></div>
    <div id="legend">
        <ul class="legend text-color">
            <li class="green">&gt; 80 km/h&nbsp;&nbsp;—</li>
            <li class="orange">40-80 km/h&nbsp;&nbsp;—</li>
            <li class="red">10-40 km/h&nbsp;&nbsp;—</li>
            <li class="black">&lt; 10 km/h&nbsp;&nbsp;—</li>
        </ul>
    </div>

    <div id="map-canvas"></div>

    <script src="//maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script src="dist/js/vendor.js?v=0405"></script>
    <!--[if lte IE 9]>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-ajaxtransport-xdomainrequest/1.0.1/jquery.xdomainrequest.min.js"></script>
    <![endif]-->
    <script src="dist/js/flatturtle.js?v=0405"></script>

    <script>
    $(document).ready(function() {
        App.initialize('https://s.flatturtle.com/<?php echo $_SERVER['QUERY_STRING']; ?>.json');
    });
    </script>
</body>
</html>
