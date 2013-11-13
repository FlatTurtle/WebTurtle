<?php
require 'vendor/autoload.php';
use phpColors\Color;

$type = $_GET['type'];
$hex = $_GET['color'];

// Manually expand hex code
if (strlen($hex) == 3)
{
	$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
}

// Create color object
$color = new Color("#$hex");
$darker = '#' . $color->darken();
$lighter = '#' . $color->lighten();

// Get SVG content
$svg = file_get_contents("img/icons/$type.svg");

// Colors to search
$search  = array('#85BDC7', '#4299A8', '#307982', '#025672', '#34848F', '#0A5B60');

// Colors to replace
$replace = array($lighter, $hex, $darker, $darker, null, $darker);

// Do replace
$svg = str_replace($search, $replace, $svg);

// Send headers
header('Content-type: image/svg+xml');
header('Expires: ' . gmdate("D, d M Y H:i:s", time() + 2592000));

// Send image
echo $svg;
