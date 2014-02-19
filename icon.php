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

// Base color
$white = "#FFFFFF";

// Invert colors
if (isset($_GET['inverse']))
{
	$white = '#' . $hex;
	$hex = "FFFFFF";
}

// Create color object
$color = new Color("#$hex");
$dark ='#' . $color->darken();
$darker = '#' . $color->darken(20);
$light = '#' . $color->lighten();
$lighter = '#' . $color->lighten(20);

// Get SVG content
$svg = file_get_contents("img/icons/$type.svg");

// Colors to search
$search  = array('#85BDC7', '#4299A8', '#307982', '#025672', '#34848F', '#0A5B60', "#FFFFFF");

// Colors to replace

$replace = array(
	$light, // glow left top
	$light, // orb base color
	$dark, // bottom right shadow
	$darker, // orb outer ring
	$hex, // orb inner ring
	$dark, // icon shadow
	$white // icon base color
);

// Do replace
$svg = str_replace($search, $replace, $svg);

// Send headers
header('Content-type: image/svg+xml');
header('Expires: ' . gmdate("D, d M Y H:i:s", time() + 2592000));

// Send image
echo $svg;
